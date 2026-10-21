"use client";

import { useEffect, useRef } from "react";
import s from "./Management.module.css";

export function BorderBeam() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = ref.current;
    const card = element?.parentElement?.parentElement;
    if (!element || !card) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    let animation: Animation | undefined;
    let visible = true;
    const start = () => {
      animation?.cancel();
      if (!reduced.matches && fine.matches) animation = element.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], { duration: 10000, iterations: Infinity, easing: "linear" });
      if (!visible) animation?.pause();
    };
    const enter = () => animation?.updatePlaybackRate(3);
    const leave = () => animation?.updatePlaybackRate(1);
    start();
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) animation?.play(); else animation?.pause(); });
    observer.observe(card);
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    reduced.addEventListener("change", start);
    fine.addEventListener("change", start);
    return () => { observer.disconnect(); animation?.cancel(); card.removeEventListener("pointerenter", enter); card.removeEventListener("pointerleave", leave); reduced.removeEventListener("change", start); fine.removeEventListener("change", start); };
  }, []);
  return <span className={s.borderBeam} aria-hidden="true"><span className={s.beamRotor} ref={ref} /></span>;
}
