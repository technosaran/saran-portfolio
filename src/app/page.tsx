export const dynamic = 'force-dynamic';
export const revalidate = 0;

import type { Metadata } from 'next';
import PortfolioClientShell from '@/components/PortfolioClientShell';
import PortfolioSectionsLive from '@/components/PortfolioSectionsLive';
import { 
  fetchProfile, 
  fetchProjects, 
  fetchSkills, 
  fetchExperience, 
  fetchCertificates, 
  Profile, 
  Project, 
  Skill, 
  Experience, 
  Certificate 
} from '@/lib/neon/db';
import { fetchGitHubData, GitHubActivityData } from '@/services/github.service';
import { fetchLeetCodeData, LeetCodeActivityData } from '@/services/leetcode.service';

const FALLBACK_PROFILE: Profile = {
  id: 1,
  full_name: 'SARAN R',
  title: 'Artificial Intelligence & Machine Learning Engineer',
  headline: 'AI/ML Engineering Student | Cloud Infrastructure & Full-Stack Developer',
  bio: 'Artificial Intelligence and Machine Learning engineering student with hands-on experience in cloud infrastructure (AWS) and full-stack development. Proven ability to architect scalable web applications, implement machine learning models, and solve algorithmic challenges. Passionate about modern software engineering practices, robust database architecture, and building production-grade systems.',
  email: 'iamsaran.ai@gmail.com',
  phone: '+91 6384957740',
  location: 'Chennai, Tamil Nadu',
  college: 'Panimalar Engineering College',
  degree: 'Bachelor of Technology in Artificial Intelligence and Machine Learning',
  graduation_year: '2023 – 2027',
  github_url: 'https://github.com/technosaran',
  linkedin_url: 'https://linkedin.com/in/saran-r-b2b1a5275',
  website_url: 'https://technosaran.vercel.app',
  leetcode_url: 'https://leetcode.com/u/Saran-R/',
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://technosaran.vercel.app';

export async function generateMetadata(): Promise<Metadata> {
  const profile = (await fetchProfile().catch(() => null)) || FALLBACK_PROFILE;
  const fullName = profile.full_name || 'Saran R';
  const title = `${fullName} — ${profile.title || 'AI & ML Engineer | Full-Stack Cloud Architect'}`;
  const description =
    profile.bio?.slice(0, 160) ||
    'AI/ML engineering student at Panimalar Engineering College (2023–2027). Building scalable web platforms, computer vision pipelines, and cloud workloads with Next.js, PyTorch, and AWS.';

  return {
    title,
    description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title,
      description: profile.headline || description,
      url: SITE_URL,
      siteName: `${fullName} Portfolio`,
      type: 'profile',
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: `${fullName} — AI & ML Engineer Portfolio`,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: profile.headline || description,
      creator: '@technosaran',
      images: ['/twitter-image'],
    },
  };
}

export default async function Home() {
  let profile: Profile = FALLBACK_PROFILE;
  let projects: Project[] = [];
  let experience: Experience[] = [];
  let certificates: Certificate[] = [];
  let skills: Skill[] = [];
  let githubData: GitHubActivityData | undefined;
  let leetcodeData: LeetCodeActivityData | undefined;

  try {
    const results = await Promise.allSettled([
      fetchProfile(),
      fetchProjects(),
      fetchSkills(),
      fetchExperience(),
      fetchCertificates(),
      fetchGitHubData('technosaran'),
      fetchLeetCodeData('Saran-R'),
    ]);

    if (results[0].status === 'fulfilled' && results[0].value) {
      profile = results[0].value;
    }
    if (results[1].status === 'fulfilled' && results[1].value) {
      projects = results[1].value;
    }
    if (results[2].status === 'fulfilled' && results[2].value) {
      skills = results[2].value;
    }
    if (results[3].status === 'fulfilled' && results[3].value) {
      experience = results[3].value;
    }
    if (results[4].status === 'fulfilled' && results[4].value) {
      certificates = results[4].value;
    }
    if (results[5].status === 'fulfilled' && results[5].value) {
      githubData = results[5].value;
    }
    if (results[6].status === 'fulfilled' && results[6].value) {
      leetcodeData = results[6].value;
    }
  } catch (err) {
    console.warn('Database fetch in Home:', err);
  }

  // Dynamic Rich Schema.org / JSON-LD Knowledge Graph for Google & Bing
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: profile.full_name,
        givenName: 'Saran',
        familyName: 'R',
        additionalName: 'technosaran',
        gender: 'https://schema.org/Male',
        jobTitle: profile.title,
        description: profile.bio,
        email: `mailto:${profile.email}`,
        telephone: profile.phone,
        url: profile.website_url || SITE_URL,
        image: `${SITE_URL}/opengraph-image`,
        homeLocation: {
          '@type': 'Place',
          name: profile.location || 'Chennai, Tamil Nadu, India',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Chennai',
            addressRegion: 'Tamil Nadu',
            addressCountry: 'IN',
          },
        },
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: profile.college,
          sameAs: 'https://en.wikipedia.org/wiki/Panimalar_Engineering_College',
        },
        knowsAbout: skills.length > 0 ? skills.map((s) => s.name) : [
          'Artificial Intelligence',
          'Machine Learning',
          'Deep Learning',
          'PyTorch',
          'Computer Vision',
          'Natural Language Processing',
          'Next.js 16',
          'TypeScript',
          'PostgreSQL',
          'AWS Cloud',
          'Docker',
          'Algorithms & Data Structures',
        ],
        hasCredential: certificates.map((c) => ({
          '@type': 'EducationalOccupationalCredential',
          name: c.title,
          recognizedBy: {
            '@type': 'Organization',
            name: c.provider,
          },
          credentialCategory: 'Certificate',
          ...(c.url ? { url: c.url } : {}),
        })),
        sameAs: [
          profile.github_url,
          profile.linkedin_url,
          profile.leetcode_url,
          profile.website_url,
        ].filter(Boolean),
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${profile.full_name} — AI & ML Engineer Portfolio`,
        publisher: {
          '@id': `${SITE_URL}/#person`,
        },
        inLanguage: 'en-US',
      },
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: `${profile.full_name} — Engineering Showcase`,
        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },
        about: {
          '@id': `${SITE_URL}/#person`,
        },
        mainEntity: {
          '@id': `${SITE_URL}/#person`,
        },
        primaryImageOfPage: `${SITE_URL}/opengraph-image`,
        dateModified: profile.updated_at || new Date().toISOString(),
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/#projects-list`,
        name: 'Featured Engineering Systems',
        description: 'Production software systems, computer vision models, and full-stack platforms architected by Saran R.',
        itemListElement: projects.map((p, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'SoftwareSourceCode',
            name: p.title,
            description: p.description,
            programmingLanguage: p.tech_stack,
            ...(p.github_url ? { codeRepository: p.github_url } : {}),
            ...(p.live_url ? { targetProduct: { '@type': 'WebApplication', url: p.live_url } } : {}),
            author: {
              '@id': `${SITE_URL}/#person`,
            },
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Portfolio Home',
            item: SITE_URL,
          },
        ],
      },
    ],
  };

  const initialData = {
    profile,
    projects,
    skills,
    experience,
    certificates,
  };

  return (
    <PortfolioClientShell initialData={initialData}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PortfolioSectionsLive 
        initialGithubData={githubData} 
        initialLeetcodeData={leetcodeData} 
      />
    </PortfolioClientShell>
  );
}
