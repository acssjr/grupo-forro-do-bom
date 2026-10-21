import { describe, expect, it } from "vitest";
import { initialState } from "@/modules/management/domain/demo";
import { financeSummary, paymentKind, receiptCurve } from "@/modules/management/domain/finance";
import { reducer } from "@/modules/management/domain/model";
import { avatarAge, avatarPosition } from "@/modules/management/domain/profiles";

describe("Recebíveis da escola", () => {
  it("não soma atrasos duas vezes no total a receber", () => {
    const result = financeSummary(initialState.payments);
    expect(result).toMatchObject({ received: 37600, pending: 23700, overdue: 15800, upcoming: 7900, expected: 61300, paidCount: 5, pendingCount: 3, percent: 61 });
    expect(result.received + result.upcoming + result.overdue).toBe(result.expected);
  });
  it("separa competência mensal e não divide por zero sem cobranças", () => {
    expect(financeSummary(initialState.payments, "2026-09")).toMatchObject({ received: 0, pending: 0, expected: 0, percent: 0 });
  });
  it("distingue continuidade, primeira aula, mensalidade e evento", () => {
    expect(paymentKind(initialState.payments[6])).toBe("Complementos");
    expect(paymentKind(initialState.payments[3])).toBe("Primeira aula");
    expect(paymentKind(initialState.payments[0])).toBe("Mensalidades");
    expect(paymentKind({ ...initialState.payments[0], eventId: "encontro" })).toBe("Eventos");
  });
  it("atualiza recebidos, pendentes e data de confirmação juntos", () => {
    const next = reducer(initialState, { type: "payment", id: "p1" });
    expect(next.payments.find((payment) => payment.id === "p1")?.paidAt).toBeTruthy();
    expect(financeSummary(next.payments)).toMatchObject({ received: 45500, pending: 15800, overdue: 7900, expected: 61300 });
  });
  it("usa a data de confirmação na curva e não apresenta receita futura", () => {
    const rows = [{ ...initialState.payments[0], paid: true, paidAt: "2026-10-10T12:00:00Z" }];
    const curve = receiptCurve(rows);
    expect(curve[8].received).toBe(0);
    expect(curve[9].received).toBe(7900);
    expect(curve[22].received).toBeNull();
  });
});

describe("Avatares por idade", () => {
  it("define faixas e mantém um padrão adulto quando a idade falta", () => {
    expect([avatarAge(20), avatarAge(30), avatarAge(55), avatarAge()]).toEqual(["young", "adult", "mature", "adult"]);
  });
  it("permite escolher outra faixa sem alterar idade ou identidade", () => {
    expect(avatarPosition(25, "female")).toEqual({ backgroundPosition: "0% 100%" });
    expect(avatarPosition(25, "male", "mature")).toEqual({ backgroundPosition: "100% 0%" });
  });
});
