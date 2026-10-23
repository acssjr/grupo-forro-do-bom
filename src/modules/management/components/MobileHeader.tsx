"use client";

import { cloneElement, createContext, isValidElement, useContext, useMemo, useSyncExternalStore, type ReactElement, type ReactNode } from "react";
import { createPortal } from "react-dom";

const HeaderContext = createContext<{ target:HTMLElement|null; mobile:boolean }>({ target:null, mobile:false });
const InsideHeader = createContext(false);
const subscribe = (update:()=>void) => { const query=matchMedia("(width < 768px)"); query.addEventListener("change",update); return ()=>query.removeEventListener("change",update); };
const mobileSnapshot = () => matchMedia("(width < 768px)").matches;
const serverSnapshot = () => false;

export function MobileHeaderProvider({target,children}:{target:HTMLElement|null;children:ReactNode}) {
  const mobile=useSyncExternalStore(subscribe,mobileSnapshot,serverSnapshot);
  const value=useMemo(()=>({target,mobile}),[target,mobile]);
  return <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>;
}

/** One heading, one DOM location. Desktop keeps its existing in-page layout. */
export function MobileHeaderContent({children}:{children:ReactNode}) {
  const {target,mobile}=useContext(HeaderContext);
  const nested=useContext(InsideHeader);
  if (nested) return children;
  if (!mobile || !target) {
    // Keep desktop markup intact; mobile CSS suppresses the pre-portal copy.
    return isValidElement(children)
      ? cloneElement(children as ReactElement<{ "data-mobile-header-fallback"?: boolean }>, { "data-mobile-header-fallback":true })
      : children;
  }
  return createPortal(<InsideHeader.Provider value>{children}</InsideHeader.Provider>,target);
}
