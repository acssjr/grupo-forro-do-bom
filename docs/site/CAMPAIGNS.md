# Organização de campanhas

Este repositório é a base das landing pages do Grupo Forró do Bom. A página existente em `/` é a landing geral para iniciantes. Novas campanhas devem ser adicionadas sem substituir essa página e sem usar uma branch diferente para cada headline.

## Estrutura recomendada

```text
app/
  campanhas/
    <slug>/
      page.tsx
content/
  campaigns/
    <slug>.ts
public/
  campaigns/
    <slug>/
components/
  landing/
config/
```

- `app/campanhas/<slug>/page.tsx` define a URL pública e compõe a landing.
- `content/campaigns/<slug>.ts` concentra copy, oferta, headlines e CTAs da campanha.
- `public/campaigns/<slug>/` guarda apenas os assets daquela campanha.
- `src/modules/site/components/landing/` continua reunindo componentes reutilizáveis.
- `config/` permanece como fonte central de WhatsApp, endereço, horários, links e dados institucionais.

## Headlines por campanha

Uma campanha pode ter diversas headlines. Cada variante deve possuir um ID estável e uma finalidade registrada.

```ts
export const heroVariants = {
  "hero-a": {
    headline: "Headline principal da campanha",
    subheadline: "Texto de apoio",
  },
  "hero-b": {
    headline: "Segunda abordagem da mesma campanha",
    subheadline: "Texto de apoio da variante",
  },
} as const;
```

Ao criar uma variante:

1. mantenha a oferta, o público e o objetivo comercial da campanha identificados;
2. altere somente as variáveis que fazem parte do teste;
3. preserve o ID da headline nos eventos de tracking;
4. use `utm_campaign` para a campanha e `utm_content` para o criativo ou variante;
5. não apague uma variante que já recebeu tráfego, marque-a como inativa no conteúdo.

## URLs

Use slugs curtos, descritivos e permanentes:

- `/campanhas/iniciantes-quinta`
- `/campanhas/iniciantes-sabado`
- `/campanhas/nivelamento`
- `/campanhas/imersao-gfb`

Se duas headlines precisarem rodar ao mesmo tempo em mídia paga, cada uma pode receber uma rota explícita dentro da campanha, como `/campanhas/iniciantes-quinta/hero-a`, ou uma seleção determinística documentada. Não use uma troca aleatória no cliente, pois isso prejudica atribuição, cache e consistência da experiência.

## O que é compartilhado

Devem permanecer centralizados:

- identidade visual, Saans e tokens de cor;
- componentes acessíveis e padrões de movimento;
- número e mensagens-base do WhatsApp;
- endereço, horários e links institucionais;
- camada de eventos do GA4 e preservação de UTMs;
- política de privacidade, termos, metadata e dados estruturados comuns.

## Fluxo para uma nova landing

1. Defina o slug e o objetivo comercial.
2. Crie o arquivo de conteúdo com as headlines identificadas.
3. Adicione os assets no diretório exclusivo da campanha.
4. Componha a rota reutilizando os componentes adequados.
5. Configure metadata, canonical e eventos da campanha.
6. Valide mobile, acessibilidade, links de WhatsApp, tracking, testes, lint e build.

Branches devem representar trabalho em desenvolvimento. Campanhas e variantes publicadas pertencem ao código versionado da `main` e às suas rotas estáveis.
