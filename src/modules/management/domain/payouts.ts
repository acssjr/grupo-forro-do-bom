export type PayoutRule = { teacherId: string; mode: "fixed" | "per-cohort"; amount: number; cohortIds: string[]; enabled: boolean; version: number; updatedAt: string };
export type Payout = { id: string; teacherId: string; teacherName: string; period: string; description: string; amount: number; status: "pending" | "paid" | "cancelled"; calculation: string; cohortIds: string[]; createdAt: string; createdBy: string; paidAt?: string; paidBy?: string; paymentDate?: string; method?: string; reference?: string; cancelledAt?: string; cancelledBy?: string; reason?: string };
export type PayoutEvent = { id: string; payoutId: string; action: string; actorId: string; at: string; detail: string };
export type PayoutTeacher = { id: string; name: string; active: boolean; cohortIds: string[] };
export type PayoutData = { rules: PayoutRule[]; payouts: Payout[]; teachers: PayoutTeacher[]; events: PayoutEvent[] };
export function validPeriod(value: unknown): value is string { return typeof value === "string" && /^(20\d{2})-(0[1-9]|1[0-2])$/.test(value); }
export function validAmount(value: unknown): value is number { return typeof value === "number" && Number.isSafeInteger(value) && value > 0 && value <= 99_999_999; }
export function parseReais(value: string): number | null {
  const text = value.trim();
  if (!/^\d{1,6}([,.]\d{1,2})?$/.test(text)) return null;
  const [whole, decimal = ""] = text.replace(",", ".").split(".");
  const amount = Number(whole) * 100 + Number(decimal.padEnd(2,"0"));
  return validAmount(amount) ? amount : null;
}
export function payoutCalculation(rule: PayoutRule, teacher: PayoutTeacher) {
  const cohortIds = rule.mode === "per-cohort" ? [...new Set(rule.cohortIds)].filter(id => teacher.cohortIds.includes(id)).sort() : [];
  const amount = rule.mode === "fixed" ? rule.amount : rule.amount * cohortIds.length;
  return { cohortIds, amount, valid: rule.enabled && teacher.active && validAmount(amount) && (rule.mode === "fixed" || cohortIds.length === rule.cohortIds.length) };
}
export function payoutQuote(rule: PayoutRule, teacher: PayoutTeacher) {
  const result = payoutCalculation(rule, teacher);
  return JSON.stringify([rule.teacherId,rule.version,rule.mode,rule.amount,result.cohortIds,result.amount,teacher.name,teacher.active,result.valid]);
}
export function currentPayoutPeriod() {
  const parts = new Intl.DateTimeFormat("en-CA", {timeZone:"America/Bahia",year:"numeric",month:"2-digit"}).formatToParts(new Date());
  return `${parts.find(p=>p.type==="year")!.value}-${parts.find(p=>p.type==="month")!.value}`;
}
export const payoutStatus = {pending:"A repassar",paid:"Repassado",cancelled:"Cancelado"};
