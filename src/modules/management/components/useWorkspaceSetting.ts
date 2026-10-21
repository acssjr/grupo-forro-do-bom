import { useEffect, useState } from "react";

/** Browser preferences are separate from pedagogical records to preserve existing saves. */
export function useWorkspaceSetting<T>(key: string, initial: T) {
  const storageKey = `gfb-workspace-${key}`;
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    const read = () => { try { const raw = localStorage.getItem(storageKey); if (raw) setValue(JSON.parse(raw) as T); } catch { /* Keep defaults if storage is unavailable. */ } };
    queueMicrotask(read);
    window.addEventListener("gfb-workspace-change", read);
    return () => window.removeEventListener("gfb-workspace-change", read);
  }, [storageKey]);
  const save = (next: T) => {
    // Let callers show a failure instead of claiming an unsaved change succeeded.
    localStorage.setItem(storageKey, JSON.stringify(next));
    setValue(next);
    window.dispatchEvent(new Event("gfb-workspace-change"));
  };
  return [value, save] as const;
}
