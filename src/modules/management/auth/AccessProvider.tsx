"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { AccessUser } from "./types";
const Context = createContext<{ user: AccessUser; setUser: (user: AccessUser) => void } | null>(null);
export function AccessProvider({ initialUser, children }: { initialUser: AccessUser; children: ReactNode }) {
  const [user, setUser] = useState(initialUser);
  return <Context.Provider value={{ user, setUser }}>{children}</Context.Provider>;
}
export function useAccess() { const value = useContext(Context); if (!value) throw new Error("Sessão ausente"); return value; }
export async function logout() {
  const response = await fetch("/api/gestao/auth/logout", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
  if (!response.ok) throw new Error("Não foi possível sair. Tente novamente.");
  window.location.replace("/gestao/login");
}
