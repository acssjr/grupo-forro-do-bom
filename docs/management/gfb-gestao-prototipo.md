# GFB Gestão — protótipo navegável

## Abrir

Com dependências instaladas: `npm run dev`, depois `/gestao`. A landing continua em `/`.

Nesta sessão o servidor local de desenvolvimento roda em http://localhost:3001/gestao.

## Explorar

- Visão geral: tarefas, turma do dia, faltas consecutivas, recebimentos e calendário.
- Turmas: cinco horários reais do GFB. Abrir uma turma para acessar chamada, aula e acompanhamento.
- Chamada: presente, falta, justificada e sem registro são estados distintos. Toque novamente para desfazer. Salve para persistir; notas individuais têm ação própria de salvar.
- Aula: salvar rascunho não publica; publicar cria um snapshot separado com título, resumo e materiais, excluindo notas internas. A prévia do aluno mostra somente o snapshot publicado.
- Alunos: busca, filtros, ficha, observações, acompanhamento humano, cadastro e acesso demonstrativo.
- Continuidade: na ficha de Lucas, confirmar Essencial cria uma única cobrança demonstrativa de R$40, somada aos R$39 da primeira aula. Não presume nova mensalidade integral nem contratação automática.
- Financeiro: filtros, detalhes, confirmação manual de recebimento e exportação CSV.
- Eventos: inscrição, pagamento/cortesia e presença independentes. A entrada precisa de pagamento confirmado ou cortesia neste exemplo; regras reais ainda serão definidas.
- Conteúdos: catálogo ilustrativo. Sem arquivos didáticos reais.
- Comunicados: rascunhos e publicação simulada. Nenhum WhatsApp conectado.
- Equipe: desenho de permissões e questões pendentes sobre monitoria.
- Configurações: dados da escola e restauração dos dados iniciais com confirmação.

## Dados e limites

Dados de exemplo, sem avisos de demonstração na interface por pedido expresso do usuário. Persistência versionada em localStorage (`gfb-gestao-demo-v1`), somente neste navegador. Nenhuma conta real, controle de acesso seguro, banco compartilhado, transação Pix, QR pagável, upload ou envio de mensagem. As menções a equipe autorizada descrevem a futura operação; não garantem segurança neste protótipo público.

Data de cenário fixa em 22/10/2026, visível na tela. Valores da base alimentam indicadores; nomes, participantes, datas de evento, capacidade e professores atribuídos são demonstração. Datas exatas dos próximos ciclos e monitoria/exames precisam ser definidos com Tailan.

Identidade implementada: preto #101010, amarelo GFB #F6C300, branco e cinzas neutros; Saans local. Logo caligráfica amarela com traço branco, restaurada em PNG a partir da referência do usuário, aplicada em tamanho menor. Variações marrons/creme e máscara anterior isoladas em outputs/gfb-gestao/brand/arquivo-nao-utilizado, fora dos assets públicos da gestão. Sidebar preta recolhível e cabeçalho preto integrados, seleção cinza-escura com ícones amarelos, fundo cinza e seções brancas. Área clara encaixada na moldura escura com canto superior esquerdo de 28px; no mobile, dois cantos superiores de 22px. Calendário com seleção de data, navegação mensal e filtros Hoje/Esta semana/Próxima. Transições de 240ms com respeito à preferência por movimento reduzido.

## Verificação

- `npm test`: 56 testes, incluindo 12 testes de regras da gestão.
- `npm run lint`: aprovado.
- `npm run build`: aprovado, TypeScript incluído.
- `node .impeccable/review/verify-management.cjs`: 33 verificações Chromium com persistência, privacidade da publicação, financeiro, evento, busca, menu mobile, rotas e preservação da landing; sem erros de execução.
- `node .impeccable/review/refine-management.cjs`: 42 verificações adicionais de calendário, barra, logo, recolhimento, persistência, ausência de sobreposição, avisos removidos e responsividade.
- Capturas desktop 1440/1280/986, chamada em 390 e verificações de overflow em 320/768/1024. Tabelas extensas têm rolagem interna; a lista de acompanhamentos torna-se lista de ações no mobile.
- Detector Impeccable: avisos de sublinhado de aba e trilho de frequência mantidos como indicadores funcionais, não bordas decorativas de cartões.
- Revisão independente final: `ship` no escopo do protótipo local; sem problemas materiais nas capturas e fluxos inspecionados.

As dependências existentes apresentaram 14 avisos no `npm ci` (1 moderado, 10 altos, 3 críticos). Não foi aplicado `audit fix` nem alterado o lock nesta entrega visual; antes de disponibilizar dados reais, é necessária investigação própria das dependências e implementação de segurança.

Fontes e CSS da gestão estão isolados em `src/modules/management/components/`; domínio e exemplos em `src/modules/management/domain/`; rotas em `app/gestao/`. A branch local desta implementação é `codex/gfb-gestao-prototipo`. Sem commit, push ou publicação externa nesta etapa.

## Referências de refinamento

O [estudo de UX enviado](https://medium.com/@a.lari.batista/ux-ui-case-study-como-facilitar-a-execu%C3%A7%C3%A3o-de-tarefas-de-gest%C3%A3o-financeira-de-pequenos-m%C3%A9dios-e-7d5fe1cc5bfd) orientou a priorização de tarefas, pendências, vencimentos e ações rápidas. É um estudo de outro domínio, sem validação de pesquisa com usuários do GFB. As referências Dots e de navegação recolhível do Pinterest orientaram a organização espacial e as transições. O vídeo Dots ficou indisponível na última tentativa; sua imagem foi usada, sem alegar reprodução exata do movimento.

A revisão independente final do refinamento aprovou as novas capturas. As primeiras capturas de página inteira do Playwright disparavam a transição de margem durante a captura; a evidência final desativa animações apenas na captura e verifica a geometria estável. A interface mantém suas animações.

Refinamento de legibilidade: nenhum texto operacional abaixo de 14px; logo centralizada na sidebar e perfil com nome/função no canto superior direito. Barras de rolagem da sidebar e da página ocultas, mantendo rolagem funcional. Indicador do Next em desenvolvimento desativado para não cobrir o perfil.

## Makking e refinamento dos indicadores

Makking variável aplicada somente à gestão por CSS local. Arquivos de prévia de letras e símbolos copiados sem modificar os binários; unicode-range calculado do cmap. A landing mantém Saans. Avatar 3D temporário com prompt/proveniência junto ao PNG.

Indicadores personalizados em faixa larga, valores/pesos diferenciados e gradientes amarelo/preto. Comparativos de setembro não são fabricados: alunos e financeiro não têm histórico suficiente; turmas se baseiam nos inícios de outubro, presença em chamadas por mês. Métricas não equivalem a contabilidade histórica completa. Códigos de turma são identificadores propostos para este modelo, sem alterar URLs ou dados existentes.

`verify-overview.cjs`: 19 verificações de fonte, avatar, indicadores, histórico ausente, foco por modalidade, alinhamento, busca por código e overflow em 1440/874/390/320px. `management-metrics.test.ts`: base zero, histórico ausente, pontos percentuais e centavos.

## Cenário visual e busca geral (decisão posterior)

O usuário autorizou explicitamente comparações ilustrativas, sem avisos de demonstração na UI. A visão geral usa82ativos, setembro74;5turmas, setembro4;presença setembro82%;saldo pendente setembroR$316. Os82alunos são um agregado de apresentação; não foram criadas matrículas falsas na lista. Ativações/desativações locais afetam o agregado a partir da base12registros ativos. Estado operacional/localStorage foi preservado.

Busca geral usa Base UI1.7já instalado, sem dependências novas. Busca por nome,código,função,sinônimo; ações e entidades compartilham ranking. Não indexa notas privadas. Escape e clique fora fecham; Enter abre; Ctrl/Cmd+Kfoca. Sem animação de teclado/reordenação.

Motion: varredura beam no hover250ms, card/seta160ms, pressão160ms; somente transform/opacity. Preferência por movimento reduzido preserva opacidade125ms sem deslocamento. A redução de movimento aplicada nas capturas não altera a preferência normal dos usuários. Botões principais em pílula, gradiente sóbrio. Calendário com proporção1:1verificada em320/390/768/874/986/1126/1440px.

Validação atual:66testes Vitest;36checks de busca/movimento/cores/geometria mais33regressões Chromium;lint e build aprovados. Revisão independente final:SHIP.


## Refinamento: organização operacional

- Dashboard: colunas independentes; calendário não altera a altura das aulas. Cards estáticos com beam 10s e aceleração 3x; botões com beam no hover; + gira no próprio eixo. Texto de ação: Registrar presenças.
- Turmas: códigos GFB-T01…T05; iniciante sábado com Sthefanie e Luinne; avançado segunda com Tailan e Karine. Seletores Base UI substituem os nativos.
- Cadastro: idade e estilo/faixa do avatar, com seleção automática por idade e opção manual. Retratos temporários ilustrativos.
- Financeiro: resumo de recebido, pendente e vencido; gráfico acumulado, composição do mês, origens e filtros. Confirmação manual atualiza o painel. Comparação de setembro continua cenário autorizado; valores correntes vêm dos registros.
- Cabeçalho: notificações de ausências, cobranças e comunicados, marcar como lidas; perfil abre painel e permite editar nome. Colapso abaixo da marca; breadcrumb removido.
- Biblioteca compacta: filtro de turma, envio de arquivo, liberação imediata ou agendada por turma. Arquivos binários em IndexedDB; metadados e disponibilidade em chaves gfb-workspace-*.
- Comunicados: rascunho de feriado e prévia que acompanha a edição; publicação local mantém o registro existente.
- Equipe: Tailan, Sthefanie, Luinne, Karine e Thiago; criação/edição local de acesso, privilégios e atribuições. Esses controles ainda não são autenticação nem autorização de servidor. A plataforma do aluno não está integrada à liberação de materiais.
- Configurações: identidade, rotina, notificações e exportação de registros. Exportação JSON não inclui arquivos binários. Preferências de alertas alteram o sino; envio externo de notificações não existe.

Validação deste refinamento: 39 verificações de dashboard/turmas/cadastro/financeiro e 34 de pop-ups/biblioteca/comunicados/equipe/configurações em Chromium. Lint e build de produção aprovados. Suíte geral: 75/76; falha existente em atmosphere-gallery.test.tsx (espera retomar autoplay após interação, enquanto o componente da landing pausa). Não foi alterada a galeria neste refinamento.

## Carregamento e organização — revisão seguinte

Skeleton SSR/rota e hidratação, entradas de telas, grid regular da sidebar e logo sem recorte, hovers de cor/superfície mais evidentes, clique pela linha de aluno. Calendário com hierarquia de mês/ano e feriados de 2026 para Feira de Santana, Bahia e Brasil; pontos facultativos identificados separadamente. Biblioteca com nove movimentos/fundamentos, filtros por nível e tags e miniaturas abstratas, preservando upload e liberação por turma. Modal de acessos em colunas com ações persistentes, scroll interno sem barra, bloqueio do fundo e fechamento externo.

Histórico: createdAt de novos alunos, paidAt real da confirmação, registro de mudanças de acesso, perfil e acompanhamento. Datas legadas ausentes permanecem sem preenchimento inferido. Pesquisa e limites em docs/management/gfb-calendar-content-research.md.

Verificação:63 checks Chromium de geometria/hover/navegação/feriados/filtros/modal/skeleton, sem erros JS ou console;35 testes do módulo aprovados; lint e build aprovados.
