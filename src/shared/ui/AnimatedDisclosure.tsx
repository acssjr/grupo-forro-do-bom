"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { uiDuration, uiEase } from "./disclosure-motion";

gsap.registerPlugin(useGSAP);

/** Native details semantics, with interruptible opening AND closing before content is hidden. */
export function AnimatedDisclosure({ summary, children, className, label }: {
  summary: ReactNode; children: ReactNode; className?: string; label?: string;
}) {
  const id = useId();
  const root = useRef<HTMLDetailsElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const tween = useRef<gsap.core.Tween | null>(null);
  const desired = useRef(false);
  const { contextSafe } = useGSAP(() => () => { tween.current?.kill(); }, { scope: root });
  const toggle = () => contextSafe(() => {
    const details = root.current, content = panel.current;
    if (!details || !content) return;
    const next = !desired.current;
    desired.current = next;
    setExpanded(next);
    tween.current?.kill();
    const start = details.open ? content.getBoundingClientRect().height : 0;
    details.open = true;
    content.inert = !next;
    gsap.set(content, { height: start, overflow: "hidden" });
    tween.current = gsap.to(content, {
      height: next ? content.scrollHeight : 0,
      duration: matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : uiDuration.enter,
      ease: uiEase(), overwrite: "auto",
      onComplete: () => {
        details.open = next;
        gsap.set(content, { clearProps: "height,overflow" });
      },
    });
  })();
  return <details ref={root} className={className} data-expanded={expanded}>
    <summary aria-label={label} aria-expanded={expanded} aria-controls={id} onClick={event => { event.preventDefault(); toggle(); }}>{summary}</summary>
    <div ref={panel} id={id}>{children}</div>
  </details>;
}
