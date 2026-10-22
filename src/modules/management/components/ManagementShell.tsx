"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { NavigationIcon } from "./NavigationIcon";
import { NavigationNotch } from "./NavigationNotch";
import { useSidebarMotion } from "./useSidebarMotion";
import { useManagement } from "./ManagementProvider";
import { HeaderActions } from "./HeaderActions";
import { GlobalSearch } from "./GlobalSearch";
import { useAccess } from "../auth/AccessProvider";
import { canAccessPath } from "../auth/types";
import { ManagementContentMotion } from "./ManagementContentMotion";
import s from "./Management.module.css";

export const navigation: { href: string; title: string; icon: IconName | "transfer" }[] = [
  { href: "/gestao", title: "Visão geral", icon: "home" }, { href: "/gestao/turmas", title: "Turmas e aulas", icon: "calendar" }, { href: "/gestao/alunos", title: "Alunos", icon: "users" }, { href: "/gestao/financeiro", title: "Financeiro", icon: "wallet" }, { href: "/gestao/repasses", title: "Repasses", icon: "transfer" }, { href: "/gestao/eventos", title: "Eventos e exames", icon: "flag" }, { href: "/gestao/conteudos", title: "Conteúdos", icon: "video" }, { href: "/gestao/comunicados", title: "Comunicados", icon: "message" }, { href: "/gestao/equipe", title: "Equipe e acessos", icon: "users" },
];
function Logo() { return <span className={s.logoSlot}><Image className={s.originalLogo} src="/brand/gfb-logo.svg" alt="Forró do Bom" width={940} height={624} priority data-sidebar-logo /></span>; }
export function ManagementShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useAccess();
  const visibleNavigation = navigation.filter(item => canAccessPath(user, item.href));
  const { storageError } = useManagement();
  const [moreOpen, setMoreOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const requestedCollapsed = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const workspace = useRef<HTMLDivElement>(null);
  const notch = useRef<HTMLDivElement>(null);
  const ink = useRef<HTMLDivElement>(null);
  const transitionSidebar = useSidebarMotion({ root, sidebar, workspace, notch, ink }, pathname, collapsed);
  useEffect(() => { try { if (localStorage.getItem("gfb-sidebar-collapsed") === "true") queueMicrotask(() => { requestedCollapsed.current = true; setCollapsed(true); }); } catch { /* preference is optional */ } }, []);
  const toggleSidebar = () => { const next = !requestedCollapsed.current; requestedCollapsed.current = next; transitionSidebar(next, () => setCollapsed(next)); try { localStorage.setItem("gfb-sidebar-collapsed", String(next)); } catch { /* preference is optional */ } };
  const isActive = (href: string) => href === "/gestao" ? pathname === href : pathname.startsWith(href);
  return <div ref={root} data-management-shell data-sidebar-state={collapsed ? "collapsed" : "expanded"} className={`${s.app} ${collapsed ? s.collapsed : ""}`} onPointerDownCapture={(event) => { event.currentTarget.dataset.keyboardNavigation = "false"; }} onKeyDownCapture={(event) => { if (["Tab", "Enter", " "].includes(event.key)) event.currentTarget.dataset.keyboardNavigation = "true"; }}>
    <a href="#management-main" className={s.skip}>Pular para o conteúdo</a>
    <aside ref={sidebar} className={s.sidebar} id="management-sidebar">
      <NavigationNotch surfaceRef={notch} />
      <div className={s.sidebarBrand} data-sidebar-brand><Link href="/gestao" className={s.brand} aria-label="GFB Gestão — início"><Logo /><span className={s.brandCaption} data-sidebar-label><strong>Grupo Forró do Bom</strong><span>Plataforma de Gestão</span></span></Link><button data-sidebar-motion data-sidebar-control className={s.collapseButton} onClick={toggleSidebar} aria-label={collapsed ? "Expandir navegação" : "Recolher navegação"} aria-expanded={!collapsed} aria-controls="management-sidebar"><NavigationIcon name="panel" size={20} /><span className={s.navLabel} data-sidebar-label>Recolher menu</span></button></div>
      <div className={s.navigationGroup} data-sidebar-scroll data-sidebar-motion><nav aria-label="Navegação principal">{visibleNavigation.map(item => <Link data-sidebar-link key={item.href} href={item.href} title={collapsed ? item.title : undefined} className={`${s.navItem} ${isActive(item.href) ? s.navActive : ""}`} aria-label={item.title} aria-current={isActive(item.href) ? "page" : undefined}>
        <NavigationIcon name={item.href.endsWith("equipe") ? "team" : item.icon} motion />
        <span className={s.navText}><span className={s.navLabel} data-sidebar-label>{item.title}</span></span>
      </Link>)}</nav></div>
      {canAccessPath(user, "/gestao/configuracoes") && <div className={s.sidebarFoot} data-sidebar-footer><Link data-sidebar-link href="/gestao/configuracoes" title={collapsed ? "Configurações" : undefined} aria-label="Configurações" aria-current={isActive("/gestao/configuracoes") ? "page" : undefined} className={`${s.navItem} ${isActive("/gestao/configuracoes") ? s.navActive : ""}`}>
        <NavigationIcon name="settings" motion /><span className={s.navLabel} data-sidebar-label>Configurações</span>
      </Link></div>}
      <div ref={ink} className={s.navigationInk} aria-hidden="true" inert>
        {[...visibleNavigation, { href:"/gestao/configuracoes", title:"Configurações", icon:"settings" as const }].filter(item => canAccessPath(user, item.href)).map(item => <div key={item.href} className={s.navigationInkRow} data-sidebar-motion data-sidebar-ink-row={item.href}>
          <NavigationIcon name={item.href.endsWith("equipe") ? "team" : item.icon} motion active={isActive(item.href)} />
          <span className={s.navText}><span className={s.navLabel} data-sidebar-label>{item.title}</span></span>
        </div>)}
      </div>
    </aside>
    <div ref={workspace} className={s.workspace}>
      <header className={s.topbar}>
        <Link href="/gestao" className={s.mobileBrand} aria-label="GFB Gestão"><Logo /><span>Gestão</span></Link>
        <GlobalSearch />
        <div className={s.topbarTrailing}><HeaderActions /></div>
      </header>
      {storageError && <p className={s.storageWarning} role="alert">Não foi possível salvar as alterações. Verifique o armazenamento disponível no navegador.</p>}
      <main id="management-main" className={s.main} tabIndex={-1}><ManagementContentMotion>{children}</ManagementContentMotion></main>
    </div>
    <div className={`${s.mobileMenu} ${moreOpen ? s.mobileMenuOpen : ""}`} inert={!moreOpen} aria-hidden={!moreOpen}><div><strong>Mais opções</strong><button className={s.iconButton} onClick={() => setMoreOpen(false)} aria-label="Fechar menu"><Icon name="close" /></button></div><nav aria-label="Mais opções de navegação">{[...visibleNavigation.slice(3), { href: "/gestao/configuracoes", title: "Configurações", icon: "settings" as const }].filter(item => canAccessPath(user, item.href)).map((item) => <Link key={item.href} href={item.href} onClick={() => setMoreOpen(false)}><NavigationIcon name={item.href.endsWith("equipe") ? "team" : item.icon} />{item.title}<Icon name="chevron" size={16} /></Link>)}</nav></div>
    <nav className={s.mobileNav} aria-label="Navegação no celular">{visibleNavigation.slice(0, 3).map((item) => <Link key={item.href} href={item.href} onClick={() => setMoreOpen(false)} className={isActive(item.href) && !moreOpen ? s.mobileActive : ""} aria-current={isActive(item.href) ? "page" : undefined}><NavigationIcon name={item.icon} size={23} /><span>{item.href === "/gestao" ? "Início" : item.href === "/gestao/turmas" ? "Turmas" : item.title}</span></Link>)}<button onClick={() => setMoreOpen(!moreOpen)} aria-expanded={moreOpen} className={moreOpen ? s.mobileActive : ""}><Icon name="more" size={22} /><span>Mais</span></button></nav>
  </div>;
}
