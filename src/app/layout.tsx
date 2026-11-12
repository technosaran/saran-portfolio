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
  metadataBase: new URL("https://saran-portfolio-smoky.vercel.app"),
  openGraph: {
    title: "Saran R — AI & ML Engineer",
    description: "AI/ML Engineering Student | Cloud Infrastructure & Full-Stack Architect. Building production systems with Next.js, Neon PostgreSQL, and AWS Cloud.",
    type: "website",
    locale: "en_US",
    siteName: "Saran R Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saran R — AI & ML Engineer",
    description: "AI/ML Engineering Student | Cloud Infrastructure & Full-Stack Architect.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>
      <body className="min-h-screen bg-[#07080c] text-zinc-100 font-sans selection:bg-blue-500/25 selection:text-blue-200">
        {children}
      </body>
    </html>
  );
}
