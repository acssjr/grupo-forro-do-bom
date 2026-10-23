import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { gsap } from "gsap";
import { ManagementContentMotion } from "@/modules/management/components/ManagementContentMotion";

let timelines: gsap.core.Timeline[] = [];
let reduced=false;
let reducedChanged:(()=>void)|undefined;
beforeEach(() => {
  reduced=false;
  document.documentElement.style.setProperty("--ease-out","cubic-bezier(0.23, 1, 0.32, 1)");
  document.documentElement.style.setProperty("--ease-in-out","cubic-bezier(0.77, 0, 0.175, 1)");
  vi.stubGlobal("matchMedia", (query:string) => ({ get matches(){return query.includes("width < 768px") || (query.includes("reduced-motion") && reduced);}, addEventListener:(_:string,cb:()=>void)=>{if(query.includes("reduced-motion"))reducedChanged=cb;}, removeEventListener() {} }));
  timelines=[];
  const create=gsap.timeline;
  vi.spyOn(gsap,"timeline").mockImplementation(vars => {
    const timeline=create.call(gsap,{...vars,paused:true});
    timelines.push(timeline);
    return timeline;
  });
});
afterEach(() => { gsap.globalTimeline.clear(); gsap.ticker.sleep(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
function Page({name="Visão geral",route="inicio//",keyboard=false}:{name?:string;route?:string;keyboard?:boolean}) { return <div data-management-shell data-keyboard-navigation={keyboard}><header><span data-testid="logo">Marca</span><div data-mobile-heading-motion><h1>{name}</h1></div></header><ManagementContentMotion><article key={route} data-management-page={route} data-testid="page"><section aria-label="Dados da tela">Conteúdo</section></article></ManagementContentMotion></div>; }
const x=(node:Element)=>Number(gsap.getProperty(node,"x"));
const finish=()=>act(()=>{timelines.at(-1)?.progress(1);});
it("leaves first paint still and enters later destinations from the right without vertical lift",async()=>{
  const {rerender}=render(<Page />);
  expect(screen.getByTestId("page").style.transform).toBe("");
  rerender(<Page name="Alunos" route="alunos//" />);
  await waitFor(()=>expect(x(screen.getByTestId("page"))).toBe(20));
  expect(Number(gsap.getProperty(screen.getByTestId("page"),"y"))).toBe(0);
  expect(x(screen.getByRole("heading").parentElement!)).toBe(14);
  expect(screen.getByTestId("logo").style.transform).toBe("");
  expect(timelines.at(-1)?.duration()).toBe(.48);
  expect(screen.getByRole("region").style.transform).toBe("");
  finish();
  expect(screen.getByTestId("page").style.transform).toBe("");
});
it("reverses direction on return and clears an interrupted destination",async()=>{
  const {rerender}=render(<Page />);
  rerender(<Page name="Alunos" route="alunos//" />);
  await waitFor(()=>expect(x(screen.getByTestId("page"))).toBe(20));
  const interrupted=screen.getByTestId("page");
  rerender(<Page />);
  await waitFor(()=>expect(x(screen.getByTestId("page"))).toBe(-20));
  expect(x(screen.getByRole("heading").parentElement!)).toBe(14);
  expect(interrupted.style.transform).toBe("");
  expect(interrupted.style.opacity).toBe("");
  finish();
  expect(screen.getByTestId("page").style.transform).toBe("");
});
it("keeps reduced-motion and keyboard navigation immediate",async()=>{
  const {rerender}=render(<Page />);
  reduced=true;
  rerender(<Page name="Alunos" route="alunos//" />);
  await act(async()=>{await Promise.resolve();});
  expect(screen.getByTestId("page").style.transform).toBe("");
  reduced=false;
  rerender(<Page name="Financeiro" route="financeiro//" keyboard />);
  await act(async()=>{await Promise.resolve();});
  expect(screen.getByTestId("page").style.transform).toBe("");
});
it("finishes cleanly when reduced motion is enabled during travel",async()=>{
  const {rerender}=render(<Page />);
  rerender(<Page name="Alunos" route="alunos//" />);
  await waitFor(()=>expect(x(screen.getByTestId("page"))).toBe(20));
  reduced=true;act(()=>reducedChanged?.());
  expect(screen.getByTestId("page").style.transform).toBe("");
  expect(screen.getByTestId("page").style.opacity).toBe("");
});

it("settles heading and page together and enters a completed return from the left",async()=>{
  const {rerender}=render(<Page />);
  rerender(<Page name="Alunos" route="alunos//" />);
  await waitFor(()=>expect(x(screen.getByTestId("page"))).toBe(20));
  act(()=>{timelines.at(-1)?.progress(.5);});
  const heading=screen.getByRole("heading").parentElement!;
  expect(x(heading)).toBeGreaterThan(0);
  expect(x(heading)).toBeLessThan(7);
  expect(x(screen.getByTestId("page"))/20).toBeCloseTo(x(heading)/14,3);
  const intermediate=x(heading);
  rerender(<Page name="Financeiro" route="financeiro//" />);
  await waitFor(()=>expect(screen.getByTestId("page").dataset.managementPage).toBe("financeiro//"));
  await act(async()=>{await Promise.resolve();});
  expect(x(heading)).toBeCloseTo(intermediate,3);
  finish();
  expect(heading.style.transform).toBe("");
  expect(heading.style.opacity).toBe("");
  rerender(<Page />);
  await waitFor(()=>expect(x(screen.getByTestId("page"))).toBe(-20));
  expect(x(heading)).toBe(-14);
  reduced=true;act(()=>reducedChanged?.());
  expect(heading.style.transform).toBe("");
});
