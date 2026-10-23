import { describe, expect, it } from "vitest";
import { contentOffset, greetingAt, navigationDuration, mobilePageDirection } from "../../src/modules/management/domain/motion";

describe("navigation travel", () => {
  it("gives distant destinations more time without an unbounded wait", () => {
    expect(navigationDuration(54)).toBeLessThan(navigationDuration(378));
    expect(navigationDuration(378)).toBeLessThan(navigationDuration(700));
    expect(navigationDuration(10000)).toBe(.5);
    expect(navigationDuration(-10)).toBe(.28);
  });
});

describe("content continuity", () => {
  it("preserves nearby anchors but bounds cross-screen displacement", () => {
    expect(contentOffset(12)).toBe(12);
    expect(contentOffset(700)).toBe(32);
    expect(contentOffset(-700)).toBe(-32);
  });
});

describe("school greeting", () => {
  it("uses Bahia time for the morning, afternoon and evening boundaries", () => {
    expect(greetingAt(new Date("2026-10-22T08:59:00Z"))).toBe("Boa noite");
    expect(greetingAt(new Date("2026-10-22T09:00:00Z"))).toBe("Bom dia");
    expect(greetingAt(new Date("2026-10-22T14:59:00Z"))).toBe("Bom dia");
    expect(greetingAt(new Date("2026-10-22T15:00:00Z"))).toBe("Boa tarde");
    expect(greetingAt(new Date("2026-10-22T21:00:00Z"))).toBe("Boa noite");
  });
});

describe("mobile page direction", () => {
  it("follows navbar order and reverses on return", () => {
    expect(mobilePageDirection("inicio//","alunos//")).toBe(1);
    expect(mobilePageDirection("alunos//","inicio//")).toBe(-1);
    expect(mobilePageDirection("financeiro//","eventos//")).toBe(1);
    expect(mobilePageDirection("eventos//","financeiro//")).toBe(-1);
  });
  it("distinguishes drill-in, back and cohort tab order", () => {
    expect(mobilePageDirection("alunos//","alunos/marina/")).toBe(1);
    expect(mobilePageDirection("alunos/marina/","alunos//")).toBe(-1);
    expect(mobilePageDirection("turmas/id/chamada","turmas/id/aulas")).toBe(1);
    expect(mobilePageDirection("turmas/id/aulas","turmas/id/chamada")).toBe(-1);
  });
  it("does not invent travel for an unchanged or unknown page", () => {
    expect(mobilePageDirection("alunos//","alunos//")).toBe(0);
    expect(mobilePageDirection("login//","inicio//")).toBe(0);
  });
});
