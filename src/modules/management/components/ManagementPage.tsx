"use client";

import { cohorts } from "@/modules/management/domain/demo";
import type { Section } from "@/modules/management/domain/model";
import { useManagement } from "./ManagementProvider";
import { Dashboard } from "./Dashboard";
import { CohortView, CohortsView } from "./CohortViews";
import { StudentDetail, StudentsView } from "./StudentViews";
import { FinanceView } from "./FinanceView";
import { ContentView, EventsView, NoticesView, SettingsView, TeamView } from "./OperationsViews";
import { ManagementSkeleton } from "./ManagementSkeleton";
import { Empty } from "./ui";
import s from "./Management.module.css";

function ManagementScreen({ section, id, tab, query }: { section: Section; id?: string; tab?: string; query: Record<string, string> }) {
  const { state } = useManagement();
  if (!state.ready) return <ManagementSkeleton compact={section !== "inicio"} />;
  if (section === "inicio") return <Dashboard />;
  if (section === "turmas") { const cohort = cohorts.find((item) => item.id === id); return cohort ? <CohortView key={`${id}/${tab}`} cohort={cohort} tab={tab} /> : <CohortsView />; }
  if (section === "alunos") { const student = state.students.find((item) => item.id === id); return id ? student ? <StudentDetail key={id} student={student} /> : <Empty title="Cadastro não encontrado" text="Este aluno não existe nos dados salvos deste navegador. Volte à lista pelo menu Alunos." /> : <StudentsView key={JSON.stringify(query)} initialQuery={query.q} initialCohort={query.turma} initialFilter={query.filtro} />; }
  if (section === "financeiro") return <FinanceView key={query.filtro} initialFilter={query.filtro} />;
  if (section === "eventos") return <EventsView key={id} eventId={id} />;
  if (section === "conteudos") return <ContentView />;
  if (section === "comunicados") return <NoticesView />;
  if (section === "equipe") return <TeamView />;
  return <SettingsView />;
}

export function ManagementPage(props: { section: Section; id?: string; tab?: string; query: Record<string, string> }) {
  const { state } = useManagement();
  if (!state.ready) return <ManagementSkeleton compact={props.section !== "inicio"} />;
  return <div className={s.pageEntrance} data-management-page={`${props.section}/${props.id ?? ""}/${props.tab ?? ""}`} key={`${props.section}/${props.id ?? ""}/${props.tab ?? ""}`}><ManagementScreen {...props} /></div>;
}
