import { LandingPage } from "@/modules/site/components/landing/LandingPage";
import { faqItems } from "@/modules/site/content/siteContent";
import { siteConfig } from "@/config/site";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DanceSchool",
        "@id": `${siteConfig.siteUrl}/#business`,
        name: siteConfig.name,
        alternateName: siteConfig.shortName,
        url: siteConfig.siteUrl,
        logo: `${siteConfig.siteUrl}/brand/gfb-logo-dark.png`,
        description:
          "Escola de forró em Feira de Santana com turmas progressivas para iniciantes e nivelamento para quem já dança.",
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.address.street,
          addressLocality: siteConfig.address.city,
          addressRegion: siteConfig.address.region,
          postalCode: siteConfig.address.postalCode,
          addressCountry: siteConfig.address.country,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.siteUrl}/#website`,
        url: siteConfig.siteUrl,
        name: siteConfig.name,
        inLanguage: "pt-BR",
        publisher: { "@id": `${siteConfig.siteUrl}/#business` },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteConfig.siteUrl}/#faq`,
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LandingPage />
    </>
  );
}
