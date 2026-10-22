import { authenticate, createSession, REMEMBER_SECONDS, SESSION_COOKIE, revokeSession } from "@/modules/management/auth/server/store";
import { failure, json, readJson } from "@/modules/management/auth/server/http";
import { cookies } from "next/headers";
export const runtime = "nodejs";
export async function POST(request: Request) {
    try {
        const body = await readJson<{
            username: string;
            password: string;
            remember: boolean;
        }>(request);
        if (typeof body.username !== "string" || typeof body.password !== "string" || typeof body.remember !== "boolean")
            return json({ error: "Informe usuário e senha." }, 400);
        const user = await authenticate(body.username.trim(), body.password, request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local");
        const jar = await cookies();
        (await revokeSession(jar.get(SESSION_COOKIE)?.value));
        const response = json({ user });
        response.cookies.set(SESSION_COOKIE, (await createSession(user.id, body.remember)), { httpOnly: true, sameSite: "lax", secure: new URL(request.url).protocol === "https:", path: "/", ...(body.remember ? { maxAge: REMEMBER_SECONDS } : {}) });
        return response;
    }
    catch (error) {
        return failure(error);
    }
}
