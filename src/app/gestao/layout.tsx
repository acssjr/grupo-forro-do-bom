import "./typography.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = { title: "GFB Gestão", description: "Gestão do Grupo Forró do Bom: alunos, turmas, financeiro e eventos.", robots: { index: false, follow: false }, alternates: { canonical: "/gestao" }, openGraph: { title: "GFB Gestão", description: "Gestão do Grupo Forró do Bom.", url: "/gestao" } };
export const viewport: Viewport = { themeColor: "#101010", colorScheme: "light" };
export default function ManagementLayout({ children }: { children: React.ReactNode }) { return children; }
