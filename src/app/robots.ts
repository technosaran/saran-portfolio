import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://technosaran.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/admin',
          '/api/admin/*',
          '/api/portfolio/stream',
          '/api/portfolio/data',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/admin',
          '/api/admin/*',
          '/api/portfolio/stream',
          '/api/portfolio/data',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/admin',
          '/api/admin/*',
          '/api/portfolio/stream',
          '/api/portfolio/data',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
