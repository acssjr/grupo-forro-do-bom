import { describe, expect, it } from "vitest";
import { canAccessPath, canManagePayouts, type AccessUser } from "../../src/modules/management/auth/types";
import { parseReais, payoutCalculation, payoutQuote, validPeriod, type PayoutRule } from "../../src/modules/management/domain/payouts";
const user={id:"tailan",active:true,role:"Administrador",privileges:["Financeiro","Gerenciar acessos"]} as AccessUser;
const teacher={id:"sthefanie",name:"Sthefanie",active:true,cohortIds:["a","b"]};
const rule:PayoutRule={teacherId:teacher.id,mode:"per-cohort",amount:12550,cohortIds:["a","b"],enabled:true,version:1,updatedAt:"2026-10-22"};
describe("private teacher payouts",()=>{
  it("restricts the area to Tailan's persistent identity, including other administrators",()=>{
    expect(canManagePayouts(user)).toBe(true);
    for(const other of [{...user,id:"another-admin",name:"Tailan"},{...user,active:false},{...user,role:"Professor" as const}]){expect(canManagePayouts(other)).toBe(false);expect(canAccessPath(other,"/gestao/repasses")).toBe(false);}
    expect(canAccessPath(user,"/gestao/repasses")).toBe(true);
  });
  it("parses currency without floating point rounding or silently accepting negatives",()=>{
    expect(parseReais("125,50")).toBe(12550);expect(parseReais("0.10")).toBe(10);expect(parseReais("12,5")).toBe(1250);
    for(const input of ["", "-10", "0", "1,234", "1.000,00", "1000000", "Infinity", "1e3"]){expect(parseReais(input)).toBeNull();}
  });
  it("calculates by the chosen assigned cohorts and rejects stale assignments",()=>{
    expect(payoutCalculation(rule,teacher)).toEqual({cohortIds:["a","b"],amount:25100,valid:true});
    expect(payoutCalculation({...rule,cohortIds:["b"]},teacher).amount).toBe(12550);
    expect(payoutCalculation(rule,{...teacher,cohortIds:["a"]}).valid).toBe(false);
    expect(payoutCalculation({...rule,enabled:false},teacher).valid).toBe(false);
    expect(payoutCalculation(rule,{...teacher,active:false}).valid).toBe(false);
    expect(payoutCalculation({...rule,amount:99_999_999},teacher).valid).toBe(false);
  });
  it("keeps fixed rules independent of assigned class count and invalidates stale review quotes",()=>{
    expect(payoutCalculation({...rule,mode:"fixed"},{...teacher,cohortIds:[]}).amount).toBe(12550);
    expect(payoutQuote(rule,teacher)).not.toBe(payoutQuote({...rule,version:2},teacher));
    expect(payoutQuote(rule,teacher)).not.toBe(payoutQuote(rule,{...teacher,cohortIds:["a"]}));
  });
  it("requires an actual year/month for the period",()=>{expect(validPeriod("2026-10")).toBe(true);for(const input of ["2026-00","2026-13","2026-1","2026-10-01",null])expect(validPeriod(input)).toBe(false);});
});
