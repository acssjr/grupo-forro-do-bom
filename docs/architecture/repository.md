# Organização do repositório

## Decisão

Um repositório e uma aplicação para o Grupo Forró do Bom. Não há workspaces npm nem aplicações separadas nesta fase. O nome do pacote, do repositório GitHub e da pasta principal é `grupo-forro-do-bom`.

## Limites

- `src/app` contém a composição de rotas e os layouts do Next.js. O grupo `(site)` não muda URLs.
- `src/modules/site` concentra a apresentação pública, conteúdo comercial e funções de campanhas.
- `src/modules/management/components` contém a interface da gestão; `domain` contém seus modelos e cálculos.
- `src/shared/ui` recebe componentes reutilizáveis. Componentes exclusivos de uma área ficam dentro dela.
- `src/config/site.ts` mantém identidade, endereço e configurações gerais compartilhadas. Campanhas não devem duplicar esses dados na gestão.
- Imports de `@/` resolvem a partir de `src/`, tanto no TypeScript quanto no Vitest.
- Os módulos site e management não importam implementações um do outro. Compartilhamento futuro deve extrair código para `shared` ou um domínio comum bem definido.
- `public` permanece na raiz, com caminhos existentes preservados. Arquivos de fonte originais ficam em `src/app/fonts`; o script de subsets foi atualizado.
- A futura área do aluno poderá entrar em `src/modules/student` com suas próprias rotas. Não foi criada uma tela vazia nem um novo produto neste ajuste.

## Configuração e arquivos de trabalho

`package.json`, `package-lock.json`, `tsconfig.json`, configurações do Next/Vitest/ESLint e `.env*` permanecem na raiz. A associação Vercel já existente foi preservada; renomear o repositório não renomeia nem republica o projeto Vercel.

`.agents`, `.impeccable`, `.superpowers`, `output`, `outputs` e materiais originais de identidade são registros/ferramentas de trabalho preservados. Não fazem parte de `src`. Planos históricos podem registrar caminhos antigos; para desenvolvimento atual, use este documento.

## Continuidade

Rotas públicas, navegação, chaves de localStorage/IndexedDB e URLs dos assets permanecem iguais. O histórico Git e as mudanças locais anteriores foram mantidos. Esta reorganização não faz commit, push nem deploy.


## Caminho local desta sessão

Pasta principal: `C:/Users/antonio.santos/Documents/grupo-forro-do-bom`.

A pasta anterior `gfb_landing` permanece como conjunto de links de compatibilidade (junctions para diretórios e hard links para arquivos da raiz), pois o processo do Codex mantém a pasta anterior aberta. Os diretórios de código, Git e dependências apontam para a nova pasta; não há segunda cópia do código. Abra novos editores e terminais no caminho principal. As associações do aplicativo Codex e do Vercel não foram alteradas por edição de configurações internas.
