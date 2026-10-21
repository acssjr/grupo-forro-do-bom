export const accessPrivileges = ["Turmas e presenças", "Alunos", "Conteúdos", "Comunicados", "Financeiro", "Eventos", "Gerenciar acessos"] as const;
export type AccessRole = "Administrador" | "Professor" | "Monitor";
export type AccessUser = {
  id: string; name: string; username: string | null; role: AccessRole;
  gender: "male" | "female"; active: boolean; privileges: string[];
  cohortIds: string[]; hasCredentials: boolean; createdAt: string; lastLoginAt: string | null;
};
export type AccessInput = {
  id?: string; name: string; username: string; password?: string; role: AccessRole;
  gender: "male" | "female"; active: boolean; privileges: string[]; cohortIds: string[];
};
export function canManageUsers(user: AccessUser) { return user.role === "Administrador" && user.privileges.includes("Gerenciar acessos"); }
export function canAccessPath(user: AccessUser, pathname: string) {
  const section = pathname.split("/")[2] ?? "";
  if (!section || section === "sem-permissao") return true;
  if (section === "equipe" || section === "configuracoes") return canManageUsers(user);
  const permission = ({ turmas: "Turmas e presenças", alunos: "Alunos", conteudos: "Conteúdos", comunicados: "Comunicados", financeiro: "Financeiro", eventos: "Eventos" } as Record<string, string>)[section];
  return Boolean(permission && user.privileges.includes(permission));
}
