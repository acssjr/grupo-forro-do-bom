import { describe, expect, it } from "vitest";
import { initialState } from "@/modules/management/domain/demo";
import { searchManagement } from "@/modules/management/domain/search";
import { metricTrend, overviewScenario } from "@/modules/management/domain/overview-scenario";

describe("Busca geral da gestão", () => {
  it("encontra funções por intenção e sem acentos", () => {
    expect(searchManagement(initialState, "presença").some((item) => item.title === "Registrar presenças")).toBe(true);
    expect(searchManagement(initialState, "mensalidade")[0].href).toBe("/gestao/financeiro");
  });
  it("prioriza nome exato e busca códigos de turma", () => {
    expect(searchManagement(initialState, "Pedro Lima")[0].href).toBe("/gestao/alunos/pedro");
    expect(searchManagement(initialState, "GFB-T03")[0].href).toBe("/gestao/turmas/basico-sabado");
  });
  it("exige todos os termos e não indexa observações privadas", () => {
    expect(searchManagement(initialState, "Marina inexistente")).toEqual([]);
    expect(searchManagement(initialState, "confiança na troca")).toEqual([]);
  });
  it("atualiza alunos da base e oferece acessos sem texto", () => {
    const state = { ...initialState, students: [...initialState.students, { ...initialState.students[0], id: "novo", name: "Renata Costa" }] };
    expect(searchManagement(state, "Renata")[0].href).toBe("/gestao/alunos/novo");
    expect(searchManagement(state, "").length).toBe(5);
  });
});

describe("Tendências do cenário visual", () => {
  it("usa cerca de 80 alunos e compara taxas em pontos percentuais", () => {
    expect(overviewScenario.active).toBe(82);
    expect(metricTrend(75, 82, true)).toMatchObject({ direction: "down", delta: -7, label: "−7 p.p." });
  });
  it("suporta crescimento, igualdade e base zero", () => {
    expect(metricTrend(82, 74).label).toBe("+10,8%");
    expect(metricTrend(5, 5).direction).toBe("flat");
    expect(metricTrend(5, 0).label).toBe("+5");
  });
});
