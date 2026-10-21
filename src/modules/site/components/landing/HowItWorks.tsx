import { SectionHeading } from "@/shared/ui/SectionHeading";
import { beginnerSteps } from "@/modules/site/content/siteContent";
import styles from "@/modules/site/components/landing/Landing.module.css";

export function HowItWorks() {
  return (
    <section id="como-funciona" className={styles.howSection} aria-labelledby="how-title">
      <SectionHeading
        kicker="PARA QUEM NUNCA DANÇOU"
        title="Começar é mais simples do que parece."
        text="A entrada acontece no início de uma nova turma. Assim, todo mundo começa junto e acompanha a progressão."
        id="how-title"
      />
      <ol className={styles.stepsList} data-how-steps>
        {beginnerSteps.map((step) => (
          <li key={step.number} data-how-step>
            <span className={styles.stepNumber}>{step.number}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
            <span className={styles.stepRule} aria-hidden="true" data-how-rule />
          </li>
        ))}
      </ol>
    </section>
  );
}
