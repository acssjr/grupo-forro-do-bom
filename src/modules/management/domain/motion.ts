/** Longer trips need more time, while nearby destinations stay responsive. */
export function navigationDuration(distance: number) {
  return Math.min(.5, .28 + Math.sqrt(Math.max(0, distance) / 54) * .055);
}

/** A real shared anchor can move; unrelated surfaces never fly across the workspace. */
export function contentOffset(distance: number) { return Math.max(-32, Math.min(32, distance)); }

export const NOTCH_OVERLAP = 8;

export function greetingAt(date: Date) {
  const hour = Number(new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Bahia", hour: "numeric", hourCycle: "h23" }).format(date));
  return hour >= 6 && hour < 12 ? "Bom dia" : hour >= 12 && hour < 18 ? "Boa tarde" : "Boa noite";
}
