"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode, type RefObject } from "react";
import styles from "@/modules/site/components/landing/Landing.module.css";

type Runtime = ComponentType<{ root: RefObject<HTMLDivElement | null> }>;

export function AnimatedLanding({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [Runtime, setRuntime] = useState<Runtime | null>(null);

  useEffect(() => {
    let cancelled = false;
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        void import("./LandingAnimationRuntime").then((module) => {
          if (!cancelled) setRuntime(() => module.LandingAnimationRuntime);
        });
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, []);

  return (
    <div ref={root} className={styles.pageShell}>
      {children}
      {Runtime ? <Runtime root={root} /> : null}
    </div>
  );
}
