import type { Metadata, Viewport } from "next";
import { Jost } from "next/font/google";
import "./globals.css";

const jost = Jost({ subsets: ["latin"], weight: ["200", "300", "400", "500"], display: "swap", variable: "--font-jost" });

export const metadata: Metadata = {
  title: "Flexjet — Redesign concept by ARMA Agency",
  description: "Independent redesign concept proposed by ARMA Agency — not affiliated with Flexjet.",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#07080a", viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jost.variable}>
      <body>{children}</body>
    </html>
  );
}
