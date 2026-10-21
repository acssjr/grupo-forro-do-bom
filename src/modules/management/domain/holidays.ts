/** 2026 national calendar + Bahia and Feira de Santana. Sources in docs/gfb-calendar-content-research.md. */
export type SchoolHoliday = { date: string; name: string; scope: "Brasil" | "Bahia" | "Feira de Santana" | "Serviço público federal"; optional?: boolean };
export const schoolHolidays: SchoolHoliday[] = [
  { date:"2026-01-01", name:"Confraternização Universal", scope:"Brasil" },
  { date:"2026-02-16", name:"Carnaval", scope:"Serviço público federal", optional:true },
  { date:"2026-02-17", name:"Carnaval", scope:"Serviço público federal", optional:true },
  { date:"2026-02-18", name:"Quarta-feira de Cinzas · até 14h", scope:"Serviço público federal", optional:true },
  { date:"2026-04-03", name:"Paixão de Cristo", scope:"Brasil" },
  { date:"2026-04-20", name:"Ponto facultativo", scope:"Serviço público federal", optional:true },
  { date:"2026-04-21", name:"Tiradentes", scope:"Brasil" },
  { date:"2026-05-01", name:"Dia do Trabalho", scope:"Brasil" },
  { date:"2026-06-04", name:"Corpus Christi", scope:"Feira de Santana" },
  { date:"2026-06-05", name:"Ponto facultativo", scope:"Serviço público federal", optional:true },
  { date:"2026-06-24", name:"São João", scope:"Feira de Santana" },
  { date:"2026-07-02", name:"Independência da Bahia", scope:"Bahia" },
  { date:"2026-07-26", name:"Senhora Sant’Ana", scope:"Feira de Santana" },
  { date:"2026-09-07", name:"Independência do Brasil", scope:"Brasil" },
  { date:"2026-10-12", name:"Nossa Senhora Aparecida", scope:"Brasil" },
  { date:"2026-10-28", name:"Dia do Servidor Público", scope:"Serviço público federal", optional:true },
  { date:"2026-11-02", name:"Finados", scope:"Brasil" },
  { date:"2026-11-15", name:"Proclamação da República", scope:"Brasil" },
  { date:"2026-11-20", name:"Consciência Negra", scope:"Brasil" },
  { date:"2026-12-24", name:"Véspera de Natal · após 13h", scope:"Serviço público federal", optional:true },
  { date:"2026-12-25", name:"Natal", scope:"Brasil" },
  { date:"2026-12-31", name:"Véspera de Ano Novo · após 13h", scope:"Serviço público federal", optional:true },
];
export function holidaysInMonth(cursor: string) { return schoolHolidays.filter(h=>h.date.startsWith(cursor)); }
