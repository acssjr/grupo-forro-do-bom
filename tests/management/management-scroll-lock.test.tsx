import { act, cleanup, render } from "@testing-library/react";
import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { useMobileMenuScrollLock } from "@/modules/management/components/useMobileMenuScrollLock";

const scrollTo = vi.fn();
let mobile = true;
let changed: (() => void) | undefined;
beforeEach(() => {
  mobile = true;
  vi.stubGlobal("matchMedia", () => ({ get matches() { return mobile; }, addEventListener: (_:string, callback:()=>void) => { changed=callback; }, removeEventListener() {} }));
  vi.stubGlobal("scrollTo", scrollTo);
  Object.defineProperty(window,"scrollY",{ configurable:true,value:420 });
  document.body.style.cssText="position:relative;width:90%;overflow:auto";
  document.documentElement.style.cssText="overflow:auto;scroll-behavior:smooth";
  scrollTo.mockClear();
});
afterEach(() => { cleanup(); document.body.style.cssText=""; document.documentElement.style.cssText=""; vi.unstubAllGlobals(); });
function Fixture({active}:{active:boolean}) { useMobileMenuScrollLock(active); return null; }
it("locks at the current page offset and restores the exact original styles and scroll", () => {
  const {rerender}=render(<Fixture active />);
  expect(document.body.style.position).toBe("fixed");
  expect(document.body.style.top).toBe("-420px");
  expect(document.documentElement.style.overflow).toBe("hidden");
  rerender(<Fixture active={false} />);
  expect(document.body.style.position).toBe("relative");
  expect(document.body.style.width).toBe("90%");
  expect(document.body.style.overflow).toBe("auto");
  expect(document.documentElement.style.scrollBehavior).toBe("smooth");
  expect(scrollTo).toHaveBeenCalledWith({left:0,top:420,behavior:"instant"});
});
it("releases on desktop resize and locks again when returning to mobile", () => {
  render(<Fixture active />);
  mobile=false; act(()=>changed?.());
  expect(document.body.style.position).toBe("relative");
  mobile=true; act(()=>changed?.());
  expect(document.body.style.position).toBe("fixed");
});
it("does not lock desktop and releases on unmount", () => {
  mobile=false;
  const {unmount}=render(<Fixture active />);
  expect(document.body.style.position).toBe("relative");
  mobile=true; act(()=>changed?.());
  expect(document.body.style.position).toBe("fixed");
  unmount();
  expect(document.body.style.position).toBe("relative");
});
