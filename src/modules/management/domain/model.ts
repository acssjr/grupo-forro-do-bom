export type AttendanceStatus = "present" | "absent" | "justified";
export type Level = "Iniciante" | "Básico" | "Intermediário" | "Avançado";
export type Section = "inicio" | "turmas" | "alunos" | "financeiro" | "eventos" | "conteudos" | "comunicados" | "equipe" | "configuracoes";
export type Cohort = { code: string; id: string; name: string; level: Level; day: string; shortDay: string; time: string; teacher: string; start: string; capacity: number };
export type StudentEvent = { id: string; studentId: string; at: string; title: string; detail: string; kind: "profile" | "payment" | "attendance" | "access" | "followup" };
export type Student = { createdAt?: string; age?: number; avatarGender?: "male" | "female" | "neutral"; avatarChoice?: "auto" | "young" | "adult" | "mature"; id: string; name: string; cohortIds: string[]; level: Level; plan: "Essencial GFB" | "GFB Plus" | "Primeira aula"; active: boolean; attendance: number; streak: number; note: string; followup: string; followedAt?: string };
export type Payment = { paidAt?: string; id: string; studentId: string; label: string; amount: number; paid: boolean; due: string; cycle: string; eventId?: string };
export type Material = { id: string; title: string; duration: string; topic: string; level?: Level; tags?: string[] };
export type Lesson = { cohortId: string; date: string; title: string; summary: string; privateNote: string; materialIds: string[]; published?: { title: string; summary: string; materialIds: string[]; at: string }; savedAt?: string };
export type SchoolEvent = { id: string; name: string; kind: "Evento" | "Exame de nível"; date: string; time: string; description: string; criteria: string; participants: { studentId: string; paid: boolean; checkedIn: boolean; courtesy: boolean }[] };
export type Notice = { id: string; title: string; body: string; cohortId: string; published: boolean; whatsapp: boolean };
export type DemoState = { studentEvents?: StudentEvent[]; version: 1; ready: boolean; students: Student[]; payments: Payment[]; lessons: Lesson[]; events: SchoolEvent[]; notices: Notice[]; attendance: Record<string, Record<string, AttendanceStatus>>; attendanceSaved: Record<string, string>; history: string[] };
export type Action =
  | { type: "hydrate"; state: DemoState }
  | { type: "student"; student: Student }
  | { type: "add-student"; student: Student }
  | { type: "enroll"; id: string }
  | { type: "payment"; id: string }
  | { type: "lesson"; lesson: Lesson }
  | { type: "attendance"; key: string; values: Record<string, AttendanceStatus> }
  | { type: "event"; event: SchoolEvent }
  | { type: "notice"; notice: Notice }
  | { type: "reset"; state: DemoState };

export const DEMO_DATE = "2026-10-22";
export const STORAGE_KEY = "gfb-gestao-demo-v1";
export const money = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
export const shortDate = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
export const initials = (name: string) => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("");
export const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
export const lessonKey = (cohortId: string, date = DEMO_DATE) => `${cohortId}:${date}`;
export function attendanceTotals(values: Record<string, AttendanceStatus>, studentIds: string[]) {
  return studentIds.reduce((sum, id) => { const value = values[id]; if (value === "present") sum.present++; else if (value) sum.absent++; else sum.unmarked++; return sum; }, { present: 0, absent: 0, unmarked: 0 });
}
export function toggleAttendance(values: Record<string, AttendanceStatus>, id: string, status: AttendanceStatus) {
  const next = { ...values };
  if (next[id] === status) delete next[id]; else next[id] = status;
  return next;
}
export function paymentStatus(payment: Payment) { return payment.paid ? "Pago" : payment.due < DEMO_DATE ? "Em atraso" : "A vencer"; }
export function publishLesson(lesson: Lesson, at: string): Lesson {
  return { ...lesson, published: { title: lesson.title, summary: lesson.summary, materialIds: [...lesson.materialIds], at } };
}
export function reducer(state: DemoState, action: Action): DemoState {
  const at = new Date().toISOString();
  const record = (studentId: string, title: string, detail: string, kind: StudentEvent["kind"]): StudentEvent[] => [{ id: `${at}-${studentId}-${kind}`, studentId, at, title, detail, kind }, ...(state.studentEvents ?? [])].slice(0, 500);
  switch (action.type) {
    case "hydrate": case "reset": return { ...action.state, ready: true };
    case "student": {
      const old = state.students.find(s => s.id === action.student.id);
      if (!old || JSON.stringify(old) === JSON.stringify(action.student)) return state;
      const access = old.active !== action.student.active;
      const followup = old.followup !== action.student.followup;
      return { ...state, students: state.students.map(student => student.id === action.student.id ? action.student : student), studentEvents: record(action.student.id, access ? action.student.active ? "Acesso ativado" : "Acesso desativado" : followup ? "Contato de acompanhamento registrado" : "Cadastro atualizado", access ? "Situação do acesso educacional alterada pela gestão." : followup ? action.student.followup : "Dados ou observações do aluno atualizados pela equipe.", access ? "access" : followup ? "followup" : "profile") };
    }
    case "add-student": return { ...state, students: [...state.students, { ...action.student, createdAt: action.student.createdAt ?? at }], studentEvents: record(action.student.id, "Cadastro criado", "Primeiro registro do aluno na gestão.", "profile") };
    case "enroll": {
      const student = state.students.find((item) => item.id === action.id);
      const firstClass = state.payments.find((payment) => payment.studentId === action.id && payment.label === "Primeira aula" && payment.paid);
      if (!student || student.plan !== "Primeira aula" || !firstClass) return state;
      return { ...state, students: state.students.map((item) => item.id === action.id ? { ...item, plan: "Essencial GFB" } : item), payments: [...state.payments, { id: `complement-${action.id}`, studentId: action.id, label: "Complemento do primeiro mês", amount: 4000, paid: false, due: DEMO_DATE, cycle: firstClass.cycle }] };
    }
    case "payment": {
      const payment = state.payments.find(p => p.id === action.id);
      if (!payment || payment.paid) return state;
      return { ...state, payments: state.payments.map(p => p.id === action.id ? { ...p, paid: true, paidAt: at } : p), studentEvents: record(payment.studentId, "Pagamento confirmado", `${payment.label} · ${money(payment.amount)}`, "payment") };
    }
    case "lesson": return { ...state, lessons: [...state.lessons.filter((lesson) => lessonKey(lesson.cohortId, lesson.date) !== lessonKey(action.lesson.cohortId, action.lesson.date)), action.lesson] };
    case "attendance": return { ...state, attendance: { ...state.attendance, [action.key]: action.values }, attendanceSaved: { ...state.attendanceSaved, [action.key]: at }, history: [`Chamada ${action.key} salva em ${at}`, ...state.history].slice(0, 50) };
    case "event": return { ...state, events: state.events.map((event) => event.id === action.event.id ? action.event : event) };
    case "notice": return { ...state, notices: [...state.notices.filter((notice) => notice.id !== action.notice.id), action.notice] };
  }
}

export function isDemoState(value: unknown): value is DemoState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<DemoState>;
  return candidate.version === 1 && Array.isArray(candidate.students) && candidate.students.length > 0 && candidate.students.every((s) => s && typeof s.id === "string" && typeof s.name === "string" && Array.isArray(s.cohortIds) && typeof s.active === "boolean" && typeof s.note === "string" && typeof s.followup === "string" && typeof s.attendance === "number" && typeof s.streak === "number") && Array.isArray(candidate.payments) && candidate.payments.every((p) => p && typeof p.amount === "number" && typeof p.paid === "boolean" && typeof p.studentId === "string" && typeof p.due === "string") && Array.isArray(candidate.lessons) && candidate.lessons.every((l) => l && typeof l.cohortId === "string" && typeof l.date === "string" && typeof l.title === "string" && typeof l.summary === "string" && typeof l.privateNote === "string" && Array.isArray(l.materialIds)) && Array.isArray(candidate.events) && candidate.events.every((e) => e && typeof e.id === "string" && Array.isArray(e.participants)) && Array.isArray(candidate.notices) && candidate.notices.every((n) => n && typeof n.title === "string" && typeof n.body === "string") && !!candidate.attendance && typeof candidate.attendance === "object" && !Array.isArray(candidate.attendance) && !!candidate.attendanceSaved && typeof candidate.attendanceSaved === "object" && Array.isArray(candidate.history);
}
