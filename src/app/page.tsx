import Navbar from '@/components/Navbar';
import InteractiveHero from '@/components/InteractiveHero';
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
  ExternalLink, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Code2, 
  Layers, 
  Terminal, 
  ChevronRight,
  Send,
  Activity,
  Flame,
  GitCommit,
  GitPullRequest,
  CheckCircle2,
  ArrowUpRight,
  Cpu,
  Database,
  Sparkles,
  ArrowUp,
  Zap,
  ShieldCheck,
  Star,
  FolderGit2
} from 'lucide-react';

const FALLBACK_PROFILE: Profile = {
  id: 1,
  full_name: 'SARAN R',
  title: 'Artificial Intelligence & Machine Learning Engineer',
  headline: 'AI/ML Engineering Student | Cloud Infrastructure & Full-Stack Architect',
  bio: 'Innovative Artificial Intelligence and Machine Learning engineering student with hands-on experience in cloud infrastructure (AWS) and full-stack development. Proven ability to architect scalable web applications and implement data-driven algorithms. Passionate about leveraging DevOps principles and modern software engineering practices to solve complex enterprise challenges.',
  email: 'iamsaran.ai@gmail.com',
  phone: '+91 6384957740',
  location: 'Chennai, Tamil Nadu',
  college: 'Panimalar Engineering College',
  degree: 'Bachelor of Technology in Artificial Intelligence and Machine Learning',
  graduation_year: '2023 – 2027',
  github_url: 'https://github.com/technosaran',
  linkedin_url: 'https://linkedin.com/in/saran-r-b2b1a5275',
  website_url: 'https://technosaran.vercel.app',
  leetcode_url: 'https://leetcode.com/u/technosaran/',
};

const FALLBACK_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'arthaX – Enterprise Personal Financial Management Terminal',
    description: 'Full-stack wealth terminal for real-time tracking of investments and net worth with dark-mode financial terminal experience.',
    tech_stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Supabase', 'TailwindCSS'],
    github_url: 'https://github.com/technosaran/arthax',
    live_url: 'https://technosaran.vercel.app',
    highlights: [
      'Architected a full-stack wealth terminal for real-time tracking of investments and net worth.',
      'Engineered secure PostgreSQL database schemas with Row Level Security (RLS) and automated parsing pipelines.',
      'Designed a dark-mode UI with Next.js App Router, cutting client-side load time by 35%.'
    ]
  },
  {
    id: 2,
    title: 'Real-Time Object Detection System',
    description: 'Live video stream object detection application using deep learning visual inference algorithms.',
    tech_stack: ['Python', 'OpenCV', 'PyTorch', 'Deep Learning'],
    github_url: 'https://github.com/technosaran/realtime-object-detection',
    live_url: null,
    highlights: [
      'Developed a real-time object detection application using Python and OpenCV for live video stream analysis.',
      'Implemented deep learning visual inference algorithms to perform high-accuracy bounding-box detection.'
    ]
  },
  {
    id: 3,
    title: 'Named Entity Recognition (NER) System using NLP',
    description: 'NLP text analytics pipeline extracting entities (Names, Locations, Dates) from unstructured datasets with high precision.',
    tech_stack: ['Python', 'NLP', 'SpaCy', 'Scikit-Learn'],
    github_url: 'https://github.com/technosaran/ner-system-nlp',
    live_url: null,
    highlights: [
      'Engineered an NLP text analytics pipeline to extract critical entities (Names, Locations, Dates) from unstructured text.',
      'Applied advanced tokenization and sequence tagging algorithms to achieve high-precision entity identification.'
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
      'Engineered machine learning models using Python and Scikit-Learn during an intensive 6-week program via IBM SkillsBuild.',
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
      'Optimized application deployment workflows using cloud-native DevOps principles, enhancing system security and scalability.'
    ]
  }
];

const FALLBACK_CERTS: Certificate[] = [
  { id: 1, credential_id: 'INFOSYS-JAVA', title: 'Programming using Java', provider: 'Infosys Springboard', issue_date: '2025', url: null },
  { id: 2, credential_id: 'ORACLE-OCI-DS', title: 'Oracle Cloud Infrastructure Certified Data Science Professional', provider: 'Oracle University', issue_date: '2025', url: null },
  { id: 3, credential_id: 'IBM-AI-FUND', title: 'Artificial Intelligence Fundamentals', provider: 'IBM SkillsBuild', issue_date: '2025', url: null },
  { id: 4, credential_id: 'AWS-COURSERA', title: 'Introduction to Information Technology and AWS Cloud', provider: 'Amazon Web Services / Coursera', issue_date: '2025', url: null },
  { id: 5, credential_id: 'GUVI-PROMPT', title: 'Prompt Engineering for Beginners', provider: 'GUVI Geek Networks (Google for Education Partner)', issue_date: '2025', url: null },
  { id: 6, credential_id: 'NASSCOM-GOLD', title: 'Acquiring Data: IT-ITeS Sector Skills Council NASSCOM – FutureSkills Prime Gold', provider: 'NASSCOM', issue_date: '2025', url: null },
];

export default async function Home() {
  let profile: Profile = FALLBACK_PROFILE;
  let projects: Project[] = FALLBACK_PROJECTS;
  let experience: Experience[] = FALLBACK_EXPERIENCE;
  let certificates: Certificate[] = FALLBACK_CERTS;
  let skills: Skill[] = [];

  try {
    const [prof, p, s, e, c] = await Promise.all([
      fetchProfile(),
      fetchProjects(),
      fetchSkills(),
      fetchExperience(),
      fetchCertificates(),
    ]);
    if (prof) profile = prof;
    if (p && p.length > 0) projects = p;
    if (s && s.length > 0) skills = s;
    if (e && e.length > 0) experience = e;
    if (c && c.length > 0) certificates = c;
  } catch (err) {
    console.warn('Using database fallback for render:', err);
  }

  // Split flagship project from research projects
  const flagshipProject = projects.find(p => p.title.toLowerCase().includes('arthax')) || projects[0];
  const otherProjects = projects.filter(p => p.id !== flagshipProject?.id);

  // Categorize skills
  const defaultCats: Record<string, string[]> = {
    'Programming Languages': ['Java', 'JavaScript', 'TypeScript', 'Python', 'SQL'],
    'Web & Backend Frameworks': ['Next.js', 'React.js', 'Node.js', 'Express.js', 'TailwindCSS', 'RESTful APIs', 'Microservices'],
    'AI/ML & Cloud': ['PyTorch', 'OpenCV', 'Scikit-Learn', 'SpaCy', 'Pandas', 'NumPy', 'AWS Cloud', 'Docker', 'DevOps & CI/CD'],
    'Databases & Developer Tools': ['PostgreSQL', 'Supabase', 'MongoDB', 'Git & GitHub', 'Vercel', 'VS Code'],
    'Core CS Fundamentals': ['Data Structures & Algorithms', 'OOP', 'DBMS', 'Operating Systems', 'Computer Networks', 'Software Engineering (SDLC)']
  };

  const skillCategories = skills.length > 0
    ? skills.reduce<Record<string, string[]>>((acc, curr) => {
        if (!acc[curr.category]) acc[curr.category] = [];
        acc[curr.category].push(curr.name);
        return acc;
      }, {})
    : defaultCats;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Programming Languages':
        return <Terminal className="h-4 w-4 text-amber-400" />;
      case 'Web & Backend Frameworks':
        return <Layers className="h-4 w-4 text-cyan-400" />;
      case 'AI/ML & Cloud':
        return <Cpu className="h-4 w-4 text-emerald-400" />;
      case 'Databases & Developer Tools':
        return <Database className="h-4 w-4 text-teal-400" />;
      case 'Core CS Fundamentals':
        return <Code2 className="h-4 w-4 text-purple-400" />;
      default:
        return <Code2 className="h-4 w-4 text-emerald-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500/25 selection:text-emerald-300">
      <Navbar />

      {/* Interactive Hero Section with Live Terminal Card & Instant Email Copy */}
      <InteractiveHero profile={profile} />

      {/* Projects Section */}
      <section id="projects" className="py-24 bg-[#0a0b10]/70 relative border-b border-white/[0.06]">
        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            <Zap className="h-4 w-4 text-emerald-400" />
            <span>Featured Systems & Production Engineering</span>
          </div>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Production &amp; Research Systems
          </h2>
          <p className="mt-3 max-w-2xl text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
            Real-time financial terminals, live video stream visual inference algorithms, and NLP text analytics pipelines loaded live from database.
          </p>

          {/* 1. Flagship Spotlight Banner (arthaX) */}
          {flagshipProject && (
            <div className="mt-12 rounded-3xl border border-white/[0.12] bg-gradient-to-b from-[#11121d] to-[#0d0e17] p-7 md:p-10 shadow-2xl backdrop-blur-2xl card-shine relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left side: Information (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-semibold text-emerald-300">
                    <Star className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
                    <span>Flagship Production System</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug group-hover:text-emerald-300 transition-colors">
                    {flagshipProject.title}
                  </h3>

                  <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                    {flagshipProject.description}
                  </p>

                  {/* Highlights with checkmarks */}
                  <div className="space-y-2.5 pt-2">
                    {flagshipProject.highlights?.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {flagshipProject.tech_stack?.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-mono text-zinc-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap items-center gap-3 pt-4">
                    {flagshipProject.live_url && (
                      <a
                        href={flagshipProject.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 px-5 py-3 text-xs font-bold text-black transition-all shadow-lg shadow-emerald-500/20"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Launch Live Terminal</span>
                      </a>
                    )}
                    {flagshipProject.github_url && (
                      <a
                        href={flagshipProject.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.1] hover:border-white/20 px-4 py-3 text-xs font-semibold text-zinc-200 transition-all"
                      >
                        <GithubIcon className="h-3.5 w-3.5" />
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Right side: Mock Terminal Display (5 cols) */}
                <div className="lg:col-span-5">
                  <div className="rounded-2xl border border-white/[0.08] bg-[#090a10] p-5 shadow-inner space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-emerald-400" />
                        <span className="text-white font-bold">arthaX.terminal.env</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        LIVE DEMO
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[11px] text-zinc-500 uppercase tracking-wider">Asset Valuation</div>
                      <div className="text-xl font-extrabold text-white font-mono flex items-baseline gap-2">
                        <span>$128,450.00</span>
                        <span className="text-xs font-bold text-emerald-400">▲ +14.2% YTD</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/[0.06] text-[11px]">
                      <div className="flex justify-between text-zinc-400">
                        <span>PostgreSQL Engine:</span>
                        <span className="text-emerald-400">Cloud Serverless DB</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Security Paradigm:</span>
                        <span className="text-zinc-200">Row Level Security (RLS)</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>App Router Latency:</span>
                        <span className="text-emerald-400">-35% Client Load</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Deployment:</span>
                        <span className="text-zinc-200">technosaran.vercel.app</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full w-4/5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Other Production & Research Projects Grid */}
          <div className="mt-8 grid grid-cols-1 gap-7 md:grid-cols-2">
            {otherProjects.map((proj) => (
              <div
                key={proj.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/[0.08] bg-[#0e0f16]/90 p-7 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/30 hover:bg-[#12131c] hover:-translate-y-1 shadow-xl hover:shadow-2xl hover:shadow-emerald-950/20"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                      {proj.tech_stack?.slice(0, 2).join(' · ')}
                    </span>
                    <FolderGit2 className="h-4 w-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {proj.title}
                  </h3>

                  <p className="mt-3 text-xs text-zinc-300 leading-relaxed font-normal">
                    {proj.description}
                  </p>

                  <div className="mt-5 space-y-2 border-t border-white/[0.06] pt-4">
                    {proj.highlights?.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-400 leading-relaxed">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-white/[0.06] pt-4">
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {proj.tech_stack?.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[11px] font-mono text-zinc-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2.5">
                    {proj.github_url && (
                      <a
                        href={proj.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/[0.18] px-3.5 py-2 text-xs font-semibold text-zinc-200 transition-all"
                      >
                        <GithubIcon className="h-3.5 w-3.5" />
                        <span>Source Code</span>
                      </a>
                    )}
                    {proj.live_url && (
                      <a
                        href={proj.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-3.5 py-2 text-xs font-bold text-black transition-all shadow-md shadow-emerald-500/20"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Live Terminal</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience & Education Section */}
      <section id="experience" className="border-t border-white/[0.06] py-24 relative">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-start">
            
            {/* Experience (Timeline) */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                <Briefcase className="h-4 w-4" />
                <span>Career Progression</span>
              </div>
              <h2 className="mt-2 text-3xl font-extrabold text-white tracking-tight">
                Internships &amp; Applied Roles
              </h2>
              <p className="mt-2 text-xs text-zinc-400">
                Practical engineering roles delivering machine learning models, cloud containerization, and DevOps workflows.
              </p>

              {/* Vertical Timeline Container */}
              <div className="mt-8 relative space-y-6 before:absolute before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-teal-500 before:to-zinc-800">
                {experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="relative pl-9 group"
                  >
                    {/* Glowing Node on Timeline */}
                    <div className="absolute left-3 top-5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-emerald-400 bg-[#09090b] shadow-md shadow-emerald-500/50 group-hover:scale-125 transition-transform" />

                    <div className="rounded-3xl border border-white/[0.08] bg-[#0e0f16]/90 p-6 backdrop-blur-xl hover:border-emerald-500/30 transition-all shadow-xl">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-base font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                          {exp.role}
                        </h3>
                        <span className="rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-mono font-medium text-emerald-400 border border-emerald-500/20">
                          {exp.period}
                        </span>
                      </div>

                      <p className="mt-1 text-xs font-medium text-emerald-300">
                        {exp.company} · <span className="text-zinc-400">{exp.location}</span>
                      </p>

                      <ul className="mt-4 space-y-2 text-xs text-zinc-300 leading-relaxed">
                        {exp.description?.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Academic Rigor */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                <GraduationCap className="h-4 w-4" />
                <span>Academic Foundation</span>
              </div>
              <h2 className="mt-2 text-3xl font-extrabold text-white tracking-tight">
                Education &amp; Core CS
              </h2>
              <p className="mt-2 text-xs text-zinc-400">
                Four-year formal engineering curriculum focused on Artificial Intelligence, Machine Learning, and Systems Engineering.
              </p>

              <div className="mt-8 rounded-3xl border border-white/[0.08] bg-[#0e0f16]/90 p-7 backdrop-blur-xl shadow-xl space-y-6">
                <div className="flex items-baseline justify-between border-b border-white/[0.06] pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{profile.college}</h3>
                    <p className="mt-1 text-sm font-medium text-emerald-300">
                      {profile.degree}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-400">{profile.location}</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-mono font-medium text-emerald-400 border border-emerald-500/20">
                    {profile.graduation_year}
                  </span>
                </div>

                {/* Coursework Matrix */}
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    Structured Engineering Coursework:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      { name: 'Data Structures & Algorithms', tag: 'Core DSA' },
                      { name: 'Object-Oriented Programming (Java)', tag: 'OOP' },
                      { name: 'Database Management Systems (DBMS)', tag: 'SQL' },
                      { name: 'Operating Systems & Linux', tag: 'Systems' },
                      { name: 'Computer Networks & Protocols', tag: 'Networking' },
                      { name: 'Software Engineering (SDLC)', tag: 'Architecture' }
                    ].map((c) => (
                      <div
                        key={c.name}
                        className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-zinc-200"
                      >
                        <span className="truncate pr-2">{c.name}</span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md shrink-0">
                          {c.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Algorithmic Problem Solving Box */}
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <Terminal className="h-4 w-4 text-amber-400" />
                      <span>Java Algorithmic Problem Solving</span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      LeetCode 90+
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-300 leading-relaxed font-normal">
                    Active LeetCode problem solver in Java, implementing graph algorithms, dynamic programming, and high-efficiency data structures.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Technical Skills Matrix */}
      <section id="skills" className="border-t border-white/[0.06] py-24 bg-[#0a0b10]/60 relative">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            <Code2 className="h-4 w-4" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Skills &amp; Architecture Matrix
          </h2>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Full-stack programming languages, AI/ML deep learning frameworks, cloud infrastructure, and modern database architectures.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(skillCategories).map(([category, items], idx, arr) => (
              <div
                key={category}
                className={`rounded-3xl border border-white/[0.08] bg-[#0e0f16]/90 p-6 md:p-7 backdrop-blur-xl hover:border-emerald-500/30 transition-all shadow-xl group ${
                  idx === arr.length - 1 && arr.length % 3 === 2 ? 'sm:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5">
                  <div className="flex items-center gap-2.5">
                    {getCategoryIcon(category)}
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {category}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.06]">
                    {items.length} skills
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-200 hover:border-emerald-500/40 hover:text-emerald-300 hover:bg-emerald-500/5 transition-all"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="border-t border-white/[0.06] py-24 relative">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            <Award className="h-4 w-4" />
            <span>Professional Credentials</span>
          </div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Certifications &amp; Verified Honors
          </h2>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Industry credentials acquired across cloud architecture, data science, deep learning, and enterprise Java.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0e0f16]/90 p-5 md:p-6 backdrop-blur-xl hover:border-emerald-500/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-950/20 transition-all duration-300 shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                      {cert.provider}
                    </span>
                    <ShieldCheck className="h-4 w-4 text-emerald-400/80 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {cert.title}
                  </h3>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs text-zinc-500 font-mono">
                  <span className="text-[11px] text-zinc-400">ID: {cert.credential_id || 'VERIFIED'}</span>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] text-emerald-400 font-medium border border-emerald-500/20">
                    Verified {cert.issue_date || '2025'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activity Section */}
      <section id="activity" className="border-t border-white/[0.06] py-24 bg-[#0a0b10]/60 relative">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            <Activity className="h-4 w-4" />
            <span>Engineering Velocity & Problem Solving</span>
          </div>
          <h2 className="mt-2.5 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Development & Coding Activity
          </h2>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Continuous engineering velocity across open-source Git repositories and daily algorithmic mastery on LeetCode.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Card: GitHub Activity */}
            <div className="flex flex-col justify-between rounded-3xl border border-white/[0.08] bg-[#0e0f16]/90 p-6 sm:p-8 backdrop-blur-xl hover:border-emerald-500/30 transition-all shadow-xl">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.05] border border-white/[0.1] text-white">
                      <GithubIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">GitHub Activity</h3>
                      <p className="text-xs font-mono text-emerald-400">@technosaran</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-mono font-medium text-emerald-400 border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active Commits
                  </span>
                </div>

                {/* Heatmap Card */}
                <div className="mt-6 rounded-2xl border border-white/[0.06] bg-black/40 p-4">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-mono text-zinc-400">Commit Contribution Calendar</span>
                    <span className="text-[11px] text-zinc-500 font-mono">Live SVG Stream</span>
                  </div>
                  <div className="overflow-x-auto pb-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/api/github-chart"
                      alt="Saran R GitHub Contribution Heatmap — Live commit data from github.com/technosaran"
                      className="w-full min-w-[500px] h-auto rounded-lg"
                      loading="lazy"
                    />
                  </div>
                  <p className="mt-2.5 text-[11px] text-zinc-500 font-mono text-center">
                    Live commit history synced with github.com/technosaran
                  </p>
                </div>

                {/* GitHub Metrics */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                    <GitCommit className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                    <div className="text-base font-bold text-white font-mono">10+</div>
                    <div className="text-[10px] text-zinc-400 font-mono">Public Repos</div>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                    <Code2 className="h-4 w-4 text-teal-400 mx-auto mb-1" />
                    <div className="text-base font-bold text-white font-mono">3 Main</div>
                    <div className="text-[10px] text-zinc-400 font-mono">TS, Py, Java</div>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                    <Layers className="h-4 w-4 text-cyan-400 mx-auto mb-1" />
                    <div className="text-base font-bold text-white font-mono">Cloud</div>
                    <div className="text-[10px] text-zinc-400 font-mono">AWS & Docker</div>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                    <GitPullRequest className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                    <div className="text-base font-bold text-white font-mono">main</div>
                    <div className="text-[10px] text-zinc-400 font-mono">Prod Branches</div>
                  </div>
                </div>

                {/* Featured Git Repos */}
                <div className="mt-6 space-y-2.5">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                    Highlighted Repositories:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                      <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        technosaran/arthax
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">Full-stack wealth terminal & portfolio engine</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                      <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                        technosaran/saran-portfolio
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">Next.js 16 portfolio with Serverless Database</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                      <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        realtime-object-detection
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">PyTorch & OpenCV live video inference</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                      <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        ner-system-nlp
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">NLP text analytics & sequence tagging</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* GitHub CTA */}
              <div className="mt-8 border-t border-white/[0.06] pt-5">
                <a
                  href={profile.github_url || 'https://github.com/technosaran'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] hover:border-emerald-500/40 px-5 py-3 text-xs font-semibold text-white transition-all group"
                >
                  <GithubIcon className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>View GitHub Profile (@technosaran)</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-emerald-400" />
                </a>
              </div>
            </div>

            {/* Right Card: LeetCode Activity */}
            <div className="flex flex-col justify-between rounded-3xl border border-white/[0.08] bg-[#0e0f16]/90 p-6 sm:p-8 backdrop-blur-xl hover:border-amber-500/30 transition-all shadow-xl">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <LeetCodeIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">LeetCode Activity</h3>
                      <p className="text-xs font-mono text-amber-400">@technosaran · Java DSA</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-mono font-medium text-amber-400 border border-amber-500/20">
                    <Flame className="h-3.5 w-3.5 text-amber-400" />
                    Active Solver
                  </span>
                </div>

                {/* Progress Card */}
                <div className="mt-6 rounded-2xl border border-white/[0.06] bg-black/40 p-5">
                  <div className="flex items-baseline justify-between border-b border-white/[0.06] pb-3 mb-4">
                    <div>
                      <div className="text-2xl font-extrabold text-white font-mono">90+</div>
                      <div className="text-[11px] text-zinc-400 font-mono">Total Problems Solved</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-400 font-mono">84.8%</div>
                      <div className="text-[11px] text-zinc-400 font-mono">Acceptance Rate</div>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <div className="flex justify-between font-mono text-zinc-300 mb-1.5">
                        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          Easy
                        </span>
                        <span>50+ Solved</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '65%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-mono text-zinc-300 mb-1.5">
                        <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                          <span className="h-2 w-2 rounded-full bg-amber-400" />
                          Medium
                        </span>
                        <span>30+ Solved</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" style={{ width: '40%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-mono text-zinc-300 mb-1.5">
                        <span className="flex items-center gap-1.5 text-rose-400 font-medium">
                          <span className="h-2 w-2 rounded-full bg-rose-400" />
                          Hard
                        </span>
                        <span>10+ Solved</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-rose-500 to-red-400 rounded-full" style={{ width: '20%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* LeetCode Metrics */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                    <Terminal className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                    <div className="text-base font-bold text-white font-mono">Java</div>
                    <div className="text-[10px] text-zinc-400 font-mono">Primary Lang</div>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                    <Cpu className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                    <div className="text-base font-bold text-white font-mono">O(N log N)</div>
                    <div className="text-[10px] text-zinc-400 font-mono">Efficiency</div>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                    <Sparkles className="h-4 w-4 text-purple-400 mx-auto mb-1" />
                    <div className="text-base font-bold text-white font-mono">OOP</div>
                    <div className="text-[10px] text-zinc-400 font-mono">Clean Code</div>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                    <CheckCircle2 className="h-4 w-4 text-teal-400 mx-auto mb-1" />
                    <div className="text-base font-bold text-white font-mono">100%</div>
                    <div className="text-[10px] text-zinc-400 font-mono">Test Passes</div>
                  </div>
                </div>

                {/* Algorithmic Topics Tagged */}
                <div className="mt-6">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                    Topics & Patterns Mastered:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Graph Algorithms (BFS/DFS)',
                      'Dynamic Programming',
                      'Binary Search Trees',
                      'Binary Search & Two Pointers',
                      'Heaps & Priority Queues',
                      'Sliding Window',
                      'Hash Tables & Tries'
                    ].map((topic) => (
                      <span
                        key={topic}
                        className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-2.5 py-1 text-[11px] font-mono text-amber-200/90"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* LeetCode CTA */}
              <div className="mt-8 border-t border-white/[0.06] pt-5">
                <a
                  href={profile.leetcode_url || 'https://leetcode.com/u/technosaran/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 px-5 py-3 text-xs font-semibold text-amber-300 transition-all group"
                >
                  <LeetCodeIcon className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>View LeetCode Profile (@technosaran)</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-amber-400/80 group-hover:text-amber-300" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Modern Footer */}
      <footer className="border-t border-white/[0.08] bg-[#07070a] pt-16 pb-12 text-xs text-zinc-400">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5 pb-12 border-b border-white/[0.06]">
            {/* Col 1 & 2: Brand & Summary */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Terminal className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base tracking-tight font-sans">SARAN R</span>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono">AI/ML & Cloud Engineer</p>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed max-w-sm font-normal">
                Artificial Intelligence and Machine Learning engineering student at {profile.college}. Passionate about architecting scalable full-stack platforms, cloud infrastructure, and data-driven algorithms.
              </p>

              <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-zinc-500">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                <span>{profile.location}</span>
                <span>·</span>
                <span className="text-emerald-400">{profile.graduation_year}</span>
              </div>
            </div>

            {/* Col 3: Navigation */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#home" className="hover:text-emerald-400 transition-colors">Home</a>
                </li>
                <li>
                  <a href="#projects" className="hover:text-emerald-400 transition-colors">Projects</a>
                </li>
                <li>
                  <a href="#experience" className="hover:text-emerald-400 transition-colors">Experience</a>
                </li>
                <li>
                  <a href="#skills" className="hover:text-emerald-400 transition-colors">Skills Matrix</a>
                </li>
                <li>
                  <a href="#certifications" className="hover:text-emerald-400 transition-colors">Certifications</a>
                </li>
                <li>
                  <a href="#activity" className="hover:text-emerald-400 transition-colors">Activity</a>
                </li>
              </ul>
            </div>

            {/* Col 4: Connect */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Connect
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href={profile.github_url || 'https://github.com/technosaran'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <GithubIcon className="h-3.5 w-3.5 text-zinc-400" />
                    <span>GitHub</span>
                  </a>
                </li>
                <li>
                  <a
                    href={profile.linkedin_url || 'https://linkedin.com/in/saran-r-b2b1a5275'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <LinkedinIcon className="h-3.5 w-3.5 text-zinc-400" />
                    <span>LinkedIn</span>
                  </a>
                </li>
                <li>
                  <a
                    href={profile.leetcode_url || 'https://leetcode.com/u/technosaran/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <LeetCodeIcon className="h-3.5 w-3.5 text-amber-400" />
                    <span>LeetCode</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${profile.email}`}
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{profile.email}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${profile.phone}`}
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{profile.phone}</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 5: Cloud Architecture */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Architecture
              </h4>
              <div className="space-y-2 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-emerald-400" />
                  <span>PostgreSQL (Relational DB)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-teal-400" />
                  <span>Next.js 16 (App Router)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Code2 className="h-3.5 w-3.5 text-cyan-400" />
                  <span>TypeScript & Tailwind CSS</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Vercel Edge Cloud</span>
                </div>

                <div className="pt-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Systems Operational
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-mono">
            <div>
              © {new Date().getFullYear()} Saran R. Built with Next.js & Tailwind CSS. All rights reserved.
            </div>
            <a
              href="#home"
              className="flex items-center gap-1 text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
