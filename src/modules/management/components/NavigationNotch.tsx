import type { RefObject } from "react";
import s from "./Management.module.css";

/** A single persistent surface, positioned by the sidebar motion controller. */
export function NavigationNotch({ surfaceRef }: { surfaceRef: RefObject<HTMLDivElement | null> }) {
  return <div ref={surfaceRef} className={s.navigationNotch} data-navigation-notch aria-hidden="true"><svg viewBox="0 0 214 94" preserveAspectRatio="none" focusable="false"><path /></svg></div>;
}
