/** Create the first admin only. Reads a password from stdin without printing it. */
import { bootstrapAdmin } from '../src/modules/management/auth/server/store.ts';
let password = '';
for await (const chunk of process.stdin) password += chunk;
try {
  await bootstrapAdmin(password.trimEnd());
  console.log('Administrador inicial criado. Login: admin. A senha não foi exibida nem gravada em texto puro.');
} catch (error) { console.error(error.message); process.exitCode = 1; }
