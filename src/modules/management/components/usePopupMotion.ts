"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { uiDuration, uiEase } from "@/shared/ui/disclosure-motion";

gsap.registerPlugin(useGSAP);

/** Base UI owns focus/dismissal; GSAP retains the surface until its exit finishes. */
export function usePopupMotion(open: boolean, afterClose?: () => void) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const actions = useRef<{ unmount: () => void; close: () => void } | null>(null);
  const animation = useRef<gsap.core.Tween | null>(null);
  const initialized = useRef<HTMLElement | null>(null);
  useGSAP(() => {
    if (!element) return;
    animation.current?.kill();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const closed = { y: reduced.matches ? 0 : -8, scale: reduced.matches ? 1 : .97, opacity: 0,
      clipPath: reduced.matches ? "inset(0% 0% 0% 0% round 16px)" : "inset(0% 0% 12% 0% round 16px)" };
    if (initialized.current !== element) { gsap.set(element, closed); initialized.current = element; }
    animation.current = gsap.to(element, {
      ...(open ? { y: 0, scale: 1, opacity: 1, clipPath: "inset(0% 0% 0% 0% round 16px)" } : closed),
      duration: reduced.matches ? .125 : open ? uiDuration.enter : uiDuration.exit,
      ease: uiEase(), overwrite: "auto",
      onComplete: () => { if (!open) { actions.current?.unmount(); afterClose?.(); } },
    });
    const finish = () => { if (reduced.matches) animation.current?.progress(1); };
    reduced.addEventListener("change", finish);
    return () => reduced.removeEventListener("change", finish);
  }, { scope: element ?? undefined, dependencies: [element, open] });
  useGSAP(() => () => { animation.current?.kill(); }, []);
  return { popupRef: setElement, actions };
}
