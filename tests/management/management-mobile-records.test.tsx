import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { ManagementProvider } from "@/modules/management/components/ManagementProvider";
import { StudentsView } from "@/modules/management/components/StudentViews";
import { EventsView } from "@/modules/management/components/OperationsViews";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
beforeEach(() => {
  const storage = new Map<string, string>();
  vi.stubGlobal("localStorage", { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) });
});

it("keeps student fields and an explicit profile action together after filtering", () => {
  render(<ManagementProvider><StudentsView /></ManagementProvider>);
  fireEvent.change(screen.getByRole("textbox", { name: "Buscar por nome" }), { target: { value: "Marina" } });
  const table = screen.getByRole("table");
  const rows = within(table).getAllByRole("row");
  expect(rows).toHaveLength(2);
  const record = rows[1];
  expect(within(record).getAllByRole("cell").map(cell => cell.dataset.label)).toEqual(["Aluno", "Nível e turma", "Plano", "Assiduidade", "Acesso", "Ações"]);
  expect(within(record).getByRole("link", { name: "Abrir ficha de Marina Costa" })).toHaveAttribute("href", "/gestao/alunos/marina");
  expect(within(table).getAllByRole("columnheader")).toHaveLength(6);
});

it("keeps receipt and entry actions on the correct participant record", () => {
  render(<ManagementProvider><EventsView eventId="encontro" /></ManagementProvider>);
  fireEvent.change(screen.getByRole("textbox", { name: "Buscar participante" }), { target: { value: "Pedro" } });
  const record = within(screen.getByRole("table")).getAllByRole("row")[1];
  expect(within(record).getAllByRole("cell").map(cell => cell.dataset.label)).toEqual(["Participante", "Inscrição", "Pagamento", "Presença", "Ações"]);
  expect(within(record).getByRole("button", { name: "Registrar entrada" })).toBeDisabled();
  fireEvent.click(within(record).getByRole("button", { name: "Confirmar recebimento" }));
  expect(within(record).getByRole("button", { name: "Registrar entrada" })).toBeEnabled();
  fireEvent.click(within(record).getByRole("button", { name: "Registrar entrada" }));
  expect(within(record).getByText("Entrada registrada")).toBeInTheDocument();
  expect(within(record).getByRole("button", { name: "Desfazer entrada" })).toBeEnabled();
});
