import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import "@/app/globals.css";

/* eslint-disable @next/next/no-css-tags -- The non-blocking supporting font sheet is intentionally activated after load. */

const title = "Aula de forró em Feira de Santana | Grupo Forró do Bom";
const description =
  "Aprenda forró do zero no Grupo Forró do Bom, em Feira de Santana. Primeira aula por R$ 39, turmas progressivas e nivelamento gratuito para quem já dança.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title,
  description,
  applicationName: siteConfig.name,
  icons: {
    icon: { url: "/brand/gfb-logo.svg", type: "image/svg+xml", sizes: "any" },
    shortcut: "/brand/gfb-logo.svg",
  },
  alternates: { canonical: "/" },
  keywords: [
    "aula de forró em Feira de Santana",
    "escola de forró em Feira de Santana",
    "aprender forró do zero",
    "aula de dança em Feira de Santana",
    "nivelamento de forró",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: siteConfig.name,
    title,
    description,
    images: [
      {
        url: "/brand/gfb-logo-dark.png",
        width: 940,
        height: 624,
        alt: "Logotipo do Grupo Forró do Bom",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/brand/gfb-logo-dark.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F6C300",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const measurementId = siteConfig.ga4MeasurementId;

  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <head>
        <link rel="preload" href="/fonts/Saans-TRIAL-Regular-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Saans-TRIAL-Bold-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="stylesheet" href="/fonts/supporting.css" media="print" id="supporting-fonts" />
      </head>
      <body>
        {children}
        <Script id="activate-supporting-fonts" strategy="lazyOnload">
          {`document.getElementById('supporting-fonts').media = 'all';`}
        </Script>
        {measurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${measurementId}', { send_page_view: false });`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
