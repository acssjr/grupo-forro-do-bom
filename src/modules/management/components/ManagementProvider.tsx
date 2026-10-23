"use client";

import { createContext, useContext, useEffect, useReducer, useState, type Dispatch, type ReactNode } from "react";
import { initialState } from "@/modules/management/domain/demo";
import { isDemoState, reducer, STORAGE_KEY, type Action, type DemoState } from "@/modules/management/domain/model";
import s from "./Management.module.css";

const Context = createContext<{ state: DemoState; dispatch: Dispatch<Action>; notify: (message: string) => void; storageError: boolean } | null>(null);
export function ManagementProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [toast, setToast] = useState("");
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); const saved: unknown = raw ? JSON.parse(raw) : null; dispatch({ type: "hydrate", state: isDemoState(saved) ? saved : initialState }); }
    catch { dispatch({ type: "hydrate", state: initialState }); }
    // Other open tabs can publish notices or record follow-ups while this panel is visible.
    const sync = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try { const saved: unknown = JSON.parse(event.newValue); if (isDemoState(saved)) dispatch({ type: "hydrate", state: saved }); } catch { /* Ignore incomplete external saves. */ }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (!state.ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch { queueMicrotask(() => setStorageError(true)); }
  }, [state]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(""), 4500); return () => clearTimeout(timer); }, [toast]);
  return <Context.Provider value={{ state, dispatch, notify: setToast, storageError }}>{children}<div className={`${s.toast} ${toast ? s.toastVisible : ""}`} role="status" aria-live="polite">{toast}</div></Context.Provider>;
}
export function useManagement() { const context = useContext(Context); if (!context) throw new Error("ManagementProvider ausente"); return context; }
