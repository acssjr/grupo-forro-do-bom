"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { useManagement } from "./ManagementProvider";
import { HeaderActions } from "./HeaderActions";
import { GlobalSearch } from "./GlobalSearch";
import s from "./Management.module.css";

export const navigation: { href: string; title: string; icon: IconName }[] = [
  { href: "/gestao", title: "Visão geral", icon: "home" }, { href: "/gestao/turmas", title: "Turmas e aulas", icon: "calendar" }, { href: "/gestao/alunos", title: "Alunos", icon: "users" }, { href: "/gestao/financeiro", title: "Financeiro", icon: "wallet" }, { href: "/gestao/eventos", title: "Eventos e exames", icon: "flag" }, { href: "/gestao/conteudos", title: "Conteúdos", icon: "video" }, { href: "/gestao/comunicados", title: "Comunicados", icon: "message" }, { href: "/gestao/equipe", title: "Equipe e acessos", icon: "users" },
];
function Logo() { return <Image className={s.originalLogo} src="/brand/gestao/gfb-original-amarelo-branco.png" alt="Forró do Bom" width={1280} height={1280} priority />; }
export function ManagementShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { state, storageError } = useManagement();
  const [moreOpen, setMoreOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => { try { if (localStorage.getItem("gfb-sidebar-collapsed") === "true") queueMicrotask(() => setCollapsed(true)); } catch { /* preference is optional */ } }, []);
  const toggleSidebar = () => { const next = !collapsed; setCollapsed(next); try { localStorage.setItem("gfb-sidebar-collapsed", String(next)); } catch { /* preference is optional */ } };
  const isActive = (href: string) => href === "/gestao" ? pathname === href : pathname.startsWith(href);
  const alerts = state.students.filter((student) => student.streak >= 2 && !student.followedAt).length;
  return <div className={`${s.app} ${collapsed ? s.collapsed : ""}`} onPointerDownCapture={(event) => { event.currentTarget.dataset.keyboardNavigation = "false"; }} onKeyDownCapture={(event) => { if (event.key === "Tab") event.currentTarget.dataset.keyboardNavigation = "true"; }}>
    <a href="#management-main" className={s.skip}>Pular para o conteúdo</a>
    <aside className={s.sidebar} id="management-sidebar">
      <div className={s.sidebarBrand}><Link href="/gestao" className={s.brand} aria-label="GFB Gestão — início"><Logo /><span className={s.brandCaption}><strong>Grupo Forró do Bom</strong><span>Plataforma de Gestão</span></span></Link><button className={s.collapseButton} onClick={toggleSidebar} aria-label={collapsed ? "Expandir navegação" : "Recolher navegação"} aria-expanded={!collapsed} aria-controls="management-sidebar"><Icon name="panel" size={19} /><span className={s.navLabel}>Recolher menu</span></button></div>
      <div className={s.navigationGroup}><span className={s.groupTitle}>Escola</span><nav aria-label="Navegação principal">{navigation.map((item, index) => <Link key={item.href} href={item.href} title={collapsed ? item.title : undefined} className={`${s.navItem} ${isActive(item.href) ? s.navActive : ""} ${index === 5 ? s.navGroupBreak : ""}`} aria-label={item.title} aria-current={isActive(item.href) ? "page" : undefined}><Icon name={item.icon} /><span className={s.navLabel}>{item.title}</span>{item.href.endsWith("alunos") && alerts > 0 && <span className={s.navCount}>{alerts}</span>}</Link>)}</nav></div>
      <div className={s.sidebarFoot}><Link href="/gestao/configuracoes" title={collapsed ? "Configurações" : undefined} aria-label="Configurações" className={`${s.navItem} ${isActive("/gestao/configuracoes") ? s.navActive : ""}`}><Icon name="settings" /><span className={s.navLabel}>Configurações</span></Link><Link href="/" title={collapsed ? "Voltar ao site" : undefined} aria-label="Voltar ao site" className={s.backSite}><Icon name="logout" size={17} /><span className={s.navLabel}>Voltar ao site</span></Link></div>
    </aside>
    <div className={s.workspace}>
      <header className={s.topbar}>
        <Link href="/gestao" className={s.mobileBrand} aria-label="GFB Gestão"><Logo /><span>Gestão</span></Link>
        <div className={s.topbarLeading} aria-hidden="true" />
        <GlobalSearch />
        <div className={s.topbarTrailing}><HeaderActions /></div>
      </header>
      {storageError && <p className={s.storageWarning} role="alert">Não foi possível salvar as alterações. Verifique o armazenamento disponível no navegador.</p>}
      <main id="management-main" className={s.main} tabIndex={-1}>{children}</main>
    </div>
    <div className={`${s.mobileMenu} ${moreOpen ? s.mobileMenuOpen : ""}`} inert={!moreOpen} aria-hidden={!moreOpen}><div><strong>Mais opções</strong><button className={s.iconButton} onClick={() => setMoreOpen(false)} aria-label="Fechar menu"><Icon name="close" /></button></div><nav aria-label="Mais opções de navegação">{[...navigation.slice(3), { href: "/gestao/configuracoes", title: "Configurações", icon: "settings" as const }].map((item) => <Link key={item.href} href={item.href} onClick={() => setMoreOpen(false)}><Icon name={item.icon} />{item.title}<Icon name="chevron" size={16} /></Link>)}</nav></div>
    <nav className={s.mobileNav} aria-label="Navegação no celular">{navigation.slice(0, 3).map((item, index) => <Link key={item.href} href={item.href} onClick={() => setMoreOpen(false)} className={isActive(item.href) && !moreOpen ? s.mobileActive : ""} aria-current={isActive(item.href) ? "page" : undefined}><Icon name={item.icon} size={22} /><span>{index === 0 ? "Início" : index === 1 ? "Turmas" : "Alunos"}</span></Link>)}<button onClick={() => setMoreOpen(!moreOpen)} aria-expanded={moreOpen} className={moreOpen ? s.mobileActive : ""}><Icon name="more" size={22} /><span>Mais</span></button></nav>
  </div>;
}
