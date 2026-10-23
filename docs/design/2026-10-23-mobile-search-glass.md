# Busca contrastante e navegação mobile

## Direção

Adaptar as referências fornecidas à identidade GFB: preto/grafite e cinzas neutros já existentes, amarelo como ação principal e reflexos claros discretos. Não alterar o tema das páginas. A lista de busca deve se distinguir da superfície clara da página. O vidro é um tratamento de superfície; não pode comprometer a leitura.

## Busca

- Superfície grafite quase opaca, contorno claro discreto e sombra externa para separar os planos.
- Títulos claros, descrições em cinza claro e ícones em amarelo suave.
- Cabeçalho “Sugestões para você” sem texto digitado, mantendo três ações prioritárias e o “Ver mais” compacto.
- Remover o rodapé de instruções de teclado. Os atalhos e a navegação por teclado continuam funcionando.
- Preservar animações de entrada, saída e reorganização existentes; não reiniciar o painel durante a digitação.

## Mobile

- Navegação flutuante com cinco posições: Início, Turmas, Buscar, Alunos e Mais, respeitando as permissões existentes.
- Busca no centro, destacada em amarelo, somente com a lupa e nome acessível “Abrir busca”. As outras ações têm ícone e legenda.
- Uma única lente translúcida acompanha somente toque/clique e destino atual. Hover e foco sem ativação não movem a seleção. GSAP desloca a lente em 240 ms com `--ease-in-out`, sem mover os rótulos. Interrupções partem da posição atual. Movimento reduzido elimina o deslocamento.
- A seleção não usa sublinhado amarelo. O vidro combina corpo grafite escuro, difusão do fundo com blur e redução de brilho, reflexão especular radial no topo, relevo por sombras internas e borda luminosa com máscara. Uma faixa de refração usa deslocamento SVG de baixa amplitude apenas na borda em navegadores compatíveis; o restante mantém a mesma leitura com blur e reflexos CSS. As camadas decorativas não recebem eventos nem participam da acessibilidade.
- Vidro em grafite neutro, borda luminosa fina, blur e gradiente discreto. Em navegadores sem suporte, usar superfície opaca legível.
- O campo de busca deixa de ocupar permanentemente uma segunda linha do cabeçalho. A ação central abre o campo e as sugestões no topo, com fundo atenuado para separar a busca da página.
- Fechar por botão, Escape ou toque fora. Ao fechar a busca iniciada pelo menu, devolver foco ao botão central.
- “Mais” abre as demais categorias acima da barra, na mesma linguagem visual, e fecha ao escolher uma categoria, tocar fora ou pressionar Escape.
- Reservar espaço inferior para a barra e para a área segura do dispositivo. Manter alvos de navegação com pelo menos 44 px de altura.

## Implementação e verificação

Reutilizar Base UI para o combobox, GSAP para o movimento já implementado e CSS para vidro/hover. Preservar dados, permissões e navegação desktop. Conferir 320, 390, 768 e 1440 px, resultados vazios, lista expandida e teclado. As preferências de movimento reduzido continuam aplicáveis.

As sugestões da visão geral usam três colunas entre 480 e 767 px. Abaixo de 480 px, as duas primeiras ficam lado a lado e a terceira ocupa a linha seguinte, conservando as descrições e o alvo clicável completo.

### Refinamento do menu Mais

A lente reutiliza `navigationDuration` do sidebar, proporcional à distância, e ignora a primeira notificação do ResizeObserver quando não houve mudança de tamanho. Isso preserva o deslocamento durante mudanças de rota ou abertura do painel. Continua respondendo apenas à ativação por toque/clique.

O painel surge e recolhe a partir do botão Mais com deslocamento de 18px, escala .97, recorte e opacidade em 200–240ms, usando o token de saída. Um feixe dourado percorre somente a borda de 1px, em 8s, pausado com o painel fechado e estático com movimento reduzido. A borda especular da barra foi reduzida para 1px.

### Material óptico instalado

A camada anterior de blur e refração por turbulência foi substituída no dock pelo pacote `simple-liquid-glass@5.4.0`, também usado em Mais opções. O padrão atual, os parâmetros e as limitações estão em [liquid-glass.md](liquid-glass.md). A entrada do painel usa apenas transformação e visibilidade para não bloquear a captura nativa do fundo.

### Reconstrução pela referência Experience chapters

As regras antigas do dock foram removidas, com uma única definição canônica de layout/controles. O material agora usa o perfil player completo, 80px de refração, tonalidade .16 aplicada ao corpo e camada refrativa transparente, conforme inspeção da referência. Seleção clara plana, sem bordas ou sombras antigas. Os controles adaptam a tinta ao fundo CSS durante a rolagem. Os detalhes vigentes estão em liquid-glass.md.
