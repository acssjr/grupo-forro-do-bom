"use client";

import { Combobox } from "@base-ui/react/combobox";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchManagement, type SearchResult } from "@/modules/management/domain/search";
import { useManagement } from "./ManagementProvider";
import { Icon } from "./Icon";
import s from "./Management.module.css";

export function GlobalSearch() {
  const { state } = useManagement();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const results = searchManagement(state, query);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); inputRef.current?.focus(); setOpen(true); } };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  const select = (item: SearchResult | null) => { if (!item) return; setOpen(false); setQuery(""); inputRef.current?.blur(); router.push(item.href); };
  return <div className={s.searchContainer} ref={containerRef}>
    <Combobox.Root<SearchResult> items={results} filter={null} value={null} inputValue={query} onInputValueChange={setQuery} open={open} onOpenChange={setOpen} onValueChange={select} autoHighlight itemToStringLabel={(item) => item.title}>
      <div className={s.searchFrame}>
        <Combobox.InputGroup className={s.globalSearch}><Icon name="search" size={19} /><Combobox.Input ref={inputRef} aria-label="Buscar na gestão" placeholder="Buscar alunos, turmas e conteúdos…" onFocus={() => setOpen(true)} /><kbd aria-label="Atalho Control K"><span>Ctrl</span><span>K</span></kbd></Combobox.InputGroup>
      </div>
      <Combobox.Portal container={containerRef}>
        <Combobox.Positioner className={s.searchPositioner} sideOffset={10} align="start">
          <Combobox.Popup className={s.searchPopup}>
            <div className={s.searchHeading}>{query ? "Resultados da busca" : "Acessos rápidos"}<span>{results.length} {results.length === 1 ? "resultado" : "resultados"}</span></div>
            <Combobox.Empty className={s.searchEmpty}>Nenhum resultado. Tente um nome, código de turma ou função.</Combobox.Empty>
            <Combobox.List className={s.searchResults}>{(item: SearchResult) => <Combobox.Item key={`${item.category}-${item.id}`} value={item} className={s.searchResult}><span className={s.searchResultIcon}><Icon name={item.icon} size={20} /></span><span className={s.searchResultText}><strong>{item.title}</strong><small>{item.detail}</small></span><span className={s.searchCategory}>{item.category}</span><Icon name="arrow" size={16} /></Combobox.Item>}</Combobox.List>
            <div className={s.searchHint}>↑ ↓ navegar · Enter abrir · Esc fechar</div>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  </div>;
}
