"use client";

import { useRef, type ReactNode } from "react";
import { useResultMotion } from "./useResultMotion";

export function AnimatedResultList({ signature, children, className, live = false }: {
  signature: string; children: ReactNode; className?: string; live?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useResultMotion(ref, signature);
  return <div ref={ref} className={className} aria-live={live ? "polite" : undefined} aria-relevant={live ? "additions removals" : undefined}>{children}</div>;
}
