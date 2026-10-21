import type { Cohort, DemoState, Material } from "./model";

export const cohorts: Cohort[] = [
  { code: "GFB-T01", id: "iniciante-quinta", name: "Iniciante · Quinta", level: "Iniciante", day: "Quinta-feira", shortDay: "QUI", time: "19h30–21h30", teacher: "Tailan", start: "2026-10-01", capacity: 24 },
  { code: "GFB-T02", id: "iniciante-sabado", name: "Iniciante · Sábado", level: "Iniciante", day: "Sábado", shortDay: "SÁB", time: "14h–15h30", teacher: "Sthefanie e Luinne", start: "2026-10-03", capacity: 24 },
  { code: "GFB-T03", id: "basico-sabado", name: "Básico · Sábado", level: "Básico", day: "Sábado", shortDay: "SÁB", time: "15h30–17h", teacher: "Tailan", start: "2026-10-03", capacity: 24 },
  { code: "GFB-T04", id: "intermediario-sabado", name: "Intermediário · Sábado", level: "Intermediário", day: "Sábado", shortDay: "SÁB", time: "17h–18h30", teacher: "Tailan", start: "2026-10-03", capacity: 24 },
  { code: "GFB-T05", id: "avancado-segunda", name: "Avançado · Segunda", level: "Avançado", day: "Segunda-feira", shortDay: "SEG", time: "19h30–21h30", teacher: "Tailan e Karine", start: "2026-10-05", capacity: 24 },
];
export const materials: Material[] = [
  { id: "marcacao", title: "Marcação e ritmo", duration: "03:20", topic: "Musicalidade", level: "Iniciante", tags: ["Ritmo", "Individual", "Fundamentos"] },
  { id: "base-frontal", title: "Base frente e trás", duration: "04:15", topic: "Bases", level: "Iniciante", tags: ["Deslocamento", "Dupla", "Fundamentos"] },
  { id: "peso", title: "Transferência de peso", duration: "04:00", topic: "Consciência corporal", level: "Iniciante", tags: ["Equilíbrio", "Individual", "Fundamentos"] },
  { id: "lateral", title: "Dois pra lá, dois pra cá", duration: "03:45", topic: "Bases", level: "Iniciante", tags: ["Base lateral", "Dupla", "Ritmo"] },
  { id: "pedida-espaco", title: "Pedida de espaço", duration: "05:10", topic: "Conexão", level: "Iniciante", tags: ["Condução", "Dupla", "Espaço"] },
  { id: "abertura", title: "Abertura básica", duration: "04:30", topic: "Conexão", level: "Iniciante", tags: ["Condução", "Dupla", "Transição"] },
  { id: "troca", title: "Troca de pares e conexão", duration: "02:45", topic: "Conexão", level: "Iniciante", tags: ["Dupla", "Prática", "Conexão"] },
  { id: "caminhada", title: "Caminhada no forró", duration: "04:20", topic: "Deslocamentos", level: "Básico", tags: ["Deslocamento", "Dupla", "Musicalidade"] },
  { id: "giro", title: "Giro simples", duration: "05:00", topic: "Giros", level: "Básico", tags: ["Eixo", "Condução", "Dupla"] },
];
export const initialState: DemoState = {
  version: 1, ready: false,
  students: [
    { id: "marina", name: "Marina Costa", cohortIds: ["iniciante-quinta"], level: "Iniciante", plan: "Essencial GFB", active: true, attendance: 50, streak: 2, note: "Precisa de mais confiança na troca de pares.", followup: "" },
    { id: "pedro", name: "Pedro Lima", cohortIds: ["iniciante-quinta"], level: "Iniciante", plan: "Essencial GFB", active: true, attendance: 100, streak: 0, note: "", followup: "" },
    { id: "ana", name: "Ana Souza", cohortIds: ["iniciante-quinta", "iniciante-sabado"], level: "Iniciante", plan: "GFB Plus", active: true, attendance: 100, streak: 0, note: "", followup: "" },
    { id: "lucas", name: "Lucas Santos", cohortIds: ["iniciante-quinta"], level: "Iniciante", plan: "Primeira aula", active: true, attendance: 100, streak: 0, note: "Primeira aula paga. A continuidade ainda será decidida.", followup: "" },
    { id: "beatriz", name: "Beatriz Rocha", cohortIds: ["iniciante-quinta"], level: "Iniciante", plan: "Essencial GFB", active: true, attendance: 75, streak: 0, note: "Ausência avisada à equipe.", followup: "" },
    { id: "rafael", name: "Rafael Alves", cohortIds: ["iniciante-quinta"], level: "Iniciante", plan: "Essencial GFB", active: true, attendance: 75, streak: 0, note: "", followup: "" },
    { id: "julia", name: "Júlia Martins", cohortIds: ["iniciante-sabado"], level: "Iniciante", plan: "Essencial GFB", active: true, attendance: 100, streak: 0, note: "", followup: "" },
    { id: "bruno", name: "Bruno Oliveira", cohortIds: ["basico-sabado"], level: "Básico", plan: "Essencial GFB", active: true, attendance: 50, streak: 2, note: "", followup: "" },
    { id: "carla", name: "Carla Ribeiro", cohortIds: ["basico-sabado"], level: "Básico", plan: "Essencial GFB", active: true, attendance: 100, streak: 0, note: "", followup: "" },
    { id: "diego", name: "Diego Fernandes", cohortIds: ["intermediario-sabado"], level: "Intermediário", plan: "Essencial GFB", active: true, attendance: 50, streak: 3, note: "", followup: "" },
    { id: "elisa", name: "Elisa Almeida", cohortIds: ["intermediario-sabado"], level: "Intermediário", plan: "Essencial GFB", active: true, attendance: 100, streak: 0, note: "", followup: "" },
    { id: "felipe", name: "Felipe Moura", cohortIds: ["avancado-segunda"], level: "Avançado", plan: "Essencial GFB", active: true, attendance: 100, streak: 0, note: "", followup: "" },
    { id: "gabriela", name: "Gabriela Melo", cohortIds: ["avancado-segunda"], level: "Avançado", plan: "Essencial GFB", active: false, attendance: 75, streak: 0, note: "", followup: "" },
  ],
  payments: [
    { id: "p1", studentId: "marina", label: "Essencial · mensalidade", amount: 7900, paid: false, due: "2026-10-20", cycle: "Outubro · turma quinta" },
    { id: "p2", studentId: "pedro", label: "Essencial · mensalidade", amount: 7900, paid: true, due: "2026-10-22", cycle: "Outubro · turma quinta" },
    { id: "p3", studentId: "ana", label: "GFB Plus · mensalidade", amount: 17900, paid: true, due: "2026-10-22", cycle: "Outubro · turma quinta" },
    { id: "p4", studentId: "lucas", label: "Primeira aula", amount: 3900, paid: true, due: "2026-10-22", cycle: "Primeiro mês · turma quinta" },
    { id: "p5", studentId: "bruno", label: "Essencial · mensalidade", amount: 7900, paid: false, due: "2026-10-18", cycle: "Outubro · turma sábado" },
    { id: "p6", studentId: "rafael", label: "Essencial · mensalidade", amount: 7900, paid: false, due: "2026-10-24", cycle: "Outubro · turma quinta" },
    { id: "p7", studentId: "carla", label: "Complemento do primeiro mês", amount: 4000, paid: true, due: "2026-10-21", cycle: "Primeiro mês · turma sábado" },
    { id: "p8", studentId: "carla", label: "Primeira aula", amount: 3900, paid: true, due: "2026-10-03", cycle: "Primeiro mês · turma sábado" },
  ],
  lessons: [
    { cohortId: "iniciante-quinta", date: "2026-10-22", title: "Marcação, base frontal e troca de pares", summary: "Retomamos a marcação e praticamos a base frontal. Trabalhamos a troca de pares com atenção ao ritmo e à conexão.", privateNote: "A turma precisa de mais prática na transição entre as bases.", materialIds: ["marcacao", "base-frontal"] },
    { cohortId: "iniciante-quinta", date: "2026-10-15", title: "Marcação e conexão", summary: "Praticamos a marcação e a conexão durante as trocas de pares.", privateNote: "", materialIds: ["marcacao"], published: { title: "Marcação e conexão", summary: "Praticamos a marcação e a conexão durante as trocas de pares.", materialIds: ["marcacao"], at: "2026-10-15T22:00:00Z" } },
  ],
  events: [
    { id: "exame", name: "Exame de nível", kind: "Exame de nível", date: "2026-10-25", time: "14h", description: "Organização de alunos elegíveis, critérios e avaliação pedagógica.", criteria: "Critérios e elegibilidade a definir com Tailan.", participants: [{ studentId: "bruno", paid: false, checkedIn: false, courtesy: true }, { studentId: "carla", paid: false, checkedIn: false, courtesy: true }] },
    { id: "encontro", name: "Encontro GFB", kind: "Evento", date: "2026-11-15", time: "17h", description: "Exemplo de controle de inscrição, pagamento e presença em um evento da escola.", criteria: "Preço e regras comerciais ainda não definidos.", participants: [{ studentId: "marina", paid: true, checkedIn: false, courtesy: false }, { studentId: "pedro", paid: false, checkedIn: false, courtesy: false }, { studentId: "ana", paid: false, checkedIn: false, courtesy: true }] },
  ],
  notices: [{ id: "n1", title: "Conteúdos da última aula", body: "Os materiais de marcação e conexão já estão disponíveis para nossa turma.", cohortId: "iniciante-quinta", published: false, whatsapp: true }],
  attendance: { "iniciante-quinta:2026-10-22": { pedro: "present", ana: "present", lucas: "present", beatriz: "justified" } }, attendanceSaved: {}, history: [],
};
