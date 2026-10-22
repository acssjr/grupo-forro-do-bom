import { failure, json, readJson, requestUser } from "@/modules/management/auth/server/http";
import { updateOwnName } from "@/modules/management/auth/server/store";
export const runtime = "nodejs";
export async function GET() { try {
    return json({ user: await requestUser() });
}
catch (error) {
    return failure(error);
} }
export async function PATCH(request: Request) {
    try {
        const user = await requestUser();
        const body = await readJson<{
            name: string;
        }>(request);
        if (typeof body.name !== "string")
            return json({ error: "Informe um nome válido." }, 400);
        (await updateOwnName(user.id, body.name));
        return json({ user: { ...user, name: body.name.trim() } });
    }
    catch (error) {
        return failure(error);
    }
}
