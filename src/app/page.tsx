export const revalidate = 3600;

import type { Metadata } from 'next';
import PortfolioClientShell from '@/components/PortfolioClientShell';
import InteractiveHero from '@/components/InteractiveHero';
import ProjectsShowcase from '@/components/ProjectsShowcase';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import SkillsNucleus from '@/components/SkillsNucleus';
import CertificatesShowcase from '@/components/CertificatesShowcase';
import ActivityShowcase from '@/components/ActivityShowcase';
import ContactSection from '@/components/ContactSection';
import ScrollReveal from '@/components/ScrollReveal';
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from '@/components/SocialIcons';
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
import { ArrowUp, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

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

const FALLBACK_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'arthaX – Personal Wealth & Financial Terminal',
    description: 'Full-stack financial terminal for real-time tracking of personal investments and net worth with responsive terminal experience.',
    tech_stack: ['Next.js 16', 'TypeScript', 'PostgreSQL', 'Supabase', 'Tailwind CSS'],
    github_url: 'https://github.com/technosaran/arthax',
    live_url: 'https://arthax.vercel.app',
    highlights: [
      'Architected a full-stack wealth platform for tracking multi-asset personal portfolios.',
      'Engineered secure PostgreSQL database schemas with Row Level Security (RLS) and automated data parsing.',
      'Designed a responsive dark-mode UI with Next.js App Router, cutting client-side load time by 35%.'
    ]
  },
  {
    id: 2,
    title: 'Real-Time Object Detection System',
    description: 'Live video stream object detection application using deep learning visual inference algorithms.',
    tech_stack: ['Python', 'OpenCV', 'PyTorch', 'Computer Vision'],
    github_url: 'https://github.com/technosaran/realtime-object-detection',
    live_url: null,
    highlights: [
      'Developed a real-time object detection application using Python and OpenCV for live stream video analysis.',
      'Implemented deep learning visual inference algorithms to perform high-accuracy bounding-box detection.'
    ]
  },
  {
    id: 3,
    title: 'Named Entity Recognition (NER) NLP Pipeline',
    description: 'Natural Language Processing pipeline extracting structured entities from unstructured text datasets.',
    tech_stack: ['Python', 'NLP', 'SpaCy', 'Scikit-Learn'],
    github_url: 'https://github.com/technosaran/ner-system-nlp',
    live_url: null,
    highlights: [
      'Engineered an NLP text analytics pipeline to extract critical entities (Names, Organizations, Dates) with high precision.',
      'Applied advanced tokenization and sequence tagging models to automate unstructured document parsing.'
    ]
  }
];

const FALLBACK_EXPERIENCE: Experience[] = [
  {
    id: 1,
    intern_id: 'edunet-ibm-aiml-2025',
    role: 'AI & ML Intern',
    company: 'Edunet Foundation (in partnership with AICTE & IBM SkillsBuild)',
    period: 'June 2025 – July 2025',
    location: 'Remote',
    description: [
      'Engineered machine learning models using Python and Scikit-Learn during an intensive program via IBM SkillsBuild.',
      'Architected an end-to-end AIML capstone project, applying supervised learning to analyze datasets and improve prediction accuracy.'
    ]
  },
  {
    id: 2,
    intern_id: 'codtech-cloud-2025',
    role: 'Cloud Computing Intern',
    company: 'CodTech IT Solutions',
    period: 'May 2025 – June 2025',
    location: 'Remote',
    description: [
      'Deployed and managed scalable cloud infrastructure utilizing AWS services and Docker containerization.',
      'Optimized application deployment workflows using cloud-native DevOps principles, enhancing system security and reliability.'
    ]
  }
];

const FALLBACK_CERTS: Certificate[] = [
  { id: 1, credential_id: 'INFOSYS-JAVA', title: 'Programming using Java', provider: 'Infosys Springboard', issue_date: '2025', url: null },
  { id: 2, credential_id: 'ORACLE-OCI-DS', title: 'Oracle Cloud Infrastructure Certified Data Science Professional', provider: 'Oracle University', issue_date: '2025', url: null },
  { id: 3, credential_id: 'IBM-AI-FUND', title: 'Artificial Intelligence Fundamentals', provider: 'IBM SkillsBuild', issue_date: '2025', url: null },
  { id: 4, credential_id: 'AWS-COURSERA', title: 'Introduction to Information Technology and AWS Cloud', provider: 'Amazon Web Services / Coursera', issue_date: '2025', url: null },
  { id: 5, credential_id: 'GUVI-PROMPT', title: 'Prompt Engineering for Beginners', provider: 'GUVI Geek Networks (Google for Education Partner)', issue_date: '2025', url: null },
  { id: 6, credential_id: 'NASSCOM-GOLD', title: 'Acquiring Data: FutureSkills Prime Gold', provider: 'NASSCOM', issue_date: '2025', url: null },
];

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
  let projects: Project[] = FALLBACK_PROJECTS;
  let experience: Experience[] = FALLBACK_EXPERIENCE;
  let certificates: Certificate[] = FALLBACK_CERTS;
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
    if (results[1].status === 'fulfilled' && results[1].value && results[1].value.length > 0) {
      projects = results[1].value;
    }
    if (results[2].status === 'fulfilled' && results[2].value && results[2].value.length > 0) {
      skills = results[2].value;
    }
    if (results[3].status === 'fulfilled' && results[3].value && results[3].value.length > 0) {
      experience = results[3].value;
    }
    if (results[4].status === 'fulfilled' && results[4].value && results[4].value.length > 0) {
      certificates = results[4].value;
    }
    if (results[5].status === 'fulfilled' && results[5].value) {
      githubData = results[5].value;
    }
    if (results[6].status === 'fulfilled' && results[6].value) {
      leetcodeData = results[6].value;
    }
  } catch (err) {
    console.warn('Using database fallback for render:', err);
  }

  // Extract core coursework dynamically from database skills
  const coreCoursework = skills
    .filter((s) => s.category === 'Core CS Fundamentals')
    .map((s) => s.name);
  const displayedCoursework = coreCoursework.length > 0 ? coreCoursework : [
    'Data Structures & Algorithms',
    'Object-Oriented Programming (Java)',
    'Database Management Systems (DBMS)',
    'Operating Systems',
    'Computer Networks & Protocols',
    'Software Engineering (SDLC)'
  ];

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
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Featured Projects',
            item: `${SITE_URL}/#projects`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Experience & Education',
            item: `${SITE_URL}/#experience`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'Technical Skills',
            item: `${SITE_URL}/#skills`,
          },
          {
            '@type': 'ListItem',
            position: 5,
            name: 'Engineering Activity',
            item: `${SITE_URL}/#activity`,
          },
          {
            '@type': 'ListItem',
            position: 6,
            name: 'Certifications',
            item: `${SITE_URL}/#certifications`,
          },
          {
            '@type': 'ListItem',
            position: 7,
            name: 'Contact',
            item: `${SITE_URL}/#contact`,
          },
        ],
      },
    ],
  };

  return (
    <PortfolioClientShell profile={profile}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <InteractiveHero 
        profile={profile} 
        projectCount={projects.length} 
        certCount={certificates.length} 
        internshipCount={experience.length} 
      />

      {/* Featured Projects Section */}
      <section id="projects" className="py-14 md:py-20 border-b border-[#20222a]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          
          <ScrollReveal>
            <div className="mb-8 space-y-1">
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                01 / Featured Work
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                Projects
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                Full-stack platforms, computer vision pipelines, and natural language processing applications.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <ProjectsShowcase projects={projects} />
          </ScrollReveal>

        </div>
      </section>

      {/* Experience & Education Section */}
      <section id="experience" className="py-14 md:py-20 border-b border-[#20222a]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-8 space-y-1">
              <div className="text-xs font-mono uppercase tracking-wider text-sky-400">
                02 / Background
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                Experience &amp; Education
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                Hands-on engineering internships, cloud infrastructure deployments, and core academic foundations.
              </p>
            </div>
            <ExperienceTimeline 
              experience={experience} 
              profile={profile} 
              displayedCoursework={displayedCoursework} 
            />
          </ScrollReveal>
        </div>
      </section>

      {/* Technical Skills Section */}
      <section id="skills" className="py-14 md:py-20 border-b border-[#20222a]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          
          <ScrollReveal>
            <div className="mb-8 space-y-1">
              <div className="text-xs font-mono uppercase tracking-wider text-purple-400">
                03 / Capabilities
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                Skills &amp; Tooling
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                Core technologies used in production applications, deep learning architectures, and cloud deployments.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <SkillsNucleus skills={skills} />
          </ScrollReveal>

        </div>
      </section>

      {/* Engineering Activity Section (GitHub & LeetCode) */}
      <section id="activity" className="py-14 md:py-20 border-b border-[#20222a]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          
          <ScrollReveal>
            <div className="mb-8 space-y-1">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-400">
                04 / Activity
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                Activity &amp; Problem Solving
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                Open-source contributions on GitHub and algorithmic problem-solving on LeetCode.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <ActivityShowcase 
              profile={profile} 
              projects={projects} 
              skills={skills} 
              initialGithubData={githubData}
              initialLeetcodeData={leetcodeData}
            />
          </ScrollReveal>

        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-14 md:py-20 border-b border-[#20222a]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          
          <ScrollReveal>
            <div className="mb-8 space-y-1">
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                05 / Credentials
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                Certifications
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                Professional certifications across cloud computing, machine learning, and software development.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <CertificatesShowcase certificates={certificates} />
          </ScrollReveal>

        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-14 md:py-20 border-b border-[#20222a]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-8 space-y-1">
              <div className="text-xs font-mono uppercase tracking-wider text-sky-400">
                06 / Connect
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                Get in Touch
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                Open to full-time software engineering roles, AI/ML opportunities, and collaborative discussions.
              </p>
            </div>
            <ContactSection profile={profile} />
          </ScrollReveal>
        </div>
      </section>

      {/* Compact Minimal Footer */}
      <footer className="border-t border-[#20222a] bg-[#09090b] py-6 text-xs text-zinc-400">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Identity & Build Info */}
          <div className="flex items-center gap-2 text-zinc-400 text-xs">
            <span className="font-semibold text-zinc-200 tracking-tight">
              {profile.full_name || 'SARAN R'}
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-[11px] font-mono text-zinc-500">
              Designed &amp; built with Next.js 16 &amp; Neon
            </span>
            <span className="text-zinc-600">·</span>
            <Link
              href="/admin"
              className="text-zinc-600 hover:text-emerald-400 transition-colors inline-flex items-center gap-1 text-[11px] font-mono"
              title="Admin Portal"
            >
              <Lock className="h-2.5 w-2.5" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Essential Social Links */}
          <div className="flex items-center gap-4">
            <a
              href={profile.github_url || 'https://github.com/technosaran'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
              title="GitHub"
              aria-label="GitHub"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <a
              href={profile.linkedin_url || 'https://linkedin.com/in/saran-r-b2b1a5275'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-sky-400 transition-colors"
              title="LinkedIn"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <a
              href={profile.leetcode_url || 'https://leetcode.com/u/Saran-R/'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-amber-400 transition-colors"
              title="LeetCode"
              aria-label="LeetCode"
            >
              <LeetCodeIcon className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="text-zinc-400 hover:text-emerald-400 transition-colors"
              title="Email"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>

          {/* Back to top */}
          <a
            href="#home"
            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3 w-3" />
          </a>
        </div>
      </footer>
    </PortfolioClientShell>
  );
}
