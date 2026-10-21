import styles from "@/modules/site/components/landing/Landing.module.css";

type SectionHeadingProps = {
  kicker?: string;
  title: string;
  text?: string;
  inverse?: boolean;
  id?: string;
};

export function SectionHeading({
  kicker,
  title,
  text,
  inverse = false,
  id,
}: SectionHeadingProps) {
  return (
    <header className={`${styles.sectionHeading} ${inverse ? styles.inverse : ""}`}>
      {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
      <h2 id={id}>{title}</h2>
      {text ? <p className={styles.sectionLead}>{text}</p> : null}
    </header>
  );
}
