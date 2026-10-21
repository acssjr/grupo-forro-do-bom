---
name: landing-page-pipeline
description: Use when creating, rebuilding, or substantially refining a conversion-focused landing page in Next.js, from essential briefing through local visual validation.
---

# Landing Page Pipeline

Conduza a landing page como uma pipeline modular. Não trate este material como template visual: preserve a identidade, a oferta e as provas reais de cada projeto.

## Fluxo obrigatório

1. Leia `references/dependencias.md`. Confira o catálogo de skills disponível no contexto e execute `node scripts/check-dependencies.mjs --json`. Resolva as dependências antes de iniciar seus gates.
2. Se faltar uma skill com origem pública registrada, use `skill-installer` quando disponível para verificar a origem e instalar; caso contrário, use o comando indicado pelo preflight. Reexecute a checagem depois. Nunca invente uma origem para skills privadas ou não registradas.
3. Audite o projeto, as instruções locais, o conteúdo, os ativos, os testes, o estado do Git e o deploy existente. Preserve trabalho e prova já existentes.
4. Leia `references/briefing-essencial.md`. Pergunte apenas lacunas que alterem conteúdo, arquitetura ou implementação. Paleta é obrigatória e tipografia sempre deve ser perguntada.
5. Leia `references/arquitetura-e-copy.md`.
6. **Gate obrigatório de estratégia:** carregue `revenue-centric-design` antes de definir a arquitetura, a ordem das provas, a seção comercial ou a distribuição dos CTAs.
7. **Gate obrigatório de copy:** carregue `schwartz-copy` antes de escrever qualquer texto persuasivo. Faça o diagnóstico de *Breakthrough Advertising* e somente então redija. Finalize com `no-ai-slop` quando disponível.
8. Apresente um plano curto com estratégia, arquitetura e direção visual. Implemente depois que a direção estiver aprovada.
9. Leia `references/interface-mobile-first.md` e construa primeiro a experiência móvel com `mobile-first-design` e `vercel-react-best-practices`.
10. Leia `references/movimento-e-componentes.md`. Use `find-animation-opportunities` antes de `animate`; implemente somente movimentos com função clara.
11. Leia `references/midia-fontes-e-performance.md`. Otimize SVGs, imagens e fontes antes do uso final e registre medidas antes/depois.
12. Leia `references/testes-e-entrega.md`. Teste comportamento, geometria responsiva, acessibilidade e performance contra a build de produção.
13. Sirva a build de produção em localhost para validação visual.
14. Pare. Commit, push e deploy exigem validação visual e um pedido explícito posterior do usuário.

Se um gate obrigatório não estiver disponível, explique o impedimento. Não alegue ter aplicado seus princípios nem produza a etapa dependente como se o gate tivesse sido executado.

## Roteamento progressivo

- Disponibilidade, origem e instalação de skills: `references/dependencias.md`.
- Briefing novo ou incompleto: `references/briefing-essencial.md`.
- Arquitetura, copy, oferta e CTAs: `references/arquitetura-e-copy.md`.
- Layout e comportamento responsivo: `references/interface-mobile-first.md`.
- Carrosséis, CTA persistente e animações: `references/movimento-e-componentes.md`.
- SVGs, imagens, fontes e Core Web Vitals: `references/midia-fontes-e-performance.md`.
- Testes, localhost e autorização de entrega: `references/testes-e-entrega.md`.

Abra apenas os módulos necessários à etapa atual, mas leia cada arquivo selecionado por completo.

## Invariantes

- Use provisoriamente o WhatsApp `75981234176`, centralizado em configuração editável.
- Dê a cada CTA uma mensagem pré-preenchida própria, coerente com sua posição e intenção.
- Não invente preços, credenciais, endereços, horários, garantias, prazos, escassez ou resultados quantitativos.
- Não insira rótulos como “foto ilustrativa”, “depoimento ilustrativo” ou equivalentes na interface, no código ou no fluxo de entrega.
- Não comece o design visual sem a paleta de cores fornecida.
- Se não houver fonte definida ou arquivo utilizável, use Plus Jakarta Sans. Use Saans somente quando escolhida e fornecida.
- Não trate um aparelho específico como solução responsiva; converta o problema em contrato geométrico e teste por faixas de viewport.
- Não alegue ter usado uma skill ausente, não instale de repositório homônimo não verificado e não substitua silenciosamente um gate obrigatório.
- Não publique nem altere o remoto antes da autorização definida no fluxo.

## Evidência de conclusão

Entregue a URL local, o que foi implementado, resultados de lint/tipos/testes/build, acessibilidade, mediana de três execuções Lighthouse mobile, pesos relevantes antes/depois, exceções e pendências. Não declare sucesso sem evidência recente.
