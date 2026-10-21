import { IllustrativeImage } from "@/shared/ui/IllustrativeImage";
import { WhatsAppLink } from "@/shared/ui/WhatsAppLink";
import { whatsappMessages } from "@/modules/site/content/siteContent";
import { visualAssets } from "@/modules/site/config/visualAssets";
import styles from "@/modules/site/components/landing/Landing.module.css";

export function HeroSection() {
  return (
    <section
      id="inicio"
      className={styles.heroSection}
      aria-labelledby="hero-title"
      data-hero-composition
      data-conversion-zone="hero"
    >
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow} data-hero-item>
          <span>ESCOLA DE FORRÓ EM FEIRA DE SANTANA - BA</span>
        </p>
        <h1 id="hero-title" data-hero-item>
          Aprenda <span className={styles.heroEmphasis}>forró</span> começando{" "}
          <span className={styles.heroZero}>do zero.</span>
        </h1>
        <p className={styles.heroSubtitle} data-hero-item>
          Você não precisa saber dançar e nem levar um par.
        </p>
        <p className={styles.heroOffer} data-hero-item>
          <strong>Primeira aula por R$ 39.</strong>
          <br />
          Se você decidir continuar, esse valor vira{" "}
          <strong className={styles.heroCredit}>crédito na sua matrícula.</strong>
        </p>
        <div className={styles.heroActions} data-hero-item>
          <WhatsAppLink
            className={styles.primaryButton}
            message={whatsappMessages.beginner}
            tracking={{ ctaLocation: "hero", userIntent: "beginner" }}
          >
            QUERO APRENDER
          </WhatsAppLink>
          <a
            className={styles.dancerRoute}
            href="#nivelamento"
            data-secondary-route
          >
            <span>
              <strong>Já danço</strong>
              <small>Como funciona o nivelamento?</small>
            </span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M14 7l5 5-5 5" />
            </svg>
          </a>
        </div>
      </div>

      <div className={styles.heroVisual} data-hero-item data-hero-visual>
        <IllustrativeImage
          asset={visualAssets.hero}
          ratio="landscape"
          priority
          sizes="(max-width: 767px) 92vw, 42vw"
          depth="medium"
        />
        <span className={styles.heroStamp} aria-hidden="true" data-hero-stamp>
          <strong>11</strong>
          {" "}
          <span>anos de história</span>
        </span>
      </div>
    </section>
  );
}
