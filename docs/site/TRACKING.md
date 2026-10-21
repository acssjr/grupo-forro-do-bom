# Plano de tracking — Grupo Forró do Bom

## Objetivo

Medir quais mensagens, horários e planos iniciam conversas qualificadas. O GA4 é carregado apenas quando `NEXT_PUBLIC_GA4_MEASUREMENT_ID` está configurado. Nenhum evento envia nome, telefone, texto da mensagem ou outro dado pessoal.

## Eventos

| Evento | Quando dispara | Propriedades possíveis |
| --- | --- | --- |
| `landing_viewed` | Primeira montagem da landing | UTMs disponíveis |
| `cta_clicked` | Clique em CTA para WhatsApp | `cta_location`, `user_intent`, plano, horário ou nível quando aplicável |
| `whatsapp_started` | Clique que abre um link `wa.me` configurado | `cta_location`, `user_intent`, plano, horário ou nível |
| `pricing_plan_selected` | Escolha de um dos três planos | `plan_name`, `cta_location`, `user_intent` |
| `leveling_info_opened` | Abertura do modal de nivelamento | `user_intent` |
| `leveling_whatsapp_started` | CTA de nivelamento | `level_intended`, `cta_location`, `user_intent` |
| `schedule_interest_selected` | Seleção de quinta ou sábado | `schedule`, `user_intent` |
| `waitlist_clicked` | Clique para entrar na lista prioritária | `schedule`, `cta_location`, `user_intent` |
| `map_clicked` | Clique em “Ver rota” | `cta_location` |
| `faq_opened` | Abertura de uma pergunta | `cta_location` |

## UTMs

Parâmetros aceitos: `utm_source`, `utm_medium`, `utm_campaign` e `utm_content`. Eles são lidos da URL, limitados a 120 caracteres, armazenados em `sessionStorage` e anexados aos eventos seguintes. `utm_term` e parâmetros desconhecidos são ignorados.

## Proteção contra PII

`lib/analytics.ts` usa uma lista fechada de propriedades. Campos como `name`, `phone`, `message` ou qualquer chave não documentada são descartados antes de chegar ao `gtag`.

## Validação no GA4

1. Configure a medição em `.env.local`.
2. Abra o site com UTMs de teste.
3. Use o DebugView do GA4 para conferir eventos e propriedades.
4. Confirme que cada clique gera um único evento e que nenhum dado pessoal aparece.
5. Marque como conversões apenas os eventos que representam avanço comercial real.
