export const siteConfig = {
  name: "Grupo Forró do Bom",
  shortName: "GFB",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || "",
  address: {
    venue: "Escola Criativa",
    street: "Praça João Havelange",
    district: "Cidade Nova",
    city: "Feira de Santana",
    region: "BA",
    postalCode: "44053-660",
    country: "BR",
    reference: "",
  },
  schedules: {
    thursday: "Quinta-feira, às 19h30",
    saturday: "Sábado, às 14h",
  },
} as const;

export type ScheduleKey = keyof typeof siteConfig.schedules;

export const cohortConfig = {
  status:
    process.env.NEXT_PUBLIC_COHORT_STATUS === "open" ? "open" : "waitlist",
  startDate: process.env.NEXT_PUBLIC_COHORT_START_DATE || "",
  schedule:
    process.env.NEXT_PUBLIC_COHORT_SCHEDULE === "saturday"
      ? "saturday"
      : "thursday",
  availableSpots: process.env.NEXT_PUBLIC_COHORT_AVAILABLE_SPOTS || "",
} as const;

export const mapLinks = {
  embed: `https://www.google.com/maps?q=${encodeURIComponent(
    "Escola Criativa, Praça João Havelange, Cidade Nova, Feira de Santana, BA, 44053-660",
  )}&output=embed`,
  route: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    "Escola Criativa, Praça João Havelange, Cidade Nova, Feira de Santana, BA, 44053-660",
  )}`,
} as const;
