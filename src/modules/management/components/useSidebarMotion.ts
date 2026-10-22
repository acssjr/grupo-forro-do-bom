"use client";

import { useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { navigationDuration, NOTCH_OVERLAP } from "../domain/motion";

gsap.registerPlugin(useGSAP, CustomEase);

type Bounds = { left: number; top: number; width: number };
type Snapshot = { workspace: Bounds; sidebar: Bounds; notch: Bounds; logo?: {width:number;height:number}; items: Map<Element, Bounds> };
type Refs = {
  root: RefObject<HTMLDivElement | null>;
  sidebar: RefObject<HTMLElement | null>;
  workspace: RefObject<HTMLDivElement | null>;
  notch: RefObject<HTMLDivElement | null>;
  ink: RefObject<HTMLDivElement | null>;
};

export function useSidebarMotion(refs: Refs, pathname: string, collapsed: boolean) {
  const snapshot = useRef<Snapshot | null>(null);
  const layoutTween = useRef<gsap.core.Timeline | null>(null);
  const verticalTween = useRef<gsap.core.Tween | null>(null);
  const sync = useRef<(animate?: boolean, preserveVertical?: boolean) => void>(() => {});
  const paintInk = useRef<() => void>(() => {});
  const alignInk = useRef<() => void>(() => {});
  const expandedRailWidth = useRef(230);
  const drawSurface = useRef<(width: number) => void>(() => {});
  const eases = useRef({ move: gsap.parseEase("power3.inOut"), drawer: gsap.parseEase("power3.out") });

  useGSAP((_, contextSafe) => {
    const { root, sidebar, notch, ink } = refs;
    if (!root.current || !sidebar.current || !notch.current || !ink.current || !contextSafe) return;
    const host = root.current;
    const rail = sidebar.current;
    const surface = notch.current;
    const darkInk = ink.current;
    // Preserve the 24px corners while the rail retracts; scaling the SVG would
    // squeeze/stretch its silhouette during the toggle.
    drawSurface.current = (width: number) => {
      const edge = width - NOTCH_OVERLAP;
      const rowHeight = Number(surface.dataset.rowHeight ?? 46);
      const radius = rowHeight / 2;
      const bottom = 24 + rowHeight;
      const height = 48 + rowHeight;
      surface.style.height = `${height}px`;
      const svg = surface.querySelector("svg");
      if (svg) svg.style.height = `${height}px`;
      surface.style.width = `${width}px`;
      surface.querySelector("svg")?.setAttribute("viewBox", `0 0 ${width} ${height}`);
      surface.querySelector("path")?.setAttribute("d", `M${edge} 0 A24 24 0 0 1 ${edge - 24} 24 H${radius} A${radius} ${radius} 0 0 0 0 ${24 + radius} A${radius} ${radius} 0 0 0 ${radius} ${bottom} H${edge - 24} A24 24 0 0 1 ${edge} ${height} H${width} V0 Z`);
    };
    let railHeight = rail.getBoundingClientRect().height;
    // Clip the dark copy with the same painted position, without fading the labels.
    const paint = () => {
      const y = Number(gsap.getProperty(surface, "y"));
      darkInk.style.setProperty("clip-path", `inset(${Math.max(0,y+24)}px 0 ${Math.max(0,railHeight-y-24-Number(surface.dataset.rowHeight ?? 46))}px 0)`);
      darkInk.style.setProperty("opacity", String(gsap.getProperty(surface, "opacity")));
    };
    paintInk.current = paint;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const tokens = getComputedStyle(host);
    const curve = (token: string, name: string) => {
      const values = tokens.getPropertyValue(token).match(/cubic-bezier\(([^)]+)\)/)?.[1];
      return values ? CustomEase.create(name, values) : gsap.parseEase("power3.out");
    };
    eases.current = { move: gsap.parseEase("sine.inOut"), drawer: curve("--ease-drawer", "gfb-sidebar-drawer") };

    // The overlay follows painted rows even while their scroll viewport moves
    // or clamps scrollTop. Its geometry must not use the final layout snapshot.
    alignInk.current = () => {
      const parent = rail.getBoundingClientRect();
      const links = Array.from(rail.querySelectorAll<HTMLElement>("[data-sidebar-link]"));
      const copies = Array.from(darkInk.querySelectorAll<HTMLElement>("[data-sidebar-ink-row]"));
      const boxes = copies.map(copy => {
        const link = links.find(link=>link.getAttribute("href")===copy.dataset.sidebarInkRow);
        return { copy, bounds:link?.getBoundingClientRect(), clip:link?.closest("[data-sidebar-scroll]")?.getBoundingClientRect() };
      });
      for (const { copy, bounds:box, clip } of boxes) if (box) gsap.set(copy, {
        left:box.left-parent.left, top:box.top-parent.top, width:box.width, height:box.height, autoRound:false,
        visibility:!clip || (box.bottom>clip.top && box.top<clip.bottom) ? "visible" : "hidden",
        clipPath:clip ? `inset(${Math.max(0,clip.top-box.top)}px 0 ${Math.max(0,box.bottom-clip.bottom)}px 0)` : "none",
      });
    };
    const position = contextSafe((animate = false, preserveVertical = false) => {
      const active = rail.querySelector<HTMLElement>("[data-sidebar-link][aria-current=page]");
      if (!active || !rail.getBoundingClientRect().width) { gsap.set(surface, { opacity: 0 }); return; }
      const bounds = active.getBoundingClientRect();
      surface.dataset.rowHeight = String(bounds.height);
      const parent = rail.getBoundingClientRect();
      const movingGroup = rail.querySelector("[data-sidebar-scroll]");
      const groupX = layoutTween.current?.isActive() && movingGroup ? Number(gsap.getProperty(movingGroup,"x")) : 0;
      const groupY = layoutTween.current?.isActive() && movingGroup ? Number(gsap.getProperty(movingGroup,"y")) : 0;
      railHeight = parent.height;
      alignInk.current();
      const inGroup = active.closest("[data-sidebar-scroll]");
      const x = bounds.left - parent.left - (inGroup?groupX:0);
      const y = bounds.top - parent.top - 24 - (inGroup?groupY:0);
      const edge = bounds.width;
      const width = edge + NOTCH_OVERLAP;
      const scrolling = active.closest("[data-sidebar-scroll]")?.getBoundingClientRect();
      const visible = !scrolling || (bounds.bottom > scrolling.top && bounds.top < scrolling.bottom);
      const immediate = !animate || reduce.matches || host.dataset.keyboardNavigation === "true" || surface.dataset.ready !== "true";
      const duration = immediate ? 0 : navigationDuration(Math.abs(y - Number(gsap.getProperty(surface, "y"))));

      // A collapsing layout and its surface share one clock. Route changes only retarget Y.
      if (layoutTween.current?.isActive()) {
        verticalTween.current = gsap.to(surface, { y, opacity: visible ? 1 : 0, duration, ease: eases.current.move, overwrite: "auto", onUpdate:paint });
        return;
      }
      // Keep both concave corners tangent to the workspace edge, then extend a
      // solid bridge beneath it. The join no longer depends on a 1px SVG edge.
      drawSurface.current(width);
      gsap.set(surface, { width, x, scaleX: 1, transformOrigin: "100% 0" });
      // Ending a width transition must not finish an unrelated route movement.
      if (!preserveVertical || !verticalTween.current?.isActive()) {
        verticalTween.current = gsap.to(surface, { y, opacity: visible ? 1 : 0, duration, ease: eases.current.move, overwrite: "auto", onUpdate:paint });
      }
      paint();
      surface.dataset.ready = "true";
    });
    sync.current = position;
    const refresh = () => { if (!layoutTween.current?.isActive()) position(false); else alignInk.current(); };
    const preferenceChanged = () => {
      if (reduce.matches) { layoutTween.current?.progress(1); }
      position(false);
    };
    const viewportChanged = () => {
      layoutTween.current?.progress(1);
      position(false);
    };
    const observer = new ResizeObserver(refresh);
    observer.observe(rail);
    const brand = rail.querySelector("[data-sidebar-brand]");
    if (brand) observer.observe(brand);
    const scroller = rail.querySelector("[data-sidebar-scroll]");
    if (scroller) observer.observe(scroller);
    const footer = rail.querySelector("[data-sidebar-footer]");
    if (footer) observer.observe(footer);
    scroller?.addEventListener("scroll", refresh, { passive: true });
    reduce.addEventListener("change", preferenceChanged);
    window.addEventListener("resize", viewportChanged);
    position();
    return () => {
      observer.disconnect();
      scroller?.removeEventListener("scroll", refresh);
      reduce.removeEventListener("change", preferenceChanged);
      window.removeEventListener("resize", viewportChanged);
      layoutTween.current?.kill();
      layoutTween.current = null;
      verticalTween.current?.kill();
      verticalTween.current = null;
    };
  }, { scope: refs.root });

  useGSAP(() => {
    const previous = snapshot.current;
    snapshot.current = null;
    const { root, sidebar, workspace, notch } = refs;
    if (!previous || !root.current || !sidebar.current || !workspace.current || !notch.current) { sync.current(true); return; }
    layoutTween.current?.kill();
    layoutTween.current = null;
    const host = root.current;
    const panel = workspace.current;
    const rail = sidebar.current;
    const surface = notch.current;
    const logo = rail.querySelector<HTMLElement>("[data-sidebar-logo]");
    const items = Array.from(sidebar.current.querySelectorAll<Element>("[data-sidebar-motion]")).filter(item => !item.closest("[data-sidebar-ink-row]"));
    gsap.killTweensOf([panel, rail, surface, ...items]);
    if (logo) { gsap.killTweensOf(logo); gsap.set(logo, {clearProps:"width,height"}); }
    gsap.set(panel, { clearProps: "marginLeft" });
    gsap.set(rail, { clearProps: "width" });
    gsap.set([panel, ...items], { clearProps: "transform" });
    const control = rail.querySelector("[data-sidebar-control]");
    if (control) gsap.set(control, {clearProps:"width"});
    sync.current(false);
    const targetMargin = parseFloat(getComputedStyle(panel).marginLeft);
    const targetRailWidth = rail.getBoundingClientRect().width;
    const targetLogo = logo?.getBoundingClientRect();
    const x = Number(gsap.getProperty(surface, "x"));
    const y = Number(gsap.getProperty(surface, "y"));
    const width = surface.getBoundingClientRect().width;
    const immediate = matchMedia("(prefers-reduced-motion: reduce)").matches || host.dataset.keyboardNavigation === "true";
    const labels = sidebar.current.querySelectorAll("[data-sidebar-label]");
    gsap.set(labels, { clearProps: "opacity,transform,clipPath" });
    if (immediate) { host.setAttribute("data-sidebar-animating", "false"); return; }
    const destinations = items.map(item => ({ item, before: previous.items.get(item), after: item.getBoundingClientRect() }));

    host.setAttribute("data-sidebar-animating", "true");
    // Spread the travel across the full interval instead of front-loading it.
    if (!collapsed) expandedRailWidth.current = targetRailWidth;
    const expandedWidth = expandedRailWidth.current;
    const compactWidth = 80;
    // Use the painted width as the shared clock, including interrupted toggles.
    // Opacity never resets on a click, and both color copies reveal together.
    const paintLabels = () => {
      const railWidth = Number(gsap.getProperty(rail, "width"));
      const progress = gsap.utils.clamp(0, 1, (railWidth - compactWidth) / Math.max(1, expandedWidth - compactWidth));
      const opacity = progress * progress * (3 - 2 * progress);
      const railBox = rail.getBoundingClientRect();
      const edge = railBox.right - 8;
      const logoBottom = logo?.getBoundingClientRect().bottom ?? railBox.top;
      const controlTop = rail.querySelector("[data-sidebar-control]")?.getBoundingClientRect().top ?? railBox.bottom;
      const boxes = Array.from(labels, label => ({label, box:label.getBoundingClientRect()}));
      for (const {label, box} of boxes) {
        const caption = label.parentElement?.getAttribute("aria-label") === "GFB Gestão — início";
        const top = caption ? Math.min(box.height, Math.max(0, logoBottom + 8 - box.top)) : 0;
        const bottom = caption ? Math.min(box.height - top, Math.max(0, box.bottom - controlTop + 12)) : 0;
        gsap.set(label, {opacity, clipPath:`inset(${top}px ${Math.max(0, box.right-edge)}px ${bottom}px ${Math.max(0, railBox.left-box.left)}px)`});
      }
    };
    const timeline = gsap.timeline({ defaults: { duration: .38, ease: eases.current.move }, onUpdate:()=>{alignInk.current(); paintInk.current(); paintLabels();}, onComplete: () => {
      layoutTween.current = null;
      host.setAttribute("data-sidebar-animating", "false");
      gsap.set(labels, {clearProps:"opacity,transform,clipPath"});
      sync.current(false, true);
    } });
    layoutTween.current = timeline;
    // Interpolate the available layout width itself. A translated final layout
    // makes tables jump to their new width before the visible slide starts.
    timeline.fromTo(panel, { marginLeft: previous.workspace.left, autoRound: false }, { marginLeft: targetMargin, autoRound: false, clearProps: "marginLeft" }, 0);
    timeline.fromTo(rail, { width: previous.sidebar.width, autoRound: false }, { width: targetRailWidth, autoRound: false, clearProps: "width" }, 0);
    if (logo && previous.logo && targetLogo) timeline.fromTo(logo,{width:previous.logo.width,height:previous.logo.height,autoRound:false},{width:targetLogo.width,height:targetLogo.height,autoRound:false,clearProps:"width,height"},0);
    const outline = { width: previous.notch.width };
    timeline.fromTo(surface, { x: previous.notch.left - sidebar.current.getBoundingClientRect().left, y: previous.notch.top - sidebar.current.getBoundingClientRect().top, scaleX: 1 }, { x, y, scaleX: 1 }, 0);
    timeline.to(outline, { width, onUpdate: () => drawSurface.current(outline.width) }, 0);
    drawSurface.current(outline.width);
    // Width is now restored to its painted start. Centered children have moved
    // with it, so measure their actual start before calculating inverse offsets.
    // Centering depends on the control's own width. Restore that width before
    // measuring its inverse offset; otherwise centering and FLIP both move it.
    for (const {item, before} of destinations) {
      if (before && item.hasAttribute("data-sidebar-control")) gsap.set(item, {width:before.width, autoRound:false});
    }
    const startingBounds = new Map(items.map(item=>[item,item.getBoundingClientRect()]));
    for (const { item, before, after } of destinations) {
      if (!before) continue;
      const start = startingBounds.get(item)!;
      const movingParent = item.parentElement?.closest("[data-sidebar-motion]");
      const parentDestination = destinations.find(destination=>destination.item===movingParent);
      const parentStart = movingParent ? startingBounds.get(movingParent) : undefined;
      const parentX = parentDestination?.before && parentStart ? parentDestination.before.left-parentStart.left : 0;
      const parentY = parentDestination?.before && parentStart ? parentDestination.before.top-parentStart.top : 0;
      if (item.hasAttribute("data-sidebar-control")) {
        // Move the complete control: moving its SVG alone leaves a stationary
        // button clipping its own travelling icon.
        timeline.fromTo(item, { x: before.left - start.left, y: before.top - start.top, width: before.width, autoRound:false }, { x:0,y:0,width:after.width,autoRound:false,clearProps:"transform,width" }, 0);
      } else timeline.fromTo(item, { x: before.left - start.left - parentX, y: before.top - start.top - parentY }, { x: 0, y: 0, clearProps: "transform" }, 0);
    }
    paintLabels();
  }, { scope: refs.root, dependencies: [pathname, collapsed] });

  const capture = () => {
    if (!refs.workspace.current || !refs.notch.current || !refs.sidebar.current) return;
    if (!collapsed && !layoutTween.current?.isActive()) expandedRailWidth.current = refs.sidebar.current.getBoundingClientRect().width;
    snapshot.current = {
      workspace: refs.workspace.current.getBoundingClientRect(),
      sidebar: refs.sidebar.current.getBoundingClientRect(),
      notch: refs.notch.current.getBoundingClientRect(),
      logo: refs.sidebar.current.querySelector("[data-sidebar-logo]")?.getBoundingClientRect(),
      items: new Map(Array.from(refs.sidebar.current.querySelectorAll<Element>("[data-sidebar-motion]")).map(item => [item, item.getBoundingClientRect()])),
    };
  };

  // Commit immediately: text and geometry now use the same interruptible clock.
  return (_nextCollapsed: boolean, commit: () => void) => {
    capture();
    commit();
  };
}
