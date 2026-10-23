# Liquid Glass — material da gestão GFB

Implementação inicial: 23 de outubro de 2026. Dependência fixada: `simple-liquid-glass@5.4.0` (MIT). O pacote está instalado no projeto; não se copia a identidade visual da demo.

## Direção atual: preto e amarelo

A pedido do usuário, o dock usa agora tonalidade preta `rgba(12,12,16,.86)`, tinta fixa `#f7d34c` e selecionado/lupa `#ffe16c`. A lente selecionada usa `rgba(26,26,30,.82)` e a lupa `rgba(12,12,16,.88)`. A adaptação de tinta foi retirada do shell: evitar alternância durante a rolagem. Refração, relevo, borda fina e animação permanecem. As medições claras e o algoritmo adaptativo abaixo são histórico do estudo, substituídos por esta direção.

## Correção de composição do switch

A barra usa **uma única superfície refrativa** do pacote. A seleção e a lupa não montam novos renderizadores: mantêm relevo por iluminação, bordas internas e sombra, sem `backdrop-filter` próprio. Três superfícies refratando a mesma região produziam refrações encadeadas e formas duplicadas. O pacote documenta que glass-through-glass não é suportado; não reintroduzir essa composição.

A lente única desloca, eleva 3px e deforma até 1.06 horizontal / .97 vertical; volta a 1/1 ao concluir. O contorno da barra recorta o movimento e os efeitos ópticos, impedindo expansão sobre a página. Mudanças rápidas de destino cancelam a timeline anterior e partem da geometria visível. A falta de seleção cancela o movimento e oculta a lente com escala neutra.

## Referências e uso

- [Simple Liquid Glass: implementação e API](https://github.com/lucaperullo/simple-liquid-glass).
- [Kube: Liquid Glass in the Browser](https://kube.io/blog/liquid-glass-css-svg/).
- [Apple: Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/).

Usar `ManagementGlass.tsx` como ponto único do material. Primeiras superfícies: barra de navegação mobile e painel Mais opções. O restante do dashboard mantém seus cards e superfícies atuais. Não estender vidro para tabelas e formulários por decoração.

## Composição óptica

A referência de Kube orienta a construção: a forma e a curvatura determinam como o fundo se desloca; um painel de blur com ruído aleatório não substitui uma lente. Centro mais tranquilo, refração progressiva na borda, brilho direcional fino e discreta dispersão de cores. O cálculo e o mapa usados nesta implementação pertencem ao motor de lente arredondada do Simple Liquid Glass; não se trata de uma cópia do algoritmo de Snell do artigo de Kube.

A barra foi reconstruída a partir da navegação “Experience chapters” da referência (medição do DOM em 23/10/2026). Usa `quality="extreme"`, `refraction="lens"`, perfil `player` sem sobrescrever seus parâmetros ópticos, deslocamento base de 80px, blur de 5px, saturação 115% e dispersão .12. O deslocamento do canal vermelho medido na referência e no GFB é 82.112px. O raio acompanha a geometria local: 38px para uma barra de 76px de altura.

A tonalidade é aplicada como `background` no corpo do material, não como uma camada opaca sobre o fundo já refratado: `rgba(18,18,22,.16)`, mantendo o grafite neutro GFB. A camada de refração permanece transparente, como no exemplo. O próprio pacote produz o brilho e a borda de 1px; não acrescentar contorno, blur ou gradientes no nav. A sombra e o brilho superior do corpo são centralizados no componente. O painel Mais usa o mesmo perfil com 64px de deslocamento, blur de 8px, raio de 26px e tonalidade .56 para preservar leitura de uma lista maior.

## Legibilidade e controles

`useDockContrast` amostra nove pontos por destino (área de ícone, legenda e margens externas para cobrir parte da refração). Compõe camadas CSS transparentes e extremos de gradientes, calcula contraste com tinta clara/escura e escolhe a menor proteção local necessária para obter pelo menos 5:1 no modelo. A proteção é uma camada discreta sob o controle, não um escurecimento global do vidro. Usa histerese para evitar alternância desnecessária.

Recalcula em rolagem, resize, viewport visual, carregamento de fontes, mudanças de conteúdo, rota e abertura de Mais. Leituras são agrupadas antes das escritas, limitadas a aproximadamente 30Hz durante uma janela de estabilização de 320ms; não há loop permanente. O contraste reportado é uma estimativa das cores CSS, não medição dos pixels refratados: fotografias, vídeos e glass-through-glass exigem verificação visual.

A seleção é uma única superfície iluminada sobre o material refrativo da barra. Ao ativar um destino, eleva 3px, alonga até 1.06 horizontalmente e comprime até .97 verticalmente, depois assenta com retorno curto. GSAP preserva a posição visível durante interrupções e não reinicia o movimento na mudança da rota. Movimento reduzido elimina a elevação e a deformação. Hover e foco sem ativação não mudam a seleção.

A lupa central usa corpo preto com iluminação e borda interna, sem renderizador refrativo separado. Os ícones mobile usam traço regular, sem preenchimento duotone. O amarelo GFB permanece; não introduzir verde-oliva ou azul como tema.

A fronteira mobile é `(width < 768px)` em CSS e JavaScript, cobrindo larguras fracionárias geradas por zoom.

## Navegadores e arquitetura

`renderer="auto"` e `mobileFallback="svg"` permitem refração nativa em Chromium, inclusive Android compatível. Safari/iOS e Firefox usam a estratégia WebGL do pacote quando disponível. `backdropRef` aponta para o workspace, irmão visual da barra, nunca ancestral da lente; assim o renderizador recebe o conteúdo da gestão em vez de uma imagem de demonstração. `backdropVersion` acompanha a rota. O pacote observa alterações do conteúdo para atualizar capturas.

O material só monta abaixo de 768px. Não cria renderizadores desktop ocultos. O material de Mais monta na abertura e desmonta depois da saída, liberando seus recursos enquanto o painel está fechado. O wrapper da lente não deve ter blur, máscara, clip-path ou opacidade parcial: essas propriedades criam raízes de backdrop e impedem a refração do conteúdo externo no Chromium. Por isso a entrada/saída de Mais usa transformação a partir do acionador e visibilidade ao fim, preservando a integridade do material. A camada da página atrás do menu continua recebendo o escurecimento do backdrop existente.

Capturas HTML não equivalem ao compositor do iOS: fontes/imagens precisam estar acessíveis, alterações contínuas podem atrasar e vidro sobre vidro não é garantido. Se WebGL/captura falharem, o fallback do pacote preserva a navegação com material difuso. Não alegar paridade com Apple ou validação em aparelho físico sem teste correspondente.

## Movimento e manutenção

A lente de seleção segue a ativação por toque/clique, usando `navigationDuration` e a curva compartilhada do sidebar. Hover/foco sem ativação não mudam a seleção. Não animar os parâmetros ópticos em cada frame nem adicionar turbulência contínua. Manter o border beam de Mais discreto e pausado quando fechado; respeitar movimento reduzido.

Validação visual: rolar cards coloridos, linhas de texto e fundos claros/escuros atrás da barra, alternar destinos rapidamente, abrir/fechar Mais durante a transição e confirmar que busca, permissões e clique dos itens continuam funcionando. Verificar o atributo `data-glass-strategy` do pacote: `svg` comprova a seleção da estratégia nativa; `webgl` comprova a seleção da estratégia WebGL. Esses atributos não comprovam desempenho ou qualidade em outro dispositivo.

## Verificação inicial

- Chromium local: estratégia `svg` e filtro `backdrop-filter` contendo `url(#liquid-glass-filter-...)` ativos.
- Testes automatizados do projeto: 113 passaram após refinamento de contraste e movimento.
- Safari/iPhone físico: pendente; o caminho WebGL está integrado, mas não foi validado em aparelho neste trabalho.

O painel Mais opções usa agora `rgba(12,12,16,.88)` para manter a lista escura mesmo sobre páginas brancas, preservando a refração e o relevo do pacote.

Mais opções usa agora translação de 14px em 180ms, sem escala, para evitar mudanças contínuas na geometria do filtro durante fechamento. O material é liberado somente ao terminar a transição do próprio painel (transform/visibility), inclusive com movimento reduzido.
