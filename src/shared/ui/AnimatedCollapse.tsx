"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { uiDuration, uiEase } from "./disclosure-motion";

gsap.registerPlugin(useGSAP);

export function AnimatedCollapse({ open, children }: { open: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const animation = useRef<gsap.core.Tween | null>(null);
  useGSAP(() => {
    const element = ref.current;
    if (!element) return;
    animation.current?.kill();
    gsap.set(element, { height: element.getBoundingClientRect().height });
    animation.current = gsap.to(element, {
      height: open ? element.scrollHeight : 0,
      duration: matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : uiDuration.enter,
      ease: uiEase(),
      onComplete: () => { if (open) gsap.set(element, { height: "auto" }); },
    });
  }, { scope: ref, dependencies: [open] });
  useGSAP(() => () => { animation.current?.kill(); }, { scope: ref });
  return <div ref={ref} style={{ height: 0, overflow: "hidden" }} inert={!open} aria-hidden={!open}>{children}</div>;
}
