"use client";

import { useEffect, useRef, useState } from "react";
import { learningItems } from "@/modules/site/content/siteContent";
import styles from "@/modules/site/components/landing/Landing.module.css";

export function LearningSection() {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const pointerStart = useRef<number | null>(null);

  useEffect(() => {
    if (!autoplay || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % learningItems.length),
      7000,
    );
    return () => window.clearInterval(timer);
  }, [autoplay]);

  function select(index: number) {
    setAutoplay(false);
    setActive((index + learningItems.length) % learningItems.length);
  }

  return (
    <section id="o-que-aprende" className={styles.learningSection} aria-labelledby="learning-title">
      <div className={styles.learningHeader} data-reveal>
        <p className={styles.kicker}>EM UM MÊS</p>
        <h2 id="learning-title">
          Em um mês, você já começa a combinar ritmo, bases e movimentos.
        </h2>
        <p>
          Quando a música começa, você encontra um ponto de partida, liga um movimento ao outro e
          sabe como voltar se algo sair diferente.
        </p>
      </div>

      <div
        className={styles.learningCarousel}
        data-learning-carousel
        aria-roledescription="carrossel"
        aria-label="Resultados do primeiro mês"
        onPointerDown={(event) => {
          pointerStart.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (pointerStart.current === null) return;
          const distance = event.clientX - pointerStart.current;
          pointerStart.current = null;
          if (Math.abs(distance) < 45) return;
          select(active + (distance < 0 ? 1 : -1));
        }}
      >
        <div className={styles.learningViewport}>
          <div
            className={styles.learningTrack}
            style={{ transform: `translate3d(-${active * 100}%, 0, 0)` }}
          >
            {learningItems.map((item, index) => (
              <article
                key={item.label}
                className={styles.learningSlide}
                aria-hidden={index !== active}
                data-learning-slide
              >
                <div className={styles.learningSlideIndex} aria-hidden="true">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>/ {String(learningItems.length).padStart(2, "0")}</span>
                </div>
                <div>
                  <p>{item.label}</p>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.learningControls}>
          <div className={styles.learningDots} aria-label="Escolher resultado">
            {learningItems.map((item, index) => (
              <button
                key={item.label}
                type="button"
                aria-label={`Mostrar resultado ${index + 1}`}
                aria-current={active === index ? "true" : undefined}
                onClick={() => select(index)}
              />
            ))}
          </div>
          <div className={styles.learningArrows}>
            <button type="button" aria-label="Resultado anterior" onClick={() => select(active - 1)}>
              ←
            </button>
            <button type="button" aria-label="Próximo resultado" onClick={() => select(active + 1)}>
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
