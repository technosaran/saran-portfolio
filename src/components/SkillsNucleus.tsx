'use client';

import { useState, useMemo } from 'react';
import { 
  Search, 
  Layers, 
  Copy, 
  Check, 
  Code2, 
  Terminal, 
  Cpu, 
  Database, 
  Cloud, 
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';
import { Skill } from '@/lib/neon/db';
import { useToast } from './Toast';
import BrandLogo from './BrandLogo';

interface SkillsNucleusProps {
  skills?: Skill[];
}

interface SkillItem {
  id: number | string;
  name: string;
  category: 'languages' | 'frameworks' | 'aiml' | 'cloud' | 'database';
  categoryLabel: string;
  context: string;
  projects: string[];
}

const DEFAULT_SKILLS: SkillItem[] = [
  // Programming Languages
  { id: 'java', name: 'Java', category: 'languages', categoryLabel: 'Programming Languages', context: '90+ LeetCode DSA Problems, Enterprise Backend & OOP', projects: ['LeetCode 90+ Problems', 'Panimalar Coursework'] },
  { id: 'python', name: 'Python', category: 'languages', categoryLabel: 'Programming Languages', context: 'PyTorch Deep Learning, OpenCV Computer Vision, SpaCy NLP', projects: ['Real-Time Object Detection', 'NER NLP Pipeline', 'IBM SkillsBuild'] },
  { id: 'typescript', name: 'TypeScript', category: 'languages', categoryLabel: 'Programming Languages', context: 'Type-safe full-stack applications with Next.js 16 & React 19', projects: ['arthaX Wealth Terminal', 'Portfolio'] },
  { id: 'javascript', name: 'JavaScript', category: 'languages', categoryLabel: 'Programming Languages', context: 'Modern ESNext, asynchronous APIs, DOM manipulation', projects: ['arthaX', 'Web Applications'] },
  { id: 'sql', name: 'SQL', category: 'languages', categoryLabel: 'Programming Languages', context: 'Complex queries, schema design, indexes, and transactions', projects: ['arthaX PostgreSQL Schema', 'DBMS Coursework'] },

  // Frameworks & Web
  { id: 'nextjs', name: 'Next.js 16', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'App Router, Server Components, Server Actions & Turbopack', projects: ['arthaX Wealth Terminal', 'Developer Portfolio'] },
  { id: 'react', name: 'React.js', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'React 19, hooks, client state management, responsive UI', projects: ['arthaX', 'Developer Portfolio'] },
  { id: 'tailwindcss', name: 'Tailwind CSS', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'Tailwind CSS 4, modern utility design, dark mode & animations', projects: ['arthaX', 'Developer Portfolio'] },
  { id: 'nodejs', name: 'Node.js', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'Backend runtimes, RESTful endpoints & JSON APIs', projects: ['Full-Stack Applications'] },
  { id: 'express', name: 'Express.js', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'Lightweight REST APIs, routing & middleware architecture', projects: ['API Microservices'] },

  // AI & Machine Learning
  { id: 'pytorch', name: 'PyTorch', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'Neural network training, tensor math & computer vision models', projects: ['Real-Time Object Detection System'] },
  { id: 'opencv', name: 'OpenCV', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'Real-time video stream capture, frame manipulation & tracking', projects: ['Real-Time Object Detection System'] },
  { id: 'spacy', name: 'SpaCy', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'Tokenization, Part-of-Speech tagging & Named Entity Recognition', projects: ['NER System NLP Pipeline'] },
  { id: 'scikitlearn', name: 'Scikit-Learn', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'Supervised & unsupervised learning, regression, classification', projects: ['IBM SkillsBuild Capstone'] },
  { id: 'pandas', name: 'Pandas', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'DataFrame manipulation, exploratory data analysis & cleansing', projects: ['Financial Data Analysis', 'ML Pipelines'] },
  { id: 'numpy', name: 'NumPy', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'High-performance multi-dimensional array computing', projects: ['Deep Learning & Matrix Math'] },

  // Cloud & DevOps
  { id: 'aws', name: 'AWS Cloud', category: 'cloud', categoryLabel: 'Cloud & DevOps', context: 'EC2 instances, S3 storage, IAM security & cloud architecture', projects: ['CodTech Internship', 'Cloud Deployments'] },
  { id: 'docker', name: 'Docker', category: 'cloud', categoryLabel: 'Cloud & DevOps', context: 'Containerization, reproducible environments & deployments', projects: ['CodTech Internship', 'Microservices'] },
  { id: 'git', name: 'Git & GitHub', category: 'cloud', categoryLabel: 'Cloud & DevOps', context: 'Version control, branch workflows & open-source collaboration', projects: ['arthaX', 'All Repositories'] },

  // Databases & Storage
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', categoryLabel: 'Databases & Storage', context: 'Relational database schemas, ACID transactions & indexing', projects: ['arthaX Wealth Terminal', 'Neon Database'] },
  { id: 'supabase', name: 'Supabase', category: 'database', categoryLabel: 'Databases & Storage', context: 'Row-Level Security (RLS) policies, authentication & storage', projects: ['arthaX Wealth Terminal'] },
  { id: 'mongodb', name: 'MongoDB', category: 'database', categoryLabel: 'Databases & Storage', context: 'NoSQL document database, BSON schemas & query operators', projects: ['Full-Stack Data Storage'] },
];

export default function SkillsNucleus({ skills = [] }: SkillsNucleusProps) {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [copiedStack, setCopiedStack] = useState(false);

  // Mouse spotlight handler
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  // Combine DB skills if present, with fallback defaults
  const allSkillsList: SkillItem[] = useMemo(() => {
    if (!skills || skills.length === 0) return DEFAULT_SKILLS;

    return skills.map((s) => {
      const catLower = (s.category || '').toLowerCase();
      let category: SkillItem['category'] = 'frameworks';
      let categoryLabel = s.category || 'Frameworks';

      if (catLower.includes('language') || ['java', 'python', 'typescript', 'javascript', 'sql'].includes(s.name.toLowerCase())) {
        category = 'languages';
        categoryLabel = 'Programming Languages';
      } else if (catLower.includes('ai') || catLower.includes('machine') || ['pytorch', 'opencv', 'spacy', 'scikit-learn', 'pandas', 'numpy'].includes(s.name.toLowerCase())) {
        category = 'aiml';
        categoryLabel = 'AI & Machine Learning';
      } else if (catLower.includes('cloud') || catLower.includes('devops') || ['aws', 'docker', 'git'].includes(s.name.toLowerCase())) {
        category = 'cloud';
        categoryLabel = 'Cloud & DevOps';
      } else if (catLower.includes('database') || ['postgresql', 'supabase', 'mongodb', 'mysql'].includes(s.name.toLowerCase())) {
        category = 'database';
        categoryLabel = 'Databases & Storage';
      }

      // Check if we have specific context from defaults
      const existing = DEFAULT_SKILLS.find(d => d.name.toLowerCase() === s.name.toLowerCase());

      return {
        id: s.id,
        name: s.name,
        category,
        categoryLabel,
        context: existing?.context || s.level || 'Applied in production software',
        projects: existing?.projects || ['Production Systems']
      };
    });
  }, [skills]);

  // Categories list
  const categories = [
    { key: 'all', label: 'All Technologies', icon: Layers, count: allSkillsList.length },
    { key: 'languages', label: 'Languages', icon: Terminal, count: allSkillsList.filter(s => s.category === 'languages').length },
    { key: 'frameworks', label: 'Frameworks & Web', icon: Code2, count: allSkillsList.filter(s => s.category === 'frameworks').length },
    { key: 'aiml', label: 'AI & Machine Learning', icon: Cpu, count: allSkillsList.filter(s => s.category === 'aiml').length },
    { key: 'cloud', label: 'Cloud & DevOps', icon: Cloud, count: allSkillsList.filter(s => s.category === 'cloud').length },
    { key: 'database', label: 'Databases', icon: Database, count: allSkillsList.filter(s => s.category === 'database').length },
  ];

  // Filter skills
  const filteredSkills = useMemo(() => {
    return allSkillsList.filter((s) => {
      const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        s.name.toLowerCase().includes(q) || 
        s.context.toLowerCase().includes(q) ||
        s.categoryLabel.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [allSkillsList, activeCategory, searchQuery]);

  const copyStackJson = () => {
    const listToCopy = allSkillsList.map(s => ({
      name: s.name,
      category: s.categoryLabel,
      context: s.context
    }));
    try {
      navigator.clipboard.writeText(JSON.stringify(listToCopy, null, 2));
      setCopiedStack(true);
      toast('Technical skills copied as JSON!', 'success');
      setTimeout(() => setCopiedStack(false), 2000);
    } catch {
      toast('Failed to copy skills', 'error');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Category Pills & Search Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-zinc-950 font-bold shadow-md shadow-white/10'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{cat.label} ({cat.count})</span>
              </button>
            );
          })}
        </div>

        {/* Right Tools: Search & Copy Stack */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skill or tool..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 font-mono"
            />
          </div>

          <button
            type="button"
            onClick={copyStackJson}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-xs font-mono text-zinc-400 hover:text-white transition-all cursor-pointer shrink-0"
            title="Copy technical stack as JSON"
          >
            {copiedStack ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Stack</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Grid of Skill Cards */}
      {filteredSkills.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d15]/60 p-12 text-center backdrop-blur-xl">
          <p className="text-zinc-400 font-mono text-sm">No skills found matching &quot;{searchQuery}&quot;.</p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-mono bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 transition-all cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => {
            return (
              <div
                key={skill.id}
                onMouseMove={handleCardMouseMove}
                onClick={() => setSelectedSkill(skill)}
                className="group relative rounded-2xl border border-white/[0.08] bg-[#0c0d15]/85 p-4 sm:p-5 backdrop-blur-xl hover:border-blue-500/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-950/20 cursor-pointer card-shine card-spotlight flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <BrandLogo
                        name={skill.name}
                        size={38}
                        badgeVariant="glass"
                        showGlow
                        className="group-hover:scale-105 transition-transform shrink-0"
                      />
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors tracking-tight">
                          {skill.name}
                        </h3>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {skill.categoryLabel}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-blue-400/80 bg-blue-500/10 border border-blue-500/20 rounded-md px-2 py-0.5 shrink-0">
                      Active
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-zinc-400 leading-relaxed font-sans line-clamp-2">
                    {skill.context}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span className="truncate max-w-[190px]">
                    {skill.projects[0]}
                  </span>
                  <span className="text-blue-400 group-hover:underline text-[10px]">
                    Details &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Skill Detail Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-white/[0.12] bg-[#0c0d16] p-6 sm:p-7 shadow-2xl card-shine">
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <BrandLogo
                  name={selectedSkill.name}
                  size={42}
                  badgeVariant="glass"
                  showGlow
                  className="shrink-0"
                />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-semibold block">
                    {selectedSkill.categoryLabel}
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                    {selectedSkill.name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSkill(null)}
                className="p-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs font-sans text-zinc-300">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                  Practical Application
                </span>
                <p className="text-zinc-200 leading-relaxed bg-white/[0.02] border border-white/[0.06] rounded-xl p-3">
                  {selectedSkill.context}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                  Related Projects &amp; Work
                </span>
                <div className="space-y-1.5">
                  {selectedSkill.projects.map((proj, i) => (
                    <div key={i} className="flex items-center gap-2 text-zinc-200 bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                      <span>{proj}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedSkill(null)}
                  className="px-4 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
