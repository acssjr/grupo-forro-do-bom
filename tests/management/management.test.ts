import { describe, expect, it } from "vitest";
import { initialState } from "@/modules/management/domain/demo";
import { attendanceTotals, isDemoState, money, publishLesson, reducer, toggleAttendance } from "@/modules/management/domain/model";

describe("GFB gestão — regras do protótipo", () => {
  it("permite corrigir e desfazer marcação sem transformar não registrados em faltas", () => {
    let values = toggleAttendance({}, "marina", "present");
    values = toggleAttendance(values, "marina", "absent");
    expect(values.marina).toBe("absent");
    values = toggleAttendance(values, "marina", "absent");
    expect(values).toEqual({});
    expect(attendanceTotals(values, ["marina", "pedro"])).toEqual({ present: 0, absent: 0, unmarked: 2 });
  });
  it("contabiliza justificativas como ausências registradas e preserva os outros alunos", () => {
    const values = { marina: "justified", pedro: "present" } as const;
    expect(attendanceTotals(values, ["marina", "pedro", "ana"])).toEqual({ present: 1, absent: 1, unmarked: 1 });
    expect(toggleAttendance(values, "ana", "present")).toEqual({ ...values, ana: "present" });
  });
  it("mantém chamadas de datas diferentes isoladas e registra histórico", () => {
    const state = reducer(initialState, { type: "attendance", key: "iniciante-quinta:2026-10-29", values: { pedro: "absent" } });
    expect(state.attendance["iniciante-quinta:2026-10-22"].pedro).toBe("present");
    expect(state.attendance["iniciante-quinta:2026-10-29"].pedro).toBe("absent");
    expect(state.history).toHaveLength(1);
  });
  it("publica somente título, resumo e materiais, sem incluir notas internas", () => {
    const lesson = { ...initialState.lessons[0], privateNote: "Nunca compartilhar com aluno" };
    const result = publishLesson(lesson, "2026-10-22T12:00:00Z");
    expect(result.published).toEqual({ title: lesson.title, summary: lesson.summary, materialIds: lesson.materialIds, at: "2026-10-22T12:00:00Z" });
    expect(JSON.stringify(result.published)).not.toContain("Nunca compartilhar");
    expect(result.privateNote).toBe("Nunca compartilhar com aluno");
    expect(lesson.published).toBeUndefined();
  });
  it("mantém um snapshot publicado independente do rascunho e dos materiais editados", () => {
    const result = publishLesson(initialState.lessons[0], "2026-10-22T12:00:00Z");
    const edited = { ...result, title: "Novo rascunho", materialIds: [] };
    expect(edited.published?.title).not.toBe("Novo rascunho");
    expect(edited.published?.materialIds).toHaveLength(2);
    expect(edited.published?.materialIds).not.toBe(initialState.lessons[0].materialIds);
  });
  it("cria apenas o complemento de R$40 depois dos R$39 da primeira aula", () => {
    const state = reducer(initialState, { type: "enroll", id: "lucas" });
    const firstMonth = state.payments.filter((payment) => payment.studentId === "lucas");
    expect(firstMonth.map((payment) => payment.amount)).toEqual([3900, 4000]);
    expect(firstMonth.reduce((sum, payment) => sum + payment.amount, 0)).toBe(7900);
    expect(state.students.find((student) => student.id === "lucas")?.plan).toBe("Essencial GFB");
  });
  it("não duplica o complemento em tentativas repetidas de matrícula", () => {
    const state = reducer(initialState, { type: "enroll", id: "lucas" });
    expect(reducer(state, { type: "enroll", id: "lucas" }).payments.filter((payment) => payment.id === "complement-lucas")).toHaveLength(1);
  });
  it("não gera complemento para primeira aula que ainda não foi paga", () => {
    const state = { ...initialState, payments: initialState.payments.map((payment) => ({ ...payment, paid: false })) };
    expect(reducer(state, { type: "enroll", id: "lucas" })).toBe(state);
  });
  it("confirma o pagamento escolhido sem afetar outras cobranças", () => {
    const state = reducer(initialState, { type: "payment", id: "p1" });
    expect(state.payments.find((payment) => payment.id === "p1")?.paid).toBe(true);
    expect(state.payments.find((payment) => payment.id === "p5")?.paid).toBe(false);
    expect(initialState.payments.find((payment) => payment.id === "p1")?.paid).toBe(false);
  });
  it("desativar acesso preserva histórico pedagógico e financeiro", () => {
    const student = initialState.students[0];
    const state = reducer(initialState, { type: "student", student: { ...student, active: false } });
    expect(state.students[0].note).toBe(student.note);
    expect(state.payments).toBe(initialState.payments);
    expect(state.attendance).toBe(initialState.attendance);
  });
  it("recupera apenas estado com versão e estrutura reconhecidas", () => {
    expect(isDemoState(JSON.parse(JSON.stringify(initialState)))).toBe(true);
    expect(isDemoState(null)).toBe(false);
    expect(isDemoState({ version: 1, students: [] })).toBe(false);
    expect(isDemoState({ ...initialState, students: [{ name: "Incompleto" }] })).toBe(false);
    expect(isDemoState({ ...initialState, version: 2 })).toBe(false);
  });
  it("formata valores monetários a partir de centavos", () => {
    expect(money(4000).replace(/\s/g, "")).toBe("R$40,00");
    expect(money(7900).replace(/\s/g, "")).toBe("R$79,00");
  });
});
