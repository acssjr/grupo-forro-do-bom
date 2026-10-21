import Image from "next/image";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { whatsappMessages } from "@/content/siteContent";
import styles from "@/components/landing/Landing.module.css";

export function FinalCta() {
  return (
    <section
      id="comece"
      className={styles.finalCtaSection}
      aria-labelledby="final-cta-title"
      data-conversion-zone="final"
      data-final-cta
    >
      <Image
        className={styles.finalMonogram}
        src="/brand/gfb-monogram.svg"
        alt=""
        width={940}
        height={624}
        aria-hidden="true"
        data-final-monogram
      />
      <p className={styles.kicker}>PRIMEIRA AULA POR R$ 39</p>
      <h2 id="final-cta-title">Sua vida pede um Forró do Bom.</h2>
      <WhatsAppLink
        className={styles.primaryButtonDark}
        message={whatsappMessages.beginner}
        tracking={{ ctaLocation: "final_cta", userIntent: "beginner" }}
      >
        Quero começar
      </WhatsAppLink>
    </section>
  );
}
