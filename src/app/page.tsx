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
import { fetchGitHubData, GitHubActivityData } from '@/services/github.service';
import { fetchLeetCodeData, LeetCodeActivityData } from '@/services/leetcode.service';
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

  return (
    <PortfolioClientShell profile={profile}>
      {/* Hero Section */}
      <InteractiveHero 
        profile={profile} 
        projectCount={projects.length} 
        certCount={certificates.length} 
        internshipCount={experience.length} 
      />

      {/* Featured Projects Section */}
      <section id="projects" className="pt-12 pb-16 md:pt-14 md:pb-20 border-b border-white/[0.06] relative">
        <div className="mx-auto max-w-6xl px-3.5 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <ScrollReveal>
            <div className="space-y-2 mb-8">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-mono font-medium text-indigo-300 backdrop-blur-md">
                <Zap className="h-3.5 w-3.5 text-cyan-400" />
                <span>Featured Systems</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                <span className="text-gradient-titanium">Featured Projects</span>
              </h2>
              <p className="max-w-2xl text-xs sm:text-sm text-slate-400 leading-relaxed">
                Full-stack financial terminals, real-time computer vision inference systems, and NLP sequence pipelines built with modern cloud and AI architectures.
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
      <section id="experience" className="py-14 md:py-20 border-b border-white/[0.06] relative">
        <div className="mx-auto max-w-6xl px-3.5 sm:px-6 lg:px-8">
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
      <section id="skills" className="py-14 md:py-20 border-b border-white/[0.06] relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-3.5 sm:px-6 lg:px-8">
          
          <ScrollReveal>
            <div className="space-y-2 text-center max-w-2xl mx-auto mb-8">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-mono font-medium text-purple-300 backdrop-blur-md">
                <Code2 className="h-3.5 w-3.5 text-purple-400" />
                <span>Technical Stack</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                <span className="text-gradient-titanium">Skills &amp; Technologies</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Core programming languages, frameworks, deep learning libraries, database systems, and cloud infrastructure I engineer with.
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
      <section id="certifications" className="py-14 md:py-20 border-b border-white/[0.06] relative">
        <div className="mx-auto max-w-6xl px-3.5 sm:px-6 lg:px-8">
          
          <ScrollReveal>
            <div className="space-y-2 mb-8">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-300 backdrop-blur-md">
                <Award className="h-3.5 w-3.5 text-emerald-400" />
                <span>Verified Credentials</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                <span className="text-gradient-titanium">Certifications</span>
              </h2>
              <p className="max-w-2xl text-xs sm:text-sm text-slate-400 leading-relaxed">
                Verified industry certifications acquired across cloud computing, data science, artificial intelligence, and Java development.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <CertificatesShowcase certificates={certificates} />
          </ScrollReveal>

        </div>
      </section>

      {/* Activity Section (GitHub & LeetCode) */}
      <section id="activity" className="py-14 md:py-20 border-b border-white/[0.06] relative">
        <div className="mx-auto max-w-6xl px-3.5 sm:px-6 lg:px-8">
          
          <ScrollReveal>
            <div className="space-y-2 mb-10">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-mono font-medium text-amber-300 backdrop-blur-md">
                <Activity className="h-3.5 w-3.5 text-amber-400" />
                <span>Algorithmic Telemetry &amp; Code</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                <span className="text-gradient-titanium">Coding Activity &amp; Repositories</span>
              </h2>
              <p className="max-w-2xl text-xs sm:text-sm text-slate-400 leading-relaxed">
                GitHub repository development, open-source code delivery, and 90+ algorithmic problem solutions on LeetCode in Java.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
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

      {/* Dedicated Clean Contact Section */}
      <section id="contact" className="py-14 md:py-20 relative overflow-hidden">
        <ScrollReveal>
          <ContactSection profile={profile} />
        </ScrollReveal>
      </section>

      {/* World-Class MNC Compact Footer */}
      <footer className="border-t border-white/[0.06] bg-[#030407] py-8 sm:py-9 text-xs text-slate-400 relative overflow-hidden">
        {/* Subtle Ambient Bottom Mesh */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[100px] bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative mx-auto max-w-6xl px-3.5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 pb-6 border-b border-white/[0.06]">
            
            {/* Column 1: Brand & Summary */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/15 text-cyan-400 border border-indigo-500/30">
                  <Terminal className="h-3 w-3" />
                </div>
                <span className="font-bold text-white text-xs tracking-tight font-sans">SARAN R</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs">
                AI &amp; ML engineering student at {profile.college}. Building production-grade web applications, cloud infrastructure, and intelligent systems.
              </p>
              <div className="text-[10px] font-mono text-slate-500">
                {profile.location} · {profile.graduation_year}
              </div>
            </div>

            {/* Column 2: System Architecture */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
                Stack &amp; Architecture
              </h4>
              <div className="space-y-1.5 text-[11px] text-slate-400 font-mono">
                <div className="flex items-center justify-between border-b border-white/[0.03] pb-1">
                  <span className="flex items-center gap-1.5">
                    <BrandLogo name="Next.js 16" size={12} badgeVariant="none" />
                    <span>Framework</span>
                  </span>
                  <span className="text-slate-200">Next.js 16 (App Router)</span>
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
                  <span className="text-slate-200">Tailwind CSS 4</span>
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
                  <span className="text-slate-200">TypeScript 5 &amp; Java 21</span>
                </div>
              </div>
            </div>

            {/* Column 3: Connect & Socials */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
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
                    <GithubIcon className="h-3 w-3 text-slate-400" />
                    <span>GitHub (@technosaran)</span>
                  </a>
                </li>
                <li>
                  <a
                    href={profile.linkedin_url || 'https://linkedin.com/in/saran-r-b2b1a5275'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    <LinkedinIcon className="h-3 w-3 text-slate-400" />
                    <span>LinkedIn (Saran R)</span>
                  </a>
                </li>
                <li>
                  <a
                    href={profile.leetcode_url || 'https://leetcode.com/u/Saran-R/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5"
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
                    <Mail className="h-3 w-3 text-slate-400" />
                    <span>{profile.email}</span>
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500 font-mono">
            <div>
              © {new Date().getFullYear()} Saran R · Engineered with Next.js 16 &amp; Neon
            </div>
            <a
              href="#home"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
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
