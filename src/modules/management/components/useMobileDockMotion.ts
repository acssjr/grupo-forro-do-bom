"use client";

import { useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { uiEase } from "@/shared/ui/disclosure-motion";
import { navigationDuration } from "../domain/motion";

gsap.registerPlugin(useGSAP);

/** One optical lens lifts, flexes and settles. Activation never follows hover. */
export function useMobileDockMotion(nav: RefObject<HTMLElement | null>, signature: string) {
  const sync = useRef<() => void>(() => {});
  useGSAP((_, contextSafe) => {
    const host = nav.current;
    const lens = host?.querySelector<HTMLElement>("[data-dock-lens]");
    if (!host || !lens || !contextSafe) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const selected = () => host.querySelector<HTMLElement>('[data-dock-item][data-selected="true"]');
    let initialized = false;
    let destination: HTMLElement | null = null;
    let motion: gsap.core.Timeline | null = null;
    const move = contextSafe((target: HTMLElement | null, instant = false) => {
      if (!target || !host.offsetWidth) { motion?.kill(); destination = null; gsap.set(lens, { opacity:0,scaleX:1,scaleY:1 }); return; }
      if (!instant && destination === target && motion?.isActive()) return;
      destination = target;
      motion?.kill();
      gsap.set(lens, { width:target.offsetWidth, height:target.offsetHeight, opacity:1 });
      const x = target.offsetLeft, y = target.offsetTop;
      if (instant || reduced.matches || !initialized) {
        gsap.set(lens, { x,y,scaleX:1,scaleY:1 }); initialized = true; return;
      }
      const distance = Math.abs(x - Number(gsap.getProperty(lens,"x")));
      if (distance < .5) { gsap.set(lens,{x,y,scaleX:1,scaleY:1}); return; }
      const duration = navigationDuration(distance);
      motion = gsap.timeline()
        .to(lens,{x,duration,ease:uiEase("in-out")},0)
        .to(lens,{y:y-3,scaleX:1.06,scaleY:.97,duration:duration*.35,ease:uiEase()},0)
        .to(lens,{y,scaleX:1,scaleY:1,duration:duration*.65,ease:"back.out(1.15)"},duration*.35);
    });
    sync.current = () => move(selected());
    const activate = (event: MouseEvent) => {
      const item = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-dock-item]") : null;
      if (item) move(item);
    };
    let width = host.offsetWidth, height = host.offsetHeight;
    const resize = new ResizeObserver(() => {
      if (width === host.offsetWidth && height === host.offsetHeight) return;
      width = host.offsetWidth; height = host.offsetHeight;
      move(selected(),true);
    });
    const preference = () => { if(reduced.matches) move(selected(),true); };
    host.addEventListener("click",activate);
    reduced.addEventListener("change",preference);
    resize.observe(host);
    move(selected());
    return () => { motion?.kill(); resize.disconnect(); host.removeEventListener("click",activate); reduced.removeEventListener("change",preference); sync.current=()=>{}; };
  }, { scope:nav });
  useGSAP(() => { sync.current(); }, { dependencies:[signature], scope:nav });
}
