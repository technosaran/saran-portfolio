export const revalidate = 3600;

import PortfolioClientShell from '@/components/PortfolioClientShell';
import InteractiveHero from '@/components/InteractiveHero';
import ProjectsShowcase from '@/components/ProjectsShowcase';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import SkillsNucleus from '@/components/SkillsNucleus';
import CertificatesShowcase from '@/components/CertificatesShowcase';
import ActivityShowcase from '@/components/ActivityShowcase';
import ContactSection from '@/components/ContactSection';
import ScrollReveal from '@/components/ScrollReveal';
import BrandLogo from '@/components/BrandLogo';
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
import { 
  Zap, 
  Code2, 
  Award, 
  Activity, 
  Terminal, 
  ArrowUp,
  Mail
} from 'lucide-react';

const FALLBACK_PROFILE: Profile = {
  id: 1,
  full_name: 'SARAN R',
  title: 'Artificial Intelligence & Machine Learning Engineer',
  headline: 'AI/ML Engineering Student | Cloud Infrastructure & Full-Stack Architect',
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
    description: 'Full-stack financial terminal for real-time tracking of investments and net worth with modern dark-mode terminal experience.',
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

export default async function Home() {
  let profile: Profile = FALLBACK_PROFILE;
  let projects: Project[] = FALLBACK_PROJECTS;
  let experience: Experience[] = FALLBACK_EXPERIENCE;
  let certificates: Certificate[] = FALLBACK_CERTS;
  let skills: Skill[] = [];

  try {
    const results = await Promise.allSettled([
      fetchProfile(),
      fetchProjects(),
      fetchSkills(),
      fetchExperience(),
      fetchCertificates(),
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

  return (
    <PortfolioClientShell profile={profile}>
      {/* Hero Section */}
      <InteractiveHero 
        profile={profile} 
        skills={skills} 
        projectCount={projects.length} 
        certCount={certificates.length} 
        internshipCount={experience.length} 
      />

      {/* Featured Projects Section */}
      <section id="projects" className="py-20 md:py-24 border-b border-white/[0.08] relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          
          {/* Section Header */}
          <ScrollReveal>
            <div className="space-y-2 mb-10">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs font-mono font-medium text-blue-300 backdrop-blur-md">
                <Zap className="h-3.5 w-3.5" />
                <span>Featured Work</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Projects
              </h2>
              <p className="max-w-2xl text-xs sm:text-sm text-zinc-400">
                Full-stack web applications, computer vision systems, and natural language processing pipelines built with modern technologies.
              </p>
            </div>
          </ScrollReveal>

          {/* Interactive Modern Projects Showcase */}
          <ScrollReveal delay={100}>
            <ProjectsShowcase projects={projects} />
          </ScrollReveal>

        </div>
      </section>

      {/* Experience & Education Section */}
      <section id="experience" className="py-20 md:py-24 border-b border-white/[0.08] relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <ExperienceTimeline 
              experience={experience} 
              profile={profile} 
              displayedCoursework={displayedCoursework} 
            />
          </ScrollReveal>
        </div>
      </section>

      {/* Technical Skills Section */}
      <section id="skills" className="py-20 md:py-24 border-b border-white/[0.08] relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          
          <ScrollReveal>
            <div className="space-y-2 text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs font-mono font-medium text-blue-300 backdrop-blur-md">
                <Code2 className="h-3.5 w-3.5" />
                <span>Technical Stack</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Skills &amp; Technologies
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Programming languages, frameworks, AI/ML tools, databases, and developer environments I work with.
              </p>
            </div>
          </ScrollReveal>

          {/* Interactive Skills Showcase */}
          <ScrollReveal delay={100}>
            <SkillsNucleus skills={skills} />
          </ScrollReveal>

        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-20 md:py-24 border-b border-white/[0.08] relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          
          <ScrollReveal>
            <div className="space-y-2 mb-10">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs font-mono font-medium text-blue-300 backdrop-blur-md">
                <Award className="h-3.5 w-3.5" />
                <span>Credentials</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Certifications
              </h2>
              <p className="max-w-2xl text-xs sm:text-sm text-zinc-400">
                Verified certifications acquired across cloud computing, data science, artificial intelligence, and Java.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <CertificatesShowcase certificates={certificates} />
          </ScrollReveal>

        </div>
      </section>

      {/* Activity Section (GitHub & LeetCode) */}
      <section id="activity" className="py-20 md:py-24 border-b border-white/[0.08] relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          
          <ScrollReveal>
            <div className="space-y-2 mb-10">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs font-mono font-medium text-blue-300 backdrop-blur-md">
                <Activity className="h-3.5 w-3.5" />
                <span>Problem Solving &amp; Code</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Coding Activity &amp; Repositories
              </h2>
              <p className="max-w-2xl text-xs sm:text-sm text-zinc-400">
                GitHub repository development, open-source code delivery, and problem solving on LeetCode.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <ActivityShowcase profile={profile} projects={projects} skills={skills} />
          </ScrollReveal>

        </div>
      </section>

      {/* Dedicated Clean Contact Section */}
      <section id="contact" className="py-20 md:py-28 relative overflow-hidden">
        <ScrollReveal>
          <ContactSection profile={profile} />
        </ScrollReveal>
      </section>

      {/* Compact Modern Footer */}
      <footer className="border-t border-white/[0.08] bg-[#050608] py-6 sm:py-7 text-xs text-zinc-400">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 pb-5 border-b border-white/[0.06]">
            
            {/* Column 1: Brand & Summary */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Terminal className="h-3 w-3" />
                </div>
                <span className="font-bold text-white text-xs tracking-tight font-sans">SARAN R</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug max-w-xs">
                AI &amp; ML engineering student at {profile.college}. Building production-grade web applications, cloud infrastructure, and intelligent systems.
              </p>
              <div className="text-[10px] font-mono text-zinc-500">
                {profile.location} · {profile.graduation_year}
              </div>
            </div>

            {/* Column 2: System Architecture */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-300">
                Stack &amp; Architecture
              </h4>
              <div className="space-y-1.5 text-[11px] text-zinc-400 font-mono">
                <div className="flex items-center justify-between border-b border-white/[0.03] pb-1">
                  <span className="flex items-center gap-1.5">
                    <BrandLogo name="Next.js 16" size={12} badgeVariant="none" />
                    <span>Framework</span>
                  </span>
                  <span className="text-zinc-200">Next.js 16 (App Router)</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/[0.03] pb-1">
                  <span className="flex items-center gap-1.5">
                    <BrandLogo name="Neon" size={12} badgeVariant="none" />
                    <span>Database</span>
                  </span>
                  <span className="text-emerald-400">Neon Serverless Postgres</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/[0.03] pb-1">
                  <span className="flex items-center gap-1.5">
                    <BrandLogo name="Tailwind CSS" size={12} badgeVariant="none" />
                    <span>Styling</span>
                  </span>
                  <span className="text-zinc-200">Tailwind CSS 4</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/[0.03] pb-1">
                  <span className="flex items-center gap-1.5">
                    <BrandLogo name="AWS Cloud" size={12} badgeVariant="none" />
                    <span>Cloud Infra</span>
                  </span>
                  <span className="text-amber-400">Vercel &amp; AWS</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <BrandLogo name="TypeScript" size={12} badgeVariant="none" />
                    <span>Language</span>
                  </span>
                  <span className="text-zinc-200">TypeScript 5 &amp; Java 21</span>
                </div>
              </div>
            </div>

            {/* Column 3: Connect & Socials */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-300">
                Connect
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <a
                    href={profile.github_url || 'https://github.com/technosaran'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <GithubIcon className="h-3 w-3 text-zinc-400" />
                    <span>GitHub (@technosaran)</span>
                  </a>
                </li>
                <li>
                  <a
                    href={profile.linkedin_url || 'https://linkedin.com/in/saran-r-b2b1a5275'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <LinkedinIcon className="h-3 w-3 text-zinc-400" />
                    <span>LinkedIn (Saran R)</span>
                  </a>
                </li>
                <li>
                  <a
                    href={profile.leetcode_url || 'https://leetcode.com/u/Saran-R/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <LeetCodeIcon className="h-3 w-3 text-amber-400" />
                    <span>LeetCode (90+ Solved)</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${profile.email}`}
                    className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <Mail className="h-3 w-3 text-zinc-400" />
                    <span>{profile.email}</span>
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-zinc-500 font-mono">
            <div>
              © {new Date().getFullYear()} Saran R · Engineered with Next.js 16 &amp; Neon
            </div>
            <a
              href="#home"
              className="inline-flex items-center gap-1 text-zinc-400 hover:text-blue-400 transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>
      </footer>
    </PortfolioClientShell>
  );
}
