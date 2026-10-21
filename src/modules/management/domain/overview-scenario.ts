// Presentation scenario requested by the user; no student records or accounting
// history are created. Replace these baselines with backend snapshots later.
export const overviewScenario = {
  active: 82, previousActive: 74, baseStudentRecords: 12,
  previousCohorts: 4, previousAttendance: 82, previousReceivable: 31600,
};

export function metricTrend(current: number, previous: number, percentagePoints = false) {
  const delta = current - previous;
  const direction = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  const value = percentagePoints ? Math.abs(delta) : previous ? Math.abs(delta / previous * 100) : Math.abs(delta);
  const unit = percentagePoints ? " p.p." : previous ? "%" : "";
  return { direction, delta, label: `${delta > 0 ? "+" : delta < 0 ? "−" : ""}${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(value)}${unit}` };
}
