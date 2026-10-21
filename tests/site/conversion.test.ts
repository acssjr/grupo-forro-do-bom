import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl } from "@/modules/site/lib/whatsapp";
import { pickSafeAnalyticsProperties } from "@/modules/site/lib/analytics";
import { readUtmParameters } from "@/modules/site/lib/utm";

describe("buildWhatsAppUrl", () => {
  it("creates a wa.me URL with an encoded message", () => {
    expect(buildWhatsAppUrl("5575999999999", "Olá! Quero começar.")).toBe(
      "https://wa.me/5575999999999?text=Ol%C3%A1!%20Quero%20come%C3%A7ar.",
    );
  });

  it("returns the explicit pending anchor when the number is missing", () => {
    expect(buildWhatsAppUrl("", "Olá")).toBe("#whatsapp-pendente");
  });
});

describe("readUtmParameters", () => {
  it("keeps only supported attribution fields", () => {
    const params = new URLSearchParams(
      "utm_source=instagram&utm_medium=social&utm_campaign=turma_agosto&utm_content=video_1&utm_term=forro&phone=123",
    );

    expect(readUtmParameters(params)).toEqual({
      utm_source: "instagram",
      utm_medium: "social",
      utm_campaign: "turma_agosto",
      utm_content: "video_1",
    });
  });
});

describe("pickSafeAnalyticsProperties", () => {
  it("removes message content, contact data and unknown properties", () => {
    expect(
      pickSafeAnalyticsProperties({
        cta_location: "hero",
        plan_name: "Essencial GFB",
        phone: "5575",
        message: "Olá, meu nome é Ana",
        name: "Ana",
      }),
    ).toEqual({
      cta_location: "hero",
      plan_name: "Essencial GFB",
    });
  });
});
