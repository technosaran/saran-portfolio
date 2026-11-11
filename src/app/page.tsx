import Navbar from '@/components/Navbar';
import NeonStatusDashboard from '@/components/NeonStatusDashboard';
import Guestbook from '@/components/Guestbook';
import { GithubIcon, LinkedinIcon } from '@/components/SocialIcons';
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
  Server,
  MessageSquare,
  Sparkles,
  ArrowUpRight
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
};

const FALLBACK_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'arthaX – Enterprise Personal Financial Management Terminal',
    description: 'Full-stack wealth terminal for real-time tracking of investments and net worth with dark-mode financial terminal experience.',
    tech_stack: ['Next.js', 'TypeScript', 'Neon Postgres', 'Supabase', 'TailwindCSS'],
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

  // Categorize skills
  const defaultCats: Record<string, string[]> = {
    'Programming Languages': ['Java', 'JavaScript', 'TypeScript', 'Python', 'SQL'],
    'Web & Backend Frameworks': ['Next.js', 'React.js', 'Node.js', 'Express.js', 'TailwindCSS', 'RESTful APIs', 'Microservices'],
    'AI/ML & Cloud': ['PyTorch', 'OpenCV', 'Scikit-Learn', 'SpaCy', 'Pandas', 'NumPy', 'AWS Cloud', 'Docker', 'DevOps & CI/CD'],
    'Databases & Developer Tools': ['Neon Postgres', 'PostgreSQL', 'Supabase', 'MongoDB', 'Git & GitHub', 'Vercel', 'VS Code'],
    'Core CS Fundamentals': ['Data Structures & Algorithms', 'OOP', 'DBMS', 'Operating Systems', 'Computer Networks', 'Software Engineering (SDLC)']
  };

  const skillCategories = skills.length > 0
    ? skills.reduce<Record<string, string[]>>((acc, curr) => {
        if (!acc[curr.category]) acc[curr.category] = [];
        acc[curr.category].push(curr.name);
        return acc;
      }, {})
    : defaultCats;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500/20 selection:text-emerald-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36 border-b border-white/[0.06]">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-500/5 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative mx-auto max-w-6xl px-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-300 mb-8 backdrop-blur-md shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{profile.degree} · {profile.college} ({profile.graduation_year})</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.08]">
            Hi, I&apos;m <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">{profile.full_name}</span>
          </h1>

          <p className="mt-5 text-xl sm:text-2xl font-medium text-zinc-300 tracking-tight max-w-3xl">
            {profile.title}
          </p>

          <p className="mt-5 max-w-3xl text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
            {profile.bio}
          </p>

          {/* Contact Details Quick Pills */}
          <div className="mt-8 flex flex-wrap items-center gap-2.5 text-xs text-zinc-300">
            <span className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 backdrop-blur-sm">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              {profile.location}
            </span>
            <a href={`tel:${profile.phone}`} className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 hover:border-emerald-500/40 hover:bg-white/[0.06] transition-all">
              <Phone className="h-3.5 w-3.5 text-emerald-400" />
              {profile.phone}
            </a>
            <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 hover:border-emerald-500/40 hover:bg-white/[0.06] transition-all">
              <Mail className="h-3.5 w-3.5 text-emerald-400" />
              {profile.email}
            </a>
            <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 hover:border-emerald-500/40 hover:bg-white/[0.06] transition-all">
              <Terminal className="h-3.5 w-3.5 text-emerald-400" />
              technosaran.vercel.app
            </a>
          </div>

          {/* Hero CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 px-6 py-3.5 text-xs font-bold text-black shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <span>Explore Projects</span>
              <ChevronRight className="h-4 w-4" />
            </a>
            <a
              href="#connect"
              className="flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/[0.2] px-6 py-3.5 text-xs font-semibold text-zinc-200 transition-all cursor-pointer backdrop-blur-md"
            >
              <MessageSquare className="h-4 w-4 text-blue-400" />
              <span>Leave a Message</span>
            </a>
            <a
              href="#neon-stack"
              className="flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 hover:bg-emerald-500/15 px-5 py-3.5 text-xs font-semibold text-emerald-400 transition-all cursor-pointer"
            >
              <Server className="h-4 w-4" />
              <span>Neon Architecture</span>
            </a>
          </div>
        </div>
      </section>

      {/* Neon Live Services Telemetry Section */}
      <section id="neon-stack" className="mx-auto max-w-6xl px-6 py-16">
        <NeonStatusDashboard />
      </section>

      {/* Projects Section */}
      <section id="projects" className="border-t border-white/[0.06] py-24 bg-[#0a0b10]/60 relative">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            <Layers className="h-4 w-4" />
            <span>Featured Systems & Deployments</span>
          </div>
          <h2 className="mt-2.5 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Production & Research Projects
          </h2>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Real-time financial terminals, live video stream visual inference algorithms, and NLP text analytics pipelines loaded live from Neon Database.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/[0.08] bg-[#0e0f16]/90 p-6 md:p-7 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/30 hover:bg-[#12131c] hover:-translate-y-1 shadow-xl hover:shadow-2xl hover:shadow-emerald-950/20"
              >
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
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
                        <span>Source</span>
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
      <section id="experience" className="border-t border-white/[0.06] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Experience */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                <Briefcase className="h-4 w-4" />
                <span>Professional Experience</span>
              </div>
              <h2 className="mt-2.5 text-3xl font-extrabold text-white tracking-tight">
                Internships & Applied Roles
              </h2>

              <div className="mt-8 space-y-5">
                {experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="relative rounded-3xl border border-white/[0.08] bg-[#0e0f16]/90 p-6 md:p-7 backdrop-blur-xl hover:border-white/[0.15] transition-all"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-base font-bold text-white tracking-tight">{exp.role}</h3>
                      <span className="rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-mono font-medium text-emerald-400 border border-emerald-500/20">
                        {exp.period}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs font-medium text-emerald-300">
                      {exp.company} · <span className="text-zinc-400">{exp.location}</span>
                    </p>

                    <ul className="mt-4 space-y-2.5 text-xs text-zinc-300 leading-relaxed">
                      {exp.description?.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                <GraduationCap className="h-4 w-4" />
                <span>Academic Foundation</span>
              </div>
              <h2 className="mt-2.5 text-3xl font-extrabold text-white tracking-tight">
                Education & Coursework
              </h2>

              <div className="mt-8 rounded-3xl border border-white/[0.08] bg-[#0e0f16]/90 p-6 md:p-7 backdrop-blur-xl">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-bold text-white tracking-tight">{profile.college}</h3>
                  <span className="rounded-full bg-blue-500/10 px-3 py-0.5 text-xs font-mono font-medium text-blue-400 border border-blue-500/20">
                    {profile.graduation_year}
                  </span>
                </div>
                <p className="mt-1.5 text-sm font-medium text-zinc-300">
                  {profile.degree}
                </p>
                <p className="mt-1 text-xs text-zinc-400">{profile.location}</p>

                <div className="mt-6 border-t border-white/[0.06] pt-5">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    Relevant Coursework:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Data Structures & Algorithms (DSA)',
                      'Object-Oriented Programming (Java)',
                      'Database Management Systems (DBMS)',
                      'Operating Systems',
                      'Computer Networks',
                      'Software Engineering (SDLC)'
                    ].map((c) => (
                      <span
                        key={c}
                        className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-white/[0.06] bg-black/40 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                    <Terminal className="h-4 w-4 text-emerald-400" />
                    <span>Problem Solving & Algorithms</span>
                  </div>
                  <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                    Active LeetCode problem solver in Java, implementing graph algorithms, dynamic programming, and high-efficiency data structures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Skills Matrix */}
      <section id="skills" className="border-t border-white/[0.06] py-24 bg-[#0a0b10]/60">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            <Code2 className="h-4 w-4" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="mt-2.5 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Skills & Architecture Matrix
          </h2>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Full-stack programming languages, AI/ML deep learning frameworks, cloud infrastructure, and modern database architectures.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(skillCategories).map(([category, items]) => (
              <div
                key={category}
                className="rounded-3xl border border-white/[0.08] bg-[#0e0f16]/90 p-6 md:p-7 backdrop-blur-xl hover:border-white/[0.16] transition-all"
              >
                <h3 className="text-sm font-bold text-white border-b border-white/[0.06] pb-3 flex items-center justify-between">
                  <span>{category}</span>
                  <span className="text-[11px] font-mono text-zinc-500">{items.length} items</span>
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-200 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors"
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
      <section id="certifications" className="border-t border-white/[0.06] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            <Award className="h-4 w-4" />
            <span>Professional Credentials</span>
          </div>
          <h2 className="mt-2.5 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Certifications & Verified Honors
          </h2>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Industry credentials acquired across cloud architecture, data science, deep learning, and enterprise Java.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0e0f16]/90 p-5 md:p-6 backdrop-blur-xl hover:border-white/[0.16] transition-all"
              >
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                    {cert.provider}
                  </span>
                  <h3 className="mt-1.5 text-sm font-bold text-white leading-snug">
                    {cert.title}
                  </h3>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs text-zinc-500 font-mono">
                  <span>Issued: {cert.issue_date || '2025'}</span>
                  <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[10px] text-zinc-300 font-medium border border-white/[0.08]">Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guestbook & Connect Section */}
      <section id="connect" className="border-t border-white/[0.06] py-24 bg-[#0a0b10]/60 relative">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
              <MessageSquare className="h-4 w-4" />
              <span>Visitor Connect</span>
            </div>
            <h2 className="mt-2.5 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Leave a Message
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Have feedback, an opportunity, or a project in mind? Post a note stored live in Neon Postgres.
            </p>
          </div>

          <Guestbook />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#09090b] py-12 text-xs text-zinc-400">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">{profile.full_name}</span>
            <span>·</span>
            <span>{profile.title}</span>
            <span>·</span>
            <span className="text-emerald-400">{profile.college}</span>
          </div>

          <div className="flex items-center gap-4">
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
            <a href={`mailto:${profile.email}`} className="hover:text-white transition-colors">Email</a>
            <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Vercel</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
