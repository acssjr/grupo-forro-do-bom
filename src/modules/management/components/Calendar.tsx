"use client";

import Link from "next/link";
import { useState } from "react";
import { schoolHolidays, holidaysInMonth } from "@/modules/management/domain/holidays";
import { cohorts } from "@/modules/management/domain/demo";
import { DEMO_DATE, shortDate } from "@/modules/management/domain/model";
import { useManagement } from "./ManagementProvider";
import { Icon } from "./Icon";
import { GlassPeriodSwitcher } from "./GlassPeriodSwitcher";
import { BorderBeam } from "./BorderBeam";
import s from "./Management.module.css";

const toISO = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export function Calendar() {
  const [cursor, setCursor] = useState(DEMO_DATE.slice(0, 7));
  const [selected, setSelected] = useState(DEMO_DATE);
  const [period, setPeriod] = useState("today");
  const { state } = useManagement();
  const [year, monthNumber] = cursor.split("-").map(Number);
  const month = monthNumber - 1;
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const count = Math.ceil((firstDay + days) / 7) * 7;
  const weekday = (new Date(`${selected}T12:00:00`).getDay() + 6) % 7;
  const start = new Date(`${selected}T12:00:00`); start.setDate(start.getDate() - weekday);
  const end = new Date(start); end.setDate(end.getDate() + 6);
  const weekStart = toISO(start); const weekEnd = toISO(end);
  const selectedEvents = state.events.filter((event) => period === "today" ? event.date === selected : event.date >= weekStart && event.date <= weekEnd);
  const selectedWeekday = new Date(`${selected}T12:00:00`).getDay();
  const selectedClasses = cohorts.filter((cohort) => period !== "today" || (cohort.shortDay === "SEG" ? 1 : cohort.shortDay === "QUI" ? 4 : 6) === selectedWeekday);
  const monthHolidays = holidaysInMonth(cursor);
  const selectedHolidays = schoolHolidays.filter(h => period === "today" ? h.date === selected : h.date >= weekStart && h.date <= weekEnd);
  const changeMonth = (delta: number) => { const date = new Date(year, month + delta, 1, 12); const day = Math.min(Number(selected.slice(-2)), new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()); date.setDate(day); const iso = toISO(date); setCursor(iso.slice(0, 7)); setSelected(iso); setPeriod("today"); };
  const choosePeriod = (value: string) => { const date = new Date(`${DEMO_DATE}T12:00:00`); if (value === "next") date.setDate(date.getDate() + 7); const next = toISO(date); setSelected(next); setCursor(next.slice(0, 7)); setPeriod(value); };
  return <section className={s.calendar} aria-label="Calendário da escola"><BorderBeam />
    <header className={s.calendarHeading}><div className={s.calendarMonthTitle}><span>Agenda da escola</span><h3>{new Date(year, month, 1).toLocaleDateString("pt-BR", { month: "long" })}<small>{year}</small></h3></div><div><button className={s.iconButton} aria-label="Mês anterior" onClick={() => changeMonth(-1)}><Icon name="back" size={17} /></button><button className={s.iconButton} aria-label="Próximo mês" onClick={() => changeMonth(1)}><Icon name="arrow" size={17} /></button></div></header>
    <GlassPeriodSwitcher value={period} onChange={choosePeriod} />
    <div className={s.calendarGrid} key={cursor}>{["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day) => <span className={s.weekday} key={day}>{day}</span>)}{Array.from({ length: count }, (_, i) => { const date = new Date(year, month, i - firstDay + 1, 12); const iso = toISO(date); const hasEvent = state.events.some((event) => event.date === iso); const holiday = schoolHolidays.find(h=>h.date===iso); const range = period !== "today" && iso >= weekStart && iso <= weekEnd; return <button key={iso} onClick={() => { setSelected(iso); setPeriod("today"); if (date.getMonth() !== month) setCursor(iso.slice(0, 7)); }} aria-label={`${date.getDate()} de ${date.toLocaleDateString("pt-BR", { month: "long" })} de ${date.getFullYear()}${hasEvent ? ", evento agendado" : ""}${holiday ? `, ${holiday.optional ? "ponto facultativo" : "feriado"}: ${holiday.name}` : ""}`} aria-pressed={iso === selected} className={`${iso === selected ? s.calendarSelected : ""} ${iso === DEMO_DATE ? s.calendarToday : ""} ${hasEvent ? s.calendarEvent : ""} ${holiday ? holiday.optional ? s.calendarOptional : s.calendarHoliday : ""} ${date.getMonth() !== month ? s.calendarOutside : ""} ${range ? s.calendarRange : ""}`}>{date.getDate()}</button>; })}</div>
    <div className={s.calendarLegend}><span><i />Evento ou exame</span><span><i />Hoje</span><span className={s.holidayLegend}><i />Feriado</span></div><div className={s.monthOccasions}>{monthHolidays.map(h=><button key={h.date} onClick={()=>{setSelected(h.date);setPeriod("today");}}><time>{h.date.slice(-2)}</time><span><strong>{h.name}</strong><small>{h.optional ? "Ponto facultativo" : `Feriado · ${h.scope}`}</small></span></button>)}</div>
    <div className={s.calendarAgenda}><header><strong>{period === "today" ? `${shortDate(selected)} · sua agenda` : "Agenda da semana"}</strong><span>{selectedEvents.length + selectedClasses.length} {selectedEvents.length + selectedClasses.length === 1 ? "compromisso" : "compromissos"}</span></header>{selectedHolidays.map(h=><div className={s.holidayNotice} key={h.date}><Icon name="flag" size={17} /><div><strong>{h.name}</strong><p>{h.optional ? "Ponto facultativo do serviço público; confirme a programação da escola." : "Feriado. Confirme com a equipe se haverá aula."}</p></div></div>)}{selectedEvents.map((event) => <Link key={event.id} href={`/gestao/eventos/${event.id}`}><span className={s.agendaDot} /><div><strong>{event.name}</strong><small>{shortDate(event.date)} · {event.time}</small></div><Icon name="chevron" size={15} /></Link>)}{selectedClasses.map((cohort) => <Link key={cohort.id} href={`/gestao/turmas/${cohort.id}`}><span className={s.agendaDot} /><div><strong>{cohort.name}</strong><small>{cohort.code}</small><small>{period !== "today" ? `${cohort.shortDay} · ` : ""}{cohort.time}</small></div><Icon name="chevron" size={15} /></Link>)}{!selectedEvents.length && !selectedClasses.length && <p>Sem compromissos neste dia.</p>}</div>
  </section>;
}
