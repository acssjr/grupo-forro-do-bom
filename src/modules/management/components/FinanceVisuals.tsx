"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DEMO_DATE, money, type Payment } from "@/modules/management/domain/model";
import { financeScenario, financeSummary, paymentKind, receiptCurve } from "@/modules/management/domain/finance";
import { metricTrend } from "@/modules/management/domain/overview-scenario";
import { BorderBeam } from "./BorderBeam";
import s from "./Management.module.css";

export function FinanceMetrics({ payments }: { payments: Payment[] }) {
  const summary = financeSummary(payments);
  const metrics = [
    { title: "Recebido no mês", amount: summary.received, previous: financeScenario.previousReceived, note: `${summary.paidCount} cobranças confirmadas`, className: s.financeReceived },
    { title: "Ainda a receber", amount: summary.pending, previous: financeScenario.previousReceivable, note: `${summary.pendingCount} cobranças em aberto`, className: s.financePending },
    { title: "Em atraso", amount: summary.overdue, previous: financeScenario.previousOverdue, note: "Parte do valor a receber", className: s.financeOverdue },
  ];
  return <section className={s.financeMetrics} aria-label="Resumo financeiro de outubro">{metrics.map((metric) => <article className={`${s.financeMetric} ${metric.className}`} key={metric.title}><BorderBeam /><span>{metric.title}</span><strong>{money(metric.amount)}</strong><div><b>{metricTrend(metric.amount, metric.previous).label}</b><span>vs. setembro</span></div><small>{metric.note}</small></article>)}</section>;
}

export function ReceiptChart({ payments }: { payments: Payment[] }) {
  const [mode, setMode] = useState("received");
  const [selectedDay, setSelectedDay] = useState(Number(DEMO_DATE.slice(-2)));
  const id = useId().replaceAll(":", "");
  const plotRef = useRef<HTMLDivElement>(null);
  const [plotWidth, setPlotWidth] = useState(700);
  useEffect(() => { const element = plotRef.current; if (!element) return; const observer = new ResizeObserver(([entry]) => setPlotWidth(entry.contentRect.width)); observer.observe(element); return () => observer.disconnect(); }, [mode]);
  const labelStyle = { fontSize: Math.max(14, 14 * 700 / Math.max(plotWidth, 250)) };
  const curve = receiptCurve(payments);
  const summary = financeSummary(payments);
  const max = Math.max(summary.expected, financeScenario.previousReceived, 10000);
  const chartMax = Math.ceil(max / 20000) * 20000;
  const currentDay = Number(DEMO_DATE.slice(-2));
  const x = (day: number) => 80 + (day - 1) / 30 * 592;
  const y = (value: number) => 208 - value / chartMax * 174;
  const values = mode === "received" ? curve.filter((point) => point.received !== null).map((point) => ({ day: point.day, value: point.received! })) : curve.map((point) => ({ day: point.day, value: point.billed }));
  const line = values.map((point, index) => `${index ? "L" : "M"}${x(point.day)},${y(point.value)}`).join(" ");
  const area = `${line} L${x(values.at(-1)?.day || 1)},208 L80,208 Z`;
  const previous = curve.filter((point) => point.day <= currentDay).map((point, index) => `${index ? "L" : "M"}${x(point.day)},${y(Math.round(financeScenario.previousReceived * point.day / currentDay))}`).join(" ");
  const point = curve.find((item) => item.day === selectedDay)!;
  const changed = values.filter((point, index) => index === 0 || point.value !== values[index - 1].value || index === values.length - 1);
  return <section className={s.financeChart} aria-label="Evolução dos recebíveis"><BorderBeam />
    <header className={s.sectionHeading}><div><h2>O mês em movimento</h2><p>Outubro de 2026 · valores acumulados</p></div><div className={s.chartTabs} aria-label="Visualização financeira">{[["received", "Recebido"], ["billed", "Cobrado"]].map(([key, label]) => <button key={key} aria-pressed={mode === key} onClick={() => setMode(key)}>{label}</button>)}</div></header>
    <div className={s.chartHeadline}><strong>{money(mode === "received" ? summary.received : summary.expected)}</strong><span>{mode === "received" ? `${metricTrend(summary.received, financeScenario.previousReceived).label} em relação a setembro` : "Total de cobranças com vencimento neste mês"}</span></div>
    <div key={mode} className={`${s.receiptPlot} ${s.chartTransition}`} ref={plotRef}><svg viewBox="0 0 700 248" role="img" aria-label={`${mode === "received" ? "Recebimentos" : "Cobranças"} acumulados em outubro`}><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#3695d4" stopOpacity=".24" /><stop offset="1" stopColor="#3695d4" stopOpacity=".01" /></linearGradient></defs>{[0, 1, 2, 3, 4].map((index) => <g key={index}><line x1="80" x2="672" y1={y(chartMax * index / 4)} y2={y(chartMax * index / 4)} stroke="#e4e8ee" strokeDasharray="3 5" /><text style={labelStyle} x="65" y={y(chartMax * index / 4) + 4} textAnchor="end">{Math.round(chartMax / 100 * index / 4)}</text></g>)}<path d={area} fill={`url(#${id})`} />{mode === "received" && <path d={previous} fill="none" stroke="#9ca8b5" strokeDasharray="5 5" strokeWidth="1.5" />}<path d={line} fill="none" stroke="#267cad" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />{changed.map((item) => <circle key={item.day} cx={x(item.day)} cy={y(item.value)} r={selectedDay === item.day ? 5 : 3.5} fill="#267cad" stroke="#fff" strokeWidth="2" tabIndex={0} role="button" aria-label={`${item.day} de outubro: ${money(item.value)}`} onFocus={() => setSelectedDay(item.day)} onMouseEnter={() => setSelectedDay(item.day)} onClick={() => setSelectedDay(item.day)} />)}{(plotWidth < 420 ? [1, 15, 31] : [1, 8, 15, 22, 31]).map((day) => <text style={labelStyle} key={day} x={x(day)} y="237" textAnchor="middle">{String(day).padStart(2, "0")} out.</text>)}</svg></div>
    <div className={s.chartLegend}><span><i />{mode === "received" ? "Recebido em outubro" : "Cobranças de outubro"}</span>{mode === "received" && <span><i />Setembro, até o dia 22</span>}</div><div className={s.chartReadout} aria-live="polite">{selectedDay} de outubro <strong>{money(mode === "received" ? point.received ?? 0 : point.billed)}</strong></div>
  </section>;
}

export function ReceivableMix({ payments }: { payments: Payment[] }) {
  const summary = financeSummary(payments);
  const segments = [{ label: "Recebido", value: summary.received, color: "#27805a" }, { label: "A vencer", value: summary.upcoming, color: "#c09a24" }, { label: "Em atraso", value: summary.overdue, color: "#b75c51" }];
  let offset = 0;
  return <section className={s.financeMix}><BorderBeam /><h2>Como está o mês</h2><div className={s.collectionRing}><svg viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="65" fill="none" stroke="#edf0f2" strokeWidth="12" />{segments.map((segment) => { const share = summary.expected ? segment.value / summary.expected * 100 : 0; const start = offset; offset += share; return <circle key={segment.label} cx="80" cy="80" r="65" pathLength="100" fill="none" stroke={segment.color} strokeWidth="12" strokeDasharray={`${share} ${100 - share}`} strokeDashoffset={-start} transform="rotate(-90 80 80)" />; })}</svg><div><strong>{summary.percent}%</strong><span>recebido</span></div></div><ul className={s.collectionLegend}>{segments.map((segment) => <li key={segment.label}><i style={{ background: segment.color }} /><span>{segment.label}</span><strong>{money(segment.value)}</strong></li>)}</ul><p className={s.collectionTotal}>Total cobrado <strong>{money(summary.expected)}</strong></p></section>;
}

export function RevenueSources({ payments }: { payments: Payment[] }) {
  const rows = financeSummary(payments).rows;
  const total = rows.reduce((sum, payment) => sum + payment.amount, 0);
  return <section className={s.revenueSources}><BorderBeam /><header className={s.sectionHeading}><div><h2>De onde vêm os recebíveis</h2><p>Cobranças do mês por origem</p></div></header><div className={s.sourceRows}>{["Mensalidades", "Primeira aula", "Complementos", "Eventos"].map((kind, index) => { const items = rows.filter((payment) => paymentKind(payment) === kind); const value = items.reduce((sum, payment) => sum + payment.amount, 0); const paid = items.filter((payment) => payment.paid).reduce((sum, payment) => sum + payment.amount, 0); return <div className={s.sourceRow} key={kind}><div><span><i className={s[`sourceColor${index}`]} />{kind}</span><strong>{money(value)}</strong></div><span className={s.sourceTrack}><i className={s[`sourceColor${index}`]} style={{ width: `${total ? value / total * 100 : 0}%` }} /></span><small>{items.length} {items.length === 1 ? "cobrança" : "cobranças"} · {money(paid)} recebido</small></div>; })}</div></section>;
}
