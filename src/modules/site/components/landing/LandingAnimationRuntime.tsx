"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type LandingAnimationRuntimeProps = { root: RefObject<HTMLDivElement | null> };

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function LandingAnimationRuntime({ root }: LandingAnimationRuntimeProps) {
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
        },
        (context) => {
          if (!context.conditions?.motion) return;

          const recognitionRows = gsap.utils.toArray<HTMLElement>("[data-kinetic-row]");
          const isMobile = Boolean(context.conditions?.mobile);
          const kineticTimeline = gsap.timeline({
            paused: true,
            repeat: -1,
            yoyo: true,
            defaults: { duration: 3.2, ease: "sine.inOut" },
          });

          recognitionRows.forEach((row, index) => {
            const direction = index % 2 === 0 ? 1 : -1;
            kineticTimeline.to(
              row.querySelector("strong"),
              { xPercent: direction * (isMobile ? 1.5 : 4) },
              0,
            );
            kineticTimeline.to(
              row.querySelector("em"),
              { xPercent: direction * (isMobile ? -4 : -9) },
              0,
            );
          });
          kineticTimeline.to(
            "[data-kinetic-image]",
            {
              y: isMobile ? -6 : -10,
              rotation: isMobile ? -0.6 : -1.4,
              scale: isMobile ? 1.01 : 1.025,
            },
            0,
          );

          ScrollTrigger.create({
            trigger: "[data-kinetic-section]",
            start: "top 88%",
            end: "bottom 12%",
            onEnter: () => kineticTimeline.play(),
            onEnterBack: () => kineticTimeline.play(),
            onLeave: () => kineticTimeline.pause(),
            onLeaveBack: () => kineticTimeline.pause(),
          });

          ScrollTrigger.batch("[data-reveal]", {
            start: "clamp(top 88%)",
            once: true,
            onEnter: (elements) =>
              gsap.from(elements, {
                y: 28,
                opacity: 0.82,
                duration: 0.72,
                ease: "power2.out",
                stagger: 0.07,
                overwrite: "auto",
              }),
          });

          ScrollTrigger.batch("[data-photo-reveal]", {
            start: "clamp(top 90%)",
            once: true,
            interval: 0.08,
            batchMax: 4,
            onEnter: (elements) =>
              gsap.from(elements, {
                y: 34,
                rotation: (index) => (index % 2 === 0 ? -1.2 : 1.2),
                opacity: 0.86,
                duration: 0.9,
                stagger: 0.1,
                ease: "power3.out",
                overwrite: "auto",
              }),
          });

          const proofTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: "[data-proof]",
              start: "top 76%",
              once: true,
            },
            defaults: { ease: "power3.out" },
          });

          proofTimeline
            .addLabel("proof-in")
            .set(
              "[data-proof-value], [data-proof-orbit]",
              { willChange: "transform" },
              "proof-in",
            )
            .from(
              "[data-proof-label]",
              { x: -28, autoAlpha: 0, letterSpacing: "0.28em", duration: 0.82 },
              "proof-in",
            )
            .from(
              "[data-proof-rule]",
              { scaleX: 0, duration: 1.1 },
              "proof-in+=0.12",
            )
            .from(
              "[data-proof-orbit]",
              { scale: 0.45, rotation: -70, autoAlpha: 0, duration: 1.25 },
              "proof-in+=0.08",
            )
            .from(
              "[data-proof-value]",
              {
                yPercent: 115,
                rotation: (index) => (index === 0 ? -2 : 2),
                stagger: 0.14,
                duration: 0.9,
                ease: "power4.out",
              },
              "proof-in+=0.3",
            )
            .from(
              "[data-stat-label]",
              { y: 18, autoAlpha: 0, stagger: 0.12, duration: 0.55 },
              "proof-in+=0.66",
            )
            .set("[data-proof-value], [data-proof-orbit]", { clearProps: "willChange" });

          gsap
            .timeline({
              scrollTrigger: {
                trigger: "[data-how-steps]",
                start: "top 82%",
                once: true,
              },
              defaults: { ease: "power3.out" },
            })
            .from("[data-how-step]", {
              y: 16,
              autoAlpha: 0,
              duration: 0.42,
              stagger: 0.07,
            })
            .from(
              "[data-how-rule]",
              { scaleX: 0, duration: 0.52, stagger: 0.07 },
              "-=0.32",
            );

          gsap
            .timeline({
              scrollTrigger: {
                trigger: "[data-learning-carousel]",
                start: "top 82%",
                once: true,
              },
              defaults: { ease: "power3.out" },
            })
            .from("[data-learning-carousel]", { y: 44, autoAlpha: 0, duration: 0.85 })
            .from(
              "[data-learning-slide]:first-child h3, [data-learning-slide]:first-child p",
              { y: 22, autoAlpha: 0, stagger: 0.07, duration: 0.58 },
              "-=0.45",
            );

          const pricingCards = gsap.utils.toArray<HTMLElement>("[data-price-card]");
          const pricingTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: "[data-pricing-stage]",
              start: "top 70%",
              once: true,
            },
            defaults: { ease: "power3.out" },
          });

          pricingTimeline
            .addLabel("pricing-in")
            .from(
              "[data-pricing-stage] header > *",
              { y: 34, autoAlpha: 0, stagger: 0.08, duration: 0.72 },
              "pricing-in",
            )
            .from(
              pricingCards,
              {
                y: (index) => 72 + Math.abs(index - 1) * 18,
                rotation: (index) => [-3.5, 0, 3.5][index] ?? 0,
                scale: (index) => (index === 1 ? 0.94 : 0.97),
                autoAlpha: 0,
                stagger: 0.11,
                duration: 0.92,
              },
              "pricing-in+=0.18",
            )
            .from(
              "[data-plan-badge]",
              {
                y: -18,
                scale: 0.78,
                autoAlpha: 0,
                stagger: 0.08,
                duration: 0.55,
                ease: "back.out(1.8)",
              },
              "pricing-in+=0.68",
            )
            .from(
              "[data-plan-item]",
              { x: -16, autoAlpha: 0, stagger: 0.025, duration: 0.42 },
              "pricing-in+=0.76",
            );

          gsap
            .timeline({
              scrollTrigger: {
                trigger: "[data-final-cta]",
                start: "top 78%",
                once: true,
              },
              defaults: { ease: "power3.out" },
            })
            .from("[data-final-cta] h2", { y: 46, scale: 0.96, duration: 0.9 })
            .from("[data-final-cta] a", { y: 20, scale: 0.94, duration: 0.55 }, "-=0.45")
            .from(
              "[data-final-monogram]",
              { rotation: -18, scale: 0.78, autoAlpha: 0, duration: 0.9 },
              "-=0.7",
            );

          if (context.conditions?.desktop) {
            const depthElements = gsap.utils.toArray<HTMLElement>("[data-depth]");
            const depthOffset = (index: number, element: HTMLElement) => {
              const amount = element.dataset.depth === "medium" ? 4.5 : 2.5;
              return index % 2 === 0 ? amount : -amount;
            };

            if (depthElements.length && root.current) {
              gsap.fromTo(
                depthElements,
                {
                  yPercent: (index, element: HTMLElement) => -depthOffset(index, element),
                },
                {
                  yPercent: depthOffset,
                  ease: "none",
                  scrollTrigger: {
                    trigger: root.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.8,
                    invalidateOnRefresh: true,
                  },
                },
              );
            }
          }
        },
      );

      return () => media.revert();
    },
    { scope: root },
  );

  return null;
}
