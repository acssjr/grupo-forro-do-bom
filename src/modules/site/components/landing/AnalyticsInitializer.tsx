"use client";

import { useEffect } from "react";
import { trackEvent } from "@/modules/site/lib/analytics";
import { persistUtmParameters } from "@/modules/site/lib/utm";

export function AnalyticsInitializer() {
  useEffect(() => {
    persistUtmParameters(new URLSearchParams(window.location.search));
    trackEvent("landing_viewed");
  }, []);

  return null;
}
