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
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Saran R — AI & ML Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saran R — AI & ML Engineer",
    description: "AI/ML Engineering Student | Cloud Infrastructure & Full-Stack Architect.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://saran-portfolio-smoky.vercel.app/#person",
      "name": "Saran R",
      "jobTitle": "Artificial Intelligence & Machine Learning Engineer",
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "Panimalar Engineering College"
      },
      "url": "https://saran-portfolio-smoky.vercel.app",
      "sameAs": [
        "https://github.com/technosaran",
        "https://linkedin.com/in/saran-r-b2b1a5275",
        "https://leetcode.com/u/Saran-R/"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://saran-portfolio-smoky.vercel.app/#website",
      "url": "https://saran-portfolio-smoky.vercel.app",
      "name": "Saran R — AI & ML Engineer Portfolio",
      "publisher": {
        "@id": "https://saran-portfolio-smoky.vercel.app/#person"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#07080c] text-zinc-100 font-sans selection:bg-blue-500/25 selection:text-blue-200">
        {children}
      </body>
    </html>
  );
}
