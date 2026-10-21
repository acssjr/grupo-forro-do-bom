"use client";

import { mapLinks, siteConfig } from "@/config/site";
import { trackEvent } from "@/modules/site/lib/analytics";
import styles from "@/modules/site/components/landing/Landing.module.css";

export function LocationSection() {
  const { address } = siteConfig;

  return (
    <section id="localizacao" className={styles.locationSection} aria-labelledby="location-title">
      <div className={styles.locationCopy} data-reveal>
        <p className={styles.kicker}>ONDE ACONTECE</p>
        <h2 id="location-title">No coração da Cidade Nova.</h2>
        <address>
          <strong>{address.venue}</strong>
          <span>{address.street}, {address.district}</span>
          <span>{address.city}, {address.region}</span>
          <span>CEP {address.postalCode}</span>
          {address.reference ? <small>{address.reference}</small> : null}
        </address>
        <a
          className={styles.secondaryButton}
          href={mapLinks.route}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent("map_clicked", { cta_location: "location" })}
        >
          Ver rota
        </a>
      </div>
      <div className={styles.locationVisuals}>
        <div className={styles.mapFrame} data-reveal>
          <iframe
            title="Mapa da Escola Criativa em Feira de Santana"
            src={mapLinks.embed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
