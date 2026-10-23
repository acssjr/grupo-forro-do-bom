"use client";

import { Combobox } from "@base-ui/react/combobox";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchManagement, type SearchResult } from "@/modules/management/domain/search";
import { useManagement } from "./ManagementProvider";
import { Icon } from "./Icon";
import { usePopupMotion } from "./usePopupMotion";
import { AnimatedResultList } from "./AnimatedResultList";
import { useWorkspaceSetting } from "./useWorkspaceSetting";
import { useAccess } from "../auth/AccessProvider";
import { canAccessPath, canManagePayouts } from "../auth/types";
import s from "./Management.module.css";

export function GlobalSearch() {
  const { state } = useManagement();
  const { user } = useAccess();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);
  const [usage, saveUsage] = useWorkspaceSetting<Record<string, number>>("search-usage", {});
  const { popupRef, actions } = usePopupMotion(open, () => { setQuery(""); setShowAll(false); setMobileVisible(false); if (mobileVisible) document.getElementById("management-mobile-search")?.focus(); });
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const payoutResult:SearchResult={id:"repasses",title:"Repasses aos professores",detail:"Regras de cálculo e pagamentos da equipe",category:"Área",href:"/gestao/repasses",keywords:"comissao comissoes repasse professor pagamento",icon:"wallet"};
  const searching = Boolean(query.trim());
  const candidates = [...searchManagement(state, query), ...(canManagePayouts(user) && (!searching || /repass|comiss|professor|pagamento/i.test(query)) ? [payoutResult] : [])].filter(item => canAccessPath(user, item.href));
  const ranked = searching ? candidates : [...candidates].sort((a, b) => (usage[b.id] ?? 0) - (usage[a.id] ?? 0));
  const results = ranked.slice(0, searching || showAll ? 10 : 3);
  useEffect(() => {
    let frame = 0;
    const show = () => {
      setMobileVisible(true); setShowAll(false); setOpen(true);
      frame = requestAnimationFrame(() => inputRef.current?.focus());
    };
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); show(); }
    };
    window.addEventListener("keydown", shortcut);
    window.addEventListener("gfb-search-open", show);
    return () => { window.removeEventListener("keydown", shortcut); window.removeEventListener("gfb-search-open", show); cancelAnimationFrame(frame); };
  }, []);
  const select = (item: SearchResult | null) => { if (!item) return; setOpen(false); try { saveUsage({ ...usage, [item.id]: (usage[item.id] ?? 0) + 1 }); } catch { /* Ranking is optional. */ } inputRef.current?.blur(); router.push(item.href); };
  return <div className={s.searchContainer} data-search-open={open || mobileVisible} ref={containerRef}>
    <Combobox.Root<SearchResult> modal={false} items={results} filter={null} value={null} inputValue={query} onInputValueChange={setQuery} open={open} actionsRef={actions} onOpenChange={(next) => { if (next && !open) setShowAll(false); setOpen(next); }} onValueChange={select} autoHighlight itemToStringLabel={(item) => item.title}>
      <div className={s.searchFrame}>
        <Combobox.InputGroup className={s.globalSearch}><Icon name="search" size={19} /><Combobox.Input ref={inputRef} aria-label="Buscar na gestão" placeholder="Buscar alunos, turmas e conteúdos…" onFocus={() => { setShowAll(false); setOpen(true); }} /><kbd aria-label="Atalho Control K"><span>Ctrl</span><span>K</span></kbd></Combobox.InputGroup>
      </div>
      <Combobox.Portal container={containerRef}>
        <Combobox.Backdrop className={s.searchBackdrop} />
        <Combobox.Positioner className={s.searchPositioner} sideOffset={10} align="start">
          <Combobox.Popup ref={popupRef} className={`${s.searchPopup} ${s.animatedPopup}`}>
            <div className={s.searchHeading}>{searching ? "Resultados da busca" : "Sugestões para você"}<span>{results.length} {results.length === 1 ? "resultado" : "resultados"}</span><button type="button" className={s.mobileSearchClose} aria-label="Fechar busca" onClick={() => { inputRef.current?.blur(); setOpen(false); }}><Icon name="close" size={17} /></button></div>
            <Combobox.Empty className={s.searchEmpty}>Nenhum resultado. Tente um nome, código de turma ou função.</Combobox.Empty>
            <AnimatedResultList signature={results.map(item => item.id).join(",")} className={s.searchResults}><Combobox.List id="management-search-results">{(item: SearchResult) => <Combobox.Item key={`${item.category}-${item.id}`} value={item} data-result-id={item.id} className={s.searchResult}><span className={s.searchResultIcon}><Icon name={item.icon} size={20} /></span><span className={s.searchResultText}><strong>{item.title}</strong><small>{item.detail}</small></span><span className={s.searchCategory}>{item.category}</span><Icon name="arrow" size={16} /></Combobox.Item>}</Combobox.List></AnimatedResultList>
            {!searching && ranked.length > 3 && <button type="button" className={s.searchMore} aria-expanded={showAll} aria-controls="management-search-results" onClick={() => setShowAll(value => !value)}>{showAll ? "Ver menos" : `Ver mais (${ranked.length - 3})`}<Icon name="down" size={16} /></button>}
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  </div>;
}
