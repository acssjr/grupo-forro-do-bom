import { DEMO_DATE, type Payment } from "./model";

export const financeScenario = { previousReceived: 34000, previousReceivable: 31600, previousOverdue: 17000 };
export const paymentKind = (payment: Payment) => payment.eventId ? "Eventos" : payment.label.includes("Complemento") ? "Complementos" : payment.label.includes("Primeira aula") ? "Primeira aula" : "Mensalidades";
export function financeSummary(payments: Payment[], month = DEMO_DATE.slice(0, 7), date = DEMO_DATE) {
  const rows = payments.filter((payment) => payment.due.startsWith(month));
  const sum = (items: Payment[]) => items.reduce((value, payment) => value + payment.amount, 0);
  const received = sum(rows.filter((payment) => payment.paid));
  const pending = sum(rows.filter((payment) => !payment.paid));
  const overdue = sum(rows.filter((payment) => !payment.paid && payment.due < date));
  return { rows, received, pending, overdue, upcoming: pending - overdue, expected: received + pending, paidCount: rows.filter((payment) => payment.paid).length, pendingCount: rows.filter((payment) => !payment.paid).length, percent: received + pending ? Math.round(received / (received + pending) * 100) : 0 };
}

export function receiptCurve(payments: Payment[], month = DEMO_DATE.slice(0, 7), date = DEMO_DATE) {
  const end = new Date(`${month}-01T12:00:00`); end.setMonth(end.getMonth() + 1, 0);
  return Array.from({ length: end.getDate() }, (_, index) => {
    const day = index + 1;
    const iso = `${month}-${String(day).padStart(2, "0")}`;
    const received = payments.filter((payment) => payment.paid && payment.due.startsWith(month) && (payment.paidAt?.slice(0, 10) || payment.due) <= iso).reduce((sum, payment) => sum + payment.amount, 0);
    const billed = payments.filter((payment) => payment.due.startsWith(month) && payment.due <= iso).reduce((sum, payment) => sum + payment.amount, 0);
    return { day, received: iso <= date ? received : null, billed };
  });
}
