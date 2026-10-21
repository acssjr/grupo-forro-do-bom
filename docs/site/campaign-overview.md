<div align="center">
  <img src="../../public/brand/gfb-logo-stacked.png" width="320" alt="Grupo Forró do Bom" />

  # Campanhas que colocam gente para dançar

  **Um sistema de landing pages para transformar interesse em conversas, matrículas e continuidade.**

  Feira de Santana, Bahia · 11 anos de história · Mais de 500 alunos formados

  [Propósito comercial](#o-negócio-antes-da-página) · [Campanhas](#uma-casa-para-várias-campanhas) · [Execução local](#rode-localmente) · [Deploy](#publicação)
</div>

<br />

<img src="../../public/images/illustrative/hero-aula.png" width="100%" alt="Cena de dança usada na direção visual da landing do Grupo Forró do Bom" />

## O negócio antes da página

O Grupo Forró do Bom não precisa de uma página que apenas receba visitas. Precisa de campanhas que reconheçam intenções diferentes e conduzam cada pessoa até a conversa certa.

Este repositório reúne essas campanhas em uma base comum. A marca, a experiência, o tracking e as informações do GFB permanecem consistentes. A mensagem, a oferta e o recorte de público podem mudar sem apagar o histórico das campanhas anteriores.

> Uma landing page para cada intenção. Uma experiência reconhecível em todas elas.

### Os quatro objetivos comerciais

| Intenção da pessoa | Próximo passo esperado |
| --- | --- |
| Nunca dancei | Participar da primeira aula de uma nova turma |
| Quero me organizar | Entrar na lista prioritária de quinta ou sábado |
| Quero continuar | Escolher o plano que combina com o ritmo de evolução desejado |
| Já danço | Agendar um nivelamento gratuito para a turma adequada |

O fechamento acontece pelo WhatsApp. Não existe checkout, pagamento online ou formulário que alongue o caminho.

## A jornada que importa

| Momento | O que a página precisa fazer | Sinal de sucesso |
| --- | --- | --- |
| Descoberta | Fazer a pessoa se reconhecer na mensagem da campanha | A pessoa continua explorando |
| Confiança | Mostrar método, ambiente, experiência e provas reais | A proposta passa a parecer possível |
| Decisão | Apresentar turma, plano ou nivelamento com clareza | A intenção fica mais específica |
| Conversa | Abrir o WhatsApp com contexto suficiente | A conversa começa qualificada |
| Continuidade | Conectar a primeira aula ao próximo passo | A matrícula deixa de ser uma decisão solta |

O clique é um meio. A métrica central é a capacidade de gerar alunos que começam, evoluem e permanecem.

## Uma casa para várias campanhas

A rota `/` contém a landing geral para iniciantes. As próximas páginas entram em rotas próprias, com conteúdo e assets isolados.

```text
/campanhas/iniciantes-quinta
/campanhas/iniciantes-sabado
/campanhas/nivelamento
/campanhas/imersao-gfb
```

Uma mesma campanha pode usar várias headlines. Cada variante recebe um identificador permanente, como `hero-a`, `hero-b` ou `hero-c`. Assim, uma nova mensagem não sobrescreve a anterior e o tracking consegue relacionar campanha, criativo e resultado.

```text
utm_campaign = objetivo comercial
utm_content  = criativo ou variante de headline
```

Branches representam trabalho em desenvolvimento. Campanhas publicadas pertencem à `main` e às suas rotas estáveis.

[Leia a convenção completa de campanhas](./CAMPAIGNS.md).

## A landing atual

A primeira experiência publicada nesta base atende quem quer começar do zero e quem já dança.

| Frente | Implementação |
| --- | --- |
| Conversão | CTAs contextuais e mensagens editáveis para WhatsApp |
| Oferta | Aula inicial, Essencial GFB e Imersão GFB |
| Turmas | Estado de turma aberta e estado de lista prioritária |
| Nivelamento | Painel acessível com seleção de básico, intermediário e avançado |
| Confiança | Provas sociais, monitores, depoimentos e atmosfera das aulas |
| Movimento | GSAP, ScrollTrigger, carrosséis e transições com ritmo controlado |
| Acessibilidade | HTML semântico, teclado, foco visível e redução de movimento |
| Mensuração | GA4, UTMs preservadas e eventos sem dados pessoais |
| Descoberta | SEO local, Open Graph, sitemap, robots e dados estruturados |

## Uma identidade que se move

O visual parte da direção **solar popular**. Amarelo, creme e marrom constroem contraste sem transformar toda a página em uma única superfície. Tipografia grande, recortes editoriais e movimento dão energia de dança sem recorrer a clichês de festa junina.

| Elemento | Escolha |
| --- | --- |
| Amarelo | `#F6C300` |
| Creme | `#FFF2DB` |
| Marrom | `#2B1A0E` |
| Tipografia | Saans Regular, Medium, SemiBold e Bold |
| Movimento | GSAP com `useGSAP`, timelines, ScrollTrigger e `matchMedia()` |

O scroll permanece nativo. As animações usam principalmente `transform` e `opacity` e respeitam `prefers-reduced-motion`.

## Rode localmente

Requisito: Node.js 20.9 ou superior.

```bash
git clone https://github.com/acssjr/grupo-forro-do-bom.git
cd grupo-forro-do-bom
npm install
copy .env.example .env.local
npm run dev
```

Acesse `http://localhost:3000`.

## Configuração

| Variável | Quando usar | Função |
| --- | --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Produção | Número com DDI e DDD, somente dígitos |
| `NEXT_PUBLIC_SITE_URL` | Produção | Canonical, Open Graph, sitemap e JSON-LD |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Opcional | Carregamento do GA4 |
| `NEXT_PUBLIC_COHORT_STATUS` | Sempre | `waitlist` ou `open` |
| `NEXT_PUBLIC_COHORT_START_DATE` | Turma aberta | Data real de início |
| `NEXT_PUBLIC_COHORT_SCHEDULE` | Turma aberta | `thursday` ou `saturday` |
| `NEXT_PUBLIC_COHORT_AVAILABLE_SPOTS` | Opcional | Número real de vagas disponíveis |

Sem o número oficial, os CTAs mostram um aviso de configuração pendente. Nenhum contato é inventado.

## Onde cada coisa vive

```text
app/                    rotas, metadata, sitemap e páginas legais
src/modules/site/components/landing/     seções, interações e identidade responsiva
config/                 negócio, turma, endereço e assets visuais
content/                copy, planos, FAQ e mensagens do WhatsApp
docs/                   campanhas, tracking, decisões e planos
lib/                    analytics, UTMs e links do WhatsApp
public/brand/           logos e monograma do GFB
public/images/          fotografias usadas pela experiência
tests/                  comportamento comercial e interface
```

### Pontos de edição frequentes

| Precisa mudar | Arquivo principal |
| --- | --- |
| Copy, planos e FAQ | [`src/modules/site/content/siteContent.ts`](./src/modules/site/content/siteContent.ts) |
| Endereço, horários e turma | [`src/config/site.ts`](./src/config/site.ts) |
| Fotografias e enquadramentos | [`src/modules/site/config/visualAssets.ts`](./src/modules/site/config/visualAssets.ts) |
| Identidade e responsividade | [`src/modules/site/components/landing/Landing.module.css`](./src/modules/site/components/landing/Landing.module.css) |
| Animações | [`src/modules/site/components/landing/AnimatedLanding.tsx`](./src/modules/site/components/landing/AnimatedLanding.tsx) |
| Eventos e propriedades | [`docs/TRACKING.md`](./TRACKING.md) |

## Qualidade antes de publicar

```bash
npm test
npm run lint
npm run build
npm audit
```

A suíte cobre conteúdo comercial, rotas de conversão, seletores acessíveis, carrosséis e estados da landing. O relatório local incluído em [`lighthouse-report.json`](./lighthouse-report.json) registrou 98 em Performance e 100 em Acessibilidade, Boas Práticas e SEO. Resultados podem variar conforme máquina, rede e assets de cada campanha.

## Publicação

O projeto está preparado para Vercel.

1. Importe este repositório.
2. Cadastre as variáveis de ambiente.
3. Confirme o domínio usado em `NEXT_PUBLIC_SITE_URL`.
4. Valide WhatsApp, UTMs, GA4 e metadata na URL pública.
5. Publique somente datas, vagas e depoimentos confirmados.

Não há banco de dados, checkout, pagamento online ou painel administrativo nesta versão.

## Antes de uma campanha entrar no ar

1. Defina uma intenção comercial por página.
2. Relacione headline, anúncio e `utm_content`.
3. Confirme o número oficial do WhatsApp.
4. Substitua conteúdos simulados por materiais autorizados.
5. Revise datas, vagas, endereço e condições dos planos.
6. Teste a jornada completa no celular.
7. Registre a campanha sem apagar as variantes anteriores.

## Documentação

| Documento | Para que serve |
| --- | --- |
| [`docs/CAMPAIGNS.md`](./CAMPAIGNS.md) | Rotas, variantes, assets e fluxo de novas campanhas |
| [`docs/TRACKING.md`](./TRACKING.md) | Eventos, propriedades, UTMs e limites de privacidade |
| [`docs/superpowers/specs/`](./docs/superpowers/specs/) | Decisões de experiência, conversão e direção visual |
| [`docs/superpowers/plans/`](./docs/superpowers/plans/) | Histórico dos ciclos de implementação |

## Uso do projeto

Código, identidade e assets reunidos para as campanhas digitais do Grupo Forró do Bom. O repositório não concede licença automática para redistribuição da marca, das imagens ou da tipografia.

Mantido em [@acssjr](https://github.com/acssjr).
