# Grupo Forró do Bom

Site público e plataforma de gestão da escola em uma única aplicação Next.js e um único repositório.

| Área | Rota | Código |
| --- | --- | --- |
| Site público e campanhas | `/` | `src/modules/site/` |
| Gestão da escola | `/gestao` | `src/modules/management/` |
| Páginas legais | `/politica-de-privacidade`, `/termos-de-uso` | `src/app/(site)/` |
| Área do aluno | Planejada | Ainda não implementada |

## Executar

```powershell
git clone https://github.com/acssjr/grupo-forro-do-bom.git
cd grupo-forro-do-bom
npm ci
Copy-Item .env.example .env.local
npm run dev -- --port 3001
```

Use Node.js compatível com o Next.js instalado. O servidor local desta sessão usa http://localhost:3001 . Variáveis e instruções comerciais estão em [docs/site/campaign-overview.md](docs/site/campaign-overview.md).

## Organização

```text
src/
  app/                         rotas, layouts, estilos globais e metadata
    (site)/                    página pública e páginas legais (não altera URLs)
    gestao/                    entrada da gestão, layout e loading
  modules/
    site/
      components/landing/      seções e interações do site
      components/legal/        apresentação das páginas legais
      content/                 textos, planos e perguntas frequentes
      config/                  catálogo visual do site
      lib/                     WhatsApp, UTMs e analytics de campanhas
    management/
      components/              telas e componentes da gestão
      domain/                  modelos, regras, dados iniciais e cálculos
  shared/ui/                   componentes visuais compartilháveis
  config/                      identidade e dados gerais do GFB
public/                        arquivos públicos; URLs preservadas
tests/
  site/                        verificações do site e conversão
  management/                  regras da gestão
  setup.ts                     configuração comum de testes
docs/
  architecture/                estrutura e limites entre módulos
  site/                        campanhas, tracking e relatórios do site
  management/                  decisões, pesquisa e limites da gestão
  superpowers/                 planos e registros anteriores
scripts/                       ferramentas de manutenção
```

## Verificar

```powershell
npm run lint
npm run test:management
npm run test:site
npm run build
```

A autenticação, os acessos da equipe, as sessões e os repasses são persistidos no servidor. Em produção, configure `GFB_DATABASE_URL` com PostgreSQL/Neon; em desenvolvimento, a ausência dessa variável usa SQLite local. Senhas usam scrypt com salt individual, e sessões usam tokens cujo hash é armazenado no banco. Consulte [banco e publicação](docs/management/database-deployment.md).

Os demais módulos (alunos, turmas, presenças e conteúdos) continuam como demonstração com dados no navegador. Não constituem ainda um cadastro compartilhado entre usuários e dispositivos.

Veja [arquitetura](docs/architecture/repository.md), [gestão](docs/management/gfb-gestao-prototipo.md), [campanhas](docs/site/CAMPAIGNS.md) e [tracking](docs/site/TRACKING.md).
