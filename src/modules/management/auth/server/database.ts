import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import postgres from "postgres";

type Parameter = string | number | null;
type Row = Record<string, unknown>;
const schema = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, username TEXT UNIQUE,
  password_hash TEXT, role TEXT NOT NULL, gender TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1, privileges TEXT NOT NULL,
  cohort_ids TEXT NOT NULL, created_at TEXT NOT NULL, last_login_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower ON users(lower(username));
CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at BIGINT NOT NULL);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
CREATE TABLE IF NOT EXISTS login_attempts (key TEXT PRIMARY KEY, failures INTEGER NOT NULL, first_at BIGINT NOT NULL);
CREATE TABLE IF NOT EXISTS access_audit (id TEXT PRIMARY KEY, actor_id TEXT NOT NULL, user_id TEXT NOT NULL, action TEXT NOT NULL, at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS payout_rules(teacher_id TEXT PRIMARY KEY REFERENCES users(id), data TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS teacher_payouts(id TEXT PRIMARY KEY,teacher_id TEXT NOT NULL REFERENCES users(id),period TEXT NOT NULL,status TEXT NOT NULL,data TEXT NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS payout_teacher_period ON teacher_payouts(teacher_id,period) WHERE status<>'cancelled';
CREATE TABLE IF NOT EXISTS payout_events(id TEXT PRIMARY KEY,payout_id TEXT NOT NULL,action TEXT NOT NULL,actor_id TEXT NOT NULL,at TEXT NOT NULL,detail TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS payout_requests(key TEXT PRIMARY KEY,payload TEXT NOT NULL,result TEXT NOT NULL);
`;
const globals = globalThis as typeof globalThis & {
  gfbSqlite?: Map<string, DatabaseSync>;
  gfbPostgres?: Map<string, Promise<postgres.Sql>>;
};

export function postgresQuery(query: string) {
  let index = 0;
  return query.replace(/ COLLATE NOCASE/g, "")
    .replace(/AS (payoutId|actorId)/g, 'AS "$1"')
    .replace(/ORDER BY rowid DESC/g, "ORDER BY (data::jsonb->>'createdAt') DESC,id DESC")
    .replace(/\?/g, () => `$${++index}`);
}

export async function database() {
  const url = process.env.GFB_DATABASE_URL;
  if (!url) {
    // Never put production credentials in an ephemeral /tmp SQLite file.
    if (process.env.VERCEL) throw new Error("Configure GFB_DATABASE_URL for persistent management storage.");
    const filename = resolve(/* turbopackIgnore: true */ process.cwd(), process.env.GFB_AUTH_DATABASE_PATH || ".data/management-auth.sqlite");
    globals.gfbSqlite ??= new Map();
    let sqlite = globals.gfbSqlite.get(filename);
    if (!sqlite) {
      mkdirSync(dirname(filename), {recursive:true, mode:0o700});
      sqlite = new DatabaseSync(filename);
      sqlite.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;");
      sqlite.exec(schema);
      globals.gfbSqlite.set(filename, sqlite);
    }
    const db = sqlite;
    return {
      prepare(query: string) {
        return {
          async all(...args: Parameter[]) { return db.prepare(query).all(...args) as Row[]; },
          async get(...args: Parameter[]) { return db.prepare(query).get(...args) as Row | undefined; },
          async run(...args: Parameter[]) { db.prepare(query).run(...args); },
        };
      },
      async exec(query: string) { db.exec(query); },
      async close() { db.close(); globals.gfbSqlite?.delete(filename); },
    };
  }
  globals.gfbPostgres ??= new Map();
  let ready = globals.gfbPostgres.get(url);
  if (!ready) {
    ready = (async () => {
      const sql = postgres(url, {ssl:"verify-full", max:3, idle_timeout:20, connect_timeout:15, prepare:false, onnotice:()=>{}});
      try {
        await sql.begin(async tx => {
          await tx.unsafe("SELECT pg_advisory_xact_lock(73612101)");
          await tx.unsafe(schema);
        });
        return sql;
      } catch (error) { await sql.end({timeout:2}); throw error; }
    })();
    globals.gfbPostgres.set(url, ready);
    ready.catch(() => globals.gfbPostgres?.delete(url));
  }
  const pool = await ready;
  // Each operation gets its own facade and reserved transaction connection.
  // A cached pool is shared; a transaction must never be shared between requests.
  let transaction: postgres.ReservedSql | undefined;
  async function query(text: string, args: Parameter[]) {
    return Array.from(await (transaction ?? pool).unsafe(postgresQuery(text), args)) as Row[];
  }
  return {
    prepare(text: string) {
      return {
        async all(...args: Parameter[]) { return query(text, args); },
        async get(...args: Parameter[]) { return (await query(text, args))[0]; },
        async run(...args: Parameter[]) { await query(text, args); },
      };
    },
    async exec(text: string) {
      if (text === "BEGIN IMMEDIATE") {
        transaction = await pool.reserve();
        try {
          await transaction.unsafe("BEGIN");
          await transaction`SELECT pg_advisory_xact_lock(73612102)`;
        } catch (error) { transaction.release(); transaction = undefined; throw error; }
      } else if (text === "COMMIT" || text === "ROLLBACK") {
        if (!transaction) return;
        try { await transaction.unsafe(text); }
        finally { transaction.release(); transaction = undefined; }
      } else { await (transaction ?? pool).unsafe(text); }
    },
    async close() { await pool.end({timeout:5}); globals.gfbPostgres?.delete(url); },
  };
}
