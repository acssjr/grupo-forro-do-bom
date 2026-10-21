# Pesquisa e diagnóstico de performance da landing GFB

Data da medição: 8 de setembro de 2026
Página pública analisada: https://gfblp-main.vercel.app/
Relatório oficial do PageSpeed Insights: https://pagespeed.web.dev/analysis/https-gfblp-main-vercel-app/v9ze5lwgw9?form_factor=mobile

## Resposta executiva

A landing já está em uma faixa forte de desempenho: o PageSpeed Insights marcou 96 no mobile e 98 no desktop. O site não tem amostra suficiente no Chrome UX Report, portanto esses resultados são dados de laboratório do Lighthouse, não experiência agregada de usuários reais.

Não existe uma métrica padronizada e comparável de “peso médio por componente React”. Os benchmarks públicos confiáveis medem recursos transferidos pela página — HTML, CSS, JavaScript, fontes e imagens — e quantidade de solicitações. Essa é a unidade usada neste relatório.

O build local de produção, que contém as otimizações de SVG ainda não publicadas, transferiu aproximadamente 593 KiB em 26 solicitações. A home mobile mediana registrada pelo HTTP Archive em 2025 tinha 2,56 MB e 78 recursos. A GFB está, portanto, perto do décimo percentil de peso da web e usa aproximadamente um terço da quantidade mediana de solicitações.

## Resultado do PageSpeed Insights

| Métrica | Mobile | Desktop | Leitura |
| --- | ---: | ---: | --- |
| Desempenho | 96 | 98 | Bom |
| Acessibilidade | 93 | 93 | Há dois grupos de correções objetivas |
| Práticas recomendadas | 100 | 100 | Excelente |
| SEO | 100 | 100 | Excelente |
| FCP | 0,9 s | 0,3 s | Bom |
| LCP | 2,6 s | 0,6 s | Mobile está 0,1 s acima da faixa boa |
| TBT | 110 ms | 120 ms | Bom |
| CLS | 0,017 | 0 | Bom |
| Speed Index | 2,4 s | 0,6 s | Bom |

O Google considera bons LCP de até 2,5 s, INP de até 200 ms e CLS de até 0,1. Uma nota de laboratório a partir de 90 também é classificada como boa. O PSI informa que os valores podem variar entre execuções devido a rede, hardware e contenção do ambiente.

## Benchmarks de peso

Referência: capítulo Page Weight do Web Almanac 2025, produzido pelo HTTP Archive.

| Tipo de recurso | Home mobile mediana | GFB local em produção | Situação |
| --- | ---: | ---: | --- |
| HTML | 22 KiB | 22 KiB | igual à mediana |
| CSS | 77 KiB | 13,7 KiB | muito abaixo |
| JavaScript | 632 KiB | 211 KiB | muito abaixo, ainda com oportunidade |
| Fontes | 122 KiB | 140 KiB | ligeiramente acima |
| Imagens, incluindo SVG | 911 KiB | cerca de 220 KiB | muito abaixo |
| Página inteira | 2,56 MB | 593 KiB | aproximadamente 77% menor |
| Solicitações | 78 | 26 | aproximadamente 67% menos |

Os números da GFB foram medidos com Lighthouse 13.4.1 contra um build local de produção. Eles são adequados para inventário de bytes, mas não para comparar latência com a CDN da Vercel. O resultado oficial da URL pública deve continuar sendo a referência de velocidade.

## O que ainda pode melhorar

### 1. Imagens apontadas pelo PSI — prioridade alta

O PageSpeed calcula economia total de 84,5 KiB:

- Foto de comunidade: 77,7 KiB transferidos, com economia estimada de 49,2 KiB. O arquivo entregue tem 511 × 640 para uma exibição quadrada de 418 × 418.
- Foto principal do hero, que é o elemento LCP: 48,4 KiB transferidos, com economia estimada de 35,4 KiB. O arquivo entregue tem 681 × 510 para uma exibição de 371 × 252.

A intervenção deve preservar a fotografia. As melhores hipóteses são criar variantes com proporção já correspondente ao quadro, testar AVIF/WebP em qualidade menor e revisar `sizes`. Não é recomendável aceitar cegamente uma resolução inferior sem comparar nitidez em telas de alta densidade.

### 2. Criar um favicon dedicado — prioridade alta

Depois do SVGO, `gfb-monogram.svg` ainda transfere aproximadamente 60 KiB e também está configurado como favicon. Para um ícone minúsculo, esse desenho tem complexidade excessiva. A recomendação é manter o monograma atual nas seções visíveis e criar um `gfb-favicon.svg` simplificado, com meta de 10 KiB ou menos. Isso pode economizar perto de 50 KiB sem alterar a marca exibida na página.

### 3. Adiar mais JavaScript interativo — prioridade média

O PSI encontrou 114,5 KiB em dois pacotes iniciais, dos quais 52 KiB não foram usados durante a carga medida:

- pacote de React/React DOM: 71 KiB transferidos, 27,4 KiB potencialmente não usados;
- pacote cliente da landing: 43,5 KiB transferidos, 24,5 KiB potencialmente não usados.

O runtime geral de animação é importado após apenas dois frames. Os pacotes posteriores de GSAP/ScrollTrigger aparecem no diagnóstico de reflow forçado, com 171 ms acumulados. Como o hero já possui entrada em CSS, vale testar a ativação do runtime pelo primeiro bloco animado que se aproxima da viewport ou por tempo ocioso real. A mudança precisa preservar os carrosséis, o nivelamento e `prefers-reduced-motion`.

### 4. CSS que bloqueia renderização — prioridade média/baixa

Dois arquivos CSS somam somente 14,3 KiB, mas o PSI estima 420 ms no caminho crítico mobile. Separar ou incorporar apenas o CSS do cabeçalho e hero pode ajudar o LCP, porém a economia precisa ser medida: o CSS já é pequeno e uma implementação agressiva pode gerar flash de conteúdo sem estilo ou duplicação.

### 5. Fontes — prioridade baixa

As quatro fontes transferem aproximadamente 140 KiB, pouco acima da mediana de 122 KiB. O projeto já utiliza subconjuntos WOFF2 e uma auditoria anterior mostrou regressão ao remover preloads. Só vale mexer novamente se houver uma fonte variável compatível ou se uma medição demonstrar que pesos não críticos podem ser realmente evitados na primeira carga.

### 6. DOM — não é gargalo agora

O PSI contou 734 elementos, profundidade máxima 11 e até 17 filhos em um mesmo nó. O build local mediu 757 elementos. Não há justificativa para remover conteúdo comercial somente para reduzir esse número.

### 7. Acessibilidade — correções rápidas

A nota 93 vem de problemas concretos:

- `aria-label` aplicado a dois elementos `<strong>` na seção de prova, atributo proibido para esse papel;
- contraste insuficiente em rodapés e textos pequenos dos depoimentos e em partes da seção de nivelamento.

Essas correções têm baixo risco e podem levar a acessibilidade para perto de 100 sem mudar a estrutura da landing.

## Orçamento recomendado para a GFB

Este orçamento é mais útil que perseguir 100 pontos em uma única execução:

| Indicador | Limite recomendado |
| --- | ---: |
| LCP mobile de laboratório | até 2,5 s |
| INP real, quando houver dados | até 200 ms no percentil 75 |
| CLS | até 0,1 |
| Página inicial transferida | até 600 KiB |
| Recursos no caminho crítico | até 350 KiB |
| JavaScript inicial | até 180 KiB |
| Imagens carregadas inicialmente | até 150 KiB |
| Fontes | até 100 KiB, sem regressão visual |
| CSS | até 20 KiB |
| Solicitações iniciais | até 30 |

O orçamento antigo de referência do web.dev sugere aproximadamente 345 KiB de recursos críticos para um Moto G4 em 4G lenta. Ele deve ser usado como ponto de partida, não como média atual da web.

## Sequência recomendada

1. Publicar os SVGs otimizados e repetir o PSI para estabelecer a nova base pública.
2. Criar o favicon simplificado, mantendo o monograma completo no conteúdo.
3. Gerar e comparar variantes das duas imagens apontadas pelo PSI.
4. Corrigir ARIA e contraste.
5. Experimentar carregamento realmente ocioso ou por proximidade do runtime GSAP.
6. Só depois avaliar CSS crítico e fontes, sempre com medições repetidas.
7. Adicionar coleta de LCP, INP e CLS de usuários reais, porque o domínio ainda não possui dados suficientes no CrUX.

## Fontes

- Google, “About PageSpeed Insights”: https://developers.google.com/speed/docs/insights/v5/about
- PageSpeed Insights, relatório da landing GFB: https://pagespeed.web.dev/analysis/https-gfblp-main-vercel-app/v9ze5lwgw9?form_factor=mobile
- HTTP Archive, “Web Almanac 2025 — Page Weight”: https://almanac.httparchive.org/en/2025/page-weight
- web.dev, “Your first performance budget”: https://web.dev/articles/your-first-performance-budget
- Skill instalada, “Web Performance Optimization”: https://github.com/secondsky/claude-skills/blob/main/plugins/web-performance-optimization/skills/web-performance-optimization/SKILL.md

## Limitações

- O PSI não encontrou volume suficiente para exibir Core Web Vitals de campo do CrUX.
- A mediana do HTTP Archive cobre home pages em geral, não exclusivamente landing pages de escolas de dança.
- O benchmark público não oferece uma média confiável por componente React; por isso a comparação usa bytes por tipo de recurso e solicitações.
- O build local contém alterações de SVG ainda não publicadas. A análise pública mede a versão atual da Vercel.
