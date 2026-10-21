import { recognitionItems } from "@/modules/site/content/siteContent";
import { IllustrativeImage } from "@/shared/ui/IllustrativeImage";
import { visualAssets } from "@/modules/site/config/visualAssets";
import styles from "@/modules/site/components/landing/Landing.module.css";

export function RecognitionSection() {
  return (
    <section
      id="reconhecimento"
      className={styles.recognitionSection}
      aria-labelledby="recognition-title"
      data-kinetic-section
    >
      <div className={styles.recognitionStage}>
        <div className={styles.recognitionCopy}>
          <p id="recognition-title" className={styles.recognitionIntro}>
            Se você já se pegou pensando alguma dessas coisas, está no lugar certo.
          </p>
          <ul className={styles.recognitionList}>
            {recognitionItems.map((item, index) => (
              <li key={item} data-kinetic-row>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
                <em aria-hidden="true">{item}</em>
              </li>
            ))}
          </ul>
          <p className={styles.recognitionNote} data-reveal>
            Você aprende no ritmo da turma, testa os movimentos sem exposição e descobre
            que errar também faz parte da aula.
          </p>
        </div>
        <div className={styles.recognitionVisual} data-kinetic-image>
          <IllustrativeImage
            asset={visualAssets.arrival}
            ratio="portrait"
            sizes="(max-width: 767px) 88vw, 34vw"
            depth="medium"
          />
        </div>
      </div>
    </section>
  );
}
