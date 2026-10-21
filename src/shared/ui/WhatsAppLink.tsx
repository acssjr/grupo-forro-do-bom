"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { trackEvent, type AnalyticsEvent } from "@/modules/site/lib/analytics";
import { buildWhatsAppUrl } from "@/modules/site/lib/whatsapp";
import { siteConfig } from "@/config/site";

type Tracking = {
  ctaLocation: string;
  userIntent: string;
  planName?: string;
  schedule?: string;
  levelIntended?: string;
  intentEvent?: AnalyticsEvent;
};

type WhatsAppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  children: ReactNode;
  message: string;
  tracking: Tracking;
};

export function WhatsAppLink({
  children,
  message,
  tracking,
  onClick,
  ...props
}: WhatsAppLinkProps) {
  const href = buildWhatsAppUrl(siteConfig.whatsappNumber, message);
  const analyticsProperties = {
    cta_location: tracking.ctaLocation,
    user_intent: tracking.userIntent,
    plan_name: tracking.planName,
    schedule: tracking.schedule,
    level_intended: tracking.levelIntended,
  };

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;

    trackEvent("cta_clicked", analyticsProperties);

    if (tracking.intentEvent) {
      trackEvent(tracking.intentEvent, analyticsProperties);
    }

    if (href === "#whatsapp-pendente") return;
    trackEvent("whatsapp_started", analyticsProperties);
  }

  return (
    <a
      {...props}
      href={href}
      onClick={handleClick}
      target={href.startsWith("https://") ? "_blank" : undefined}
      rel={href.startsWith("https://") ? "noreferrer" : undefined}
      data-missing-config={href === "#whatsapp-pendente" ? "true" : undefined}
    >
      {children}
    </a>
  );
}
