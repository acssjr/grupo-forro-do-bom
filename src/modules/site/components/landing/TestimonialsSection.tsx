import { SectionHeading } from "@/shared/ui/SectionHeading";
import { IllustrativeImage } from "@/shared/ui/IllustrativeImage";
import { testimonialThemes } from "@/modules/site/content/siteContent";
import { visualAssets } from "@/modules/site/config/visualAssets";
import styles from "@/modules/site/components/landing/Landing.module.css";

export function TestimonialsSection() {
  return (
    <section className={styles.testimonialsSection} aria-labelledby="testimonials-title">
      <SectionHeading
        kicker="QUEM JÁ COMEÇOU"
        title="Como foi a primeira aula."
        text="Relatos sobre a primeira aula, o contato com a escola e as pessoas encontradas no caminho."
        id="testimonials-title"
        inverse
      />
      <IllustrativeImage
        asset={visualAssets.community}
        ratio="wide"
        className={styles.testimonialImage}
        sizes="100vw"
        depth="medium"
      />
      <div className={styles.testimonialGrid}>
        {testimonialThemes.map((theme, index) => (
          <article key={theme.title} data-reveal>
            <h3>{theme.title}</h3>
            <p>{theme.text}</p>
            <footer>{theme.role}</footer>
            <small>{String(index + 1).padStart(2, "0")}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
