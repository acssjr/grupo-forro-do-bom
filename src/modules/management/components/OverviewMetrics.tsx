"use client";

import Link from "next/link";
import { cohorts } from "@/modules/management/domain/demo";
import { DEMO_DATE, money } from "@/modules/management/domain/model";
import { metricTrend, overviewScenario } from "@/modules/management/domain/overview-scenario";
import { useManagement } from "./ManagementProvider";
import { Icon } from "./Icon";
import { BorderBeam } from "./BorderBeam";
import s from "./Management.module.css";

function TrendMark({ direction }: { direction: string }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={direction === "up" ? "m3 17 6-6 4 4 8-10m-7 0h7v7" : direction === "down" ? "m3 7 6 6 4-4 8 10m-7 0h7v-7" : "M3 12h18m-5-5 5 5-5 5"} /></svg>;
}

export function OverviewMetrics() {
  const { state } = useManagement();
  const attendanceValues = Object.entries(state.attendance).filter(([key]) => key.slice(-10).startsWith(DEMO_DATE.slice(0, 7))).flatMap(([, values]) => Object.values(values));
  const attendance = attendanceValues.length ? Math.round(attendanceValues.filter((value) => value === "present").length / attendanceValues.length * 100) : 0;
  const active = overviewScenario.active + state.students.filter((student) => student.active).length - overviewScenario.baseStudentRecords;
  const receivable = state.payments.filter((payment) => !payment.paid && payment.due.startsWith(DEMO_DATE.slice(0, 7))).reduce((sum, payment) => sum + payment.amount, 0);
  const metrics = [
    { label: "Alunos ativos", value: String(active), current: active, previous: overviewScenario.previousActive, href: "/gestao/alunos", size: s.metricFeatured, downIsGood: false, rate: false, detail: `${Math.abs(active - overviewScenario.previousActive)} alunos ${active >= overviewScenario.previousActive ? "a mais" : "a menos"} no mês` },
    { label: "Turmas em movimento", value: String(cohorts.length), current: cohorts.length, previous: overviewScenario.previousCohorts, href: "/gestao/turmas", size: s.metricCohorts, downIsGood: false, rate: false, detail: "Uma nova turma" },
    { label: "Presença nas aulas", value: `${attendance}%`, current: attendance, previous: overviewScenario.previousAttendance, href: "/gestao/turmas/iniciante-quinta/chamada", size: s.metricAttendance, downIsGood: false, rate: true, detail: attendance >= overviewScenario.previousAttendance ? "Mais presença nas aulas" : "Atenção às ausências" },
    { label: "A receber neste mês", value: money(receivable), current: receivable, previous: overviewScenario.previousReceivable, href: "/gestao/financeiro", size: s.metricFinance, downIsGood: true, rate: false, detail: receivable <= overviewScenario.previousReceivable ? "Menos valores pendentes" : "Mais valores pendentes" },
  ];
  return <section className={s.overviewMetrics} aria-label="Indicadores de outubro e comparação com setembro">{metrics.map((metric) => {
    const trend = metricTrend(metric.current, metric.previous, metric.rate);
    const favorable = metric.downIsGood ? trend.delta <= 0 : trend.delta >= 0;
    const tone = !favorable ? s.metricDecline : metric.downIsGood ? s.metricRecovery : metric.label === "Alunos ativos" ? s.metricGrowth : s.metricExpansion;
    return <Link key={metric.label} href={metric.href} className={`${s.metricCard} ${metric.size} ${tone}`}><BorderBeam /><header><span>{metric.label}</span><span className={s.metricArrow}><Icon name="arrow" size={18} /></span></header><strong className={s.metricValue}>{metric.value}</strong><footer><span className={s.metricTrend}><TrendMark direction={trend.direction} /><strong>{trend.label}</strong><span>vs. setembro</span></span><span className={s.metricContext}>{metric.detail}</span></footer></Link>;
  })}</section>;
}
