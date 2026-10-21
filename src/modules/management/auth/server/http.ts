import "server-only";
import { NextResponse } from "next/server";
import { currentUser } from "./session";
import { AccessError } from "./store";
import { canManageUsers } from "../types";

export async function requestUser(admin = false) {
  const user = await currentUser();
  if (!user) throw new AccessError("Sua sessão expirou. Entre novamente.", 401);
  if (admin && !canManageUsers(user)) throw new AccessError("Somente administradores podem gerenciar acessos.", 403);
  return user;
}
export async function readJson<T>(request: Request): Promise<T> {
  if (request.headers.get("origin") !== new URL(request.url).origin) throw new AccessError("Solicitação de origem inválida.", 403);
  if (!request.headers.get("content-type")?.includes("application/json")) throw new AccessError("Formato de solicitação inválido.", 415);
  const text = await request.text();
  if (text.length > 8000) throw new AccessError("Solicitação muito grande.", 413);
  try { return JSON.parse(text) as T; } catch { throw new AccessError("Solicitação inválida."); }
}
export function json(value: unknown, status = 200) { return NextResponse.json(value, { status, headers: { "Cache-Control": "no-store" } }); }
export function failure(error: unknown) { return error instanceof AccessError ? json({ error: error.message }, error.status) : json({ error: "Não foi possível concluir. Tente novamente." }, 500); }
