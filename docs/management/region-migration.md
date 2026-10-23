# Infraestrutura em São Paulo

Verificação final: 23 de outubro de 2026.

## Bancos ativos

| Projeto | Projeto Neon ativo | Região |
| --- | --- | --- |
| Grupo Forró do Bom | grupo-forro-do-bom-sp / bold-scene-46152196 | aws-sa-east-1 |
| Radar Cursos | radar-cursos-sp / floral-hall-38798783 | aws-sa-east-1 |
| Pedra AIO | pedra-aio-db-sp / steep-credit-13717142 | aws-sa-east-1 |
| Forrovers | late-pine-82811677 | aws-sa-east-1 |
| Iasmin Psi | floral-base-41852952 | aws-sa-east-1 |
| Vizu | cold-tooth-42493872 | aws-sa-east-1 |
| YouTube Acervo | crimson-paper-69754670 | aws-sa-east-1 |

Os quatro últimos bancos já estavam em São Paulo. GFB, Radar e Pedra foram migrados de Virgínia para novos projetos, pois a região de um projeto Neon existente não pode ser alterada. A Pedra mantém o provisionamento pela integração nativa da Vercel.

## Aplicações e publicação

Os projetos Vercel gfb_lp-main, radar-cursos, mktpedraconstrutora, iasmin-psi, forr-vers-rio e youtube-acervo-aio têm região padrão gru1. As publicações de produção foram verificadas como READY em gru1. Os endereços públicos permanecem os mesmos. Não foi identificada aplicação Vercel correspondente ao banco Vizu.

O GFB fixa a região no vercel.json deste repositório; o Radar também fixa gru1 em seu próprio repositório. Os demais usam a configuração regional do projeto. Ao republicar um deployment antigo pela API, informar explicitamente regions: ["gru1"]: a republicação pode herdar iad1 do deployment de origem mesmo quando a região padrão do projeto já mudou.

Arquivos estáticos continuam na CDN global. Este ajuste diz respeito aos bancos e às funções das aplicações identificadas, sem afirmar residência brasileira para serviços externos, CDN ou backups do provedor.

## Integridade e recuperação

Antes da troca das conexões, as origens foram colocadas em modo somente leitura e suas conexões antigas encerradas. A cópia final foi comparada por contagem e impressão digital do conteúdo de cada tabela:

| Banco | Tabelas | Registros no momento da cópia | Resultado |
| --- | ---: | ---: | --- |
| GFB / gfb_management | 8 | 7 | Conteúdo idêntico |
| GFB / gfb_verification | 8 | 29 | Conteúdo idêntico |
| Radar / neondb | 6 | 342 | Conteúdo idêntico |
| Pedra / neondb | 33 | 1537 | Conteúdo idêntico, incluindo public e neon_auth |

Os destinos aceitam escrita. As origens aged-hall-54743645, square-glade-64548226 e fancy-heart-37139771 foram preservadas somente para recuperação, com os bancos migrados em modo somente leitura. Elas não são réplicas atualizadas da produção.

Os dumps finais e seus manifestos SHA-256 estão em .data/backups/region-migration-20261022/. Credenciais, evidências operacionais e configurações privadas estão em .vercel/region-migration/. Ambas as pastas são ignoradas pelo Git. Não copiar esses conteúdos para documentação pública.

Uma reversão posterior exige reconciliar as escritas realizadas em São Paulo antes de trocar a conexão de volta. Não restaurar os dumps iniciais sobre os destinos ativos nem liberar escrita simultânea nas duas regiões.

## Validação

- GFB: login real com usuário temporário, senha incorreta, cookie seguro, sessão persistente, logout, restrições de professor e acesso de Tailan aos repasses; acesso às páginas da gestão.
- Navegador GFB: dashboard, expansão e recolhimento do menu, repasses em desktop e celular, sem erros de página ou transbordamento horizontal.
- Pedra: /api/health respondeu 200 com consulta real ao armazenamento.
- As seis aplicações responderam HTTP 200 em seus endereços públicos; o Radar encaminhou corretamente ao login.
- Origens confirmadas somente leitura e destinos confirmados graváveis com uma transação temporária.

## Planos e custos

Nenhum plano foi atualizado: Neon Free e Vercel Hobby foram mantidos. A migração não contratou recursos pagos. As cópias de recuperação também ocupam recursos e limites gratuitos enquanto forem mantidas.

Isso não garante o mesmo custo numa futura contratação paga: as tarifas regionais da Vercel podem diferir. Antes de mudar de plano, revisar a tabela vigente de preços.

Referências: [migração entre regiões Neon](https://neon.com/docs/import/migrate-neon-to-another-region), [regiões Neon](https://neon.com/docs/introduction/regions), [região das funções Vercel](https://vercel.com/docs/functions/configuring-functions/region), [preços das funções Vercel](https://vercel.com/docs/functions/usage-and-pricing).
