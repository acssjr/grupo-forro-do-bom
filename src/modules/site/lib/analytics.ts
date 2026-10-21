import { getStoredUtmParameters } from "@/modules/site/lib/utm";

export const ANALYTICS_EVENTS = [
  "landing_viewed",
  "cta_clicked",
  "whatsapp_started",
  "pricing_plan_selected",
  "leveling_info_opened",
  "leveling_whatsapp_started",
  "schedule_interest_selected",
  "waitlist_clicked",
  "map_clicked",
  "faq_opened",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

const SAFE_PROPERTY_KEYS = new Set([
  "cta_location",
  "plan_name",
  "schedule",
  "user_intent",
  "level_intended",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
]);

export type AnalyticsProperties = Record<string, string | number | boolean | undefined>;

export function pickSafeAnalyticsProperties(
  properties: AnalyticsProperties,
): AnalyticsProperties {
  return Object.fromEntries(
    Object.entries(properties).filter(
      ([key, value]) => SAFE_PROPERTY_KEYS.has(key) && value !== undefined,
    ),
  );
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  event: AnalyticsEvent,
  properties: AnalyticsProperties = {},
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  const safeProperties = pickSafeAnalyticsProperties({
    ...getStoredUtmParameters(),
    ...properties,
  });

  window.gtag("event", event, safeProperties);
}
