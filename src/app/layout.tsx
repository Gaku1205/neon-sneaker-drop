import type { Metadata, Viewport } from "next";
import { Anton, Dela_Gothic_One, Noto_Sans_JP, Space_Mono } from "next/font/google";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const dela = Dela_Gothic_One({ weight: "400", subsets: ["latin"], variable: "--font-heavy", preload: false });
const noto = Noto_Sans_JP({ weight: ["500", "700"], subsets: ["latin"], variable: "--font-body", preload: false });
const mono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "PULSAR-9 — 12.12 DROP | GRAVLESS",
  description:
    "架空のブランド GRAVLESS の新作スニーカー PULSAR-9。反発する厚底と、光るかかと。2026年12月12日 10:00 発売。",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${anton.variable} ${dela.variable} ${noto.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
