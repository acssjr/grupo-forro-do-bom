import Image from "next/image";
import styles from "@/modules/site/components/landing/Landing.module.css";

export function ProofSection() {
  return (
    <section id="prova" className={styles.proofSection} aria-label="Experiência do Grupo Forró do Bom" data-proof>
      <div className={styles.proofHeading}>
        <p className={styles.proofLabel} data-proof-label>Nossa história em dois números</p>
        <span className={styles.proofRule} aria-hidden="true" data-proof-rule />
      </div>
      <div className={styles.proofGrid}>
        <p data-stat>
          <strong aria-label="11 anos">
            <span aria-hidden="true" data-proof-value>11 anos</span>
          </strong>
          <span data-stat-label>fazendo gente dançar.</span>
        </p>
        <p data-stat>
          <strong aria-label="mais de 3 mil pessoas">
            <span aria-hidden="true" data-proof-value>+ de 3.000</span>
          </strong>
          <span data-stat-label>pessoas já passaram por aqui.</span>
        </p>
      </div>
      <span className={styles.proofOrbit} aria-hidden="true" data-proof-orbit>
        <Image src="/brand/gfb-logo.svg" alt="" width={940} height={624} />
      </span>
    </section>
  );
}
