import type { AccessInput } from "@/modules/management/auth/types";
import { listUsers, saveUser } from "@/modules/management/auth/server/store";
import { failure, json, readJson, requestUser } from "@/modules/management/auth/server/http";

export const runtime = "nodejs";
export async function GET() {
  try { await requestUser(true); return json({ users: listUsers() }); } catch (error) { return failure(error); }
}
export async function POST(request: Request) {
  try {
    const actor = await requestUser(true);
    const input = await readJson<AccessInput>(request);
    return json({ user: await saveUser(actor.id, input) });
  } catch (error) { return failure(error); }
}
