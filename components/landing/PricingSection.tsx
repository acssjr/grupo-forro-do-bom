import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { plans, whatsappMessages } from "@/content/siteContent";
import styles from "@/components/landing/Landing.module.css";

export function PricingSection() {
  return (
    <section
      id="planos"
      className={styles.pricingSection}
      aria-labelledby="pricing-title"
      data-conversion-zone="plans"
      data-pricing-stage
    >
      <SectionHeading
        kicker="ESCOLHA COMO CONTINUAR"
        title="Comece leve. Evolua com constância."
        text="A aula inicial abre a porta. Para continuar, o Essencial reúne o que a maioria das pessoas precisa para ganhar segurança sem pesar no mês."
        id="pricing-title"
      />
      <p className={styles.pricingDecisionNote}>
        Você escolhe o plano e conversa com a equipe pelo WhatsApp. O pagamento não acontece
        nesta página.
      </p>

      <div className={styles.pricingGrid}>
        {plans.map((plan, index) => (
          <article
            key={plan.name}
            className={`${styles.priceCard} ${
              plan.recommended ? styles.featuredPlan : ""
            } ${plan.acceleration ? styles.plusPlan : ""} ${
              plan.entry ? styles.entryPlan : ""
            }`}
            data-price-card
            data-entry-plan={plan.entry ? "true" : undefined}
            data-recommended-plan={plan.recommended ? "true" : undefined}
          >
            <p className={styles.planBadge} data-plan-badge>
              {plan.badge}
            </p>
            <div className={styles.planMeta}>
              <p className={styles.planIndex}>{String(index + 1).padStart(2, "0")}</p>
              <p>{plan.role}</p>
            </div>
            <h3>{plan.name}</h3>
            <p className={styles.planBenefit}>{plan.benefit}</p>
            <p className={styles.planPrice}>
              <strong>{plan.price}</strong>
              <span>{plan.cadence}</span>
            </p>
            <ul>
              {plan.items.map((item) => (
                <li key={item} data-plan-item>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {plan.platform ? (
              <details className={styles.planDisclosure}>
                <summary aria-label="Entenda o que está incluído na plataforma do aluno">
                  <span>{plan.platform.prompt}</span>
                  <span aria-hidden="true">?</span>
                </summary>
                <p>{plan.platform.description}</p>
              </details>
            ) : null}
            {plan.note ? <p className={styles.planNote}>{plan.note}</p> : null}
            <WhatsAppLink
              className={plan.recommended ? styles.primaryButton : styles.outlineButton}
              message={whatsappMessages.plan(plan.name)}
              tracking={{
                ctaLocation: `pricing_${index + 1}`,
                userIntent: "plan",
                planName: plan.name,
                intentEvent: "pricing_plan_selected",
              }}
            >
              {plan.cta}
            </WhatsAppLink>
          </article>
        ))}
      </div>
    </section>
  );
}
