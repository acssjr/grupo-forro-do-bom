import { cookies } from "next/headers";
import { failure, json, readJson } from "@/modules/management/auth/server/http";
import { revokeSession, SESSION_COOKIE } from "@/modules/management/auth/server/store";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    await readJson(request);
    revokeSession((await cookies()).get(SESSION_COOKIE)?.value);
    const response = json({ success: true });
    response.cookies.set(SESSION_COOKIE, "", { maxAge: 0, path: "/", httpOnly: true, sameSite: "lax", secure: new URL(request.url).protocol === "https:" });
    return response;
  } catch (error) { return failure(error); }
}
