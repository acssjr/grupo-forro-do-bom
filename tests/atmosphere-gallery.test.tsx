import { act, fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AtmosphereGallery } from "@/components/landing/AtmosphereGallery";

const originalMatchMedia = window.matchMedia;

function allowCarouselMotion() {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

afterEach(() => {
  vi.useRealTimers();
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: originalMatchMedia,
  });
});

describe("AtmosphereGallery", () => {
  it("continues autoplay after a manual slide change", async () => {
    vi.useFakeTimers();
    allowCarouselMotion();
    render(<AtmosphereGallery />);

    await act(async () => undefined);
    expect(screen.getByRole("button", { name: "Mostrar registro 1" })).toHaveAttribute(
      "aria-current",
      "true",
    );

    act(() => vi.advanceTimersByTime(5200));
    expect(screen.getByRole("button", { name: "Mostrar registro 2" })).toHaveAttribute(
      "aria-current",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: "Mostrar registro 4" }));
    expect(screen.getByRole("button", { name: "Mostrar registro 4" })).toHaveAttribute(
      "aria-current",
      "true",
    );

    act(() => vi.advanceTimersByTime(5200));
    expect(screen.getByRole("button", { name: "Mostrar registro 5" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("keeps video elements mounted while their slide becomes active", async () => {
    allowCarouselMotion();
    const { container } = render(<AtmosphereGallery />);
    await act(async () => undefined);

    const videoBefore = container.querySelectorAll("video")[0];
    fireEvent.click(screen.getByRole("button", { name: "Mostrar registro 2" }));
    const videoAfter = container.querySelectorAll("video")[0];

    expect(videoAfter).toBe(videoBefore);
  });

  it("moves slides with an interruptible CSS transition instead of resetting the animation", () => {
    const source = readFileSync("components/landing/AtmosphereGallery.tsx", "utf8");
    const css = readFileSync("components/landing/Landing.module.css", "utf8");

    expect(source).not.toContain('import("gsap")');
    expect(source).not.toContain("ResizeObserver");
    expect(css).toMatch(
      /\.atmosphereTrack\s*\{[\s\S]*transition:\s*transform 280ms var\(--ease-in-out\)/,
    );
    expect(css).toMatch(
      /\.atmosphereSlide\s*\{[\s\S]*transition:[\s\S]*opacity 180ms var\(--ease-out\)[\s\S]*transform 280ms var\(--ease-in-out\)/,
    );
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.atmosphereTrack\s*\{[\s\S]*transition:\s*none/,
    );
  });
});
