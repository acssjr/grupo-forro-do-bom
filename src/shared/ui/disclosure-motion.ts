"use client";

import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

/** GSAP uses the same curves as CSS, rather than a second motion vocabulary. */
export function uiEase(kind: "out" | "in-out" = "out") {
  const curve = getComputedStyle(document.documentElement).getPropertyValue(`--ease-${kind}`).trim();
  return CustomEase.create(`gfb-ui-${kind}`, curve.replace(/^cubic-bezier\(|\)$/g, ""));
}

export const uiDuration = { enter: .2, exit: .16, layout: .24, navigation: .48 };
