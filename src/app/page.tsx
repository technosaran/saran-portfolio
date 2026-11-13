export const revalidate = 3600;

import Navbar from '@/components/Navbar';
import InteractiveHero from '@/components/InteractiveHero';
import ProjectsShowcase from '@/components/ProjectsShowcase';
import SkillsNucleus from '@/components/SkillsNucleus';
import ActivityShowcase from '@/components/ActivityShowcase';
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
import { 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Code2, 
  Terminal, 
  ArrowUpRight,
  ArrowUp,
  Zap,
  ShieldCheck,
  Activity,
  ExternalLink,
  Download
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
    <div className="min-h-screen bg-[#07080c] text-slate-100 selection:bg-blue-500/25 selection:text-blue-200">
      <Navbar profile={profile} />

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
                <span>Production &amp; Research</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Featured Systems
              </h2>
              <p className="max-w-2xl text-xs sm:text-sm text-zinc-400">
                Full-stack personal wealth terminal, real-time computer vision inference stream, and NLP sequence tagging pipeline.
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
          
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-start">
            
            {/* Experience Column */}
            <ScrollReveal>
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs font-mono font-medium text-blue-300 backdrop-blur-md">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Professional Background</span>
                </div>
                <h2 className="mt-2 text-3xl font-extrabold text-white tracking-tight">
                  Work Experience
                </h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Applied engineering internships focused on machine learning models and cloud deployment.
                </p>

                <div className="mt-8 space-y-4">
                  {experience.map((exp) => (
                    <div
                      key={exp.id}
                      className="rounded-2xl border border-white/[0.08] bg-[#0c0d15]/80 p-5 md:p-6 backdrop-blur-2xl hover:border-blue-500/30 transition-all duration-300 shadow-xl card-shine group"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-base font-bold text-white tracking-tight group-hover:text-blue-300 transition-colors">
                          {exp.role}
                        </h3>
                        <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-mono font-medium text-blue-300 border border-blue-500/20">
                          {exp.period}
                        </span>
                      </div>

                      <p className="mt-1 text-xs font-medium text-blue-400">
                        {exp.company} · <span className="text-zinc-400">{exp.location}</span>
                      </p>

                      <ul className="mt-3.5 space-y-2 text-xs text-zinc-300/90 leading-relaxed">
                        {exp.description?.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Education & Academic Rigor */}
            <ScrollReveal delay={120}>
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs font-mono font-medium text-blue-300 backdrop-blur-md">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>Academic Foundation</span>
                </div>
                <h2 className="mt-2 text-3xl font-extrabold text-white tracking-tight">
                  Education &amp; Rigor
                </h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Formal undergraduate engineering curriculum in Artificial Intelligence &amp; Systems.
                </p>

                <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#0c0d15]/80 p-6 backdrop-blur-2xl shadow-xl space-y-6 card-shine">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/[0.06] pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">{profile.college}</h3>
                      <p className="mt-0.5 text-sm font-medium text-blue-300">
                        {profile.degree}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-400">{profile.location}</p>
                    </div>
                    <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-mono font-medium text-blue-300 border border-blue-500/20">
                      {profile.graduation_year}
                    </span>
                  </div>

                  {/* Coursework Matrix */}
                  <div>
                    <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-2.5">
                      Core CS Fundamentals:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {displayedCoursework.map((course) => (
                        <div
                          key={course}
                          className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-zinc-300 hover:border-white/15 transition-colors"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                          <span>{course}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Problem Solving Summary */}
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-center justify-between hover:border-amber-500/35 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Terminal className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Java Algorithmic Problem Solving</div>
                        <div className="text-[11px] text-zinc-400">90 Problems Solved on LeetCode (81 Easy, 9 Medium)</div>
                      </div>
                    </div>
                    <a
                      href={profile.leetcode_url || 'https://leetcode.com/u/Saran-R/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      <span>Profile</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Verified Resume & Credentials Badge */}
                  <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex items-center justify-between hover:border-blue-500/35 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Download className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Verified Curriculum Vitae</div>
                        <div className="text-[11px] text-zinc-400">Complete Engineering Background PDF</div>
                      </div>
                    </div>
                    <a
                      href="/resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <span>Download</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>

                </div>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </section>

      {/* Technical Skills Section */}
      <section id="skills" className="py-20 md:py-24 border-b border-white/[0.08] relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          
          <ScrollReveal>
            <div className="space-y-2 text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs font-mono font-medium text-blue-300 backdrop-blur-md">
                <Code2 className="h-3.5 w-3.5" />
                <span>Atomic Competencies</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Skills Nucleus &amp; Architecture
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Interactive atomic orbital visualizer featuring core technologies revolving around the energy nucleus (E = mc²).
              </p>
            </div>
          </ScrollReveal>

          {/* Interactive Atomic Skills Orbit Visualizer */}
          <ScrollReveal delay={100}>
            <SkillsNucleus skills={skills} />
          </ScrollReveal>

        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-20 md:py-24 border-b border-white/[0.08] relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          
          <ScrollReveal>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs font-mono font-medium text-blue-300 backdrop-blur-md">
                <Award className="h-3.5 w-3.5" />
                <span>Credentials</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Certifications &amp; Honors
              </h2>
              <p className="max-w-2xl text-xs sm:text-sm text-zinc-400">
                Industry credentials acquired across cloud architecture, data science, deep learning, and enterprise Java.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100} variant="stagger">
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0c0d15]/80 p-5 backdrop-blur-xl hover:border-blue-500/30 transition-all duration-300 shadow-md group card-shine"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-blue-400">
                        {cert.provider}
                      </span>
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    </div>
                    {cert.url ? (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 text-sm font-bold text-white group-hover:text-blue-300 transition-colors leading-snug inline-flex items-center gap-1.5"
                      >
                        <span>{cert.title}</span>
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 shrink-0" />
                      </a>
                    ) : (
                      <h3 className="mt-2 text-sm font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                        {cert.title}
                      </h3>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs text-zinc-500 font-mono">
                    <span className="text-[11px] text-zinc-400">ID: {cert.credential_id || 'VERIFIED'}</span>
                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-300 font-medium border border-blue-500/20">
                      {cert.issue_date || '2025'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
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
                <span>Velocity &amp; Practice</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Development Activity &amp; Algorithmic Mastery
              </h2>
              <p className="max-w-2xl text-xs sm:text-sm text-zinc-400">
                Continuous code delivery across Git repositories, open-source architectures, and daily Java algorithmic problem solving.
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
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center relative">
          
          <ScrollReveal>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3.5 py-1 text-xs font-mono font-medium text-blue-300 backdrop-blur-md">
              <Mail className="h-3.5 w-3.5" />
              <span>Get in Touch</span>
            </div>
            
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Let&apos;s Build Something Impactful
            </h2>
            
            <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
              I am actively seeking software engineering and AI/ML internship or full-time opportunities. Reach out directly for collaboration or inquiries.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={120} variant="scale">
            <div className="mt-10 rounded-3xl border border-white/[0.08] bg-[#0c0d15]/80 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl card-shine">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                
                <div className="space-y-1.5">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="text-xs font-mono text-zinc-400">Email Address</div>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-sm font-semibold text-white hover:text-blue-400 transition-colors block"
                  >
                    {profile.email}
                  </a>
                </div>

                <div className="space-y-1.5">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="text-xs font-mono text-zinc-400">Phone Number</div>
                  <a
                    href={`tel:${profile.phone}`}
                    className="text-sm font-semibold text-white hover:text-blue-400 transition-colors block"
                  >
                    {profile.phone}
                  </a>
                </div>

                <div className="space-y-1.5">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="text-xs font-mono text-zinc-400">Current Location</div>
                  <div className="text-sm font-semibold text-white">
                    {profile.location}
                  </div>
                </div>

              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-zinc-200 px-6 py-3 text-xs font-bold text-zinc-950 transition-all shadow-md shadow-white/10 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Mail className="h-3.5 w-3.5 text-zinc-950" />
                  <span>Send Direct Email</span>
                </a>

                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 hover:border-blue-500/50 px-5 py-3 text-xs font-semibold text-blue-300 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download className="h-3.5 w-3.5 text-blue-400" />
                  <span>Download Resume (PDF)</span>
                </a>

                <a
                  href={profile.linkedin_url || 'https://linkedin.com/in/saran-r-b2b1a5275'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] hover:border-blue-500/40 px-5 py-3 text-xs font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <LinkedinIcon className="h-3.5 w-3.5 text-zinc-300" />
                  <span>Connect on LinkedIn</span>
                </a>

                <a
                  href={profile.github_url || 'https://github.com/technosaran'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] hover:border-blue-500/40 px-5 py-3 text-xs font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <GithubIcon className="h-3.5 w-3.5 text-zinc-300" />
                  <span>Follow on GitHub</span>
                </a>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* Clean Modern Footer */}
      <footer className="border-t border-white/[0.08] bg-[#050608] pt-14 pb-10 text-xs text-zinc-400">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 pb-10 border-b border-white/[0.06]">
            
            {/* Column 1: Brand & Summary */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Terminal className="h-4 w-4" />
                </div>
                <span className="font-bold text-white text-sm tracking-tight font-sans">SARAN R</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
                AI &amp; ML engineering student at {profile.college}. Focused on building production-grade web applications, cloud infrastructure, and intelligent systems.
              </p>
              <div className="text-[11px] font-mono text-zinc-500">
                {profile.location} · {profile.graduation_year}
              </div>
            </div>

            {/* Column 2: System Architecture */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Stack &amp; Architecture
              </h4>
              <div className="space-y-2 text-xs text-zinc-400 font-mono">
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-1">
                  <span>Framework</span>
                  <span className="text-zinc-200">Next.js 16 (App Router)</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-1">
                  <span>Database</span>
                  <span className="text-blue-400">Neon Serverless PostgreSQL</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-1">
                  <span>Styling</span>
                  <span className="text-zinc-200">Tailwind CSS 4</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-1">
                  <span>Cloud Infra</span>
                  <span className="text-amber-400">Vercel &amp; AWS</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Language</span>
                  <span className="text-zinc-200">TypeScript 5 &amp; Java 21</span>
                </div>
              </div>
            </div>

            {/* Column 3: Connect & Socials */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Connect
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href={profile.github_url || 'https://github.com/technosaran'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <GithubIcon className="h-3.5 w-3.5 text-zinc-400" />
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
                    <LinkedinIcon className="h-3.5 w-3.5 text-zinc-400" />
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
                    <LeetCodeIcon className="h-3.5 w-3.5 text-amber-400" />
                    <span>LeetCode (90+ Solved)</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${profile.email}`}
                    className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <Mail className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{profile.email}</span>
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500 font-mono">
            <div>
              © {new Date().getFullYear()} Saran R · Engineered with Next.js 16 &amp; Neon
            </div>
            <a
              href="#home"
              className="inline-flex items-center gap-1 text-zinc-400 hover:text-blue-400 transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
