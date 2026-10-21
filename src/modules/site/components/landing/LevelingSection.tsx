"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Level } from "./LevelSelect";
import { levelingSteps, whatsappMessages } from "@/modules/site/content/siteContent";
import { WhatsAppLink } from "@/shared/ui/WhatsAppLink";
import { trackEvent } from "@/modules/site/lib/analytics";
import styles from "@/modules/site/components/landing/Landing.module.css";

function SelectPlaceholder() {
  return <>
    <span className={styles.levelSelectLabel}>Nível pretendido</span>
    <button type="button" className={styles.levelSelectTrigger} disabled aria-label="Carregando níveis">
      <span className={styles.levelSelectCurrent} aria-hidden="true">Sua escolha</span>
      <span className={styles.levelSelectValue}>Básico</span>
      <span className={styles.levelSelectIcon}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></span>
    </button>
  </>;
}
const LevelSelect = dynamic(() => import("./LevelSelect").then((module) => module.LevelSelect), {
  loading: SelectPlaceholder,
});
const journeyLevels = [
  { label: "iniciante", stars: 1 },
  { label: "básico", stars: 2 },
  { label: "intermediário", stars: 3 },
  { label: "avançado", stars: 5 },
] as const;

export function LevelingSection() {
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState<Level>("básico");
  const [selectReady, setSelectReady] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const journeyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const root = journeyRef.current;
      if (!root) return;

      let timeline: { kill: () => void; play: () => void; pause: () => void } | undefined;
      let media: {
        add: (
          conditions: Record<string, string>,
          callback: (context: { conditions?: Record<string, boolean> }) => void,
        ) => unknown;
        revert: () => void;
      } | undefined;
      let cancelled = false;
      let inView = typeof IntersectionObserver === "undefined";
      let activation: Promise<void> | undefined;

      const buildMorph = () => {
        if (cancelled || activation) return;
        activation = Promise.all([
          import("gsap"),
          document.fonts?.ready ?? Promise.resolve(),
        ]).then(([{ default: gsap }]) => {
        if (cancelled) return;

        const frame = root.querySelector<HTMLElement>("[data-level-morph-frame]");
        const words = Array.from(root.querySelectorAll<HTMLElement>("[data-level-word]"));
        const markers = Array.from(root.querySelectorAll<HTMLElement>("[data-level-marker]"));
        if (!frame || words.length === 0) return;

        const measurementCanvas = document.createElement("canvas");
        const measurementContext = window.navigator.userAgent.includes("jsdom")
          ? null
          : measurementCanvas.getContext("2d");
        const widths = words.map((word) => {
          const label = word.querySelector<HTMLElement>("[data-level-label]") ?? word;
          const computed = window.getComputedStyle(label);
          const text = label.textContent ?? "";
          const tracking = Number.parseFloat(computed.letterSpacing) || 0;
          const opticalGutter = Math.max(12, Number.parseFloat(computed.fontSize) * 0.18);
          if (!measurementContext) return Math.ceil(label.offsetWidth + opticalGutter);

          measurementContext.font = [
            computed.fontStyle,
            computed.fontWeight,
            computed.fontSize,
            computed.fontFamily,
          ].join(" ");

          return Math.ceil(
            measurementContext.measureText(text).width + tracking * (text.length - 1) + opticalGutter,
          );
        });
        media = gsap.matchMedia();
        media.add(
          {
            animate: "(prefers-reduced-motion: no-preference)",
            reduce: "(prefers-reduced-motion: reduce)",
          },
          ({ conditions }: { conditions?: Record<string, boolean> }) => {
            const reduce = Boolean(conditions?.reduce);

            gsap.set(words, { autoAlpha: 0, display: "none" });
            gsap.set(words[0], { autoAlpha: 1, display: "grid" });
            gsap.set(frame, { width: widths[0] });
            gsap.set(markers, { scaleX: 0, transformOrigin: "left center" });
            gsap.set(markers[0], { scaleX: 1 });

            if (reduce) return;

            const maxWidth = Math.max(...widths);
            const widthRatios = widths.map((width) => width / maxWidth);
            const activeTimeline = gsap.timeline({ repeat: -1, paused: !inView });
            timeline = activeTimeline;

            gsap.set(frame, {
              width: maxWidth,
              scaleX: widthRatios[0],
              transformOrigin: "left center",
            });
            gsap.set(words, { transformOrigin: "left center" });
            gsap.set(words[0], { scaleX: 1 / widthRatios[0] });

            words.forEach((word, index) => {
              const nextIndex = (index + 1) % words.length;
              const nextWord = words[nextIndex];
              const currentChars = word.querySelectorAll<HTMLElement>("[data-level-char]");
              const nextChars = nextWord.querySelectorAll<HTMLElement>("[data-level-char]");
              const currentBadge = word.querySelector<HTMLElement>("[data-level-badge]");
              const nextBadge = nextWord.querySelector<HTMLElement>("[data-level-badge]");
              const currentStars = currentBadge?.querySelectorAll<HTMLElement>("[data-level-star]");
              const nextStars = nextBadge?.querySelectorAll<HTMLElement>("[data-level-star]");
              const levelAt = `level-${index}`;
              const exitAt = `exit-${index}`;
              const resizeAt = `resize-${index}`;
              const enterAt = `enter-${index}`;

              activeTimeline
                .addLabel(levelAt)
                .set(words, { autoAlpha: 0, display: "none", zIndex: 0 }, levelAt)
                .set(word, {
                  autoAlpha: 1,
                  display: "grid",
                  zIndex: 2,
                  scaleX: 1 / widthRatios[index],
                }, levelAt)
                .set(frame, { scaleX: widthRatios[index] }, levelAt)
                .set(currentChars, {
                  autoAlpha: 1,
                  yPercent: 0,
                  rotationX: 0,
                  rotationZ: 0,
                  scale: 1,
                }, levelAt)
                .set(currentBadge, { autoAlpha: 1, y: 0, scale: 1 }, levelAt)
                .set(currentStars ?? [], { autoAlpha: 1, rotation: 0, scale: 1 }, levelAt)
                .set(markers, { scaleX: 0 }, levelAt)
                .to(markers[index], { scaleX: 1, duration: 2.6, ease: "none" })
                .addLabel(exitAt)
                .to(currentBadge, {
                  autoAlpha: 0,
                  y: -8,
                  scale: 0.92,
                  duration: 0.24,
                  ease: "power2.in",
                }, exitAt)
                .to(currentChars, {
                  autoAlpha: 0,
                  yPercent: -115,
                  rotationX: 72,
                  rotationZ: (characterIndex) => (characterIndex % 2 === 0 ? -3 : 3),
                  scale: 0.92,
                  duration: 0.34,
                  ease: "power3.in",
                  stagger: { each: 0.022, from: "edges" },
                }, `${exitAt}+=0.02`)
                .set(word, { autoAlpha: 0, display: "none", zIndex: 0 })
                .set(nextWord, {
                  autoAlpha: 1,
                  display: "grid",
                  zIndex: 2,
                  scaleX: 1 / widthRatios[index],
                })
                .set(nextChars, {
                  autoAlpha: 0,
                  yPercent: 120,
                  rotationX: -78,
                  rotationZ: (characterIndex) => (characterIndex % 2 === 0 ? 4 : -4),
                  scale: 0.9,
                  transformOrigin: "50% 100%",
                })
                .set(nextBadge, { autoAlpha: 0, y: 10, scale: 0.86 })
                .set(nextStars ?? [], { autoAlpha: 0, rotation: -35, scale: 0 })
                .addLabel(resizeAt)
                .to(frame, {
                  scaleX: widthRatios[nextIndex],
                  duration: 0.58,
                  ease: "expo.inOut",
                }, resizeAt)
                .to(nextWord, {
                  scaleX: 1 / widthRatios[nextIndex],
                  duration: 0.58,
                  ease: "expo.inOut",
                }, resizeAt)
                .addLabel(enterAt, `${resizeAt}+=0.26`)
                .to(nextChars, {
                  autoAlpha: 1,
                  yPercent: 0,
                  rotationX: 0,
                  rotationZ: 0,
                  scale: 1,
                  duration: 0.56,
                  ease: "back.out(1.35)",
                  stagger: { each: 0.026, from: "center" },
                }, enterAt)
                .to(nextBadge, {
                  autoAlpha: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.34,
                  ease: "back.out(1.7)",
                }, `${enterAt}+=0.2`)
                .to(nextStars ?? [], {
                  autoAlpha: 1,
                  rotation: 0,
                  scale: 1,
                  duration: 0.3,
                  ease: "back.out(2.4)",
                  stagger: 0.06,
                }, `${enterAt}+=0.3`)
                .set(markers[index], { scaleX: 0 });
            });
          },
        );
        });
      };

      // Prepare the same choreography just before it becomes visible, then pause
      // off-screen. Font measurements and the repeating loop need not run at load.
      const observer = typeof IntersectionObserver === "undefined" ? undefined :
        new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          if (inView) setSelectReady(true);
          if (inView && !media) buildMorph();
          if (inView) timeline?.play();
          else timeline?.pause();
        }, { rootMargin: "300px 0px" });
      observer?.observe(root);
      if (inView) buildMorph();
      return () => {
        cancelled = true;
        observer?.disconnect();
        timeline?.kill();
        media?.revert();
      };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    let backdropFrame = 0;

    animationRef.current?.cancel();

    const finishClose = () => {
      if (cancelled) return;
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
      dialog.dataset.motionState = "closed";
      triggerRef.current?.focus();
    };

    if (open) {
      if (!dialog.open) {
        if (typeof dialog.showModal === "function") dialog.showModal();
        else dialog.setAttribute("open", "");
      }

      backdropFrame = window.requestAnimationFrame(() => {
        if (!cancelled) dialog.dataset.motionState = "open";
      });
      if (reducedMotion || typeof dialog.animate !== "function") {
        return;
      }

      const animation = dialog.animate(
        [
          { opacity: 0, transform: "translateY(12px) scale(0.97)" },
          { opacity: 1, transform: "translateY(0) scale(1)" },
        ],
        {
          duration: 250,
          easing: "cubic-bezier(0.23, 1, 0.32, 1)",
          fill: "both",
        },
      );
      animationRef.current = animation;
      animation.finished.catch(() => undefined);

      return () => {
        cancelled = true;
        window.cancelAnimationFrame(backdropFrame);
        animation.cancel();
      };
    }

    if (!dialog.open) {
      dialog.dataset.motionState = "closed";
      return;
    }

    dialog.dataset.motionState = "closing";
    if (reducedMotion || typeof dialog.animate !== "function") {
      finishClose();
      return;
    }

    const animation = dialog.animate(
      [
        { opacity: 1, transform: "translateY(0) scale(1)" },
        { opacity: 0, transform: "translateY(12px) scale(0.97)" },
      ],
      {
        duration: 180,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
        fill: "both",
      },
    );
    animationRef.current = animation;
    animation.finished.then(finishClose).catch(finishClose);

    return () => {
      cancelled = true;
      animation.cancel();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [open]);

  function openDialog() {
    setSelectReady(true);
    setOpen(true);
    trackEvent("leveling_info_opened", { user_intent: "leveling" });
  }

  function closeDialog() {
    setOpen(false);
  }

  return (
    <section id="nivelamento" className={styles.levelingSection} aria-labelledby="leveling-title">
      <div className={styles.levelingIntro} data-reveal>
        <div className={styles.levelingKickerRow}>
          <p className={styles.kicker}>JÁ DANÇA?</p>
          <span className={styles.levelingRibbon}>Nivelamento gratuito</span>
        </div>
        <h2 id="leveling-title">Está vindo de outra escola?</h2>
        <p>
          Cada escola possui seu próprio ritmo de ensino. Faça o nivelamento para entender
          como a sua dança se encaixa na metodologia GFB.
        </p>
        <button
          ref={triggerRef}
          className={styles.secondaryButtonLight}
          type="button"
          onClick={openDialog}
        >
          Como funciona o nivelamento?
        </button>
      </div>

      <div ref={journeyRef} className={styles.levelingJourney} data-leveling-selector>
        <p>Encontre a turma que acompanha a sua dança</p>
        <div className={styles.levelingWordStage} aria-hidden="true">
          <div className={styles.levelingWordMorph} data-level-morph data-level-morph-frame>
            {journeyLevels.map(({ label, stars }, index) => (
              <strong key={label} data-level-word data-level-first={index === 0 ? "true" : undefined}>
                <span className={styles.levelingLevelName} data-level-label>
                  {Array.from(label).map((character, characterIndex) => (
                    <span key={`${label}-${characterIndex}`} data-level-char>
                      {character}
                    </span>
                  ))}
                </span>
                <span className={styles.levelingLevelBadge} data-level-badge data-level-stars={stars}>
                  {Array.from({ length: stars }, (_, starIndex) => (
                    <span key={starIndex} data-level-star aria-hidden="true">★</span>
                  ))}
                </span>
              </strong>
            ))}
          </div>
        </div>
        <p className={styles.srOnly}>
          Níveis: iniciante com uma estrela, básico com duas, intermediário com três e
          avançado com cinco estrelas.
        </p>
        <div className={styles.levelingMarkers} aria-hidden="true">
          {journeyLevels.map(({ label }) => <span key={label} data-level-marker />)}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className={styles.levelingDialog}
        data-motion-state="closed"
        aria-labelledby="leveling-dialog-title"
        onCancel={(event) => {
          event.preventDefault();
          closeDialog();
        }}
        onClose={() => {
          setOpen(false);
          if (dialogRef.current) dialogRef.current.dataset.motionState = "closed";
        }}
      >
        <div className={styles.dialogHeader}>
          <div>
            <p className={styles.kicker}>ENCONTRE SUA TURMA</p>
            <h2 id="leveling-dialog-title">Como funciona o nivelamento</h2>
          </div>
          <button type="button" className={styles.closeButton} onClick={closeDialog} aria-label="Fechar nivelamento">
            ×
          </button>
        </div>

        <ol className={styles.levelingSteps}>
          {levelingSteps.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>

        <div className={styles.dialogAction}>
          <div>
            <strong>Um encontro cuidadoso, não uma prova.</strong>
            {selectReady ? <LevelSelect level={level} onChange={setLevel} dialogRef={dialogRef} /> : <SelectPlaceholder />}
          </div>
          <WhatsAppLink
            className={styles.primaryButton}
            message={whatsappMessages.leveling(level)}
            tracking={{
              ctaLocation: "leveling_dialog",
              userIntent: "leveling",
              levelIntended: level,
              intentEvent: "leveling_whatsapp_started",
            }}
          >
            Agendar nivelamento
          </WhatsAppLink>
        </div>
      </dialog>
    </section>
  );
}
