# Três estudos do topo mobile

Estudos gráficos de composição, não capturas de navegador. Dimensão de referência: 430 px. Assets existentes: logo GFB, avatar, sol e fonte Makking. Paleta preservada.

1. Barra escura compacta: identidade em duas linhas, utilidades à direita e saudação em área clara.
2. Cabeçalho claro: nome e plataforma em destaque, contexto em segunda linha e saudação abaixo.
3. Saudação integrada: marca, utilidades e boas-vindas no mesmo topo escuro, com área operacional clara abaixo.

A direção de saudação integrada da opção 3 foi aprovada e refinada na aplicação. Os PNGs preservam os estudos iniciais; não são capturas da versão atual. Tipografia e composição implementadas dependem de conferência no navegador quando houver acesso.

## Arquivos e origem

- `opcao-1.png`, `opcao-2.png` e `opcao-3.png`: composições de 430 × 560 px renderizadas em 2× (860 × 1120 px).
- `comparativo.png`: apresentação das três opções, em 1370 × 640 px.
- `generate-previews.mjs`: gerador local com Sharp. Reutiliza `public/brand/gfb-logo.svg`, `public/brand/gfb-logo-dark.svg`, `public/brand/gestao/avatar-professor-3d.png` e `public/brand/gestao/greeting-sun.png`. Os pictogramas de contexto são vetores simples desenhados no próprio gerador.
- Fonte de origem: `public/fonts/gestao/makking-variable-letters.woff2`. Para a renderização local, foi convertida com fontTools em uma instância estática de peso 400 em `.impeccable/mocks/mobile-header/makking.ttf`, exigida pelo gerador. Essa conversão serve aos estudos, sem alterar a fonte usada pela aplicação.

O gerador recria um README resumido; preservar esta documentação ao regenerar os PNGs. Os dados de alunos, cobranças, data e saudação ilustram a composição existente, sem representar uma consulta atual ao sistema. As imagens não demonstram comportamento responsivo, foco ou animações.

## Implementação desta rodada

A identificação “Plataforma de gestão” usa duas linhas explícitas, com 12 px (11 px abaixo de 360 px). A direção aprovada foi refinada em um molde escuro compartilhado pelos títulos das categorias e pela ficha do aluno, com transição arredondada para o corpo claro. No dashboard, o sol fica junto ao nome, que recebe brilho suave em ciclo de 7 s, desativado com movimento reduzido. A data tem margem superior de 8 px e o intervalo até o conteúdo foi reduzido.

Os títulos mobile permanecem estacionários: não recebem a translação GSAP dos blocos de conteúdo. O conteúdo conserva suas transições e o desktop permanece com sua composição anterior. As fontes conferidas para esse refinamento são o bloco final de `Management.module.css`, `PageTitle` em `ui.tsx` e `ManagementContentMotion.tsx`.

O cabeçalho agora é uma superfície única de `ManagementShell`: barra de marca, espaço do título e uma só borda curva. A legenda da plataforma fica centralizada em uma coluna própria entre logo e utilidades. `MobileHeader.tsx` usa contexto e portal para mover a saudação, o título e os breadcrumbs existentes abaixo de 768 px, restaurando sua posição no desktop e evitando duplicação do título aninhado da ficha do aluno. A medição da saudação é refeita quando o nó muda de local. Sol, nome, data e brilho permanecem preservados. A revisão de fonte não apontou defeito material no novo escopo; 128 testes passaram, com lint/build ainda em finalização nesta atualização. Não houve QA em navegador.

O menu Mais recebeu um border beam dourado de 1 px com ciclo de 6 s, que fica estático com movimento reduzido. O fundo externo usa desfoque de 3 px.

Enquanto a superfície do menu permanece montada, inclusive durante a saída, `useMobileMenuScrollLock` fixa o corpo na posição de rolagem atual abaixo de 768 px. Fechar, desmontar ou passar para desktop restaura os estilos anteriores e a posição da página. A grade do menu conserva rolagem interna para telas baixas.

## Evidência e pendências

Conferência de fonte: `ManagementShell.tsx`, regras finais de `Management.module.css`, `useMobileMenuScrollLock.ts` e os três cenários de `management-scroll-lock.test.tsx` (restauração de estilos/posição, mudança de breakpoint e desmontagem). A rodada de implementação passou em sete testes direcionados, lint e build de produção com TypeScript, conforme registro do executor. Isso não equivale a validação visual em dispositivo.

As prévias foram produzidas como estudos gráficos e passaram por revisão de composição. A revisão de fonte do refinamento aprovado não identificou defeito material no novo escopo. Não houve captura da aplicação em execução: o acesso ao navegador está desativado no Work. Permanecem pendentes conferência em 320/375/430 px, telas baixas e landscape, movimento reduzido, retorno da rolagem no iOS e leitura do desfoque/refração sobre conteúdo real. O design system vigente permanece preservado em `DESIGN.md` e `.impeccable/design.json`.

## Escolha aplicada

Usuário escolheu a opção 3. O mobile da visão geral usa saudação integrada ao topo preto, data abaixo e nome amarelo. A saudação inteira fica em uma linha, sem quebrar antes ou dentro do nome; a fonte ajusta ao espaço via medição. Estudos originais acima preservam a comparação, mas a versão aprovada corrige a quebra que mostravam. Desktop conserva composição anterior. Conferência de layout no navegador segue pendente.

Validação da unificação: 128 testes na suíte completa, sete testes direcionados de cabeçalho/dashboard, build de produção e TypeScript concluídos. Ajuste final de medição usa callback ref com observação de tamanho/texto; lint sem pendências. Verificação visual continua pendente por acesso ao navegador desativado.

Refinamento de carga da visão geral: removida a regra legada que desenhava uma divisória na logo; área da saudação reservada em 100px desde o HTML inicial, curva sempre presente e fallback no corpo oculto apenas no mobile até a montagem no cabeçalho. Folgas de 8px acima e 24px abaixo compensam o espaço inferior da linha da logo. Oito testes direcionados e lint passaram. A reserva fixa de 100px aplica-se à visão geral; títulos de outras rotas com ações continuam com altura pelo conteúdo e precisam de conferência própria. QA visual permanece pendente.
