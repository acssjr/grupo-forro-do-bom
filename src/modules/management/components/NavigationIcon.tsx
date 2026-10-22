"use client";

import { useId, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { HouseLineIcon, CalendarDotsIcon, StudentIcon, WalletIcon, MedalIcon, BooksIcon, ChatsCircleIcon, UsersThreeIcon, GearSixIcon, ArrowSquareOutIcon, SidebarSimpleIcon, HandCoinsIcon } from "@phosphor-icons/react";
import type { IconName } from "./Icon";
import { navigationDuration } from "../domain/motion";

const icons = { home: HouseLineIcon, calendar: CalendarDotsIcon, users: StudentIcon, wallet: WalletIcon, transfer:HandCoinsIcon, flag: MedalIcon, video: BooksIcon, message: ChatsCircleIcon, team: UsersThreeIcon, settings: GearSixIcon, logout: ArrowSquareOutIcon, panel: SidebarSimpleIcon };
const accents: Record<string, string> = { home:"#d6a64c", calendar:"#4e9c91", users:"#7399c3", wallet:"#c59245", flag:"#d3aa35", video:"#9583be", message:"#6aa685", team:"#c48e72", settings:"#859bb0" };
const gestures: Record<string, { x?: number; y?: number; rotation?: number }> = { home:{y:-12}, calendar:{rotation:-5}, users:{rotation:5}, wallet:{x:16,rotation:-4}, flag:{rotation:-8}, video:{rotation:-5,x:-8}, message:{y:-12,rotation:3}, team:{y:-8}, settings:{rotation:25} };
gsap.registerPlugin(useGSAP);

export function NavigationIcon({ name, size = 23, motion = false, active = false }: { name: IconName | "team" | "transfer"; size?: number; motion?: boolean; active?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const gradientId = `nav-sheen-${useId().replace(/:/g, "")}`;
  useGSAP(() => {
    const svg = ref.current;
    if (!svg || !active) return;
    const fills = svg.querySelectorAll('[opacity="0.2"]');
    gsap.set(fills, { fill:`url(#${gradientId})`, opacity:.85 });
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || svg.closest('[data-keyboard-navigation="true"]')) return;
    const shapes = svg.querySelectorAll(":scope > path, :scope > rect, :scope > circle, :scope > polyline, :scope > polygon");
    const gesture = gestures[name] || {y:-8};
    const row = svg.closest<HTMLElement>("[data-sidebar-ink-row]");
    const notch = svg.closest("aside")?.querySelector("[data-navigation-notch]");
    const distance = row && notch ? Math.abs(row.getBoundingClientRect().top - notch.getBoundingClientRect().top - 24) : 0;
    const timeline = gsap.timeline({delay:distance>1 ? navigationDuration(distance)*.65 : 0});
    timeline.to(shapes, { ...gesture, svgOrigin:"128 128", duration:.16, ease:"sine.out" })
      .to(shapes, { x:0,y:0,rotation:0,duration:.22,ease:"sine.inOut",clearProps:"transform" });
    const sheen = gsap.fromTo(svg.querySelector("linearGradient"), {attr:{x1:"-100%",x2:"0%"}}, {attr:{x1:"100%",x2:"200%"},duration:1.2,delay:.5,repeat:-1,repeatDelay:7,ease:"none"});
    const stop = () => { if(reduced.matches){timeline.progress(1);sheen.kill();} };
    reduced.addEventListener("change",stop);
    return () => reduced.removeEventListener("change",stop);
  }, {scope:ref,dependencies:[active,name],revertOnUpdate:true});
  const Component = icons[name as keyof typeof icons] || HouseLineIcon;
  const accent = name === "transfer" ? "#579577" : accents[name] || "#b0a36c";
  return <Component ref={ref} size={size} weight="duotone" aria-hidden="true" data-navigation-icon={name} data-icon-active={active} data-sidebar-motion={motion ? "" : undefined}><defs><linearGradient id={gradientId} x1="-100%" x2="0%"><stop stopColor={accent} /><stop offset=".48" stopColor={accent} /><stop offset=".6" stopColor="#fff5d4" /><stop offset=".75" stopColor={accent} /><stop offset="1" stopColor={accent} /></linearGradient></defs></Component>;
}
