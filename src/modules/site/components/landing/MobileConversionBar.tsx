"use client";

import { useEffect, useState } from "react";
import { whatsappMessages } from "@/modules/site/content/siteContent";
import { WhatsAppLink } from "@/shared/ui/WhatsAppLink";
import styles from "@/modules/site/components/landing/Landing.module.css";

export function MobileConversionBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const visibility = { hero: true, plans: false, final: false };
    const update = () => setVisible(!visibility.hero && !visibility.plans && !visibility.final);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const key = entry.target.getAttribute("data-conversion-zone") as keyof typeof visibility;
          if (key) visibility[key] = entry.isIntersecting;
        }
        update();
      },
      { threshold: 0.08 },
    );

    document.querySelectorAll<HTMLElement>("[data-conversion-zone]").forEach((element) =>
      observer.observe(element),
    );

    return () => observer.disconnect();
  }, []);

  return (
    <aside
      className={`${styles.mobileBar} ${visible ? styles.mobileBarVisible : ""}`}
      aria-hidden={!visible}
    >
      <span>Primeira aula por R$ 39</span>
      <WhatsAppLink
        className={styles.mobileBarButton}
        message={whatsappMessages.beginner}
        tracking={{ ctaLocation: "mobile_sticky", userIntent: "beginner" }}
        tabIndex={visible ? 0 : -1}
      >
        Quero começar
      </WhatsAppLink>
    </aside>
  );
}
