import { act, fireEvent, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { gsap } from "gsap";
import { useMobileDockMotion } from "@/modules/management/components/useMobileDockMotion";

function Fixture({ selected = "home" }: { selected?: string }) {
  const nav = useRef<HTMLElement>(null);
  useMobileDockMotion(nav, selected);
  return <nav ref={element => {
    nav.current = element;
    if (element) Object.defineProperty(element, "offsetWidth", { configurable: true, value: 300 });
  }}><span data-dock-lens data-testid="lens" />{["home", "classes", "more"].map((id, index) =>
    <button key={id} data-dock-item data-selected={selected === id} ref={element => {
      if (!element) return;
      for (const [key, value] of Object.entries({ offsetLeft: 8 + index * 96, offsetTop: 8, offsetWidth: 90, offsetHeight: 59 }))
        Object.defineProperty(element, key, { configurable: true, value });
    }}>{id}</button>)}</nav>;
}

let resizeCallbacks: (() => void)[] = [];
beforeEach(() => {
  resizeCallbacks = [];
  document.documentElement.style.setProperty("--ease-in-out", "cubic-bezier(0.77, 0, 0.175, 1)");
  vi.stubGlobal("ResizeObserver", class { constructor(callback: () => void) { resizeCallbacks.push(callback); } observe() {} disconnect() {} });
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("pointer: fine"), addEventListener() {}, removeEventListener() {} }));
});
afterEach(() => { gsap.globalTimeline.clear(); gsap.ticker.sleep(); vi.unstubAllGlobals(); });
const finish = () => act(() => { gsap.globalTimeline.progress(1); });
const lensX = () => Number(gsap.getProperty(screen.getByTestId("lens"), "x"));

it("moves only after click activation and ignores hover and focus", () => {
  render(<Fixture />);
  expect(lensX()).toBe(8);
  fireEvent.pointerOver(screen.getByText("classes"));
  fireEvent.focus(screen.getByText("classes"));
  finish();
  expect(lensX()).toBe(8);
  fireEvent.click(screen.getByText("classes"));
  finish();
  expect(lensX()).toBe(104);
  fireEvent.click(screen.getByText("more"));
  finish();
  expect(lensX()).toBe(200);
  fireEvent.pointerLeave(screen.getByRole("navigation"));
  finish();
  expect(lensX()).toBe(200);
});

it("retargets from the visible position during navigation rather than resetting", () => {
  const { rerender } = render(<Fixture />);
  rerender(<Fixture selected="more" />);
  expect(lensX()).toBe(8);
  finish();
  expect(lensX()).toBe(200);
  rerender(<Fixture selected="classes" />);
  expect(lensX()).toBe(200);
  finish();
  expect(lensX()).toBe(104);
});

it("does not let the first resize observation snap a selection transition", () => {
  const { rerender } = render(<Fixture />);
  rerender(<Fixture selected="more" />);
  act(() => { for (const tween of gsap.getTweensOf(screen.getByTestId("lens"))) tween.progress(.4); });
  const midway = lensX();
  expect(midway).toBeGreaterThan(8);
  expect(midway).toBeLessThan(200);
  act(() => resizeCallbacks.forEach(callback => callback()));
  expect(lensX()).toBe(midway);
  finish();
  expect(lensX()).toBe(200);
});

it("lifts a glass lens during travel and settles without scaling the labels", () => {
  render(<Fixture />);
  fireEvent.click(screen.getByText("more"));
  const lens = screen.getByTestId("lens");
  act(() => gsap.getTweensOf(lens).forEach(tween => tween.progress(.4)));
  expect(Number(gsap.getProperty(lens,"scaleX"))).toBeGreaterThan(1);
  finish();
  expect(Number(gsap.getProperty(lens,"scaleX"))).toBe(1);
  expect(Number(gsap.getProperty(lens,"y"))).toBe(8);
  expect(screen.getByText("more").style.transform).toBe("");
});

it("keeps reduced-motion selection stationary in height with no lift", () => {
  vi.stubGlobal("matchMedia", () => ({matches:true,addEventListener(){},removeEventListener(){}}));
  render(<Fixture />);
  fireEvent.click(screen.getByText("more"));
  expect(lensX()).toBe(200);
  expect(Number(gsap.getProperty(screen.getByTestId("lens"),"scaleX"))).toBe(1);
  expect(Number(gsap.getProperty(screen.getByTestId("lens"),"y"))).toBe(8);
});

it("settles on the last destination after rapid clicks and route confirmation", () => {
  const { rerender } = render(<Fixture />);
  const lens = screen.getByTestId("lens");
  fireEvent.click(screen.getByText("more"));
  act(() => gsap.getTweensOf(lens).forEach(tween => tween.progress(.3)));
  fireEvent.click(screen.getByText("classes"));
  rerender(<Fixture selected="classes" />);
  finish();
  expect(lensX()).toBe(104);
  expect(Number(gsap.getProperty(lens,"y"))).toBe(8);
  expect(Number(gsap.getProperty(lens,"scaleX"))).toBe(1);
  expect(Number(gsap.getProperty(lens,"scaleY"))).toBe(1);
  expect(document.querySelectorAll("[data-dock-lens]")).toHaveLength(1);
});

it("cancels travel when no destination is selected and restores clean geometry afterwards", () => {
  const { rerender } = render(<Fixture />);
  const lens = screen.getByTestId("lens");
  fireEvent.click(screen.getByText("more"));
  act(() => gsap.getTweensOf(lens).forEach(tween => tween.progress(.3)));
  rerender(<Fixture selected="none" />);
  finish();
  expect(Number(gsap.getProperty(lens,"opacity"))).toBe(0);
  expect(Number(gsap.getProperty(lens,"scaleX"))).toBe(1);
  rerender(<Fixture selected="classes" />);
  finish();
  expect(lensX()).toBe(104);
  expect(Number(gsap.getProperty(lens,"opacity"))).toBe(1);
  expect(Number(gsap.getProperty(lens,"scaleX"))).toBe(1);
});
