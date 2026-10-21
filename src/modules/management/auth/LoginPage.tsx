"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { Icon } from "../components/Icon";
import s from "./LoginPage.module.css";

const USERNAME_KEY = "gfb-login-username";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    try { const saved = localStorage.getItem(USERNAME_KEY); if (saved) queueMicrotask(() => setUsername(saved)); } catch { /* The form also works without local storage. */ }
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username.trim() || !password || pending) return;
    setPending(true); setMessage("");
    try {
      const response = await fetch("/api/gestao/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: username.trim(), password, remember }) });
      const result = await response.json();
      if (!response.ok) { setMessage(result.error || "Não foi possível entrar. Tente novamente."); return; }
      try { if (remember) localStorage.setItem(USERNAME_KEY, username.trim()); else localStorage.removeItem(USERNAME_KEY); } catch { /* The session uses a server cookie, never browser-stored passwords. */ }
      window.location.replace("/gestao");
    } catch { setMessage("Não foi possível conectar. Verifique sua conexão e tente novamente."); }
    finally { setPending(false); }
  }

  return <main className={s.page}>
    <div className={s.composition}>
      <section className={s.illustration} aria-labelledby="login-story-title">
        <Image className={s.scene} src="/images/management/login-forro-cartoon-3d-v2.png" alt="Personagem 3D cartoon com chapéu, sentado à mesa com uma sanfona e um computador." fill priority sizes="(max-width: 760px) 100vw, 48vw" />
        <div className={s.story}><h2 id="login-story-title">Gestão da<br />escola.</h2><p>Alunos, turmas, conteúdos e financeiro.</p></div>
      </section>
      <section className={s.access} aria-labelledby="login-title">
        <Link href="/" className={s.brand} aria-label="Grupo Forró do Bom — ir para o site"><Image src="/brand/gfb-logo-dark.png" alt="Forró do Bom" width={940} height={624} priority /><span>Plataforma de Gestão</span></Link>
        <div className={s.glass}>
          <span className={s.beam} aria-hidden="true"><span /></span>
          <header className={s.heading}><h1 id="login-title">Acesse sua conta</h1><p>Informe seu usuário e sua senha.</p></header>
          <form onSubmit={submit}>
            <label className={s.field} htmlFor="login-username">Usuário<span className={s.inputWrap}><Icon name="users" size={19} /><input id="login-username" name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="Seu usuário" required maxLength={120} value={username} onChange={event => { setUsername(event.target.value); setMessage(""); }} /></span></label>
            <label className={s.field} htmlFor="login-password">Senha<span className={s.inputWrap}><Icon name="lock" size={19} /><input id="login-password" name="password" autoComplete="current-password" type={visible ? "text" : "password"} placeholder="Sua senha" required maxLength={256} value={password} onChange={event => { setPassword(event.target.value); setMessage(""); }} /><button className={s.reveal} type="button" onClick={() => setVisible(!visible)} aria-label={visible ? "Ocultar senha" : "Mostrar senha"} aria-pressed={visible}><Icon name="eye" size={19} />{visible && <span className={s.eyeSlash} />}</button></span></label>
            <div className={s.formOptions}>
              <label className={s.remember}><input type="checkbox" name="remember" checked={remember} onChange={event => setRemember(event.target.checked)} /><span className={s.checkbox} aria-hidden="true"><Icon name="check" size={13} /></span><span>Salvar meu acesso</span></label>
              <Popover.Root><Popover.Trigger className={s.help}>Esqueci minha senha</Popover.Trigger><Popover.Portal><Popover.Positioner sideOffset={10} align="end" className={s.helpPositioner}><Popover.Popup className={s.helpPopup}><Popover.Title>Recuperar seu acesso</Popover.Title><Popover.Description>Peça à administração do Grupo Forró do Bom para redefinir sua senha.</Popover.Description><Popover.Close className={s.helpClose}>Entendi<Icon name="check" size={15} /></Popover.Close></Popover.Popup></Popover.Positioner></Popover.Portal></Popover.Root>
            </div>
            {message && <p className={s.formMessage} role="alert"><Icon name="info" size={18} />{message}</p>}
            <button className={s.submit} type="submit" disabled={pending} aria-busy={pending}><span>{pending ? "Entrando…" : "Entrar na gestão"}</span><Icon name="arrow" size={19} /></button>
          </form>
        </div>
        <footer className={s.footer}><span><Icon name="lock" size={14} />Acesso da equipe GFB</span><Link href="/">Voltar ao site<Icon name="arrow" size={14} /></Link></footer>
      </section>
    </div>
  </main>;
}
