# Repasses aos professores

Data: 22/10/2026. Estado: implementado e validado localmente.

## Atualização aprovada — regras configuráveis

O usuário confirmou que os valores ainda não foram definidos. A tela permite a Tailan configurar **valor fixo por competência** ou **valor por turma** para cada professor, sem valores iniciais. A regra por turma tem um valor unitário e as turmas selecionadas entre as atribuídas ao professor. O valor fixo independe de quantidade de turmas. Não criar fórmulas livres ou percentuais sobre receitas de demonstração.

O fluxo é configurar, revisar a apuração e gerar pendências; gerar não significa pagar. A revisão mostra professor, regra, turmas consideradas e total. Regras e atribuições são revalidadas no servidor antes da geração; se mudarem desde a revisão, a operação pede uma nova conferência. Cada lançamento preserva a memória de cálculo e o nome do professor naquele momento. Alterar a regra futura não recalcula lançamentos existentes.

No máximo um lançamento não cancelado por professor/competência, inclusive entre geração e lançamento manual, para evitar pagamento duplicado. A geração indica professores já lançados; cancelamento com motivo permite criar um lançamento corrigido e preserva o anterior. Reenvios usam chave de idempotência. Permitir desativar regra sem apagar histórico. Professores inativos não recebem novas apurações.

Enquanto os valores não forem definidos, a regra fica “Não configurada”, sem R$ 0,00 apresentado como remuneração. O período usa o mês atual em America/Bahia. Registro manual de valor fixo continua disponível como alternativa por competência. Percentual e valor por aula permanecem fora da primeira versão.

## Objetivo e nome

Permitir que Tailan organize os valores devidos aos professores, confira o período e registre os pagamentos realizados. No menu, usar **Repasses**, depois de Financeiro; no cabeçalho, **Repasses aos professores**. Descrição: “Organize os valores e acompanhe os pagamentos da equipe.”

“Repasses” abrange comissões, valores fixos e pagamentos por aula sem presumir uma relação comercial específica. A página controla o registro do pagamento feito fora da plataforma. Não inicia Pix nem transferência bancária.

## Decisões e alternativas

1. **Regras fixas ou por turma, com alternativa manual — implementado.** Tailan configura o valor e as turmas de cada professor, revisa o cálculo e gera os lançamentos. Também pode informar um valor fixo específico para a competência, sem mudar a regra futura.
2. **Percentual dos recebimentos.** Exige definir base elegível, vínculo receita/turma/professor, divisão de aulas em dupla, estornos e período de competência. Ainda não há essas regras no projeto.
3. **Valor por aula.** Exige definir valor por professor, aulas efetivamente realizadas, substituições e cancelamentos. Uma chamada salva, por si só, não define o pagamento contratual.

A opção 1 foi escolhida a partir da orientação do usuário. As opções 2 e 3 são possibilidades futuras, não regras ativas. Não gerar valores fictícios nem presumir divisão igual entre professores.

## Acesso exclusivo do gestor

- Identificar Tailan pelo ID persistente da conta existente, `tailan`, e exigir conta ativa com perfil Administrador. Não usar o nome exibido, que é editável, nem apenas o privilégio Financeiro.
- Uma função compartilhada, `canManagePayouts`, controla rota, menu, busca, atalhos e API.
- Professores, monitores e outros administradores não veem o item em desktop, menu recolhido, menu mobile ou resultados de busca.
- Acesso direto por URL retorna a tela de acesso restrito já utilizada pela gestão; nenhum dado de repasse é carregado para esse usuário.
- A API verifica a sessão em todas as leituras e gravações e responde 401/403 conforme o caso. O bloqueio não depende de esconder elementos no React.
- A regra é exclusiva e não pode ser concedida a outro usuário pelo formulário de privilégios da equipe.

## Estrutura da tela

Usar o shell persistente, notch, espaço de conteúdo, tipografia, cores e componentes da [brandline](brandline.md). Sem criar uma segunda navegação ou um painel visualmente independente.

### Cabeçalho

Título “Repasses aos professores”; descrição objetiva. Ação primária amarela sólida **Novo repasse** e ação secundária **Exportar período**. A exportação usa os filtros atuais e não inclui dados bancários.

### Resumo da competência

Seletor de mês/ano com rótulo “Competência”. Inicialmente o mês corrente no fuso America/Bahia, sem usar a data fixa do cenário de demonstração.

Três cards: **A repassar** (pendentes), **Repassado** (pagos) e **Total do período** (pendentes + pagos). Valores calculados em centavos inteiros; lançamentos cancelados não compõem totais. Verde para realizado, amarelo moderado para pendência e verde profundo para total, reutilizando os cards financeiros.

### Regras de cálculo

A aba “Regras de cálculo” lista os professores ativos da equipe. Cada linha mostra atribuições, regra configurada ou “Não configurada” e a ação Definir/Editar regra. Um modal permite escolher valor fixo ou por turma, valor unitário, turmas elegíveis e regra ativa/pausada. A prévia calcula o total antes de salvar. Toda alteração usa versão para impedir sobrescrever uma edição concorrente.

A aba “Repasses do período” reúne a conferência de regras elegíveis e os lançamentos. “Conferir apuração” considera apenas regras ativas, válidas e sem lançamento ativo no período. A confirmação gera o lote em uma transação: se uma regra mudar, nenhum item do lote é gravado.

### Lista

Uma superfície branca contém busca por professor/descrição, filtro de professor e situação. Situações: Todos, A repassar, Repassados, Cancelados.

Colunas: Professor, Descrição, Competência, Valor, Situação e ação **Ver repasse**. A identificação do professor usa a equipe de acessos existente; não manter uma lista paralela de nomes no código. A conta de Tailan também pode ser beneficiária por atuar como professor, se ele a selecionar explicitamente.

Nome do professor e descrição têm prioridade em larguras menores. A tabela tem rolagem interna no celular; busca e filtros ocupam a largura disponível, sem overflow da página. Mostrar a quantidade de resultados e estado vazio próprio para período sem lançamentos ou filtros sem correspondências.

## Fluxos

### Novo repasse

Abrir o modal acessível já utilizado no projeto. Campos: professor ativo (perfil Professor ou Administrador), competência, descrição do serviço/aulas e valor em reais. Sem inferir relação com receita. Ação **Criar repasse** cria registro pendente; o botão permanece desabilitado durante o envio. Manter os dados preenchidos quando ocorrer erro.

Valor obrigatório maior que zero, máximo de R$ 999.999,99, convertido sem erro de ponto flutuante para centavos. Competência validada como mês real; descrição com até 160 caracteres. ID e datas vêm do servidor. Não aceitar status arbitrário enviado pelo formulário.

### Conferir e registrar pagamento

**Ver repasse** abre os detalhes: professor, descrição, competência, valor, criação e histórico. Em pendentes, ação **Registrar pagamento** exige data do pagamento, forma (Pix, transferência, dinheiro ou outro) e referência opcional de até 120 caracteres. Apresentar resumo antes da confirmação.

Após confirmar, registrar situação paga, data informada, horário do registro e ID do gestor. O servidor impede uma segunda confirmação, mesmo em cliques simultâneos ou requisições repetidas. A mensagem é “Pagamento registrado”; não dizer “transferência realizada”. O valor do lançamento pago é preservado.

### Correções

Lançamentos pendentes podem ser cancelados com motivo obrigatório e permanecem no histórico. Não oferecer exclusão definitiva. Não editar silenciosamente um registro pago: a primeira versão mostra seus detalhes e histórico. Estorno/reabertura de pagamento exige uma decisão operacional separada, ainda fora do escopo aprovado.

### Falhas e estados

Carregamento no grid existente; erro com mensagem e **Tentar novamente**; submissão com indicação de andamento; sessão expirada encaminha ao login. Não substituir erro de rede por lista vazia ou confirmar uma operação apenas no estado local.

## Dados e persistência

A escola já tem autenticação persistida em SQLite no servidor; dados pedagógicos e recebimentos do protótipo ainda usam o navegador. Repasses são privados: não gravar valores, histórico ou beneficiários em localStorage nem incluir em DemoState.

Usar o armazenamento configurado no servidor, com tabelas próprias e migração idempotente. Reutilizar a configuração de infraestrutura existente e sua indisponibilidade explícita em produção quando o armazenamento não estiver configurado.

Registro: ID, professor ID, nome no momento do lançamento, competência, descrição, turmas do cálculo quando aplicável, valor em centavos, situação, criado por/em, pago por/em, data do pagamento, forma e referência, cancelado por/em e motivo. Guardar nome histórico evita que renomear/desativar o professor altere um comprovante antigo.

Eventos de auditoria: criação, confirmação e cancelamento, com ator e horário do servidor. Transação para atualizar situação e inserir evento juntos. Chave de idempotência para a criação evita duplicação ao reenviar depois de uma resposta perdida. Mudanças de estado validam a situação atual dentro da transação.

Uma rota privada `/api/gestao/repasses` fornece leitura e criação; confirmação/cancelamento usam operações explícitas por ID. Retornar `Cache-Control: no-store`, validar origem das gravações, tamanho do corpo, tipos e limites, seguindo os helpers de autenticação existentes.

## Movimento e interação

O item Repasses participa do mesmo notch e cópia de ícone selecionada. Escolher ícone distinto de Financeiro, associado a envio/distribuição; tom verde discreto apenas na seleção, gesto curto de confirmação e brilho espaçado segundo a brandline.

A tela entra pelo mecanismo existente de conteúdo: resumo, filtros e lista acompanham os demais componentes. Mudanças de filtro preservam a identidade dos lançamentos e reutilizam a lógica de reorganização de listas, com 380 ms e `sine.inOut`. Respeitar movimento reduzido, teclado e interrupções rápidas. Nenhuma animação bloqueia ações nem sugere que uma transferência bancária ocorreu.

## Verificação de aceite

- Tailan vê e abre a área. Professor, monitor e outro administrador não veem o menu/busca e não leem nem alteram dados pela API ou URL direta.
- Criar, atualizar estado e recarregar preserva dados no servidor; dados não vazam entre sessões nem para armazenamento público do navegador.
- Todos os totais fecham em centavos por competência e situação; cancelados não contam.
- Cliques/requisições repetidas não duplicam lançamentos nem pagamentos. Falhas de gravação não exibem sucesso.
- Histórico preserva valor, beneficiário original, ator e horário; cancelamento não apaga registro.
- Filtros, exportação, estados vazios, loading, erros, mobile, teclado, foco e movimento reduzido são verificados no navegador.
- Navegar de/para Repasses com menu aberto/recolhido mantém a continuidade do notch e do conteúdo.

## Pontos a confirmar antes do cálculo automático

Os valores reais ainda serão definidos pelo gestor na própria tela. A primeira versão já calcula valor fixo por competência ou valor unitário por turma selecionada, conforme a regra salva. Percentual sobre receitas, valor por aula, divisão automática em duplas, rateio por dias e estorno de pagamento confirmado dependem de regras futuras e não são presumidos.

## Implementação e validação

Rota `/gestao/repasses`; API privada `/api/gestao/repasses`. `domain/payouts.ts` concentra valores, competências, cálculo e revisão; `auth/server/payouts.ts` concentra transações, autorização e auditoria; `PayoutsView.tsx` integra os componentes existentes. As tabelas `payout_rules`, `teacher_payouts`, `payout_events` e `payout_requests` são criadas idempotentemente no banco configurado pela autenticação.

Verificações: testes de domínio para autorização exclusiva, moeda, competência, turma removida e revisão obsoleta; integração com banco temporário para duplicação, transação, cancelamento e histórico; navegador com regras por turma, geração revisada, pagamento, persistência após reload, exportação, bloqueio de outro admin/professor, origem de gravações e viewport mobile. Dados de verificação são isolados/removidos, sem criar remuneração para professores reais.
