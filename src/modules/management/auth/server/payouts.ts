import { randomUUID } from "node:crypto";
import { AccessError, database, listUsers } from "./store.ts";
import { canManagePayouts } from "../types.ts";
import { payoutCalculation, payoutQuote, validAmount, validPeriod, type Payout, type PayoutEvent, type PayoutRule } from "../../domain/payouts.ts";
import { money } from "../../domain/model.ts";
async function dbFor(actorId: string) {
    const actor = (await listUsers()).find(u => u.id === actorId);
    if (!actor || !canManagePayouts(actor))
        throw new AccessError("Esta área é exclusiva do gestor Tailan.", 403);
    const db = (await database());
    return db;
}
type Db = Awaited<ReturnType<typeof dbFor>>;
function decode<T>(rows: unknown[]): T[] { return (rows as {
    data: string;
}[]).map(row => JSON.parse(row.data) as T); }
async function audit(db: Db, actorId: string, payoutId: string, action: string, detail: string) {
    (await db.prepare("INSERT INTO payout_events VALUES (?,?,?,?,?,?)").run(randomUUID(), payoutId, action, actorId, new Date().toISOString(), detail));
}
export async function payoutData(actorId: string, period: string) {
    if (!validPeriod(period))
        throw new AccessError("Selecione uma competência válida.");
    const db = (await dbFor(actorId));
    const payouts = decode<Payout>((await db.prepare("SELECT data FROM teacher_payouts WHERE period=? ORDER BY rowid DESC").all(period)));
    const events = (await db.prepare("SELECT id,payout_id AS payoutId,action,actor_id AS actorId,at,detail FROM payout_events WHERE payout_id IN (SELECT id FROM teacher_payouts WHERE period=?) ORDER BY at DESC").all(period)) as PayoutEvent[];
    return { rules: decode<PayoutRule>((await db.prepare("SELECT data FROM payout_rules").all())), payouts, events, teachers: (await listUsers()).filter(u => u.role === "Professor" || u.role === "Administrador").map(u => ({ id: u.id, name: u.name, active: u.active, cohortIds: u.cohortIds })) };
}
function object(input: unknown): Record<string, unknown> {
    if (!input || typeof input !== "object" || Array.isArray(input))
        throw new AccessError("Dados inválidos.");
    return input as Record<string, unknown>;
}
function text(value: unknown, max: number, label: string, optional = false) {
    if (optional && (value === undefined || value === ""))
        return "";
    if (typeof value !== "string" || !value.trim() || value.trim().length > max)
        throw new AccessError(`Informe ${label} válido.`);
    return value.trim();
}
export async function savePayoutRule(actorId: string, input: unknown) {
    const db = (await dbFor(actorId)), data = object(input);
    const teacherId = text(data.teacherId, 80, "um professor");
    const teacher = (await listUsers(db)).find(u => u.id === teacherId && u.active && (u.role === "Professor" || u.role === "Administrador"));
    if (!teacher)
        throw new AccessError("Professor indisponível para novos repasses.");
    if (data.mode !== "fixed" && data.mode !== "per-cohort")
        throw new AccessError("Escolha valor fixo ou por turma.");
    if (!validAmount(data.amount) || typeof data.enabled !== "boolean")
        throw new AccessError("Informe um valor maior que zero, até R$ 999.999,99.");
    if (!Array.isArray(data.cohortIds) || data.cohortIds.some(id => typeof id !== "string" || !teacher.cohortIds.includes(id)) || new Set(data.cohortIds).size !== data.cohortIds.length)
        throw new AccessError("Confira as turmas atribuídas ao professor.");
    if (data.mode === "per-cohort" && data.cohortIds.length === 0)
        throw new AccessError("Selecione pelo menos uma turma.");
    (await db.exec("BEGIN IMMEDIATE"));
    try {
        const row = (await db.prepare("SELECT data FROM payout_rules WHERE teacher_id=?").get(teacherId)) as {
            data: string;
        } | undefined;
        const old = row ? JSON.parse(row.data) as PayoutRule : undefined;
        if (data.version !== (old?.version ?? 0))
            throw new AccessError("A regra mudou. Atualize a página antes de salvar.", 409);
        const rule: PayoutRule = { teacherId, mode: data.mode, amount: data.amount, enabled: data.enabled, cohortIds: data.mode === "fixed" ? [] : data.cohortIds as string[], version: (old?.version ?? 0) + 1, updatedAt: new Date().toISOString() };
        if (!payoutCalculation(rule, teacher).valid && rule.enabled)
            throw new AccessError("O total calculado excede o limite ou as turmas mudaram.");
        (await db.prepare("INSERT INTO payout_rules VALUES (?,?) ON CONFLICT(teacher_id) DO UPDATE SET data=excluded.data").run(teacherId, JSON.stringify(rule)));
        (await audit(db, actorId, `rule:${teacherId}`, "rule-saved", JSON.stringify(rule)));
        (await db.exec("COMMIT"));
        return rule;
    }
    catch (error) {
        (await db.exec("ROLLBACK"));
        throw error;
    }
}
async function insertPayout(db: Db, actorId: string, payout: Payout) {
    if ((await db.prepare("SELECT id FROM teacher_payouts WHERE teacher_id=? AND period=? AND status<>'cancelled'").get(payout.teacherId, payout.period)))
        throw new AccessError(`Já existe um repasse de ${payout.teacherName} nesta competência.`, 409);
    (await db.prepare("INSERT INTO teacher_payouts VALUES (?,?,?,?,?)").run(payout.id, payout.teacherId, payout.period, payout.status, JSON.stringify(payout)));
    (await audit(db, actorId, payout.id, "created", payout.calculation));
}
export async function createPayouts(actorId: string, input: unknown) {
    const db = (await dbFor(actorId)), data = object(input);
    if (!validPeriod(data.period))
        throw new AccessError("Selecione uma competência válida.");
    const period = data.period, key = text(data.requestId, 80, "uma referência de envio");
    const payload = JSON.stringify(data);
    (await db.exec("BEGIN IMMEDIATE"));
    try {
        const old = (await db.prepare("SELECT payload,result FROM payout_requests WHERE key=?").get(key)) as {
            payload: string;
            result: string;
        } | undefined;
        if (old) {
            if (old.payload !== payload)
                throw new AccessError("Referência de envio já utilizada.", 409);
            (await db.exec("COMMIT"));
            return JSON.parse(old.result) as Payout[];
        }
        const teachers = (await listUsers(db)).filter(u => u.active && (u.role === "Professor" || u.role === "Administrador"));
        const created: Payout[] = [];
        const base = (teacher: typeof teachers[number]): Payout => ({ id: randomUUID(), teacherId: teacher.id, teacherName: teacher.name, period, description: "Repasse do período", amount: 0, status: "pending", calculation: "", cohortIds: [], createdAt: new Date().toISOString(), createdBy: actorId });
        if (data.action === "manual") {
            const teacher = teachers.find(t => t.id === data.teacherId);
            if (!teacher)
                throw new AccessError("Professor indisponível.");
            if (!validAmount(data.amount))
                throw new AccessError("Informe um valor válido em reais.");
            created.push({ ...base(teacher), description: text(data.description, 160, "uma descrição"), amount: data.amount, calculation: "Valor fixo informado pelo gestor" });
        }
        else if (data.action === "generate") {
            if (!Array.isArray(data.review) || !data.review.length || data.review.length > 100)
                throw new AccessError("Selecione as regras para apurar.");
            const seen = new Set<string>();
            for (const item of data.review) {
                const review = object(item), teacher = teachers.find(t => t.id === review.teacherId);
                if (!teacher || seen.has(teacher.id))
                    throw new AccessError("Confira os professores da apuração.");
                seen.add(teacher.id);
                const row = (await db.prepare("SELECT data FROM payout_rules WHERE teacher_id=?").get(teacher.id)) as {
                    data: string;
                } | undefined;
                if (!row)
                    throw new AccessError("Configure a regra antes de gerar.", 409);
                const rule = JSON.parse(row.data) as PayoutRule, result = payoutCalculation(rule, teacher);
                if (!result.valid || payoutQuote(rule, teacher) !== review.quote)
                    throw new AccessError("Uma regra ou atribuição mudou. Confira a apuração novamente.", 409);
                created.push({ ...base(teacher), amount: result.amount, cohortIds: result.cohortIds, calculation: rule.mode === "fixed" ? `Valor fixo de ${money(rule.amount)} · regra v${rule.version}` : `${result.cohortIds.length} turma(s) × ${money(rule.amount)} · regra v${rule.version}` });
            }
        }
        else
            throw new AccessError("Operação inválida.");
        for (const payout of created)
            (await insertPayout(db, actorId, payout));
        (await db.prepare("INSERT INTO payout_requests VALUES (?,?,?)").run(key, payload, JSON.stringify(created)));
        (await db.exec("COMMIT"));
        return created;
    }
    catch (error) {
        (await db.exec("ROLLBACK"));
        throw error;
    }
}
export async function updatePayout(actorId: string, input: unknown) {
    const db = (await dbFor(actorId)), data = object(input), id = text(data.id, 80, "um repasse");
    (await db.exec("BEGIN IMMEDIATE"));
    try {
        const row = (await db.prepare("SELECT data FROM teacher_payouts WHERE id=?").get(id)) as {
            data: string;
        } | undefined;
        if (!row)
            throw new AccessError("Repasse não encontrado.", 404);
        const payout = JSON.parse(row.data) as Payout;
        if (payout.status !== "pending")
            throw new AccessError("Este repasse já foi pago ou cancelado. Atualize a lista.", 409);
        if (data.action === "pay") {
            const date = text(data.paymentDate, 10, "uma data de pagamento");
            if (!/^20\d{2}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(`${date}T12:00:00Z`).toISOString().slice(0, 10) !== date || date > new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bahia", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()))
                throw new AccessError("Informe uma data válida, até hoje.");
            if (!["Pix", "Transferência", "Dinheiro", "Outro"].includes(String(data.method)))
                throw new AccessError("Selecione a forma de pagamento.");
            Object.assign(payout, { status: "paid", paidAt: new Date().toISOString(), paidBy: actorId, paymentDate: date, method: data.method, reference: text(data.reference, 120, "uma referência", true) });
        }
        else if (data.action === "cancel")
            Object.assign(payout, { status: "cancelled", cancelledAt: new Date().toISOString(), cancelledBy: actorId, reason: text(data.reason, 300, "um motivo de cancelamento") });
        else
            throw new AccessError("Operação inválida.");
        (await db.prepare("UPDATE teacher_payouts SET status=?,data=? WHERE id=?").run(payout.status, JSON.stringify(payout), id));
        (await audit(db, actorId, id, data.action === "pay" ? "paid" : "cancelled", JSON.stringify(payout)));
        (await db.exec("COMMIT"));
        return payout;
    }
    catch (error) {
        (await db.exec("ROLLBACK"));
        throw error;
    }
}
