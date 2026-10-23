"use client";

import { useEffect } from "react";

/** Fixed body also prevents background panning on iOS; preserve the visible offset. */
export function useMobileMenuScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const mobile = matchMedia("(width < 768px)");
    let restore: (() => void) | undefined;
    const sync = () => {
      if (!mobile.matches) { restore?.(); restore = undefined; return; }
      if (restore) return;
      const body = document.body, root = document.documentElement;
      const x = window.scrollX, y = window.scrollY;
      const bodyBefore = { position:body.style.position, top:body.style.top, left:body.style.left, right:body.style.right, width:body.style.width, overflow:body.style.overflow, overscrollBehavior:body.style.overscrollBehavior };
      const rootBefore = { overflow:root.style.overflow, overscrollBehavior:root.style.overscrollBehavior, scrollBehavior:root.style.scrollBehavior };
      Object.assign(body.style,{ position:"fixed", top:`${-y}px`, left:"0", right:"0", width:"100%", overflow:"hidden", overscrollBehavior:"none" });
      Object.assign(root.style,{ overflow:"hidden", overscrollBehavior:"none", scrollBehavior:"auto" });
      restore = () => {
        Object.assign(body.style,bodyBefore);
        Object.assign(root.style,{ ...rootBefore, scrollBehavior:"auto" });
        window.scrollTo({ left:x, top:y, behavior:"instant" });
        root.style.scrollBehavior = rootBefore.scrollBehavior;
      };
    };
    sync(); mobile.addEventListener("change",sync);
    return () => { mobile.removeEventListener("change",sync); restore?.(); };
  },[active]);
}
