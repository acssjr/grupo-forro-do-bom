"use client";

import { useEffect, type RefObject } from "react";
import { composite, cssColors, dockContrast, extremes, type GlassColor } from "../domain/dock-contrast";

/** Multiple icon/label samples, alpha composition, and a bounded settling window after layout changes. */
export function useDockContrast(nav: RefObject<HTMLElement | null>, workspace: RefObject<HTMLDivElement | null>, signature: string) {
  useEffect(() => {
    const host = nav.current;
    const source = workspace.current;
    if (!host || !source) return;
    let frame = 0, until = 0, lastPaint = 0, disposed = false;
    const paint = () => {
      if (!host.offsetWidth || !document.elementsFromPoint) return;
      const cache = new Map<Element, GlassColor[]>();
      const sample = (x: number, y: number) => {
        const layers: GlassColor[][] = [];
        for (const element of document.elementsFromPoint(x, y)) {
          if (element === host || host.contains(element)) continue;
          let colors = cache.get(element);
          if (!colors) {
            const style = getComputedStyle(element);
            const gradient = cssColors(style.backgroundImage).filter(color => color[3] >= .85);
            colors = extremes(gradient.length ? gradient : cssColors(style.backgroundColor).filter(color => color[3] > 0));
            cache.set(element, colors);
          }
          if (!colors.length) continue;
          layers.push(colors);
          if (colors.every(color => color[3] === 1)) break;
        }
        let colors: GlassColor[] = [[255,255,255,1]];
        for (const layer of layers.reverse()) colors = extremes(layer.flatMap(front => colors.map(back => composite(front, back))));
        return colors;
      };
      const changes = Array.from(host.querySelectorAll<HTMLElement>("[data-dock-item]")).map(item => {
        const rect = item.getBoundingClientRect();
        const colors = [-.15,.5,1.15].flatMap(x => [.12,.5,.88].flatMap(y => sample(rect.x + rect.width * x, rect.y + rect.height * y)));
        return { item, tone: dockContrast(colors, item.dataset.selected === "true", item.dataset.dockTone) };
      });
      // Finish all layout reads before touching the rendered controls.
      for (const { item, tone } of changes) {
        item.dataset.dockTone = tone.name;
        item.dataset.dockContrast = tone.minimum.toFixed(2);
        item.style.setProperty("--dock-ink", tone.ink);
        item.style.setProperty("--dock-veil", tone.veil);
        item.style.setProperty("--dock-text-shadow", tone.name === "light" ? "0 1px 2px #0008" : "0 1px 1px #ffffff30");
      }
    };
    const tick = (now: number) => {
      frame = 0;
      if (now - lastPaint >= 32) { paint(); lastPaint = now; }
      if (now < until) frame = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (disposed) return;
      until = performance.now() + 320;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(host); resize.observe(source);
    const content = new MutationObserver(schedule);
    content.observe(source, { childList:true, subtree:true, characterData:true });
    document.fonts?.ready.then(schedule);
    window.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("resize", schedule);
    schedule();
    return () => { disposed = true; cancelAnimationFrame(frame); resize.disconnect(); content.disconnect(); window.removeEventListener("scroll", schedule, true); window.removeEventListener("resize", schedule); window.visualViewport?.removeEventListener("resize", schedule); };
  }, [nav, workspace, signature]);
}
