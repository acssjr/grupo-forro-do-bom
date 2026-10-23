"use client";

import { useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { uiEase } from "@/shared/ui/disclosure-motion";

gsap.registerPlugin(useGSAP);

/** Keep the surface mounted through exit, retargeting from the current frame. */
export function useMoreMenuMotion(host: RefObject<HTMLDivElement | null>, open: boolean, onClosed: () => void) {
  const initialized = useRef(false);
  const motion = useRef<gsap.core.Tween | null>(null);
  const closed = useRef(onClosed);
  useGSAP(() => { closed.current = onClosed; }, { dependencies:[onClosed] });
  useGSAP(() => {
    const element = host.current;
    if (!element) return;
    motion.current?.kill();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (!initialized.current) {
      gsap.set(element, { autoAlpha:0, y:reduced.matches ? 0 : 22 });
      initialized.current = true;
    }
    motion.current = gsap.to(element, {
      autoAlpha:open ? 1 : 0, y:open || reduced.matches ? 0 : 22,
      duration:reduced.matches ? .125 : open ? .26 : .18,
      ease:uiEase(), overwrite:"auto", onComplete:() => { if (!open) closed.current(); },
    });
    const finish = () => {
      if (!reduced.matches) return;
      motion.current?.kill();
      gsap.set(element, { autoAlpha:open ? 1 : 0, y:0 });
      if (!open) closed.current();
    };
    reduced.addEventListener("change",finish);
    return () => reduced.removeEventListener("change",finish);
  }, { dependencies:[open], scope:host });
  useGSAP(() => () => { motion.current?.kill(); }, []);
}
