import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Saran R — AI & ML Engineer Portfolio',
    short_name: 'Saran R',
    description:
      'Portfolio of Saran R - Artificial Intelligence & Machine Learning Engineer, Cloud Infrastructure & Full-Stack Architect.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050609',
    theme_color: '#10b981',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
