# GFB Gestão — plano de implementação

**Goal:** entregar protótipo navegável em /gestao com a estrutura aprovada e paleta preta/amarela, utilizável em desktop e celular.

**Architecture:** rotas Next.js isoladas sob layout próprio; provider de estado demonstrativo com persistência local versionada. Domínio separado da UI; funções centrais de chamada, financeiro e publicação verificadas por testes. Nenhuma operação externa, autenticação ou dado real nesta etapa.

**Tech Stack:** Next.js existente, React, TypeScript, CSS Modules, Saans local, Vitest e navegador Chromium para validação.

## Trabalho

- [x] Instalar dependências do lock e ler documentação local Next antes de código.
- [x] Criar modelos e base demonstrativa de cinco turmas nos horários reais, alunos, cobranças, aulas, conteúdos, eventos e tarefas.
- [x] Criar layout isolado preto/amarelo com menu lateral, busca contextual, avisos de protótipo e navegação mobile.
- [x] Implementar visão geral e agenda com ações que abrem as turmas e acompanhamentos.
- [x] Implementar turmas, chamada reversível, justificativas e observações por aluno, registro de aula e publicação de materiais.
- [x] Implementar alunos com busca/filtro, ficha, acesso demonstrativo e acompanhamento humano registrado sem disparar mensagens.
- [x] Implementar financeiro com valores de R$39 + R$40 associados ao primeiro mês, filtros e simulação explícita de confirmação.
- [x] Implementar eventos/exames com inscrição, pagamento e presença separados; conteúdos, comunicados e equipe com regras pendentes explícitas.
- [x] Verificar testes de domínio e fluxos, lint e build; capturar desktop/mobile e corrigir problemas em uma rodada.
- [x] Revisão independente de interface e documentação final do design. Abrir /gestao no painel do usuário.

## Limites e aceitação

As prévias aprovam composição, não seus dados artificiais. Não regenerar imagens; adaptar a paleta em código. Sem marrom, creme ou dourado; foco neutro. Sem política inventada de monitoria ou bloqueios financeiros automáticos. Salvar rascunho não publica observações internas. Botões de simulação são explicitamente identificados e não afirmam operações externas. A plataforma educacional completa é uma próxima entrega; a prévia do aluno aqui mostra apenas o conteúdo publicado, sem notas internas.
