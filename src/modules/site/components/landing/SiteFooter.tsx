import Link from "next/link";
import styles from "@/modules/site/components/landing/Landing.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.siteFooter}>
      <div className={styles.footerBrand}>
        <span
          className={styles.footerLogo}
          role="img"
          aria-label="Grupo Forró do Bom"
          data-footer-logo
        />
        <p>Forró para começar, continuar e encontrar o seu lugar na dança.</p>
      </div>

      <div className={styles.footerColumn}>
        <h2>Onde estamos</h2>
        <address>
          Escola Criativa<br />
          Praça João Havelange, Cidade Nova<br />
          Feira de Santana, BA · CEP 44053-660
        </address>
        <a href="#localizacao">Localização e rota</a>
      </div>

      <nav className={styles.footerColumn} aria-label="Informações do site">
        <h2>Informações</h2>
        <a href="#como-funciona">Como começar</a>
        <a href="#planos">Planos</a>
        <a href="#nivelamento">Nivelamento</a>
        <a href="#duvidas">Dúvidas frequentes</a>
      </nav>

      <div className={styles.footerColumn}>
        <h2>Matrícula e pagamento</h2>
        <p>O atendimento, a matrícula e o fechamento acontecem pelo WhatsApp.</p>
        <p>Não há pagamento on-line nesta página.</p>
        <p>As formas de pagamento são confirmadas pela equipe antes da matrícula.</p>
      </div>

      <div className={styles.footerMeta}>
        <p>© {new Date().getFullYear()} Grupo Forró do Bom</p>
        <nav aria-label="Informações legais">
          <Link href="/politica-de-privacidade">Política de privacidade</Link>
          <Link href="/termos-de-uso">Termos de uso</Link>
        </nav>
        <a
          className={styles.instagramLink}
          href="https://www.instagram.com/dobomforro/"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram do Grupo Forró do Bom, @dobomforro"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" className={styles.instagramDot} />
          </svg>
        </a>
      </div>
    </footer>
  );
}
