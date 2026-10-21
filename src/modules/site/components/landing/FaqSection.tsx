"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { faqItems } from "@/modules/site/content/siteContent";
import { trackEvent } from "@/modules/site/lib/analytics";
import styles from "@/modules/site/components/landing/Landing.module.css";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    const panels = panelRefs.current;

    panels.forEach((panel, index) => {
      if (!panel) return;
      panel.style.height = openIndex === index ? `${panel.scrollHeight}px` : "0px";
    });

    if (openIndex === null || typeof ResizeObserver === "undefined") return;
    const openPanel = panels[openIndex];
    if (!openPanel) return;

    const observer = new ResizeObserver(() => {
      openPanel.style.height = `${openPanel.scrollHeight}px`;
    });
    observer.observe(openPanel.firstElementChild ?? openPanel);
    return () => observer.disconnect();
  }, [openIndex]);

  return (
    <section id="duvidas" className={styles.faqSection} aria-labelledby="faq-title">
      <div className={styles.faqIntro} data-reveal>
        <p className={styles.kicker}>PERGUNTAS FREQUENTES</p>
        <h2 id="faq-title">Antes da primeira aula</h2>
        <p>O que costuma passar pela cabeça de quem está pensando em começar.</p>
      </div>

      <div className={styles.faqList}>
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <article className={styles.faqItem} key={item.question} data-reveal>
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                  id={`faq-trigger-${index}`}
                  onClick={() => {
                    const nextOpen = isOpen ? null : index;
                    setOpenIndex(nextOpen);
                    if (!isOpen) {
                      trackEvent("faq_opened", { cta_location: `faq_${index + 1}` });
                    }
                  }}
                >
                  <span>{item.question}</span>
                  <span className={styles.faqIcon} aria-hidden="true" data-faq-icon />
                </button>
              </h3>
              <div
                ref={(element) => {
                  panelRefs.current[index] = element;
                }}
                id={`faq-panel-${index}`}
                role="region"
                aria-labelledby={`faq-trigger-${index}`}
                aria-hidden={!isOpen}
                className={`${styles.faqPanel} ${isOpen ? styles.faqPanelOpen : ""}`}
              >
                <p>{item.answer}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
