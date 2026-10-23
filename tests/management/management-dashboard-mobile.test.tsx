import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { useRef, useState, type ReactNode } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { gsap } from "gsap";
import { ManagementShell } from "@/modules/management/components/ManagementShell";
import { Dashboard } from "@/modules/management/components/Dashboard";
import { ManagementProvider } from "@/modules/management/components/ManagementProvider";
import { useMoreMenuMotion } from "@/modules/management/components/useMoreMenuMotion";

vi.mock("next/navigation", () => ({ usePathname: () => "/gestao", useRouter: () => ({ push:vi.fn() }) }));
vi.mock("@/modules/management/components/ManagementGlass", () => ({ ManagementGlass: () => <span data-testid="glass-material" /> }));
vi.mock("@/modules/management/components/useSidebarMotion", () => ({ useSidebarMotion: () => vi.fn() }));
vi.mock("@/modules/management/components/NavigationNotch", () => ({ NavigationNotch: () => null }));
vi.mock("@/modules/management/components/GlobalSearch", () => ({ GlobalSearch: () => null }));
vi.mock("@/modules/management/components/HeaderActions", () => ({ HeaderActions: () => null }));
vi.mock("@/modules/management/components/ManagementContentMotion", () => ({ ManagementContentMotion: ({ children }: { children:ReactNode }) => children }));
vi.mock("simple-liquid-glass", () => ({ LiquidGlass: () => null }));
vi.mock("simple-liquid-glass/backdrop", () => ({ LiquidGlassScene: ({ children, className }: { children: ReactNode; className: string }) => <div className={className}>{children}</div> }));
vi.mock("@/modules/management/components/BorderBeam", () => ({ BorderBeam: () => null }));
vi.mock("@/modules/management/auth/AccessProvider", () => ({ useAccess: () => ({ user: { id:"tailan", name:"Tailan", role:"Administrador", active:true, privileges:["Turmas e presenças","Alunos","Conteúdos","Comunicados","Financeiro","Eventos","Gerenciar acessos"] } }) }));
beforeEach(() => {
  const data = new Map<string,string>();
  vi.stubGlobal("localStorage", { getItem:(key:string) => data.get(key) ?? null, setItem:(key:string,value:string) => data.set(key,value) });
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  vi.stubGlobal("matchMedia", () => ({ matches:false, addEventListener() {}, removeEventListener() {} }));
  document.documentElement.style.setProperty("--ease-out","cubic-bezier(0.23, 1, 0.32, 1)");
  document.documentElement.style.setProperty("--ease-in-out","cubic-bezier(0.77, 0, 0.175, 1)");
});
afterEach(() => { gsap.globalTimeline.clear(); gsap.ticker.sleep(); vi.unstubAllGlobals(); });

it("keeps each follow-up action with its student outside the compressed table", () => {
  render(<ManagementProvider><Dashboard /></ManagementProvider>);
  const panel = screen.getByRole("tabpanel", { name:/Acompanhamento/ });
  expect(within(panel).queryByRole("table")).not.toBeInTheDocument();
  const marina = within(panel).getByRole("link", { name:"Marina Costa" }).closest("article")!;
  expect(within(marina).getByRole("link", { name:"Acompanhar" })).toHaveAttribute("href","/gestao/alunos/marina?acompanhar=1");
  expect(within(marina).getByText("2 faltas seguidas")).toBeInTheDocument();
  expect(screen.getByRole("link", { name:"Registrar presenças" })).toHaveAttribute("href","/gestao/turmas/iniciante-quinta/chamada");
});

it("updates agenda selection after repeated activations and resets after changing month", () => {
  render(<ManagementProvider><Dashboard /></ManagementProvider>);
  const group = screen.getByRole("group", { name:"Período da agenda" });
  const today = within(group).getByRole("button", { name:"Hoje" });
  const week = within(group).getByRole("button", { name:"Esta semana" });
  const next = within(group).getByRole("button", { name:"Próxima" });
  fireEvent.mouseOver(week);
  expect(today).toHaveAttribute("aria-pressed","true");
  fireEvent.click(next); fireEvent.click(week);
  expect(week).toHaveAttribute("aria-pressed","true");
  expect(next).toHaveAttribute("aria-pressed","false");
  fireEvent.click(screen.getByRole("button", { name:"Próximo mês" }));
  expect(today).toHaveAttribute("aria-pressed","true");
});

function MenuFixture({ afterClose }: { afterClose: () => void }) {
  const [open,setOpen] = useState(false);
  const surface = useRef<HTMLDivElement>(null);
  useMoreMenuMotion(surface,open,afterClose);
  return <><button onClick={() => setOpen(value => !value)}>Toggle</button><div ref={surface} data-testid="menu" inert={!open}>Opções</div></>;
}
const finish = () => act(() => { gsap.globalTimeline.progress(1); });
it("retains menu exit, reverses interrupted closing and only releases material after closing", () => {
  const afterClose = vi.fn();
  render(<MenuFixture afterClose={afterClose} />);
  finish(); afterClose.mockClear();
  fireEvent.click(screen.getByText("Toggle")); finish();
  const menu = screen.getByTestId("menu");
  expect(Number(gsap.getProperty(menu,"opacity"))).toBe(1);
  fireEvent.click(screen.getByText("Toggle"));
  expect(afterClose).not.toHaveBeenCalled();
  fireEvent.click(screen.getByText("Toggle")); finish();
  expect(afterClose).not.toHaveBeenCalled();
  expect(Number(gsap.getProperty(menu,"opacity"))).toBe(1);
  fireEvent.click(screen.getByText("Toggle")); finish();
  expect(Number(gsap.getProperty(menu,"opacity"))).toBe(0);
  expect(afterClose).toHaveBeenCalledTimes(1);
});

it("opens all navigation cards with raster icons, no header or expansion control, and retains glass during exit", () => {
  render(<ManagementProvider><ManagementShell><p>Conteúdo</p></ManagementShell></ManagementProvider>);
  finish();
  // JSDOM keeps the desktop CSS branch; target the mobile structure explicitly.
  fireEvent.click(within(screen.getByLabelText("Navegação no celular")).getByText("Mais"));
  finish();
  const menu = document.getElementById("management-mobile-more")!;
  const nav = document.getElementById("management-more-cards")!;
  expect(within(nav).getAllByRole("link", { hidden:true })).toHaveLength(7);
  expect(within(nav).getByText("Configurações").closest("a")).toHaveAttribute("href","/gestao/configuracoes");
  expect(within(menu).queryByText("Mais opções")).not.toBeInTheDocument();
  expect(within(menu).queryByText(/Ver mais|Ver menos/)).not.toBeInTheDocument();
  for (const link of within(nav).getAllByRole("link", { hidden:true })) {
    expect(link.querySelector("img")).toHaveAttribute("width", "26");
    expect(link.querySelector("img")).toHaveAttribute("alt", "");
  }
  fireEvent.click(within(screen.getByLabelText("Navegação no celular")).getByText("Mais"));
  expect(within(menu).getByTestId("glass-material")).toBeInTheDocument();
  finish();
  expect(within(menu).queryByTestId("glass-material")).not.toBeInTheDocument();
  expect(menu).toHaveAttribute("inert");
});
