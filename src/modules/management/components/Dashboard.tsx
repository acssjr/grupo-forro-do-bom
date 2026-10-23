"use client";

import Link from "next/link";
import Image from "next/image";
import { LiquidGlassScene } from "simple-liquid-glass/backdrop";
import { ControlGlass } from "./GlassPeriodSwitcher";
import { useCallback, useState, useSyncExternalStore } from "react";
import { cohorts } from "@/modules/management/domain/demo";
import { DEMO_DATE, money, shortDate } from "@/modules/management/domain/model";
import { useManagement } from "./ManagementProvider";
import { Avatar, Badge, Empty } from "./ui";
import { useAccess } from "../auth/AccessProvider";
import { canAccessPath } from "../auth/types";
import { greetingAt } from "../domain/motion";
import { Icon } from "./Icon";
import { MobileHeaderContent } from "./MobileHeader";
import { Calendar } from "./Calendar";
import { OverviewMetrics } from "./OverviewMetrics";
import { BorderBeam } from "./BorderBeam";
import s from "./Management.module.css";

const currentGreeting = () => greetingAt(new Date());
const serverGreeting = () => "Olá";
const subscribeGreeting = (update: () => void) => {
  const timer = setInterval(update, 60_000);
  return () => clearInterval(timer);
};

export function Dashboard() {
  const { state } = useManagement();
  const { user } = useAccess();
  // Read the current greeting on client navigation, before measuring the entrance.
  // An effect-delayed greeting added the 48px icon after the first animated frame.
  const greeting = useSyncExternalStore(subscribeGreeting, currentGreeting, serverGreeting);
  const firstName = user.name.trim().split(/\s+/)[0];
  const setGreetingText = useCallback((text: HTMLSpanElement|null) => {
    if (!text) return;
    const mobile = matchMedia("(width < 768px)");
    const fit = () => {
      text.style.fontSize = "";
      if (!mobile.matches || !text.clientWidth) return;
      const natural = parseFloat(getComputedStyle(text).fontSize);
      if (text.scrollWidth > text.clientWidth) text.style.fontSize = `${natural * text.clientWidth / text.scrollWidth}px`;
    };
    const resize = new ResizeObserver(fit);
    const content = new MutationObserver(fit);
    content.observe(text, { childList:true, characterData:true, subtree:true });
    resize.observe(text); mobile.addEventListener("change",fit); fit();
    return () => { content.disconnect(); resize.disconnect(); mobile.removeEventListener("change",fit); };
  }, []);
  const [tab, setTab] = useState("followup");
  const alerts = state.students.filter((student) => student.streak >= 2 && !student.followedAt);
  const overdue = state.payments.filter((payment) => !payment.paid && payment.due < DEMO_DATE);
  const drafts = state.lessons.filter((lesson) => !lesson.published);
  return <LiquidGlassScene className={s.dashboardLayout}>
      <MobileHeaderContent><div className={`${s.pageTitle} ${s.dashboardGreeting}`} data-motion-region="heading"><div><p className={s.greetingDate}>{new Date(`${DEMO_DATE}T12:00:00`).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p><h1 className={s.greetingHeading}><span ref={setGreetingText} className={s.greetingText}>{greeting}, <span className={s.greetingName}>{firstName}.</span></span>{greeting !== "Olá" && <Image className={s.greetingDayIcon} src={greeting === "Boa noite" ? "/brand/gestao/greeting-moon.png" : "/brand/gestao/greeting-sun.png"} width={96} height={96} sizes="48px" alt="" />}</h1><p>Aqui está uma visão geral do Grupo Forró do Bom.</p></div></div></MobileHeaderContent>
      <div className={s.dashboardPriorities} aria-label="Sugestões com base nas pendências">
        {alerts.length > 0 && canAccessPath(user, "/gestao/alunos") && <Link href="/gestao/alunos?filtro=acompanhar"><Icon name="users" size={17} /><span><strong>{alerts.length} {alerts.length === 1 ? "aluno precisa" : "alunos precisam"} de acompanhamento</strong><small>Duas ou mais faltas seguidas, sem contato registrado</small></span><Icon name="arrow" size={16} /></Link>}
        {overdue.length > 0 && canAccessPath(user, "/gestao/financeiro") && <Link href="/gestao/financeiro?filtro=atraso"><Icon name="wallet" size={17} /><span><strong>{overdue.length} {overdue.length === 1 ? "cobrança em atraso" : "cobranças em atraso"}</strong><small>{money(overdue.reduce((sum, payment) => sum + payment.amount, 0))} a conferir no financeiro</small></span><Icon name="arrow" size={16} /></Link>}
        {drafts.length > 0 && canAccessPath(user, "/gestao/conteudos") && <Link href={`/gestao/turmas/${drafts[0].cohortId}/aulas`}><Icon name="book" size={17} /><span><strong>{drafts.length} {drafts.length === 1 ? "aula com conteúdo em rascunho" : "aulas com conteúdo em rascunho"}</strong><small>Revise os materiais antes de publicar para a turma</small></span><Icon name="arrow" size={16} /></Link>}
        {!alerts.length && !overdue.length && !drafts.length && <span><Icon name="check" size={18} />Acompanhamentos e recebimentos em dia.</span>}
      </div>
      <OverviewMetrics />
    <div className={s.dashboardColumns}><div className={s.dashboardMain}>
      <section className={`${s.panel} ${s.todayPanel}`}><BorderBeam /><header className={s.sectionHeading}><h2><Icon name="clock" size={19} />Aulas de hoje</h2><Link href="/gestao/turmas" className={s.textLink}>Ver turmas<Icon name="arrow" size={16} /></Link></header><div className={s.todayClass}><div className={s.timeBlock}><Icon name="clock" /><strong>19h30<span>21h30</span></strong></div><div className={s.grow}><Link href="/gestao/turmas/iniciante-quinta"><h3>Iniciante · Quinta</h3><span className={s.cohortCode}>GFB-T01</span></Link><p>Tailan · {state.students.filter((student) => student.cohortIds.includes("iniciante-quinta")).length} alunos</p></div><Badge kind={state.attendanceSaved["iniciante-quinta:2026-10-22"] ? "green" : "neutral"}>{state.attendanceSaved["iniciante-quinta:2026-10-22"] ? "Chamada salva" : "Chamada pendente"}</Badge><Link className={`${s.primary} ${s.glassAttendanceAction}`} href="/gestao/turmas/iniciante-quinta/chamada"><ControlGlass gold /><span>Registrar presenças</span><Icon name="arrow" size={16} /></Link></div><div className={s.lastClass}><span className={s.smallIcon}><Icon name="book" /></span><div className={s.grow}><strong>Conteúdo da última aula</strong><p>Marcação e conexão</p></div><Link href="/gestao/turmas/iniciante-quinta/aulas" className={s.secondary}>Revisar conteúdo</Link></div></section>
      <section className={s.attention}><BorderBeam /><header className={s.sectionHeading}><h2><Icon name="flag" size={19} />Precisam da sua atenção</h2><span className={s.totalTag}>{alerts.length + overdue.length + drafts.length} pendências</span></header><div className={s.tabs} role="tablist" aria-label="Pendências">{[["followup", "Acompanhamento", alerts.length], ["finance", "Financeiro", overdue.length], ["content", "Conteúdos", drafts.length]].map(([id, title, count]) => <button role="tab" id={`tab-${id}`} aria-controls="attention-panel" aria-selected={tab === id} className={tab === id ? s.tabActive : ""} key={id} onClick={() => setTab(String(id))}>{title}<span>{count}</span></button>)}</div><div key={tab} className={s.attentionContent} id="attention-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === "followup" && (alerts.length ? <div className={s.followupList}>{alerts.map((student) => <article className={s.followupCard} key={student.id}><Link href={`/gestao/alunos/${student.id}`} className={s.personCell}><Avatar name={student.name} /><strong>{student.name}</strong></Link><div className={s.followupCohort}>{cohorts.find((cohort) => student.cohortIds.includes(cohort.id))?.name}<small>{cohorts.find((cohort) => student.cohortIds.includes(cohort.id))?.code}</small></div><Badge kind="red">{student.streak} faltas seguidas</Badge><Link href={`/gestao/alunos/${student.id}?acompanhar=1`} className={s.secondary}>Acompanhar<Icon name="arrow" size={14} /></Link></article>)}</div> : <Empty title="Acompanhamentos em dia" text="Os contatos realizados ficam registrados na ficha de cada aluno." />)}
        {tab === "finance" && <div className={s.rowList}>{overdue.map((payment) => <Link href="/gestao/financeiro?filtro=atraso" className={s.listRow} key={payment.id}><Avatar name={state.students.find((student) => student.id === payment.studentId)?.name || "Aluno"} /><div className={s.grow}><strong>{state.students.find((student) => student.id === payment.studentId)?.name}</strong><p>{payment.label}</p></div><Badge kind="red">{money(payment.amount)}</Badge><Icon name="chevron" size={16} /></Link>)}{!overdue.length && <Empty title="Nenhuma cobrança em atraso" text="Veja os próximos vencimentos na área financeira." />}</div>}
        {tab === "content" && <div className={s.rowList}>{drafts.map((lesson) => <Link href={`/gestao/turmas/${lesson.cohortId}/aulas`} className={s.listRow} key={`${lesson.cohortId}${lesson.date}`}><span className={s.smallIcon}><Icon name="video" /></span><div className={s.grow}><strong>{lesson.title}</strong><p>{cohorts.find((cohort) => cohort.id === lesson.cohortId)?.name} · {shortDate(lesson.date)}</p></div><Badge>Rascunho</Badge><Icon name="chevron" size={16} /></Link>)}{!drafts.length && <Empty title="Conteúdos em dia" text="Os materiais publicados já estão associados às suas turmas." />}</div>}
      </div></section>
      <section className={s.weekSection}><BorderBeam /><header className={s.sectionHeading}><h2><Icon name="calendar" size={19} />Semana da escola</h2><Link className={s.textLink} href="/gestao/turmas">Ver grade<Icon name="arrow" size={16} /></Link></header><div className={s.weekGrid}>{["Segunda-feira", "Quinta-feira", "Sábado"].map((day) => <div className={s.weekDay} key={day}><h3 className={day === "Quinta-feira" ? s.currentDay : ""}>{day}<span>{day === "Quinta-feira" ? "Hoje" : ""}</span></h3>{cohorts.filter((cohort) => cohort.day === day).map((cohort) => <Link href={`/gestao/turmas/${cohort.id}`} key={cohort.id}><time>{cohort.time}</time><strong>{cohort.level}<span className={s.cohortCode}>{cohort.code}</span></strong><Icon name="chevron" size={13} /></Link>)}</div>)}</div></section>
      <section className={`${s.panel} ${s.cohortHealth}`} aria-labelledby="cohort-health-title"><BorderBeam /><header className={s.sectionHeading}><div><h2 id="cohort-health-title"><Icon name="users" size={19} />Acompanhamento das turmas</h2><p>Ocupação, presença e materiais para revisar.</p></div><Link className={s.textLink} href="/gestao/turmas">Abrir turmas<Icon name="arrow" size={16} /></Link></header><div className={s.cohortHealthHead} aria-hidden="true"><span>Turma / ocupação</span><span>Presença histórica</span><span>Conteúdos</span><span /></div>{cohorts.map(cohort => {
        const students = state.students.filter(student => student.active && student.cohortIds.includes(cohort.id));
        const presence = students.length ? Math.round(students.reduce((sum, student) => sum + student.attendance, 0) / students.length) : null;
        const lessons = state.lessons.filter(lesson => lesson.cohortId === cohort.id);
        const pending = lessons.filter(lesson => !lesson.published).length;
        return <Link href={`/gestao/turmas/${cohort.id}`} key={cohort.id} className={s.cohortHealthRow}><span><strong>{cohort.name}</strong><small>{students.length} de {cohort.capacity} vagas ocupadas</small><span className={s.occupancyTrack}><i style={{ width: `${Math.min(100, students.length / cohort.capacity * 100)}%` }} /></span></span><span className={s.healthPresence}><small>Presença histórica</small><strong>{presence === null ? "Sem registros" : `${presence}%`}</strong></span><span><Badge kind={pending ? "yellow" : lessons.length ? "green" : "neutral"}>{pending ? `${pending} ${pending === 1 ? "rascunho" : "rascunhos"}` : lessons.length ? "Publicados" : "Sem registro"}</Badge></span><Icon name="chevron" size={16} /></Link>;
      })}</section>
    </div>
    <aside className={s.contextRail} aria-label="Agenda e atividade"><header className={s.sectionHeading}><h2>Agenda</h2><Icon name="calendar" size={19} /></header><Calendar /><section><BorderBeam /><header className={s.sectionHeading}><h2>Próximos marcos</h2><Link href="/gestao/eventos" aria-label="Ver todos os eventos"><Icon name="arrow" size={17} /></Link></header><div className={s.railList}>{state.events.map((event) => <Link href={`/gestao/eventos/${event.id}`} key={event.id} className={s.eventLink}><span className={s.dateTile}><strong>{event.date.slice(-2)}</strong>{shortDate(event.date).replace(/^\d+\s*(de)?\s*/, "")}</span><div><strong>{event.name}</strong><p>{event.kind === "Evento" ? "Inscrições e pagamentos" : "Critérios e alunos elegíveis"}</p></div><Icon name="chevron" size={14} /></Link>)}</div></section><section><BorderBeam /><header className={s.sectionHeading}><h2>Recebimentos</h2><Link href="/gestao/financeiro" aria-label="Ver financeiro"><Icon name="arrow" size={17} /></Link></header>{state.payments.filter((payment) => payment.paid).slice(0, 3).map((payment) => <div className={s.receipt} key={payment.id}><span className={s.statusDot} /><div className={s.grow}><strong>{payment.label === "Complemento do primeiro mês" ? "Complemento do mês" : "Pix confirmado"}</strong><p>{state.students.find((student) => student.id === payment.studentId)?.name}</p></div><strong>{money(payment.amount)}</strong></div>)}</section></aside></div>
  </LiquidGlassScene>;
}

