import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Saran R — AI & ML Engineer | Full-Stack Cloud Architect",
  description: "Portfolio of Saran R - Artificial Intelligence & Machine Learning engineering student at Panimalar Engineering College, Full-Stack developer & AWS Cloud architect.",
  keywords: ["Saran R", "AI Engineer", "Machine Learning", "Full Stack", "Next.js", "TypeScript", "AWS", "Neon Postgres"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>
      <body className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
