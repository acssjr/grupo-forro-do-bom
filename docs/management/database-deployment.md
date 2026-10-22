# Banco de dados e publicação da gestão

## Ambiente

- Repositório: acssjr/grupo-forro-do-bom, branch main.
- Hospedagem: projeto Vercel gfb_lp-main, runtime Node.js 24.
- Banco: projeto Neon grupo-forro-do-bom (aged-hall-54743645), região AWS us-east-1, banco gfb_management.
- Credencial somente na variável secreta GFB_DATABASE_URL de produção da Vercel. Nunca usar prefixo NEXT_PUBLIC_, incluir URI no Git ou expor a configuração no cliente.
- SQLite em .data/ continua disponível para desenvolvimento sem GFB_DATABASE_URL. Produção falha de forma fechada se a conexão persistente não estiver configurada; /tmp não é um banco persistente.

## Dados persistidos

Usuários, logins, hashes de senha, permissões, atribuições de turmas, sessões, tentativas de login, auditoria de acessos, regras e lançamentos de repasses. O banco não recebe senhas em texto puro: scrypt com salt aleatório individual. Cookies de produção usam HttpOnly, Secure e SameSite=Lax. O banco guarda o hash do token de sessão, com prazo de expiração.

O restante da gestão continua demonstrativo: alunos, presenças, calendário e conteúdos não passaram para o banco nesta entrega. Dados desses módulos no navegador não são compartilhados automaticamente entre dispositivos.

## Conexão e transações

A camada database.ts oferece operações assíncronas para SQLite local e PostgreSQL remoto. Cada requisição recebe uma fachada própria; o pool de conexões é reaproveitado, mas a conexão reservada de uma transação não é compartilhada. Advisory locks de transação serializam alterações de acesso e repasses; índices únicos impedem duplicação por professor e competência. Leituras dentro de uma transação usam sua conexão reservada. As tabelas são inicializadas idempotentemente sob lock. TLS verifica o certificado do servidor.

## Migração inicial

Com GFB_DATABASE_URL apontando ao banco vazio e Node.js 24 disponível:

```powershell
node --experimental-strip-types scripts/migrate-management.mjs
```

A ferramenta cria um backup SQLite consistente em .data/backups/, exige destino vazio, copia usuários com seus hashes e os dados de repasses/auditoria em uma única transação. Não substitui acessos já existentes e não copia sessões ou limites de tentativas locais. A importação inicial preservou os cinco usuários locais. Entrar online usa o mesmo login e senha já configurados no localhost.

Para criar o primeiro administrador de um banco vazio, usar scripts/create-admin.mjs com a senha via stdin. O comando recusa bancos com credenciais existentes. Não incluir a senha em argumentos de shell ou no histórico.

## Verificação

```powershell
npm run lint
npm test
npm run build
```

A suíte de persistência também pode executar contra o banco isolado gfb_verification, informando GFB_TEST_DATABASE_URL e timeout de rede:

```powershell
npx vitest run tests/management/management-payout-store.test.ts --testTimeout 30000 --hookTimeout 30000
```

A suíte exige esse nome de banco antes de limpar dados. Nunca apontar testes ao banco de produção. Há verificações de acesso exclusivo de Tailan, hashes/login, revogação de sessão, redefinição de senha, preservação do cálculo, rollback e geração concorrente sem duplicar repasses.

## Publicação e segredos

Commit e push da branch main, seguido de deploy de produção no projeto já vinculado da Vercel. Verificar a página pública, login, cookie, sessão, logout, acesso não autenticado e bloqueio de professores em Repasses na URL publicada. O teste online usa um acesso temporário e o remove ao final. Bancos locais, backups, arquivos de ambiente e evidências privadas são excluídos do upload e do rastreamento das funções. A conta Neon/Vercel e seus limites de uso permanecem sob controle do proprietário.

Referências: [Postgres.js](https://github.com/porsager/postgres), [Neon CLI](https://neon.com/docs/cli/projects), [variáveis da Vercel](https://vercel.com/docs/cli/env).
