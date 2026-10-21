import { ManagementProvider } from "@/modules/management/components/ManagementProvider";
import { ManagementShell } from "@/modules/management/components/ManagementShell";
import { AccessProvider } from "@/modules/management/auth/AccessProvider";
import { requireUser } from "@/modules/management/auth/server/session";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return <AccessProvider initialUser={user}><ManagementProvider><ManagementShell>{children}</ManagementShell></ManagementProvider></AccessProvider>;
}
