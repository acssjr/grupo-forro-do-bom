import { IllustrativeImage } from "@/shared/ui/IllustrativeImage";
import { visualAssets } from "@/modules/site/config/visualAssets";
import { gfbHistory } from "@/modules/site/content/siteContent";
import styles from "@/modules/site/components/landing/Landing.module.css";

export function AboutGfbSection() {
  return (
    <section
      id="quem-e-o-gfb"
      className={styles.aboutSection}
      aria-labelledby="about-gfb-title"
    >
      <div className={styles.aboutYear} aria-hidden="true">
        2015
      </div>

      <div className={styles.aboutCopy}>
        <p className={styles.kicker} data-reveal>
          {gfbHistory.kicker}
        </p>
        <h2 id="about-gfb-title" data-reveal>
          {gfbHistory.title}
        </h2>
      </div>

      <div className={styles.aboutVisual}>
        <IllustrativeImage
          asset={visualAssets.history}
          ratio="landscape"
          sizes="(max-width: 767px) 88vw, 36vw"
          depth="medium"
        />
      </div>

      <div className={styles.aboutNarrative}>
        <div className={styles.aboutText}>
          <p data-reveal>{gfbHistory.origin}</p>
          <p data-reveal>{gfbHistory.legacy}</p>
        </div>
        <p className={styles.aboutClosing} data-reveal>
          {gfbHistory.closing}
        </p>
      </div>
    </section>
  );
}
