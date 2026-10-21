import { money } from "./model";

export function monthComparison(current: number, previous: number | null, unit: "count" | "rate" | "money" = "count") {
  if (previous === null) return "Sem histórico de setembro";
  const delta = current - previous;
  if (delta === 0) return "Sem alteração vs. setembro";
  const sign = delta > 0 ? "+" : "−";
  const value = unit === "rate" ? `${Math.abs(delta)} p.p.` : unit === "money" ? money(Math.abs(delta)) : String(Math.abs(delta));
  return `${sign}${value} vs. setembro`;
}
