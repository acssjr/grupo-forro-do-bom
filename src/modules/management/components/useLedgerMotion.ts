"use client";

import { useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
type Row = { box: DOMRect; clone: HTMLTableRowElement; cells: number[] };
type Snapshot = { box: DOMRect; rows: Map<string, Row> };

/** Keep payment identity and text size while a filter changes the table layout. */
export function useLedgerMotion(container: RefObject<HTMLDivElement | null>, signature: string) {
  const before = useRef<Snapshot | null>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  const ghosts = useRef<HTMLElement[]>([]);
  useGSAP(() => {
    const host = container.current;
    const previous = before.current;
    before.current = null;
    if (!host) return;
    animation.current?.kill();
    ghosts.current.forEach(element => element.remove());
    ghosts.current = [];
    const rows = Array.from(host.querySelectorAll<HTMLTableRowElement>("tbody tr[data-payment-id]"));
    gsap.killTweensOf([host, ...rows]);
    gsap.set(host, { clearProps:"height,overflow" });
    gsap.set(rows, { clearProps:"transform,opacity" });
    if (!previous) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || host.closest('[data-keyboard-navigation="true"]')) return;
    const next = host.getBoundingClientRect();
    const destinations = rows.map(row => ({row,box:row.getBoundingClientRect(),old:previous.rows.get(row.dataset.paymentId!)}));
    const ids = new Set(rows.map(row => row.dataset.paymentId));
    const timeline = gsap.timeline({defaults:{duration:.38,ease:"sine.inOut"},onComplete:()=>{
      gsap.set(host,{clearProps:"height,overflow"});
      ghosts.current.forEach(element=>element.remove());ghosts.current=[];
    }});
    animation.current = timeline;
    // Height follows the reflow so the page does not jump when rows disappear.
    timeline.fromTo(host,{height:previous.box.height,overflow:"hidden"},{height:next.height},0);
    for (const {row,box,old} of destinations) {
      const offset = old ? old.box.top - box.top : 12;
      timeline.fromTo(row,{y:offset,opacity:old?1:0},{y:0,opacity:1,clearProps:"transform,opacity"},old?0:.06);
    }
    const empty = host.querySelector("[data-ledger-empty]");
    if (empty) timeline.fromTo(empty,{y:12,opacity:0},{y:0,opacity:1,clearProps:"transform,opacity"},.06);
    for (const [id, old] of previous.rows) {
      if (ids.has(id) || old.box.bottom < 0 || old.box.top > innerHeight) continue;
      const table = document.createElement("table");
      table.setAttribute("aria-hidden","true");table.inert=true;
      Object.assign(table.style,{position:"absolute",left:`${old.box.left-previous.box.left}px`,top:`${old.box.top-previous.box.top}px`,width:`${old.box.width}px`,margin:"0",tableLayout:"fixed",pointerEvents:"none"});
      old.clone.removeAttribute("data-payment-id");old.clone.style.transform="none";
      Array.from(old.clone.cells).forEach((cell,i)=>{cell.style.width=`${old.cells[i]}px`;});
      const body=document.createElement("tbody");body.append(old.clone);table.append(body);host.append(table);ghosts.current.push(table);
      timeline.to(table,{y:-8,opacity:0,duration:.16,ease:"sine.out"},0);
    }
    const finish = () => {if(reduced.matches)timeline.progress(1);};
    reduced.addEventListener("change",finish);
    return () => reduced.removeEventListener("change",finish);
  },{scope:container,dependencies:[signature],revertOnUpdate:true});
  useGSAP(()=>()=>{animation.current?.kill();ghosts.current.forEach(element=>element.remove());},{scope:container});
  return (animate = true) => {
    const host=container.current;
    if(!host)return;
    if (!animate) { animation.current?.progress(1); before.current=null; return; }
    before.current={box:host.getBoundingClientRect(),rows:new Map(Array.from(host.querySelectorAll<HTMLTableRowElement>("tbody tr[data-payment-id]")).map(row=>[row.dataset.paymentId!,{box:row.getBoundingClientRect(),clone:row.cloneNode(true) as HTMLTableRowElement,cells:Array.from(row.cells).map(cell=>cell.getBoundingClientRect().width)}]))};
  };
}
