import { canManagePayouts } from "@/modules/management/auth/types";
import { AccessError } from "@/modules/management/auth/server/store";
import { failure, json, readJson, requestUser } from "@/modules/management/auth/server/http";
import { createPayouts, payoutData, savePayoutRule, updatePayout } from "@/modules/management/auth/server/payouts";
export const runtime = "nodejs";
async function actor() { const user = await requestUser(); if (!canManagePayouts(user))
    throw new AccessError("Esta área é exclusiva do gestor Tailan.", 403); return user; }
export async function GET(request: Request) { try {
    const user = await actor();
    return json((await payoutData(user.id, new URL(request.url).searchParams.get("period") ?? "")));
}
catch (error) {
    return failure(error);
} }
export async function POST(request: Request) { try {
    const user = await actor();
    const input = await readJson<Record<string, unknown>>(request);
    if (!input || typeof input !== "object")
        throw new AccessError("Dados inválidos.");
    if (input.action === "rule")
        return json({ rule: (await savePayoutRule(user.id, input)) });
    if (input.action === "pay" || input.action === "cancel")
        return json({ payout: (await updatePayout(user.id, input)) });
    return json({ payouts: (await createPayouts(user.id, input)) }, 201);
}
catch (error) {
    return failure(error);
} }
