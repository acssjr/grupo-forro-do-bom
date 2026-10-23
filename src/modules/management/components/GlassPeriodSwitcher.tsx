"use client";

import { useRef } from "react";
import { LiquidGlass } from "simple-liquid-glass";
import { useMobileDockMotion } from "./useMobileDockMotion";
import s from "./Management.module.css";

/** Same optical engine as the dock. The scene excludes glass from its snapshots. */
export function ControlGlass({ gold = false }: { gold?: boolean }) {
  return <span className={s.controlGlassMaterial} aria-hidden="true" data-liquid-glass-ignore>
    <LiquidGlass renderer="auto" mobileFallback="svg" quality="extreme" refraction="lens" lensProfile="player"
      radius={28} displacementScale={48} blur={5} saturation={115} dispersion={30}
      aberrationIntensity={.08} frost={0} background={gold ? "rgba(246,195,0,0.72)" : "rgba(12,12,16,0.86)"}
      reveal="immediate" style={{ width:"100%",height:"100%",boxShadow:"inset 0 1px 1px #ffffff99, inset 0 -1px 2px #00000040, 0 3px 8px #0000001a" }} />
  </span>;
}

export function GlassPeriodSwitcher({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const host = useRef<HTMLDivElement>(null);
  useMobileDockMotion(host, value);
  return <div ref={host} className={`${s.calendarPeriods} ${s.glassPeriodSwitcher}`} role="group" aria-label="Período da agenda">
    <ControlGlass />
    <span className={s.glassPeriodLens} data-dock-lens aria-hidden="true" />
    {[["today","Hoje"],["week","Esta semana"],["next","Próxima"]].map(([id,label]) =>
      <button key={id} data-dock-item data-selected={value === id} aria-pressed={value === id} onClick={() => onChange(id)}>{label}</button>)}
  </div>;
}
