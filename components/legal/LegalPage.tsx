import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "@/components/legal/LegalPage.module.css";

type LegalPageProps = {
  kicker: string;
  title: string;
  summary: string;
  children: ReactNode;
};

export function LegalPage({ kicker, title, summary, children }: LegalPageProps) {
  return (
    <div className={styles.legalShell}>
      <header className={styles.legalHeader}>
        <Link href="/" aria-label="Voltar para a página inicial do Grupo Forró do Bom">
          <Image src="/brand/gfb-logo.svg" alt="Grupo Forró do Bom" width={940} height={624} />
        </Link>
        <Link className={styles.backLink} href="/">
          Voltar para a landing
        </Link>
      </header>

      <main>
        <article className={styles.legalArticle}>
          <p className={styles.kicker}>{kicker}</p>
          <h1>{title}</h1>
          <p className={styles.summary}>{summary}</p>
          <p className={styles.updated}>Última atualização: 18 de agosto de 2026.</p>
          <div className={styles.legalContent}>{children}</div>
        </article>
      </main>

      <footer className={styles.legalFooter}>
        <p>© {new Date().getFullYear()} Grupo Forró do Bom</p>
        <Link href="/">Voltar ao início</Link>
      </footer>
    </div>
  );
}
