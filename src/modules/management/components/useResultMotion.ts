"use client";

import { useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { uiDuration, uiEase } from "@/shared/ui/disclosure-motion";

gsap.registerPlugin(useGSAP);
type Position = { left: number; top: number };

/** Stable identities move from their current visual position, including interrupted searches. */
export function useResultMotion(ref: RefObject<HTMLDivElement | null>, signature: string) {
  const positions = useRef(new Map<string, Position>());
  const height = useRef(0);
  const width = useRef(0);
  const animation = useRef<gsap.core.Timeline | null>(null);
  useGSAP(() => {
    const host = ref.current;
    if (!host) return;
    animation.current?.kill();
    const rows = Array.from(host.querySelectorAll<HTMLElement>("[data-result-id]"));
    const hostBox = host.getBoundingClientRect();
    const old = Math.abs(width.current - hostBox.width) > 1 ? new Map<string, Position>() : positions.current;
    width.current = hostBox.width;
    const previousHeight = height.current;
    gsap.set(host, { clearProps: "height,overflow" });
    gsap.set(rows, { clearProps: "transform,opacity" });
    const destination = rows.map(row => {
      const box = row.getBoundingClientRect();
      return { row, box: { left: box.left - hostBox.left, top: box.top - hostBox.top }, before: old.get(row.dataset.resultId!) };
    });
    const remember = () => {
      const parent = host.getBoundingClientRect();
      height.current = parent.height;
      positions.current = new Map(rows.map(row => {
        const box = row.getBoundingClientRect();
        return [row.dataset.resultId!, { left: box.left - parent.left, top: box.top - parent.top }];
      }));
    };
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || !old.size) { remember(); return; }
    const timeline = gsap.timeline({ onUpdate: remember, onComplete: remember });
    animation.current = timeline;
    const nextHeight = host.getBoundingClientRect().height;
    if (Math.abs(previousHeight - nextHeight) > 1) {
      timeline.fromTo(host, { height: previousHeight, overflow: "hidden" },
        { height: nextHeight, duration: uiDuration.enter, ease: uiEase(), clearProps: "height,overflow" }, 0);
    }
    for (const { row, box, before } of destination) {
      timeline.fromTo(row, { x: before ? before.left - box.left : 0, y: before ? before.top - box.top : 8, opacity: before ? 1 : 0 },
        { x: 0, y: 0, opacity: 1, duration: uiDuration.layout, ease: uiEase(before ? "in-out" : "out"), clearProps: "transform,opacity" }, 0);
    }
    remember();
    const finish = () => { if (reduced.matches) timeline.progress(1); };
    reduced.addEventListener("change", finish);
    return () => reduced.removeEventListener("change", finish);
  }, { scope: ref, dependencies: [signature] });
  useGSAP(() => () => { animation.current?.kill(); }, { scope: ref });
}
