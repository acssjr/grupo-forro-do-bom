"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { navigationItems, whatsappMessages } from "@/modules/site/content/siteContent";
import { WhatsAppLink } from "@/shared/ui/WhatsAppLink";
import styles from "@/modules/site/components/landing/Landing.module.css";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className={styles.siteHeader}>
      <a className={styles.logoLink} href="#inicio" aria-label="Grupo Forró do Bom, início">
        <Image
          src="/brand/gfb-logo.svg"
          alt="Grupo Forró do Bom"
          width={940}
          height={624}
          preload
        />
      </a>

      <button
        className={styles.menuButton}
        type="button"
        aria-expanded={open}
        aria-controls="site-navigation"
        onClick={() => setOpen((current) => !current)}
      >
        <span>{open ? "Fechar" : "Menu"}</span>
        <span className={styles.menuGlyph} aria-hidden="true">
          {open ? "×" : "≡"}
        </span>
      </button>

      <nav
        id="site-navigation"
        aria-label="Navegação principal"
        data-open={open}
        className={`${styles.navigation} ${open ? styles.navigationOpen : ""}`}
      >
        {navigationItems.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
        <WhatsAppLink
          className={styles.headerCta}
          message={whatsappMessages.beginner}
          tracking={{ ctaLocation: "header", userIntent: "beginner" }}
          onClick={() => setOpen(false)}
        >
          Quero começar
        </WhatsAppLink>
      </nav>
    </header>
  );
}
