import type { Metadata } from "next";
import { LoginPage } from "@/modules/management/auth/LoginPage";

export const metadata: Metadata = {
  title: "Entrar | GFB Gestão",
  description: "Acesso à gestão do Grupo Forró do Bom.",
  alternates: { canonical: "/gestao/login" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LoginPage />;
}
