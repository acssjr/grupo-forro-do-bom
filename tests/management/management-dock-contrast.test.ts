import { describe, expect, it } from "vitest";
import { composite, contrast, cssColors, DARK_INK, LIGHT_INK, DOCK_TINT, dockContrast, type GlassColor } from "@/modules/management/domain/dock-contrast";

const white: GlassColor = [255,255,255,1];
const black: GlassColor = [0,0,0,1];
const palette: GlassColor[] = [white,black,[32,103,73,1],[218,172,35,1],[230,177,166,1],[26,86,82,1],[125,125,125,1]];
function renderedMinimum(colors: GlassColor[], selected: boolean) {
  const result = dockContrast(colors,selected);
  const ink = result.name === "dark" ? DARK_INK : LIGHT_INK;
  const veil = cssColors(result.veil)[0];
  const ratios = colors.map(color => {
    let material = composite(DOCK_TINT,color);
    if(selected) material = composite([255,255,255,.18],material);
    return contrast(ink,composite(veil,material));
  });
  return { result, minimum: Math.min(...ratios) };
}
describe("dock readability",()=>{
  it("keeps 5:1 for every pair of the actual dashboard surfaces, including mixed boundaries",()=>{
    for(const a of palette) for(const b of palette) for(const selected of [false,true]) {
      expect(renderedMinimum([a,b],selected).minimum).toBeGreaterThanOrEqual(5);
    }
  });
  it("covers the full neutral brightness range, not one light/dark threshold",()=>{
    for(let value=0;value<=255;value+=3) for(const selected of [false,true]) {
      expect(renderedMinimum([[value,value,value,1]],selected).minimum).toBeGreaterThanOrEqual(5);
    }
  });
  it("uses no extra backing when the material already gives sufficient contrast",()=>{
    expect(dockContrast([white]).alpha).toBe(0);
    expect(dockContrast([black]).alpha).toBe(0);
    expect(dockContrast([white,black]).alpha).toBeGreaterThan(0);
  });
  it("composes translucent overlays instead of treating their RGB as opaque",()=>{
    expect(composite([0,0,0,.25],white)).toEqual([191.25,191.25,191.25,1]);
    expect(cssColors("linear-gradient(rgb(10, 20, 30), rgba(40,50,60,.3))")).toEqual([[10,20,30,1],[40,50,60,.3]]);
  });
});
