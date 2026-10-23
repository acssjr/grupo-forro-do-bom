"use client";

import { useSyncExternalStore, type RefObject } from "react";
import { LiquidGlass } from "simple-liquid-glass";
import s from "./Management.module.css";

const subscribe = (notify: () => void) => {
  const mobile = matchMedia("(width < 768px)");
  mobile.addEventListener("change", notify);
  return () => mobile.removeEventListener("change", notify);
};
const isMobile = () => matchMedia("(width < 768px)").matches;
const serverSnapshot = () => false;

/** GFB optical material. The source is a sibling, never an ancestor of the lens. */
export function ManagementGlass({ backdrop, version, panel = false }: {
  backdrop: RefObject<HTMLDivElement | null>;
  version: string;
  panel?: boolean;
}) {
  const mobile = useSyncExternalStore(subscribe, isMobile, serverSnapshot);
  if (!mobile) return null;
  return <div className={s.mobileGlassMaterial} aria-hidden="true" data-liquid-glass-ignore>
    <LiquidGlass
      backdropRef={backdrop}
      backdropVersion={version}
      renderer="auto"
      mobileFallback="svg"
      quality="extreme"
      refraction="lens"
      lensProfile="player"
      displacementScale={panel ? 64 : 80}
      radius={panel ? 26 : 38}
      blur={panel ? 8 : 5}
      saturation={115}
      dispersion={50}
      aberrationIntensity={.12}
      frost={0}
      background={panel ? "rgba(12,12,16,0.88)" : "rgba(12,12,16,0.86)"}
      reveal="immediate"
      style={{ width: "100%", height: "100%", boxShadow: "0 12px 32px #00000030, inset 0 1px #ffffffa6" }}
    />
  </div>;
}
