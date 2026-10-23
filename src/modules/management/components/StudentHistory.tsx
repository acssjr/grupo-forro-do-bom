"use client";
import { AnimatedDisclosure } from "@/shared/ui/AnimatedDisclosure";
import { useManagement } from "./ManagementProvider";
import type { Student } from "@/modules/management/domain/model";
import { money } from "@/modules/management/domain/model";
import { Icon } from "./Icon";
import s from "./Management.module.css";
const dateLabel = (date?: string) => date ? new Date(date).toLocaleDateString("pt-BR", { day:"2-digit", month:"short", year:"numeric", timeZone:"America/Bahia" }) : "Data não registrada";
export function StudentHistory({ student }: { student: Student }) {
  const { state } = useManagement();
  const paid = state.payments.filter(p => p.studentId === student.id && p.paid);
  const undated = paid.some(p => !p.paidAt);
  const first = paid.filter(p => p.paidAt).sort((a,b) => a.paidAt!.localeCompare(b.paidAt!))[0];
  const events = [
    ...(state.studentEvents ?? []).filter(e => e.studentId === student.id && e.kind !== "payment"),
    ...paid.map(p => ({ id:`payment-${p.id}`, title:"Recebimento confirmado", detail:`${p.label} · ${money(p.amount)}`, at:p.paidAt })),
  ].sort((a,b)=>(b.at ?? "").localeCompare(a.at ?? ""));
  return <section className={s.studentHistory}><div className={s.studentMilestones}><div><Icon name="calendar" size={19} /><span>Data de cadastro<strong>{dateLabel(student.createdAt)}</strong></span></div><div><Icon name="wallet" size={19} /><span>Primeiro pagamento<strong>{undated ? "Data não registrada" : first ? dateLabel(first.paidAt) : "Ainda sem pagamento"}</strong></span></div><div><Icon name="check" size={19} /><span>Total recebido<strong>{money(paid.reduce((sum,p)=>sum+p.amount,0))}</strong></span></div></div><AnimatedDisclosure className={s.studentTimeline} summary={<><span><Icon name="clock" size={18} />Histórico do aluno</span><span>{events.length} registros<Icon name="down" size={16} /></span></>}> <div>{events.length ? events.map(e => <article key={e.id}><span className={s.historyDot} /><div><strong>{e.title}</strong><p>{e.detail}</p></div><time dateTime={e.at}>{dateLabel(e.at)}</time></article>) : <p className={s.muted}>As próximas alterações de cadastro, acesso, contatos e pagamentos aparecerão aqui.</p>}{undated && <p className={s.fieldHelp}>Há recebimentos anteriores sem data de confirmação. O vencimento da cobrança é preservado no financeiro.</p>}</div></AnimatedDisclosure></section>;
}
