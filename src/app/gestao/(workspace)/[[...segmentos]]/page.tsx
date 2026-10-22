import { notFound } from "next/navigation";
import { ManagementPage } from "@/modules/management/components/ManagementPage";
import { cohorts } from "@/modules/management/domain/demo";
import type { Section } from "@/modules/management/domain/model";
import { requireUser } from "@/modules/management/auth/server/session";
import { canAccessPath } from "@/modules/management/auth/types";
import { Empty } from "@/modules/management/components/ui";

const sections: Section[] = ["inicio", "turmas", "alunos", "financeiro", "eventos", "conteudos", "comunicados", "equipe", "configuracoes"];
export default async function Page({ params, searchParams }: { params: Promise<{ segmentos?: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { segmentos = [] } = await params;
  const user = await requireUser();
  if (!canAccessPath(user, `/gestao/${segmentos.join("/")}`)) return <Empty title="Acesso restrito" text="Seu perfil não tem permissão para acessar esta área. Solicite a liberação ao administrador." />;
  const [raw = "inicio", id, tab] = segmentos;
  if (!sections.includes(raw as Section) || segmentos.length > 3) notFound();
  const section = raw as Section;
  if (section === "turmas" && id && !cohorts.some((cohort) => cohort.id === id)) notFound();
  if (tab && (section !== "turmas" || !["visao", "chamada", "aulas", "acompanhamento"].includes(tab))) notFound();
  if (id && !["turmas", "alunos", "eventos"].includes(section)) notFound();
  if (section === "eventos" && id && !["exame", "encontro"].includes(id)) notFound();
  const rawQuery = await searchParams;
  const query = Object.fromEntries(Object.entries(rawQuery).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
  return <ManagementPage section={section} id={id} tab={tab} query={query} />;
}
