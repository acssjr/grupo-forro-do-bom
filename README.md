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

A gestão atual persiste dados no navegador; autenticação, permissões de servidor e integrações externas ainda precisam ser implementadas. A organização em módulos não substitui esses controles.

Veja [arquitetura](docs/architecture/repository.md), [gestão](docs/management/gfb-gestao-prototipo.md), [campanhas](docs/site/CAMPAIGNS.md) e [tracking](docs/site/TRACKING.md).
