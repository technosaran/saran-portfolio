import type { Metadata, Viewport } from "next";
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://technosaran.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#050609",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Saran R — AI & ML Engineer | Full-Stack Cloud Architect",
    template: "%s | Saran R — AI & ML Engineer",
  },
  description:
    "Official engineering portfolio of Saran R — Artificial Intelligence & Machine Learning engineering student at Panimalar Engineering College (2023–2027). Architecting high-performance web systems with Next.js 16, PostgreSQL, AWS cloud workloads, and deep learning vision pipelines.",
  applicationName: "Saran R Portfolio",
  authors: [{ name: "Saran R", url: SITE_URL }],
  generator: "Next.js 16",
  keywords: [
    "Saran R",
    "Saran R Portfolio",
    "Artificial Intelligence Engineer",
    "Machine Learning Engineer",
    "Full Stack Developer Chennai",
    "Panimalar Engineering College AI",
    "Next.js 16 Developer",
    "TypeScript Full Stack",
    "AWS Cloud Architect",
    "PostgreSQL Neon Drizzle",
    "PyTorch Deep Learning",
    "Computer Vision Developer",
    "NLP Pipelines SpaCy",
    "technosaran",
    "Saran-R LeetCode",
    "Software Engineering 2027",
    "arthaX Financial Terminal",
    "Chennai Software Developer",
  ],
  creator: "Saran R",
  publisher: "Saran R",
  category: "technology",
  classification: "Engineering Portfolio",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    firstName: "Saran",
    lastName: "R",
    username: "technosaran",
    gender: "male",
    title: "Saran R — AI & ML Engineer | Full-Stack Cloud Architect",
    description:
      "Engineering portfolio of Saran R. AI/ML Engineering student at Panimalar Engineering College building scalable full-stack web platforms, deep learning models, and AWS cloud architectures.",
    url: SITE_URL,
    siteName: "Saran R — Engineering Showcase",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Saran R — AI & ML Engineer Portfolio",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saran R — AI & ML Engineer | Full-Stack Cloud Architect",
    description:
      "AI/ML engineering student at Panimalar Engineering College. Full-stack developer & AWS Cloud architect building real-time vision pipelines & financial terminals.",
    creator: "@technosaran",
    site: "@technosaran",
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>
      <head>
        <link rel="preconnect" href="https://assets.leetcode.com" />
        <link rel="dns-prefetch" href="https://assets.leetcode.com" />
        <link rel="preconnect" href="https://github.com" />
        <link rel="dns-prefetch" href="https://github.com" />
      </head>
      <body className="min-h-screen bg-[#050609] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
