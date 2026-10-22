"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { contentOffset } from "../domain/motion";
import s from "./Management.module.css";

gsap.registerPlugin(useGSAP);

type Region = { element: HTMLElement; id: string; box: DOMRect };

/** Match roles rather than unrelated text: header, filters, metrics and content surfaces. */
function regions(page: HTMLElement): Region[] {
  const groups = [
    ["heading", `[data-motion-region=heading]`],
    ["filters", `.${s.toolbar}`],
    ["metric", `.${s.metricCard}, .${s.financeMetric}`],
    ["surface", `section, .${s.responsiveTable}, .${s.cohortCard}, .${s.eventCard}, .${s.teamList}, .${s.contentOrganizer}, .${s.settingsPanel}, .${s.studentHistory}`],
  ];
  const selected: HTMLElement[] = [];
  const result: Region[] = [];
  for (const [role, selector] of groups) {
    let index = 0;
    for (const element of page.querySelectorAll<HTMLElement>(selector)) {
      if (element.matches(`.${s.overviewMetrics}, .${s.financeMetrics}`) || element.closest("dialog") || selected.some(parent => parent.contains(element) || element.contains(parent))) continue;
      const box = element.getBoundingClientRect();
      if (box.width < 60 || box.height < 20 || box.bottom < 0 || box.top > innerHeight) continue;
      const id = `workspace-${role}-${index++}`;
      element.dataset.contentRegion = id;
      selected.push(element);
      result.push({ element, id, box });
    }
  }
  return result;
}

export function ManagementContentMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP((_, contextSafe) => {
    const host = root.current;
    if (!host || !contextSafe) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let current: HTMLElement | null = null;
    let previous: Region[] | null = null;
    let animation: gsap.core.Timeline | null = null;
    let expiry: ReturnType<typeof setTimeout> | undefined;
    const ease = "sine.inOut";
    const immediate = () => reduced.matches || host.closest("[data-management-shell]")?.getAttribute("data-keyboard-navigation") === "true";

    const capture = () => {
      if (!current || immediate()) { previous = null; return; }
      const items = regions(current);
      // Keep the outgoing view moving while Next prepares the destination.
      // Never freeze it at the click or force it to its final frame.
      previous = items;
      clearTimeout(expiry);
      expiry = setTimeout(() => {
        previous = null;
      }, 5000);
    };
    const beforeNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href);
      if (url.origin === location.origin && url.pathname.startsWith("/gestao") && url.pathname + url.search !== location.pathname + location.search) capture();
    };
    const transition = contextSafe(() => {
      const page = host.querySelector<HTMLElement>("[data-management-page]");
      if (!page || page === current || page.querySelector('[data-content-ready="false"]')) return;
      current = page;
      const items = regions(page);
      animation?.kill();
      clearTimeout(expiry);
      const before = previous;
      previous = null;
      if (immediate() || !items.length) { host.dataset.contentAnimating = "false"; return; }
      host.dataset.contentAnimating = "true";
      const timeline = gsap.timeline({ onComplete: () => { host.dataset.contentAnimating = "false"; } });
      animation = timeline;
      const content = items.filter(item => !item.id.startsWith("workspace-heading"));
      // Headers and filters are real shared anchors. A chart, table and calendar
      // are different content: do not squeeze them into each other's rectangles.
      items.forEach(item => {
        const anchor = item.id.startsWith("workspace-heading") || item.id.startsWith("workspace-filters");
        const old = anchor ? before?.find(region => region.id === item.id) : undefined;
        const index = content.indexOf(item);
        const delay = index < 0 ? 0 : Math.min(.10, index * .025);
        timeline.fromTo(item.element, {
          x: old ? contentOffset(old.box.left - item.box.left) : 0,
          y: old ? contentOffset(old.box.top - item.box.top) : 20,
        }, {
          x: 0, y: 0, duration: .38, ease, force3D:true,
          clearProps: "transform",
        }, delay);
      });
    });
    const observer = new MutationObserver(transition);
    observer.observe(host, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-content-ready"] });
    const finish = () => { if (reduced.matches) animation?.progress(1); };
    const resize = () => { animation?.progress(1); previous = null; };
    document.addEventListener("click", beforeNavigation, true);
    window.addEventListener("popstate", capture);
    window.addEventListener("resize", resize);
    reduced.addEventListener("change", finish);
    transition();
    return () => {
      observer.disconnect(); animation?.kill(); clearTimeout(expiry);
      document.removeEventListener("click", beforeNavigation, true);
      window.removeEventListener("popstate", capture);
      window.removeEventListener("resize", resize);
      reduced.removeEventListener("change", finish);
    };
  }, { scope: root });
  return <div ref={root} className={s.contentMotion} data-content-motion>{children}</div>;
}
