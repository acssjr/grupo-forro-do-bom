---
name: GFB Gestão
description: Sistema visual observado no protótipo de gestão do Grupo Forró do Bom.
colors:
  black: "#101010"
  yellow: "#f6c300"
  yellow-hover: "#e5b600"
  white: "#ffffff"
  muted: "#505058"
  line: "#dedfe3"
  surface: "#f1f2f4"
  rail: "transparent"
  focus: "#68686e"
  status-yellow-bg: "#fff5c7"
  status-yellow-text: "#594600"
  status-green-bg: "#eef6ef"
  status-green-text: "#296436"
  status-red-bg: "#fff0ef"
  status-red-text: "#a32a24"
typography:
  headline:
    fontFamily: '"GFB Makking", "Arial", "Arial Nova", Arial, Helvetica, sans-serif'
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: "-0.035em"
  title:
    fontFamily: '"GFB Makking", "Arial", "Arial Nova", Arial, Helvetica, sans-serif'
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.025em"
  body:
    fontFamily: '"GFB Makking", "Arial", "Arial Nova", Arial, Helvetica, sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: '"GFB Makking", "Arial", "Arial Nova", Arial, Helvetica, sans-serif'
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.35
rounded:
  badge: "5px"
  secondary: "7px"
  control: "8px"
  navigation: "9px"
  panel: "14px"
  dialog: "14px"
spacing:
  compact: "8px"
  control-gap: "10px"
  mobile-gutter: "20px"
  panel: "22px"
  desktop-gutter: "32px"
components:
  button-primary:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.black}"
    rounded: "{rounded.control}"
    padding: "11px 17px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.yellow-hover}"
  panel:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.panel}"
    padding: "22px"
  navigation-active:
    backgroundColor: "{colors.black}"
    textColor: "{colors.white}"
    rounded: "{rounded.navigation}"
    padding: "11px 14px"
---

# Design System: GFB Gestão

## Overview

**Creative North Star: “A escola em movimento”** — expressão já presente na visão geral, usada aqui para descrever o sistema implementado.

Este documento se aplica à rota `/gestao` e suas telas. A sidebar preta (#101010) sustenta a navegação e se integra ao cabeçalho preto, com seleção cinza-escura (#303033), texto branco e ícone amarelo. A área de trabalho cinza (#f1f2f4) separa os painéis brancos. A logo caligráfica pequena, amarela e branca sobre fundo preto, usa `public/brand/gestao/gfb-original-amarelo-branco.png`; a interface operacional usa Makking.

O estado atual é um protótipo navegável com dados demonstrativos persistidos somente no navegador. A identidade apresentada não implica autenticação, controle de permissões seguro, banco compartilhado ou integrações reais. A persistência usa localStorage; PIX e WhatsApp não têm integração de backend nesta etapa. A landing pública mantém sua identidade anterior e está fora deste sistema visual.

**Key Characteristics:**

- Sidebar e cabeçalho pretos, seleção cinza-escura, painéis brancos e fundo cinza com canto superior esquerdo de 28px.
- Hierarquia por tipografia, espaço e divisórias discretas.
- Trabalho central e contexto lateral no desktop; chamada vertical no celular.
- Estados acompanhados de texto e ícones, além de cor.

## Colors

### Primary

- **Amarelo GFB (#F6C300):** ações prioritárias, ícone ativo, sublinhado de abas e assinatura da marca. A seleção do calendário usa preto; a navegação usa cinza-escuro.
- **Amarelo de hover:** resposta discreta das ações primárias.

### Neutral

- **Preto:** sidebar e cabeçalho, data selecionada, painel de publicação, card de alunos da visão geral e texto principal.
- **Branco:** painéis, campos e navegação inferior mobile.
- **Cinza de apoio:** fundo da área de trabalho (#f1f2f4), texto secundário e divisórias. O trilho contextual é transparente e agrupa painéis brancos independentes.
- **Cinza de foco:** indicação de teclado neutra.

Os badges usam amarelo para atenção, verde para confirmação e vermelho para pendência ou erro, sempre com rótulo. Essas cores semânticas não substituem a paleta da marca.

**The GFB Rule.** Gestão usa preto, amarelo, branco e cinzas de apoio; não introduzir marrom. Os aliases locais legados `--brown` e `--cream` resolvem para preto e branco. Não herdar a paleta quente da landing. Logos geométricas marrons ou creme existentes em outputs isolados não são identidade aprovada para a gestão.

## Typography

**Display Font / Body Font:** Makking variável local, registrada como `GFB Makking`, pesos de 25 a 900. Dois subconjuntos WOFF2 observados na prévia (letras e símbolos/números), com unicode-range real de cada arquivo, em `public/fonts/gestao/`. Fallback Arial para caracteres ausentes. A landing preserva Saans.

### Hierarchy

Os tokens do frontmatter são referências de base, não uma escala universal. O CSS efetivo contém muitos tamanhos específicos por componente.

- **Headline:** base (30px), títulos de página (32px) e (29px) no mobile; perfil do aluno possui variação própria.
- **Title:** títulos operacionais geralmente (20–22px), com exceções como títulos de turma (24px).
- **Body:** base (16px), (15px) no mobile; textos, ações e metadados têm mínimo de (14px). Navegação de (15px), ou (14px) no desktop compacto. Indicadores da visão geral usam (32px), com adaptações nos breakpoints.
- **Label:** ações e campos com tamanho local; sem caixa alta obrigatória. Campos editáveis passam a (16px) no mobile.
- Indicadores numéricos e valores financeiros usam números tabulares. Texto descritivo é curto e alinhado à esquerda.

## Layout

No desktop, sidebar fixa de (230px) e área de trabalho com deslocamento equivalente. Recolhida, ocupa (80px); a preferência é persistida no navegador. A barra superior mede (82px), na mesma superfície preta da sidebar. A área clara começa abaixo dela, com canto superior esquerdo de (28px) e moldura direita/inferior de (16px). A visão geral usa coluna principal flexível e contexto direito de (310px), com calendário, marcos e recebimentos em painéis independentes. O layout tem intervalo de (24px) e preenchimento de (27px 24px 30px).

Entre (768px) e (1300px), a sidebar passa a (212px), mantém (80px) recolhida, e o contexto mede (290px). Até (1180px), o contexto desce e organiza seus blocos em duas colunas no desktop; até (1120px), detalhes e editor de aula também deixam a composição lateral. A partir de (1600px), o contexto mede (340px), com intervalo de (28px).

Até (767px), a sidebar desaparece; cabeçalho preto de (74px), área clara com dois cantos superiores de (22px), margens principais de (16px) e navegação inferior branca fixa com quatro destinos assumem a estrutura. O contexto fica em uma coluna. A área principal reserva (80px) inferiores; a barra de salvar chamada fica acima da navegação, a (68px) da base.

Na chamada, cada aluno passa de linha com controles à direita para bloco vertical: identificação, situação e par de ações. A barra de salvar permanece acessível. Tabelas de atenção viram blocos; outras tabelas podem rolar horizontalmente.

As ações de presença têm altura mínima de (44px) no desktop e (47px) no mobile; botões primários e secundários mobile têm mínimo de (44px), e salvar chamada usa (47px). Adotar áreas de pelo menos (44×44px) para novos controles de toque. Isso é uma meta de continuidade: o CSS atual ainda contém controles compactos, como células do calendário e alguns ícones, e não prova conformidade universal.

## Elevation & Depth

Painéis são planos e separados por linha fina ou mudança de superfície. Sombra aparece em sobreposições: diálogo (`0 24px 80px #0003`), menu móvel (`0 12px 60px #0003`) e toast (`0 8px 28px #0002`). O backdrop do diálogo usa preto translúcido (`#0008`). Não adicionar brilho ou profundidade decorativa aos cards.

A largura da sidebar e o deslocamento da área de trabalho usam (240ms var(--ease-out)). Os rótulos desaparecem por opacidade (100ms ease) e deslocamento (180ms var(--ease-out)); legenda da marca e grupo usam (120ms ease). No mobile, o menu “Mais” combina opacidade (160ms ease) e transformação (240ms var(--ease-out)), fica inerte quando fechado e fecha ao navegar. Hover usa (150ms ease); toast usa (180ms ease). `prefers-reduced-motion: reduce` remove transições e rolagem animada no escopo da gestão.

## Shapes

Controles têm cantos discretamente arredondados; painéis usam cantos mais abertos. Badges são pequenos retângulos, avatares são circulares. Bordas são simples e neutras, sem molduras duplas. A identidade visual depende da composição e da marca, sem ilustrações decorativas adicionais.

## Components

### Buttons

Primário amarelo com texto preto; secundário branco com borda neutra e texto escuro. Os primários medem no mínimo (42px) no desktop e (44px) no mobile. O hover altera a superfície. Desabilitado usa opacidade (.45) e cursor indisponível.

O foco visível é contorno neutro de (2px), afastado (3px), conforme token de foco. Não usar halo dourado, preenchimento colorido de foco ou borda dupla.

### Chips

Badges compactos com texto explícito: presença, pendência, publicado, rascunho ou situação financeira. Não depender exclusivamente de verde, vermelho ou amarelo para comunicar o estado.

### Cards / Containers

Painéis brancos sem borda externa, raio de (14px), separados pelo fundo cinza e pelos intervalos. Preenchimentos variam por componente; painéis principais da visão geral usam (24px), passando a (19px 17px) no mobile. O card de alunos da visão geral usa preto, número amarelo e texto branco. O painel de publicação também usa preto, com campos e ação secundária escuros. Divisórias neutras organizam linhas internas; não adicionar sombra a cada cartão.

### Inputs / Fields

Campos brancos com borda cinza simples, raio de (7px) e preenchimento de (11px 12px). Rótulos ficam acima; orientação complementar fica abaixo. Texto de leitura usa superfície levemente cinza. Busca mobile tem altura de (46px). O foco segue o mesmo tratamento neutro das ações.

### Navigation

Sidebar preta com links cinza-claro, seleção cinza-escura, ícone ativo amarelo e texto branco; marca caligráfica amarela e branca em pequeno suporte preto. O botão superior recolhe ou expande a navegação, preservando ícones e nomes acessíveis. Abas usam sublinhado amarelo de (3px). No mobile, cabeçalho preto e navegação inferior branca com ícone e rótulo; seleção com texto preto e traço amarelo. “Mais” abre um painel branco sobreposto com transição.

### Chamada e publicação

Presença e falta são ações separadas, com rótulo e ícone. Seleção recebe superfície semântica e o toque repetido desfaz a marcação. Aluno sem registro não é automaticamente ausente. Salvar chamada é uma ação explícita.

No editor de aula, salvar rascunho e publicar são ações distintas. Prévia do aluno e observações internas têm áreas e rótulos separados; não apresentar anotação privada como material publicado. A disponibilidade ao aluno é uma simulação local nesta etapa, sem autorização real no servidor.

### Calendário

Painel branco independente com navegação entre meses e filtros “Hoje”, “Esta semana” e “Próxima”. A grade inclui dias dos meses adjacentes, pontos para eventos ou exames, seleção preta e destaque suave do intervalo semanal. A agenda abaixo acompanha o dia ou semana selecionados e oferece acesso às turmas e eventos. Nesta etapa, “Hoje” e “Próxima” usam a data de referência local `DEMO_DATE`; isso não representa sincronização com uma agenda externa.

## Do's and Don'ts

### Do:

- **Do** preservar preto e amarelo GFB, a logo fornecida e Makking local.
- **Do** manter rótulos operacionais de estado e apresentação normal da interface, sem avisos de protótipo ou dados demonstrativos, conforme decisão explícita do usuário. Registrar os limites técnicos na documentação.
- **Do** verificar composição desktop e chamada mobile, incluindo barra de salvar e navegação fixa.
- **Do** separar salvar, publicar, prévia do aluno e observação interna.
- **Do** manter foco neutro e respeitar redução de movimento.

### Don't:

- **Don't** aplicar marrom à gestão ou alterar a identidade da landing por herança deste documento.
- **Don't** adicionar halos dourados, bordas duplas ou sombras decorativas aos painéis.
- **Don't** afirmar autenticação, banco compartilhado, pagamento, envio de mensagens ou permissões seguras com base na aparência do protótipo.
- **Don't** tratar prévias geradas como fonte de novos dados comerciais ou regenerar as imagens aprovadas para documentar a implementação.

Fontes observadas: `PRODUCT.md`, `src/modules/management/components/Management.module.css`, componentes de gestão, `app/gestao/layout.tsx`, tipografia em `app/globals.css` e capturas `.impeccable/review/refined-desktop.png` e `refined-chamada.png` (referências visuais do refinamento; a leitura de uma captura não comprova ausência de defeitos em todos os estados).

A logo fica centralizada em relação à largura da sidebar, inclusive recolhida. O perfil com nome e função fica no canto superior direito; o rodapé lateral contém somente configurações e retorno ao site. Barras de rolagem da sidebar e da página ficam ocultas sem desativar rolagem por roda, toque ou teclado. A regra de página usa :has(#management-sidebar), preservando outras rotas.

## Refinamento da visão geral

Indicadores ocupam uma faixa inteira antes das colunas de trabalho: rótulo superior, atalho circular, valor com peso/tamanho próprio e comparação na base. Alunos usa gradiente amarelo #F6C300 → #FFEAA2 e número 64px/600; turmas 64px/400; presença 52px/550; financeiro gradiente preto #101010 → #343438 e valor 32px/450. Até 1050px passam a duas colunas; no mobile, valores e preenchimentos se adaptam. Não confundir essa faixa específica com os resumos das outras telas.

Por pedido posterior do usuário, a visão geral usa um cenário visual com 82 alunos e bases ilustrativas de setembro, sem avisos na interface. Essas bases ficam em src/modules/management/domain/overview-scenario.ts e não criam matrículas, recebimentos ou histórico operacional. Presença e valores atuais continuam reagindo às alterações locais. Antes da operação real, substituir o cenário por snapshots persistidos. Códigos de turma usam GFB-T01 a GFB-T05, preservando IDs de rota.

Avatar de perfil é uma ilustração 3D temporária, sem pretensão de retratar Tailan. Cliques e toques não criam contorno, brilho ou faixa translúcida; foco cinza fica restrito à modalidade de teclado. Seleção de texto neutra. A tabela de acompanhamentos cabe no painel a 874px sem rolagem horizontal.

## Busca e feedback de navegação

Busca geral centralizada em três zonas equilibradas no cabeçalho. No mobile, ocupa uma segunda linha (cabeçalho 126px). Usa Base UI Combobox já instalado, com ArrowUp/Down, Enter, Escape, clique fora e Ctrl/Cmd+K. Pesquisa nomes, códigos de turma, conteúdos, eventos, comunicados e funções por sinônimos. Ranking: título exato, prefixo, ocorrência no título, descrição/código, palavras-chave. Não indexa observações privadas. Resultados aparecem e se reorganizam imediatamente; sem animação de entrada nem contagem.

Indicadores têm SVG de tendência e resultado por semântica: verde para alunos em crescimento; amarelo para expansão de turmas; rosa para queda de presença; verde-petróleo para redução do saldo pendente. Uma redução de valores a receber é favorável neste cenário e não é apresentada como queda de receita. Valores de cenário:82 vs74 alunos,+10,8%;5 vs4 turmas,+25%;75 vs82%presença,−7p.p.;R$237 vsR$316,−25%.

Botões principais usam pílula (999px), gradiente amarelo discreto e pressão scale(.98)/160ms. Cards não se deslocam no hover. Beam de borda em rotação contínua lenta (10s), acelera 3x no hover sem reiniciar; pausa fora da tela. Todos os botões recebem beam interno ao hover. O ícone + gira 90 graus no próprio eixo. Hover somente em ponteiro fino; movimento reduzido troca o deslocamento por opacidade de125ms. Cards com múltiplas ações têm beam sem levantar o conteúdo ou tornar o painel inteiro clicável.

Datas do calendário mantêm aspect-ratio1/1 e largura máxima38px (40pxmobile), sem altura mínima que force elipses.


## Gestão: organização e superfícies de apoio

Colunas independentes impedem que mudanças de data/agenda estiquem o painel de aulas. Calendário preserva células circulares. Abas de acompanhamento trocam por opacidade/180ms. Indicadores usam dourado fechado (#D1A024→#E2B840), rosa fechado (#E2AAA2→#ECC0B5), verde e petróleo por resultado. Botões em pílula com amarelo sóbrio.

Cabeçalho sem breadcrumb; controle de colapso abaixo da marca na sidebar. Sino e perfil abrem Base UI Popover ancorado, escala .97/180ms, origem no acionador. Modais usam abertura de 250ms; movimento reduzido preserva apenas opacidade. Busca de teclado permanece imediata. Foco de teclado neutro.

Conteúdos são linhas de ~114px com miniatura, etapa, status por turma e ação de disponibilizar/agendar. Upload armazena o arquivo em IndexedDB e metadados no navegador. Comunicados têm lista e prévia do aluno; feriado começa como rascunho. Equipe é lista compacta com cinco pessoas e edição de privilégios/turmas. Configurações dividem identidade, rotina, notificações e dados; preferências de alertas alimentam o sino.

## Refinamento de navegação, feedback e carregamento

Sidebar usa grid de linhas 46px com intervalo 6px. Legendas recolhidas deixam o fluxo; logo tem object-fit contain e dimensões limitadas em todos os breakpoints. Colapso fica junto da marca. Indicadores continuam sem deslocamento; hover usa saturação, brilho na superfície e beam de 2px, com velocidade acelerada no ponteiro. Aulas usam título de seção menor/cinza, nome da turma maior e cores suaves para horário e revisão. Linhas de aluno respondem ao hover e abrem a ficha também pelo corpo da linha, mantendo links de teclado.

Skeleton SSR em loading.tsx e na hidratação do estado local; respeita o grid e não cria espera artificial. Entradas de páginas com 240ms em opacidade e translateY de 8px, reduzidos a opacidade de125ms na preferência de movimento reduzido.

Modal de acesso: duas colunas no desktop, retrato e identidade à esquerda, privilégios/turmas à direita; header e footer fixos dentro do modal. Cancelar/salvar permanecem visíveis; scrollbar interna oculta e fundo bloqueado. Clique fora, Escape e fechar restauram a rolagem. Mobile passa a uma coluna.

## Login da gestão

Rota /gestao/login, sem sidebar. Referência explícita do usuário prevalece: ilustração cartoon 3D à esquerda, formulário à direita; branco e dourado (#F6C300, #EDB900, #F7CB3F, #FFE691), neutros quentes (#24241F, #6C6C66, #F1F1EF, #ECE7D9), vidro com saturação/blur e beam fino em rotação10s. Sem personagens realistas. Checkbox personalizado pré-marcado; fontes14–16px nos campos/apoio, título27–30px, título ilustrado34–40px; raios13–14px nos controles,24px no formulário e36px na composição. Mobile prioriza formulário e coloca a arte abaixo. Texto crítico e foco têm contraste neutro. Movimento reduzido congela o beam. Limites funcionais em docs/management/login.md.
