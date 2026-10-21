import { afterEach, describe, expect, it, vi } from "vitest";
import { initialState } from "@/modules/management/domain/demo";
import { reducer } from "@/modules/management/domain/model";
import { holidaysInMonth, schoolHolidays } from "@/modules/management/domain/holidays";
afterEach(()=>vi.useRealTimers());
describe("Histórico operacional",()=>{
  it("grava o cadastro na criação e preserva a data ao editar",()=>{
    vi.useFakeTimers(); vi.setSystemTime(new Date("2026-10-21T18:00:00Z"));
    const student={...initialState.students[0],id:"novo",name:"Nova pessoa"};
    const state=reducer(initialState,{type:"add-student",student});
    expect(state.students.at(-1)?.createdAt).toBe("2026-10-21T18:00:00.000Z");
    expect(state.studentEvents?.[0].title).toBe("Cadastro criado");
    const saved=state.students.at(-1)!;
    const edited=reducer(state,{type:"student",student:{...saved,name:"Nome corrigido"}});
    expect(edited.students.at(-1)?.createdAt).toBe(saved.createdAt);
    expect(edited.studentEvents?.[0].title).toBe("Cadastro atualizado");
  });
  it("confirma recebimento uma única vez e usa a data da confirmação",()=>{
    vi.useFakeTimers();vi.setSystemTime(new Date("2026-10-21T19:00:00Z"));
    const paid=reducer(initialState,{type:"payment",id:"p1"});
    expect(paid.payments.find(p=>p.id==="p1")?.paidAt).toBe("2026-10-21T19:00:00.000Z");
    expect(paid.studentEvents?.[0].kind).toBe("payment");
    expect(reducer(paid,{type:"payment",id:"p1"})).toBe(paid);
  });
  it("preserva datas ausentes do legado e registra mudanças de acesso",()=>{
    const hydrated=reducer(initialState,{type:"hydrate",state:initialState});
    expect(hydrated.students[0].createdAt).toBeUndefined();
    expect(hydrated.payments.find(p=>p.id==="p2")?.paidAt).toBeUndefined();
    const updated=reducer(hydrated,{type:"student",student:{...hydrated.students[0],active:false}});
    expect(updated.studentEvents?.[0].kind).toBe("access");
    expect(updated.payments).toBe(hydrated.payments);
  });
});
describe("Calendário de Feira de Santana",()=>{
  it("inclui os três feriados nacionais de novembro",()=>expect(holidaysInMonth("2026-11").map(h=>h.date)).toEqual(["2026-11-02","2026-11-15","2026-11-20"]));
  it("distingue ponto facultativo federal de feriado municipal",()=>{
    expect(schoolHolidays.find(h=>h.date==="2026-10-28")?.optional).toBe(true);
    expect(schoolHolidays.find(h=>h.date==="2026-06-04")?.scope).toBe("Feira de Santana");
    expect(schoolHolidays.find(h=>h.date==="2026-06-04")?.optional).toBeUndefined();
  });
  it("não inventa datas para anos sem fonte cadastrada",()=>expect(holidaysInMonth("2027-10")).toEqual([]));
});
