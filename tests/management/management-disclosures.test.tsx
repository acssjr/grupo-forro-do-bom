import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { gsap } from "gsap";
import { AnimatedDisclosure } from "@/shared/ui/AnimatedDisclosure";
import { ManagementProvider, useManagement } from "@/modules/management/components/ManagementProvider";
import { initialState } from "@/modules/management/domain/demo";
import { STORAGE_KEY } from "@/modules/management/domain/model";
import { GlobalSearch } from "@/modules/management/components/GlobalSearch";
import { HeaderActions } from "@/modules/management/components/HeaderActions";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/modules/management/auth/AccessProvider", () => ({ useAccess: () => ({ user: {
  id: "tailan", role: "Administrador", active: true, privileges: ["Turmas e presenças", "Alunos", "Conteúdos", "Comunicados", "Financeiro", "Eventos", "Gerenciar acessos"],
} }) }));

beforeEach(() => {
  const storage = new Map<string, string>();
  vi.stubGlobal("localStorage", { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value), removeItem: (key: string) => storage.delete(key), clear: () => storage.clear() });
  document.documentElement.style.setProperty("--ease-out", "cubic-bezier(0.23, 1, 0.32, 1)");
  document.documentElement.style.setProperty("--ease-in-out", "cubic-bezier(0.77, 0, 0.175, 1)");
});
afterEach(() => { gsap.globalTimeline.clear(); gsap.ticker.sleep(); });

describe("Workspace disclosure behavior", () => {
  it("opens and closes a native disclosure, including reversing before the exit finishes", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
    const { container } = render(<AnimatedDisclosure summary="Histórico">Registros do aluno</AnimatedDisclosure>);
    const summary = screen.getByText("Histórico");
    fireEvent.click(summary);
    expect(summary).toHaveAttribute("aria-expanded", "true");
    expect(container.querySelector("details")).toHaveAttribute("open");
    fireEvent.click(summary);
    expect(summary).toHaveAttribute("aria-expanded", "false");
    // Retain the content while it retracts, rather than disappearing immediately.
    expect(container.querySelector("details")).toHaveAttribute("open");
    fireEvent.click(summary);
    await waitFor(() => expect(summary).toHaveAttribute("aria-expanded", "true"));
    fireEvent.click(summary);
    await waitFor(() => expect(container.querySelector("details")).not.toHaveAttribute("open"));
    vi.unstubAllGlobals();
  });

  it("receives another tab's new notice without reloading and ignores malformed saves", async () => {
    function Notices() { const { state } = useManagement(); return <div>{state.notices.map(n => <p key={n.id}>{n.title}</p>)}</div>; }
    render(<ManagementProvider><Notices /></ManagementProvider>);
    const state = { ...initialState, ready: true, notices: [{ id: "live", title: "Aula confirmada", body: "Nesta quinta", published: true, cohortIds: [] }] };
    act(() => window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: JSON.stringify(state) })));
    expect(await screen.findByText("Aula confirmada")).toBeInTheDocument();
    act(() => window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: "{invalid" })));
    expect(screen.getByText("Aula confirmada")).toBeInTheDocument();
  });

  it("starts with three useful shortcuts, reveals the others and filters by a student's name", async () => {
    render(<ManagementProvider><GlobalSearch /></ManagementProvider>);
    const search = screen.getByRole("combobox", { name: "Buscar na gestão" });
    fireEvent.focus(search);
    await waitFor(() => expect(screen.getAllByRole("option")).toHaveLength(3));
    expect(screen.getByRole("option", { name: /Registrar presenças/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Ver mais/ }));
    await waitFor(() => expect(screen.getAllByRole("option").length).toBeGreaterThan(3));
    fireEvent.change(search, { target: { value: "Marina" } });
    await waitFor(() => expect(screen.getAllByRole("option")).toHaveLength(1));
    expect(screen.getByRole("option", { name: /Marina Costa/ })).toBeInTheDocument();
    fireEvent.keyDown(search, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
  });

  it("inserts a notice into an already open notification panel and retains its exit", async () => {
    render(<ManagementProvider><HeaderActions /></ManagementProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Notificações" }));
    expect(await screen.findByRole("dialog", { name: "Notificações" })).toBeInTheDocument();
    const state = { ...initialState, ready: true, notices: [{ id: "live", title: "Novo material disponível", body: "Prática de quinta", published: true, cohortIds: [] }] };
    act(() => window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: JSON.stringify(state) })));
    expect(await screen.findByText("Novo material disponível")).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("dialog", { name: "Notificações" }), { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Notificações" })).not.toBeInTheDocument());
  });

  it("opens from the mobile search action and returns focus after closing", async () => {
    render(<ManagementProvider><button id="management-mobile-search" onClick={() => window.dispatchEvent(new Event("gfb-search-open"))}>Abrir busca</button><GlobalSearch /></ManagementProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Abrir busca" }));
    const input = screen.getByRole("combobox", { name: "Buscar na gestão" });
    await waitFor(() => expect(input).toHaveFocus());
    expect(await screen.findByText("Sugestões para você")).toBeInTheDocument();
    expect(screen.queryByText(/Enter abrir/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Fechar busca", { selector: "button" }));
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Abrir busca" })).toHaveFocus();
    expect(input.closest("[data-search-open]")).toHaveAttribute("data-search-open", "false");
  });
});
