// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { payoutQuote } from "../../src/modules/management/domain/payouts";
import { bootstrapAdmin, database, listUsers, authenticate, createSession, sessionUser, revokeSession, updateOwnName, saveUser } from "../../src/modules/management/auth/server/store";
import { createPayouts, payoutData, savePayoutRule, updatePayout } from "../../src/modules/management/auth/server/payouts";
const previousUrl = process.env.GFB_DATABASE_URL;
const password = randomUUID();
const previousPath = process.env.GFB_AUTH_DATABASE_PATH;
beforeAll(async () => {
    process.env.GFB_AUTH_DATABASE_PATH = join(mkdtempSync(join(tmpdir(), "gfb-payout-tests-")), "auth.sqlite");
    if (process.env.GFB_TEST_DATABASE_URL) {
        if (new URL(process.env.GFB_TEST_DATABASE_URL).pathname !== "/gfb_verification") throw new Error("Use only the isolated gfb_verification database for integration tests.");
        process.env.GFB_DATABASE_URL = process.env.GFB_TEST_DATABASE_URL;
        const db = await database();
        await db.exec("TRUNCATE payout_requests,payout_events,teacher_payouts,payout_rules,access_audit,login_attempts,sessions,users CASCADE");
    } else delete process.env.GFB_DATABASE_URL;
    await bootstrapAdmin(password);
});
afterAll(async () => {
    (await database()).close();
    if (previousPath === undefined)
        delete process.env.GFB_AUTH_DATABASE_PATH;
    else
        process.env.GFB_AUTH_DATABASE_PATH = previousPath;
});
describe("persisted payouts", () => {
    it("blocks a teacher and a different administrator even with financial privileges", async () => {
        await expect(payoutData("sthefanie", "2026-10")).rejects.toThrow("exclusiva");
        (await (await database()).prepare("INSERT INTO users(id,name,role,gender,active,privileges,cohort_ids,created_at) VALUES (?,?,?,?,?,?,?,?)").run("other", "Tailan", "Administrador", "male", 1, '["Financeiro","Gerenciar acessos"]', "[]", new Date().toISOString()));
        await expect(payoutData("other", "2026-10")).rejects.toThrow("exclusiva");
    });
    it("generates reviewed rules once and keeps the calculation when future rules change", async () => {
        const rule = (await savePayoutRule("tailan", { teacherId: "sthefanie", mode: "per-cohort", amount: 12550, cohortIds: ["iniciante-sabado"], enabled: true, version: 0 }));
        const teacher = (await listUsers()).find(t => t.id === "sthefanie")!;
        const input = { action: "generate", period: "2026-10", requestId: randomUUID(), review: [{ teacherId: teacher.id, quote: payoutQuote(rule, teacher) }] };
        const created = (await createPayouts("tailan", input));
        expect(created[0].amount).toBe(12550);
        expect((await createPayouts("tailan", input))[0].id).toBe(created[0].id);
        await expect(createPayouts("tailan", { ...input, requestId: randomUUID() })).rejects.toThrow("Já existe");
        (await savePayoutRule("tailan", { ...rule, mode: "fixed", amount: 30000, cohortIds: [] }));
        expect((await payoutData("tailan", "2026-10")).payouts[0].amount).toBe(12550);
        await expect(createPayouts("tailan", { ...input, period: "2026-11", requestId: randomUUID() })).rejects.toThrow("mudou");
        await expect(savePayoutRule("tailan", { ...rule, amount: 999 })).rejects.toThrow("mudou");
    });
    it("validates payment dates and never confirms or cancels an already paid record", async () => {
        const record = (await payoutData("tailan", "2026-10")).payouts[0];
        await expect(updatePayout("tailan", { id: record.id, action: "pay", paymentDate: "2026-02-30", method: "Pix" })).rejects.toThrow("data válida");
        (await updatePayout("tailan", { id: record.id, action: "pay", paymentDate: "2020-01-01", method: "Pix" }));
        await expect(updatePayout("tailan", { id: record.id, action: "pay", paymentDate: "2020-01-01", method: "Pix" })).rejects.toThrow("já foi");
        await expect(updatePayout("tailan", { id: record.id, action: "cancel", reason: "correção" })).rejects.toThrow("já foi");
        const result = (await payoutData("tailan", "2026-10"));
        expect(result.payouts[0].status).toBe("paid");
        expect(result.events.map(e => e.action).sort()).toEqual(["created", "paid"]);
    });
    it("keeps cancelled records and permits a corrected value without deleting the audit", async () => {
        const input = { action: "manual", period: "2026-11", teacherId: "sthefanie", amount: 10000, description: "Aulas do período", requestId: randomUUID() };
        const [record] = (await createPayouts("tailan", input));
        (await updatePayout("tailan", { id: record.id, action: "cancel", reason: "Valor corrigido" }));
        (await createPayouts("tailan", { ...input, amount: 11000, requestId: randomUUID() }));
        const result = (await payoutData("tailan", "2026-11"));
        expect(result.payouts).toHaveLength(2);
        expect(result.payouts.find(p => p.id === record.id)?.reason).toBe("Valor corrigido");
        expect(result.events).toHaveLength(3);
    });
    it("rolls back the complete generation batch if one teacher already has a payout", async () => {
        const rule = (await savePayoutRule("tailan", { teacherId: "karine", mode: "fixed", amount: 15000, cohortIds: [], enabled: true, version: 0 }));
        const first = (await listUsers()).find(t => t.id === "karine")!, second = (await listUsers()).find(t => t.id === "sthefanie")!;
        const otherRule = (await payoutData("tailan", "2026-10")).rules.find(r => r.teacherId === second.id)!;
        await expect(createPayouts("tailan", { action: "generate", period: "2026-10", requestId: randomUUID(), review: [{ teacherId: first.id, quote: payoutQuote(rule, first) }, { teacherId: second.id, quote: payoutQuote(otherRule, second) }] })).rejects.toThrow("Já existe");
        expect((await payoutData("tailan", "2026-10")).payouts.some(p => p.teacherId === first.id)).toBe(false);
    });
});


describe("persistent authentication", () => {
    it("authenticates case-insensitively, stores and revokes sessions, and persists profile changes", async () => {
        const user = await authenticate("ADMIN", password, "test");
        expect(user.id).toBe("tailan");
        await expect(authenticate("admin", "wrong-password", "test")).rejects.toMatchObject({status:401});
        const token = await createSession(user.id, true);
        expect((await sessionUser(token))?.id).toBe(user.id);
        await updateOwnName(user.id, "Tailan");
        await revokeSession(token);
        expect(await sessionUser(token)).toBe(null);
        expect(await sessionUser("invalid")).toBe(null);
    });
    it("persists a teacher login and invalidates existing sessions after a password reset", async () => {
        const teacher = (await listUsers()).find(u=>u.id === "thiago")!;
        const input = {...teacher, username:"thiago.demo", password, role:"Professor" as const};
        const saved = await saveUser("tailan", input);
        expect(saved.hasCredentials).toBe(true);
        const token = await createSession(saved.id,false);
        await expect(saveUser(saved.id,{...input,name:"Changed"})).rejects.toMatchObject({status:403});
        await saveUser("tailan", {...input,password:randomUUID()});
        expect(await sessionUser(token)).toBe(null);
    });
    it("serializes concurrent remote generation and keeps exactly one payout", async () => {
        if (!process.env.GFB_TEST_DATABASE_URL) return;
        const create = () => createPayouts("tailan", {action:"manual",period:"2035-01",teacherId:"thiago",amount:10000,description:"Concurrency check",requestId:randomUUID()});
        const results = await Promise.allSettled([create(),create(),create(),create()]);
        expect(results.filter(r=>r.status === "fulfilled")).toHaveLength(1);
        expect((await payoutData("tailan","2035-01")).payouts).toHaveLength(1);
    });
});
