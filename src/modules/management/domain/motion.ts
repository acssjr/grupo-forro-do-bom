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

/** Match page travel to the management navigation order; details travel inward. */
export function mobilePageDirection(from: string, to: string): -1 | 0 | 1 {
  if (from === to) return 0;
  const order = ["inicio", "turmas", "alunos", "financeiro", "repasses", "eventos", "conteudos", "comunicados", "equipe", "configuracoes"];
  const previous = from.split("/"), next = to.split("/");
  const a = order.indexOf(previous[0]), b = order.indexOf(next[0]);
  if (a < 0 || b < 0) return 0;
  if (a !== b) return b > a ? 1 : -1;
  const oldDepth = previous.filter(Boolean).length, newDepth = next.filter(Boolean).length;
  if (oldDepth !== newDepth) return newDepth > oldDepth ? 1 : -1;
  const tabs = ["", "chamada", "aulas"];
  if (previous[1] === next[1] && tabs.includes(previous[2] ?? "") && tabs.includes(next[2] ?? "")) {
    const delta = tabs.indexOf(next[2] ?? "") - tabs.indexOf(previous[2] ?? "");
    return delta > 0 ? 1 : delta < 0 ? -1 : 0;
  }
  return 1;
}
