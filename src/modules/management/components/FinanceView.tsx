"use client";

import { useState } from "react";
import { DEMO_DATE, money, normalize, paymentStatus, shortDate } from "@/modules/management/domain/model";
import { financeSummary, paymentKind } from "@/modules/management/domain/finance";
import { useManagement } from "./ManagementProvider";
import { Icon } from "./Icon";
import { Avatar, Badge, Empty, Modal, PageTitle } from "./ui";
import { SchoolSelect } from "./SchoolSelect";
import { BorderBeam } from "./BorderBeam";
import { FinanceMetrics, ReceiptChart, ReceivableMix, RevenueSources } from "./FinanceVisuals";
import s from "./Management.module.css";

export function FinanceView({ initialFilter = "" }: { initialFilter?: string }) {
  const { state, dispatch, notify } = useManagement();
  const [filter, setFilter] = useState(initialFilter);
  const [kind, setKind] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const selected = state.payments.find((payment) => payment.id === selectedId);
  const summary = financeSummary(state.payments);
  const rows = summary.rows.filter((payment) => normalize(`${state.students.find((student) => student.id === payment.studentId)?.name} ${payment.label}`).includes(normalize(query)) && (!kind || paymentKind(payment) === kind) && (filter === "atraso" ? !payment.paid && payment.due < DEMO_DATE : filter === "pago" ? payment.paid : filter === "pendente" ? !payment.paid : true));
  const upcoming = summary.rows.filter((payment) => !payment.paid).sort((a, b) => a.due.localeCompare(b.due));
  const download = () => { const csv = ["Aluno;Descrição;Valor;Situação;Vencimento", ...rows.map((payment) => [state.students.find((student) => student.id === payment.studentId)?.name, payment.label, money(payment.amount), paymentStatus(payment), payment.due].map((value) => `"${String(value || "").replaceAll('"', '""')}"`).join(";"))].join("\r\n"); const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" })); const link = document.createElement("a"); link.href = url; link.download = "gfb-financeiro.csv"; link.click(); URL.revokeObjectURL(url); notify("Relatório exportado."); };
  return <div className={`${s.contentPage} ${s.financePage}`}>
    <PageTitle title="Financeiro" description="Outubro de 2026 · entradas, vencimentos e continuidade."><button className={s.secondary} onClick={download}><Icon name="download" size={17} />Exportar relatório</button></PageTitle>
    <FinanceMetrics payments={state.payments} />
    <div className={s.financeColumns}><div className={s.financeMain}><ReceiptChart payments={state.payments} /><RevenueSources payments={state.payments} /></div><aside className={s.financeAside}><ReceivableMix payments={state.payments} /><section className={s.upcomingPayments}><BorderBeam /><header className={s.sectionHeading}><h2>Próximas ações</h2><span>{upcoming.length}</span></header>{upcoming.slice(0, 4).map((payment) => <button key={payment.id} onClick={() => setSelectedId(payment.id)} className={s.upcomingPayment}><span className={`${s.paymentDate} ${payment.due < DEMO_DATE ? s.paymentDateLate : ""}`}>{payment.due.slice(-2)}<small>OUT.</small></span><span><strong>{state.students.find((student) => student.id === payment.studentId)?.name}</strong><small>{payment.due < DEMO_DATE ? "Pagamento em atraso" : "Próximo vencimento"}</small></span><strong>{money(payment.amount)}</strong></button>)}{!upcoming.length && <p className={s.muted}>Todos os recebimentos do mês estão confirmados.</p>}<button className={s.textLink} onClick={() => { setFilter("atraso"); document.getElementById("finance-ledger")?.scrollIntoView({ block: "start", behavior: "auto" }); }}>Revisar atrasos<Icon name="arrow" size={16} /></button></section></aside></div>
    <section className={s.financeLedger} id="finance-ledger"><header className={s.sectionHeading}><div><h2>Cobranças e recebimentos</h2><p>Cada pagamento no histórico do aluno.</p></div><span className={s.totalTag}>{rows.length} cobranças</span></header><div className={s.toolbar}><label className={s.searchField}><Icon name="search" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar aluno ou cobrança…" aria-label="Buscar cobrança" /></label><SchoolSelect label="Situação das cobranças" value={filter} onChange={setFilter} options={[{ value: "", label: "Todas as cobranças" }, { value: "atraso", label: "Em atraso" }, { value: "pendente", label: "Pendentes" }, { value: "pago", label: "Pagas" }]} /><SchoolSelect label="Origem das cobranças" value={kind} onChange={setKind} options={[{ value: "", label: "Todas as origens" }, ...["Mensalidades", "Primeira aula", "Complementos", "Eventos"].map((label) => ({ value: label, label }))]} /></div>
    <div className={s.responsiveTable}><table><thead><tr><th>Aluno</th><th>Cobrança</th><th>Vencimento</th><th>Valor</th><th>Situação</th><th><span className={s.srOnly}>Abrir</span></th></tr></thead><tbody>{rows.map((payment) => <tr key={payment.id}><td><span className={s.personCell}><Avatar name={state.students.find((student) => student.id === payment.studentId)?.name || "Aluno"} /><strong>{state.students.find((student) => student.id === payment.studentId)?.name}</strong></span></td><td>{payment.label}<small>{payment.cycle}</small></td><td>{shortDate(payment.due)}</td><td><strong>{money(payment.amount)}</strong></td><td><Badge kind={payment.paid ? "green" : payment.due < DEMO_DATE ? "red" : "neutral"}>{paymentStatus(payment)}</Badge></td><td><button className={s.secondary} onClick={() => setSelectedId(payment.id)}>Ver cobrança</button></td></tr>)}</tbody></table></div>{!rows.length && <Empty title="Nenhuma cobrança encontrada" text="Ajuste os filtros ou busque outro aluno." />}</section>
    <div className={s.infoGrid}><section className={s.noteBox}><Icon name="info" /><div><strong>Primeiro mês: R$39 + R$40 = R$79</strong><p>O valor da primeira aula faz parte do mês. A continuidade é decidida pelo aluno; não há cobrança automática do complemento.</p></div></section></div>
    {selected && <Modal title="Detalhes da cobrança" onClose={() => setSelectedId("")}><Badge kind={selected.paid ? "green" : "yellow"}>{paymentStatus(selected)}</Badge><h3 className={s.spacedHeading}>{state.students.find((student) => student.id === selected.studentId)?.name}</h3><p>{selected.label}</p><p className={s.paymentAmount}>{money(selected.amount)}</p><dl className={s.definitionList}><div><dt>Vencimento</dt><dd>{shortDate(selected.due)}</dd></div><div><dt>Período</dt><dd>{selected.cycle}</dd></div></dl>{!selected.paid && <button className={s.primary} onClick={() => { dispatch({ type: "payment", id: selected.id }); notify("Recebimento registrado."); }}>Confirmar recebimento</button>}</Modal>}
  </div>;
}
