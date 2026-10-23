# Auditoria mobile da gestão — 23/10/2026

## Escopo e evidência

Revisão dos componentes usados pelas rotas abaixo e primeira rodada de correções, preservando tema, dados e fluxos. Base de largura: 320 px; composição compacta abaixo de 380 px; adaptação de listas abaixo de 768 px; desktop preserva tabelas.

Esta é uma auditoria de código, não uma homologação visual. O navegador está desativado nas configurações do Work. Não foram produzidas capturas nem medidos overflow, contraste ou comportamento do teclado em dispositivo real. Ausência de problema na leitura do código não significa que uma página esteja aprovada visualmente.

## Revisão por página

| Página / fluxo | Achado no código | Ajuste desta rodada / próximo passo |
| --- | --- | --- |
| `/gestao` | Visão geral já tem avisos empilhados e métricas compactas da rodada anterior. | Preservado; conferir densidade e respiro acima do dock em 320/360/430 px. |
| `/gestao/turmas` | Filtros e seletores compartilhados mantinham larguras mínimas; títulos extensos podiam pressionar ações. | Filtros em grid flexível, busca em largura inteira, seletores sem mínimo de desktop e ações com quebra. |
| `/gestao/turmas/:id` — chamada | Barra de salvar com posicionamento sticky e margens negativas disputava espaço com navegação inferior. | Barra no fluxo, sem margens negativas no celular, ações em largura inteira. Conferir chamada longa e teclado aberto. |
| `/gestao/turmas/:id` — aulas | Formulário, tabs e publicação usam componentes compartilhados suscetíveis à largura mínima. | Campos limitados à largura disponível, tabs com rolagem local e salvamento no fluxo. Conferir seletor de data. |
| `/gestao/alunos` | Tabela com largura mínima exigia rolagem lateral para informações e ação. | Registros em cards com rótulos no celular; todos os campos preservados e ação visível “Abrir ficha”. |
| `/gestao/alunos/:id` | Título, histórico, dados e ações compartilham grupos flex; textos extensos e campos exigem contenção. | Proteção contra expansão por texto, ações com quebra e formulários com tamanho de fonte de 16 px no celular. Conferir histórico aberto e cadastro extenso. |
| `/gestao/financeiro` | Tabela larga, filtros com mínimo e botões extensos. | Cobranças em cards no celular, filtros flexíveis e ações contidas. Gráficos e sua legibilidade precisam de inspeção visual. |
| `/gestao/repasses` | Tabela larga; regra de professor e revisão de totais tinham vários itens na mesma linha. | Cards para registros, regra em duas colunas com valor/ação abaixo do nome, revisão com quebra. Conferir nomes e valores grandes. |
| `/gestao/eventos` | Cards usam grade responsiva existente. | Proteções compartilhadas de título/ações; conferir conteúdo longo e estado vazio. |
| `/gestao/eventos/:id` | Pagamento e entrada ficavam em colunas distantes da identificação. | Participantes em cards; informações e ações mantidas no mesmo registro. Teste confirma bloqueio de entrada antes do pagamento e liberação após recebimento. |
| `/gestao/conteudos` | Miniatura, texto, status e ação dependiam de flex com quebra; tags e seletores compactos. | Miniatura/texto em grade, ação em largura inteira, tags com maior altura, filtros flexíveis. Calendário com menos espaço entre dias e hora sem largura mínima. |
| `/gestao/comunicados` | Linhas e rodapés com textos variáveis dependem de quebra; composição já passa para uma coluna. | Contenção de texto e ações compartilhadas; conferir anexos e avisos longos. |
| `/gestao/equipe` | Avatar, nome, status e ação dependiam de flex e margens manuais. | Grade com nome ao lado do avatar; status abaixo e ação em largura inteira. Modal de privilégios recebe contenção compartilhada. |
| `/gestao/configuracoes` | Navegação horizontal e linhas de configuração precisavam suportar textos extensos. | Itens de navegação com altura mínima de toque, contenção do texto e ações com quebra. Conferir switches e abas extensas. |
| `/gestao/login` | Breakpoint de 760 px divergia do restante da gestão e conservava composição desktop entre 761–767 px. | Unificado em 768 px; rodapé com quebra e ajuda/mostrar senha com alvo mínimo de 44 px. |
| Busca global, Mais, notificações e diálogos | Superfícies fixas exigem verificação com viewport baixo e teclado; diálogos tinham risco de conteúdo lateral. | Diálogos limitados a altura dinâmica, corpo com padding compacto, rodapé com quebra; toast afastado do dock. Vidro e animações existentes preservados. |

## Regras aplicadas

- Listas de dados mantêm uma única fonte de renderização. No celular, o CSS organiza linhas em cards; no desktop, continuam tabelas.
- Cabeçalhos permanecem acessíveis, com `scope` e papéis explícitos para preservar a estrutura da tabela quando o CSS muda o display. Células recebem rótulos visuais.
- Botões principais/secundários podem quebrar texto. Seletores e grupos de ações não impõem largura de desktop.
- Campos de formulário usam 16 px no mobile; isso reduz o risco de zoom automático ao focar no iOS, ainda pendente de teste no aparelho.
- Ações de salvar ficam no fluxo em telas pequenas, sem competir com o dock.
- Alvos compartilhados de ícones e opções têm mínimo de 44 px. Dias do calendário usam 36 px de altura para caber em sete colunas estreitas; ainda requer teste de precisão de toque.

## Validação e pendências

- 117 testes passaram, incluindo regressões de filtro/ficha de aluno e pagamento/entrada no card de participante.
- ESLint passou.
- Build de produção e verificação TypeScript concluídos sem erros.
- Próxima inspeção visual: 320, 360, 390, 430, 623, 767, 768 e 1024 px; retrato/paisagem e altura reduzida.
- Em cada rota: procurar scroll horizontal da página, ações cortadas, texto longo, filtros abertos, modal com teclado, estado vazio e navegação para voltar.
- Conferir foco e leitura da tabela com VoiceOver/TalkBack; testes DOM não substituem essa avaliação.
- Conferir contraste do dock/menus em fundos claros, coloridos e durante rolagem, sem alterar a direção preta/amarela aprovada.

## Revisão dos comentários visuais — dashboard e Mais

- Acompanhamentos: a tabela interna da visão geral continuava com regras de largura e grid concorrentes. O botão se comprimía e herdava quebra de palavra. Foi substituída por artigos com identificação, turma, motivo e ação própria; ação sem quebra entre letras e uma coluna nas telas menores que 380 px.
- Seções: cabeçalhos da rotina, pendências, semana e turmas usam ícones e faixas neutras/levemente tingidas na paleta existente, com bordas e espaço entre blocos. Não foi alterado o tema.
- Agenda: seletor com `simple-liquid-glass`, três destinos de largura igual e a mesma lente de ativação/GSAP do dock. Hover não muda o período; teclado e clique ativam imediatamente o estado. A lente não tem um segundo filtro refrativo.
- Registrar presenças: superfície dourada com `simple-liquid-glass`, tamanho pelo texto e altura mínima de toque de 44 px.
- Dashboard usa `LiquidGlassScene` para fornecer o fundo às superfícies locais, com exclusão automática do vidro nas capturas; navbar conserva seu fundo explícito existente.
- Mais: animação única por GSAP, entrada de 260 ms e saída de 180 ms, translação e opacidade, sem escala da superfície refrativa. Mantém material até concluir a saída e pode reverter durante a transição. Redução de movimento remove deslocamento.
- Mais: quatro cards iniciais em duas colunas, ações adicionais em “Ver mais” e retorno em “Ver menos”. Permissões continuam filtrando destinos; rota ativa entre destinos adicionais abre a grade expandida.
- A nova rodada tem testes de regressão para acompanhamento, período, interrupção de saída e expansão do menu. O motor óptico é simulado nos testes DOM; aparência, refração e desempenho precisam de inspeção no navegador/dispositivo.
- Validação após esta revisão: 121 testes aprovados, ESLint e build de produção/TypeScript sem erros. Inspeção visual ainda pendente por acesso ao navegador desativado.


### Atualização: menu completo com ícones glossy

Por solicitação posterior, todos os cards autorizados aparecem desde a abertura. Removidos cabeçalho, botão de fechar interno e Ver mais/Ver menos. O painel continua fechando pelo botão Mais, pelo toque externo, por Escape ou pela seleção de destino. Categorias usam sete imagens transparentes geradas com estética 3D glossy dourada, em WebP 128 × 128 e exibição de 26 × 26 px. Origem preservada em `public/brand/gestao/menu-3d/provenance.json`. Inspeção da folha de assets confirmou transparência e leitura em 26 px; a página no navegador segue sem validação visual por acesso desativado no Work.
