import { describe, expect, it } from "vitest";
import { monthComparison } from "@/modules/management/domain/metrics";

describe("Comparação mensal da gestão", () => {
  it("não inventa um resultado quando falta histórico", () => {
    expect(monthComparison(12, null)).toBe("Sem histórico de setembro");
  });
  it("compara uma base zero sem divisão por zero", () => {
    expect(monthComparison(5, 0)).toBe("+5 vs. setembro");
  });
  it("compara taxas em pontos percentuais", () => {
    expect(monthComparison(75, 80, "rate")).toBe("−5 p.p. vs. setembro");
    expect(monthComparison(75, 75, "rate")).toBe("Sem alteração vs. setembro");
  });
  it("mantém valores financeiros em centavos", () => {
    expect(monthComparison(23700, 20000, "money")).toContain("37,00");
  });
});
