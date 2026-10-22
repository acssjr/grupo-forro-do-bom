import { createHash, randomBytes, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { accessPrivileges, canManageUsers, type AccessInput, type AccessUser } from "../types.ts";
type UserRow = {
    id: string;
    name: string;
    username: string | null;
    password_hash: string | null;
    role: AccessUser["role"];
    gender: AccessUser["gender"];
    active: number;
    privileges: string;
    cohort_ids: string;
    created_at: string;
    last_login_at: string | null;
};
import { database } from "./database.ts";
export { database } from "./database.ts";
const hashToken = (value: string) => createHash("sha256").update(value).digest("hex");
export const SESSION_COOKIE = "gfb_management_session";
export const REMEMBER_SECONDS = 30 * 24 * 60 * 60;
export const SESSION_SECONDS = 12 * 60 * 60;
export class AccessError extends Error {
    status: number;
    constructor(message: string, status = 400) { super(message); this.status = status; }
}
function publicUser(row: UserRow): AccessUser {
    return { id: row.id, name: row.name, username: row.username, role: row.role, gender: row.gender, active: Boolean(row.active), privileges: JSON.parse(row.privileges), cohortIds: JSON.parse(row.cohort_ids), hasCredentials: Boolean(row.password_hash && row.username), createdAt: row.created_at, lastLoginAt: row.last_login_at };
}
function derive(password: string, salt: Buffer) {
    return new Promise<Buffer>((accept, reject) => scrypt(password, salt, 64, { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 }, (error, key) => error ? reject(error) : accept(key)));
}
export async function hashPassword(password: string) {
    if (password.length < 8 || password.length > 128)
        throw new AccessError("Use uma senha com 8 a 128 caracteres.");
    const salt = randomBytes(16);
    return `scrypt-v1$${salt.toString("base64url")}$${(await derive(password, salt)).toString("base64url")}`;
}
export async function verifyPassword(password: string, encoded: string | null) {
    const parts = encoded?.split("$");
    const salt = parts?.[0] === "scrypt-v1" ? Buffer.from(parts[1], "base64url") : Buffer.alloc(16, 7);
    const expected = parts?.[0] === "scrypt-v1" ? Buffer.from(parts[2], "base64url") : Buffer.alloc(64);
    const actual = await derive(password.slice(0, 128), salt);
    return expected.length === actual.length && timingSafeEqual(expected, actual) && Boolean(encoded);
}
export async function listUsers(connection?: Awaited<ReturnType<typeof database>>) {
    const db = connection ?? await database();
    return (await db.prepare("SELECT * FROM users ORDER BY created_at, name").all() as UserRow[]).map(publicUser);
}
function validate(input: AccessInput) {
    if (!input || typeof input.name !== "string" || !input.name.trim() || input.name.trim().length > 80)
        throw new AccessError("Informe o nome da pessoa.");
    if (typeof input.username !== "string" || !/^[a-zA-Z0-9._-]{3,40}$/.test(input.username))
        throw new AccessError("O login deve ter 3 a 40 letras, números, pontos, traços ou sublinhados.");
    if (!["Administrador", "Professor", "Monitor"].includes(input.role))
        throw new AccessError("Selecione um perfil válido.");
    if (!["male", "female"].includes(input.gender) || typeof input.active !== "boolean")
        throw new AccessError("Dados de acesso inválidos.");
    if (!Array.isArray(input.privileges) || input.privileges.some(p => !(accessPrivileges as readonly string[]).includes(p)))
        throw new AccessError("Privilégios inválidos.");
    const ids = ["iniciante-quinta", "iniciante-sabado", "basico-sabado", "intermediario-sabado", "avancado-segunda"];
    if (!Array.isArray(input.cohortIds) || input.cohortIds.some(id => !ids.includes(id)))
        throw new AccessError("Turmas inválidas.");
    if (input.password !== undefined && typeof input.password !== "string")
        throw new AccessError("Senha inválida.");
}
export async function saveUser(actorId: string, input: AccessInput): Promise<AccessUser> {
    validate(input);
    const db = (await database());
    const id = input.id ?? randomUUID();
    const suppliedHash = input.password ? await hashPassword(input.password) : null;
    await db.exec("BEGIN IMMEDIATE");
    try {
        // Read mutable credentials inside the same transaction as their update.
        const existing = input.id ? await db.prepare("SELECT * FROM users WHERE id=?").get(input.id) as UserRow | undefined : undefined;
        if (input.id && !existing) throw new AccessError("Acesso não encontrado.",404);
        if (!existing?.password_hash && !suppliedHash) throw new AccessError("Defina uma senha para ativar o login.");
        const passwordHash = suppliedHash ?? existing!.password_hash;
        const actor = (await db.prepare("SELECT * FROM users WHERE id=? AND active=1").get(actorId)) as UserRow | undefined;
        if (!actor || !canManageUsers(publicUser(actor)))
            throw new AccessError("Somente administradores podem gerenciar acessos.", 403);
        const collision = (await db.prepare("SELECT id FROM users WHERE lower(username)=lower(?) AND id<>?").get(input.username, id));
        if (collision)
            throw new AccessError("Este login já está em uso. Escolha outro.", 409);
        if (existing && existing.active && canManageUsers(publicUser(existing)) && (!input.active || input.role !== "Administrador" || !input.privileges.includes("Gerenciar acessos"))) {
            const others = ((await db.prepare("SELECT * FROM users WHERE active=1 AND id<>?").all(id)) as UserRow[]).filter(row => row.password_hash && canManageUsers(publicUser(row)));
            if (!others.length)
                throw new AccessError("Mantenha ao menos um administrador ativo com permissão para gerenciar acessos.");
        }
        const nextPrivileges = JSON.stringify([...new Set(input.privileges)]);
        if (existing) {
            (await db.prepare("UPDATE users SET name=?,username=?,password_hash=?,role=?,gender=?,active=?,privileges=?,cohort_ids=? WHERE id=?").run(input.name.trim(), input.username.toLowerCase(), passwordHash, input.role, input.gender, Number(input.active), nextPrivileges, JSON.stringify([...new Set(input.cohortIds)]), id));
            if (input.password || !input.active || existing.username !== input.username.toLowerCase() || existing.role !== input.role || existing.privileges !== nextPrivileges)
                (await db.prepare("DELETE FROM sessions WHERE user_id=?").run(id));
        }
        else {
            (await db.prepare("INSERT INTO users (id,name,username,password_hash,role,gender,active,privileges,cohort_ids,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)").run(id, input.name.trim(), input.username.toLowerCase(), passwordHash, input.role, input.gender, Number(input.active), nextPrivileges, JSON.stringify(input.cohortIds), new Date().toISOString()));
        }
        (await db.prepare("INSERT INTO access_audit VALUES (?,?,?,?,?)").run(randomUUID(), actorId, id, existing ? input.password ? "password-reset" : "access-updated" : "access-created", new Date().toISOString()));
        (await db.exec("COMMIT"));
    }
    catch (error) {
        (await db.exec("ROLLBACK"));
        throw error;
    }
    return publicUser((await db.prepare("SELECT * FROM users WHERE id=?").get(id)) as UserRow);
}
export async function bootstrapAdmin(password: string) {
    const db = (await database());
    const passwordHash = await hashPassword(password);
    (await db.exec("BEGIN IMMEDIATE"));
    try {
        if ((await db.prepare("SELECT id FROM users WHERE password_hash IS NOT NULL").get()))
            throw new AccessError("Já existe um acesso configurado. Use o painel para alterar credenciais.");
        const now = new Date().toISOString();
        (await db.prepare("INSERT INTO users (id,name,username,password_hash,role,gender,active,privileges,cohort_ids,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)").run("tailan", "Tailan", "admin", passwordHash, "Administrador", "male", 1, JSON.stringify(accessPrivileges), JSON.stringify(["iniciante-quinta", "iniciante-sabado", "basico-sabado", "intermediario-sabado", "avancado-segunda"]), now));
        for (const [name, gender, cohortIds] of [["Sthefanie", "female", ["iniciante-sabado"]], ["Luinne", "female", ["iniciante-sabado"]], ["Karine", "female", ["avancado-segunda"]], ["Thiago", "male", []]] as const) {
            (await db.prepare("INSERT INTO users (id,name,role,gender,active,privileges,cohort_ids,created_at) VALUES (?,?,?,?,?,?,?,?)").run(name.toLowerCase(), name, "Professor", gender, 1, JSON.stringify(accessPrivileges.slice(0, 4)), JSON.stringify(cohortIds), now));
        }
        (await db.exec("COMMIT"));
    }
    catch (error) {
        (await db.exec("ROLLBACK"));
        throw error;
    }
}
export async function authenticate(username: string, password: string, address: string) {
    if (!/^[a-zA-Z0-9._-]{3,40}$/.test(username) || password.length > 128 || !password)
        throw new AccessError("Usuário ou senha incorretos.", 401);
    const db = (await database()), now = Date.now(), windowMs = 15 * 60 * 1000;
    (await db.prepare("DELETE FROM login_attempts WHERE first_at<?").run(now - windowMs));
    const keys = [hashToken(`user:${username.toLowerCase()}`), hashToken(`ip:${address}`)];
    for (const key of keys) {
        const row = (await db.prepare("SELECT failures FROM login_attempts WHERE key=?").get(key)) as {
            failures: number;
        } | undefined;
        if (row && row.failures >= 12)
            throw new AccessError("Muitas tentativas. Aguarde 15 minutos e tente novamente.", 429);
    }
    const row = (await db.prepare("SELECT * FROM users WHERE lower(username)=lower(?)").get(username)) as UserRow | undefined;
    const verified = await verifyPassword(password, row?.password_hash ?? null);
    if (!row || !row.active || !verified) {
        for (const key of keys)
            (await db.prepare("INSERT INTO login_attempts VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET failures=login_attempts.failures+1").run(key, now));
        throw new AccessError("Usuário ou senha incorretos.", 401);
    }
    (await db.prepare("DELETE FROM login_attempts WHERE key=?").run(keys[0]));
    (await db.prepare("UPDATE users SET last_login_at=? WHERE id=?").run(new Date().toISOString(), row.id));
    return publicUser(row);
}
export async function createSession(userId: string, remember: boolean) {
    const db = (await database());
    (await db.prepare("DELETE FROM sessions WHERE expires_at<=?").run(Date.now()));
    const token = randomBytes(32).toString("base64url");
    (await db.prepare("INSERT INTO sessions VALUES (?,?,?)").run(hashToken(token), userId, Date.now() + (remember ? REMEMBER_SECONDS : SESSION_SECONDS) * 1000));
    return token;
}
export async function sessionUser(token?: string) {
    if (!token || !/^[a-zA-Z0-9_-]{43}$/.test(token))
        return null;
    const row = (await (await database()).prepare("SELECT users.* FROM users JOIN sessions ON users.id=sessions.user_id WHERE sessions.token_hash=? AND sessions.expires_at>? AND users.active=1").get(hashToken(token), Date.now())) as UserRow | undefined;
    return row ? publicUser(row) : null;
}
export async function revokeSession(token?: string) { if (token)
    (await (await database()).prepare("DELETE FROM sessions WHERE token_hash=?").run(hashToken(token))); }
export async function updateOwnName(id: string, name: string) {
    if (!name.trim() || name.trim().length > 80)
        throw new AccessError("Informe um nome válido.");
    (await (await database()).prepare("UPDATE users SET name=? WHERE id=?").run(name.trim(), id));
}
