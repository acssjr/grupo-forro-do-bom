import { cohorts, materials } from "./demo";
import { normalize, type DemoState } from "./model";

export type SearchResult = { id: string; title: string; detail: string; category: string; href: string; keywords: string; icon: "users" | "calendar" | "wallet" | "video" | "message" | "flag" | "settings" };
const actions: SearchResult[] = [
  { id: "chamada", title: "Registrar presenças", detail: "Registrar presença por turma", category: "Função", href: "/gestao/turmas/iniciante-quinta/chamada", keywords: "presenca presencas assiduidade falta chamada", icon: "calendar" },
  { id: "aula", title: "Registrar aula", detail: "Conteúdo trabalhado e publicação", category: "Função", href: "/gestao/turmas/iniciante-quinta/aulas", keywords: "conteudo passos video publicar aula", icon: "video" },
  { id: "alunos", title: "Alunos", detail: "Cadastros, planos e acompanhamento", category: "Área", href: "/gestao/alunos", keywords: "matricula novo cadastro alunos pessoas", icon: "users" },
  { id: "financeiro", title: "Financeiro", detail: "Cobranças, pagamentos e vencimentos", category: "Área", href: "/gestao/financeiro", keywords: "pix pagamento mensalidade atraso recebimento financeiro", icon: "wallet" },
  { id: "turmas", title: "Turmas e aulas", detail: "Horários e níveis da escola", category: "Área", href: "/gestao/turmas", keywords: "horario calendario agenda grade turmas", icon: "calendar" },
  { id: "comunicados", title: "Comunicados", detail: "Avisos para as turmas", category: "Área", href: "/gestao/comunicados", keywords: "aviso mensagem whatsapp comunicado", icon: "message" },
  { id: "eventos", title: "Eventos e exames", detail: "Inscrição, avaliação e entrada", category: "Área", href: "/gestao/eventos", keywords: "nivel avaliacao festa ingresso exame evento", icon: "flag" },
  { id: "equipe", title: "Equipe e acessos", detail: "Professores, monitores e permissões", category: "Área", href: "/gestao/equipe", keywords: "monitoria tailan professor permissao equipe", icon: "users" },
  { id: "configuracoes", title: "Configurações", detail: "Dados e preferências da escola", category: "Área", href: "/gestao/configuracoes", keywords: "configuracao escola perfil restaurar", icon: "settings" },
];

export function searchManagement(state: DemoState, query: string): SearchResult[] {
  const entries: SearchResult[] = [...actions,
    ...state.students.map((student): SearchResult => ({ id: `student-${student.id}`, title: student.name, detail: `${student.level} · ${student.plan}`, category: "Aluno", href: `/gestao/alunos/${student.id}`, keywords: "aluno estudante", icon: "users" })),
    ...cohorts.map((cohort): SearchResult => ({ id: cohort.id, title: cohort.name, detail: `${cohort.code} · ${cohort.time}`, category: "Turma", href: `/gestao/turmas/${cohort.id}`, keywords: `${cohort.teacher} ${cohort.code} ${cohort.day}`, icon: "calendar" })),
    ...materials.map((material): SearchResult => ({ id: material.id, title: material.title, detail: material.topic, category: "Conteúdo", href: "/gestao/conteudos", keywords: "video conteudo material", icon: "video" })),
    ...state.events.map((event): SearchResult => ({ id: event.id, title: event.name, detail: `${event.kind} · ${event.date}`, category: "Evento", href: `/gestao/eventos/${event.id}`, keywords: event.kind, icon: "flag" })),
    ...state.notices.map((notice): SearchResult => ({ id: notice.id, title: notice.title, detail: notice.published ? "Publicado" : "Rascunho", category: "Comunicado", href: "/gestao/comunicados", keywords: "aviso comunicado", icon: "message" })),
  ];
  const text = normalize(query);
  if (!text) return actions.slice(0, 5);
  const terms = text.split(/\s+/);
  return entries.map((entry, index) => {
    const title = normalize(entry.title);
    const full = normalize(`${entry.title} ${entry.detail} ${entry.keywords} ${entry.category}`);
    const score = !terms.every((term) => full.includes(term)) ? -1 : title === text ? 100 : title.startsWith(text) ? 80 : title.includes(text) ? 60 : normalize(entry.detail).includes(text) ? 40 : 20;
    return { entry, score, index };
  }).filter((item) => item.score >= 0).sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 10).map((item) => item.entry);
}
