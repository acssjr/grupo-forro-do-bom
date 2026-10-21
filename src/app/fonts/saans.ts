import localFont from "next/font/local";

export const saans = localFont({
  src: [
    { path: "./Saans-TRIAL-Regular.woff2", weight: "400", style: "normal" },
    { path: "./Saans-TRIAL-Medium.woff2", weight: "500", style: "normal" },
    { path: "./Saans-TRIAL-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./Saans-TRIAL-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-saans",
  display: "swap",
  fallback: ["Arial Nova", "Arial", "Helvetica", "sans-serif"],
});
