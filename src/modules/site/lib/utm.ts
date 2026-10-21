export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
] as const;

export type UtmParameters = Partial<Record<(typeof UTM_KEYS)[number], string>>;

const STORAGE_KEY = "gfb_attribution";

export function readUtmParameters(params: URLSearchParams): UtmParameters {
  return UTM_KEYS.reduce<UtmParameters>((result, key) => {
    const value = params.get(key)?.trim();
    if (value) result[key] = value.slice(0, 120);
    return result;
  }, {});
}

export function persistUtmParameters(params: URLSearchParams): UtmParameters {
  const incoming = readUtmParameters(params);

  if (typeof window === "undefined") return incoming;

  if (Object.keys(incoming).length > 0) {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(incoming));
    return incoming;
  }

  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as UtmParameters) : {};
  } catch {
    return {};
  }
}

export function getStoredUtmParameters(): UtmParameters {
  if (typeof window === "undefined") return {};

  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as UtmParameters) : {};
  } catch {
    return {};
  }
}
