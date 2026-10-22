/** One-time SQLite → PostgreSQL import. Never copies plaintext passwords or sessions. */
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { database } from "../src/modules/management/auth/server/database.ts";

if (!process.env.GFB_DATABASE_URL) throw new Error("Set GFB_DATABASE_URL before importing.");
const source = resolve(process.argv[2] || ".data/management-auth.sqlite");
const sqlite = new DatabaseSync(source, {readOnly:true});
const target = await database();
const tables = ["users", "access_audit", "payout_rules", "teacher_payouts", "payout_events", "payout_requests"];
const quote = value => `"${value.replaceAll('"','""')}"`;
try {
  mkdirSync(".data/backups", {recursive:true});
  const backup = resolve(`.data/backups/management-before-cloud-${Date.now()}.sqlite`);
  sqlite.prepare("VACUUM INTO ?").run(backup);
  await target.exec("BEGIN IMMEDIATE");
  try {
    for (const table of tables) {
      const existing = await target.prepare(`SELECT count(*) AS n FROM ${quote(table)}`).get();
      if (Number(existing.n) !== 0)
        throw new Error("Target must be empty. Existing accounts and payouts will not be overwritten.");
    }
    const counts = {};
    for (const table of tables) {
      const exists = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(table);
      const rows = exists ? sqlite.prepare(`SELECT * FROM ${quote(table)}`).all() : [];
      counts[table] = rows.length;
      for (const row of rows) {
        const columns = Object.keys(row);
        await target.prepare(`INSERT INTO ${quote(table)} (${columns.map(quote).join(",")}) VALUES (${columns.map(()=>"?").join(",")})`).run(...Object.values(row));
      }
    }
    await target.exec("COMMIT");
    console.log(JSON.stringify({imported:counts,localBackup:backup,sessionsCopied:0}));
  } catch (error) { await target.exec("ROLLBACK"); throw error; }
} finally { sqlite.close(); await target.close(); }
