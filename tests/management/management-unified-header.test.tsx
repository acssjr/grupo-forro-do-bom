import { act, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { MobileHeaderContent, MobileHeaderProvider } from "@/modules/management/components/MobileHeader";
import { PageTitle } from "@/modules/management/components/ui";
let mobile=true;
let notify:(()=>void)|undefined;
beforeEach(()=> { mobile=true; vi.stubGlobal("matchMedia",()=>({get matches(){return mobile;},addEventListener:(_:string,cb:()=>void)=>{notify=cb;},removeEventListener(){}})); });
afterEach(()=>vi.unstubAllGlobals());
function Fixture({title="Alunos",nested=false}:{title?:string;nested?:boolean}) {
 const [slot,setSlot]=useState<HTMLDivElement|null>(null);
 return <MobileHeaderProvider target={slot}><header data-testid="unified"><div>Marca e utilidades</div><div ref={setSlot} data-testid="slot" /></header><main>{nested?<MobileHeaderContent><div data-testid="identity"><span>Avatar</span><PageTitle title={title} description="Dados do aluno" /></div></MobileHeaderContent>:<PageTitle title={title} description="Informações da escola" /> }<p>Dados da tela</p></main></MobileHeaderProvider>;
}
it("places a single mobile title inside the shared header and updates it on navigation",()=>{
 const {rerender}=render(<Fixture />);
 expect(within(screen.getByTestId("unified")).getByRole("heading",{name:"Alunos"})).toBeInTheDocument();
 expect(within(screen.getByRole("main")).queryByRole("heading")).not.toBeInTheDocument();
 rerender(<Fixture title="Financeiro" />);
 expect(screen.getAllByRole("heading")).toHaveLength(1);
 expect(within(screen.getByTestId("unified")).getByRole("heading",{name:"Financeiro"})).toBeInTheDocument();
});
it("restores the original desktop location when the viewport changes",()=>{
 render(<Fixture />);
 mobile=false;act(()=>notify?.());
 expect(screen.getByTestId("slot")).toBeEmptyDOMElement();
 expect(within(screen.getByRole("main")).getByRole("heading",{name:"Alunos"})).toBeInTheDocument();
 mobile=true;act(()=>notify?.());
 expect(within(screen.getByTestId("unified")).getByRole("heading",{name:"Alunos"})).toBeInTheDocument();
 expect(screen.getAllByRole("heading")).toHaveLength(1);
});
it("moves the complete student identity without portalling its nested title twice",()=>{
 render(<Fixture nested title="Marina Costa" />);
 const slot=screen.getByTestId("slot");
 expect(within(slot).getByTestId("identity")).toContainElement(screen.getByRole("heading",{name:"Marina Costa"}));
 expect(screen.getAllByRole("heading")).toHaveLength(1);
});

it("marks the server fallback so mobile can hide it before hydration without duplicating the title",()=>{
 const html=renderToString(<Fixture />);
 const page=new DOMParser().parseFromString(html,"text/html");
 expect(page.querySelectorAll("h1")).toHaveLength(1);
 expect(page.querySelector("h1")?.closest("[data-mobile-header-fallback='true']")).not.toBeNull();
 expect(page.querySelector("[data-testid='slot']")?.childElementCount).toBe(0);
});
