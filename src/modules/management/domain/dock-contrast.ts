export type GlassColor = readonly [number, number, number, number];
export const DOCK_TINT: GlassColor = [18, 18, 22, .16];
export const DARK_INK: GlassColor = [24, 27, 24, 1];
export const LIGHT_INK: GlassColor = [255, 255, 255, 1];

export function cssColors(value: string): GlassColor[] {
  return (value.match(/rgba?\([^)]+\)/g) ?? []).map(color => {
    const values = color.match(/[\d.]+/g)!.map(Number);
    return [values[0], values[1], values[2], values[3] ?? 1] as const;
  });
}
export function composite(front: GlassColor, back: GlassColor): GlassColor {
  const alpha = front[3] + back[3] * (1 - front[3]);
  return [0, 1, 2].map(index => alpha ? (front[index] * front[3] + back[index] * back[3] * (1 - front[3])) / alpha : 0)
    .concat(alpha) as unknown as GlassColor;
}
export function luminance(color: GlassColor) {
  return color.slice(0, 3).reduce((sum, value, index) => {
    const channel = value / 255;
    return sum + (channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4) * [.2126, .7152, .0722][index];
  }, 0);
}
export function contrast(a: GlassColor, b: GlassColor) {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}
export function extremes(colors: GlassColor[]): GlassColor[] {
  const sorted = [...colors].sort((a, b) => luminance(a) - luminance(b));
  return sorted.length > 1 ? [sorted[0], sorted[sorted.length - 1]] : sorted;
}
/** Minimize the backing veil while keeping every sampled background above 5:1. */
export function dockContrast(backgrounds: GlassColor[], selected = false, previous?: string) {
  const samples = backgrounds.map(color => selected ? composite([255,255,255,.18], composite(DOCK_TINT, color)) : composite(DOCK_TINT, color));
  const candidates = [DARK_INK, LIGHT_INK].map(ink => {
    const dark = ink === DARK_INK;
    const backing = dark ? LIGHT_INK : DARK_INK;
    let alpha = 0;
    let minimum = 0;
    for (let step = 0; step <= 40; step++) {
      alpha = step / 50;
      minimum = Math.min(...samples.map(color => contrast(ink, composite([backing[0],backing[1],backing[2],alpha], color))));
      if (minimum >= 5) break;
    }
    const name = dark ? "dark" : "light";
    return { name, ink: dark ? "#181b18" : "#ffffff", veil: `rgba(${backing.slice(0,3).join(",")},${alpha})`, minimum, alpha,
      cost: alpha + (previous && previous !== name ? .06 : 0) };
  });
  return candidates.sort((a, b) => a.cost - b.cost)[0];
}
