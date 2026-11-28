'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Cpu, Orbit, LayoutGrid, Search, ArrowUpRight } from 'lucide-react';
import { Skill } from '@/lib/neon/db';
import BrandLogo from './BrandLogo';

export interface SkillItem {
  id: number | string;
  name: string;
  category: 'languages' | 'frameworks' | 'aiml' | 'cloud' | 'database' | 'fundamentals';
  categoryLabel: string;
  context: string;
  projects: string[];
  orbit: number; // 0: Matrix-only CS fundamentals, 1: Languages, 2: Frameworks, 3: AI/ML, 4: Cloud & Databases
  proficiency?: string;
  initialAngle: number;
}

export function groupSkillsByCategory(skills: SkillItem[]): Record<string, SkillItem[]> {
  const groups: Record<string, SkillItem[]> = {
    languages: [],
    frameworks: [],
    aiml: [],
    cloud: [],
    database: [],
    fundamentals: [],
  };

  skills.forEach((skill) => {
    const cat = skill.category || 'languages';
    if (!groups[cat]) {
      groups[cat] = [];
    }
    groups[cat].push(skill);
  });

  return groups;
}

// Balanced Celestial Orbital Mechanics (880x880 stage, synchronized phase-locked orbits for zero pill overlap)
const ORBIT_STAGE_SIZE = 880;
const ORBIT_CENTER = ORBIT_STAGE_SIZE / 2;

const CELESTIAL_ORBITS = {
  orbit1: { radius: 120, duration: 72, offset: 12, label: 'Languages', dotClass: 'bg-cyan-400' },
  orbit2: { radius: 208, duration: 72, offset: 12, label: 'Frameworks & Web', dotClass: 'bg-blue-400' },
  orbit3: { radius: 296, duration: 72, offset: 10, label: 'AI & Machine Learning', dotClass: 'bg-purple-400' },
  orbit4: { radius: 384, duration: 72, offset: 27, label: 'Cloud & Databases', dotClass: 'bg-emerald-400' },
} as const;

// Curated technical knowledge catalog with rich production contexts
const DEFAULT_SKILLS_CATALOG: Omit<SkillItem, 'initialAngle'>[] = [
  // Orbit 1: Core Languages
  { id: 'python', name: 'Python', category: 'languages', categoryLabel: 'Programming Languages', context: 'PyTorch Deep Learning, OpenCV Computer Vision, SpaCy NLP pipelines', projects: ['Real-Time Object Detection', 'NER NLP Pipeline', 'IBM SkillsBuild'], orbit: 1, proficiency: 'Expert' },
  { id: 'java', name: 'Java', category: 'languages', categoryLabel: 'Programming Languages', context: 'Algorithmic problem solving, Object-Oriented Architecture & Enterprise Runtimes', projects: ['LeetCode 90+ Problems', 'Infosys Java Certification'], orbit: 1, proficiency: 'Expert' },
  { id: 'typescript', name: 'TypeScript', category: 'languages', categoryLabel: 'Programming Languages', context: 'Type-safe full-stack engineering with Next.js 16, React 19 & Drizzle ORM', projects: ['arthaX Wealth Terminal', 'Portfolio Core'], orbit: 1, proficiency: 'Advanced' },
  { id: 'javascript', name: 'JavaScript', category: 'languages', categoryLabel: 'Programming Languages', context: 'Modern ESNext, asynchronous APIs, event loops & client DOM hydration', projects: ['arthaX Terminal', 'Web Microservices'], orbit: 1, proficiency: 'Advanced' },
  { id: 'sql', name: 'SQL', category: 'languages', categoryLabel: 'Programming Languages', context: 'Complex analytic queries, indexes, ACID transactions & schema normalization', projects: ['arthaX PostgreSQL Schema', 'LeetCode 43+ SQL Solved'], orbit: 1, proficiency: 'Advanced' },

  // Orbit 2: Frameworks & Web
  { id: 'react', name: 'React', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'React 19 Server Components, custom hooks, concurrent rendering & state management', projects: ['arthaX Terminal', 'Developer Portfolio'], orbit: 2, proficiency: 'Expert' },
  { id: 'nextjs', name: 'Next.js', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'Turbopack, Server Components, Server Actions & App Router architecture', projects: ['arthaX Wealth Terminal', 'Developer Portfolio'], orbit: 2, proficiency: 'Expert' },
  { id: 'nodejs', name: 'Node.js', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'Asynchronous event runtimes, high-throughput microservices & streaming APIs', projects: ['Full-Stack Microservices'], orbit: 2, proficiency: 'Advanced' },
  { id: 'express', name: 'Express.js', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'RESTful API endpoints, secure middleware chains & routing architecture', projects: ['Backend Microservices'], orbit: 2, proficiency: 'Advanced' },
  { id: 'tailwindcss', name: 'Tailwind CSS', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'Tailwind CSS 4, modern utility design, responsive grids & tokens', projects: ['arthaX Terminal', 'Developer Portfolio'], orbit: 2, proficiency: 'Expert' },
  { id: 'restapis', name: 'RESTful APIs', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'Stateless resource modeling, Zod validation, rate limiting & HTTP caching', projects: ['Portfolio API Layer', 'arthaX'], orbit: 2, proficiency: 'Advanced' },
  { id: 'microservices', name: 'Microservices', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'Decoupled service boundaries, containerized workers & resilient IPC', projects: ['Cloud Deployment Pipelines'], orbit: 2, proficiency: 'Proficient' },

  // Orbit 3: AI & Machine Learning
  { id: 'pytorch', name: 'PyTorch', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'Deep neural network training, tensor math, autograd & computer vision architectures', projects: ['Real-Time Object Detection System'], orbit: 3, proficiency: 'Advanced' },
  { id: 'opencv', name: 'OpenCV', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'Real-time video stream processing, edge detection & visual bounding boxes', projects: ['Real-Time Object Detection System'], orbit: 3, proficiency: 'Advanced' },
  { id: 'scikitlearn', name: 'Scikit-Learn', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'Supervised classifiers, regression algorithms, hyperparameter tuning & evaluation', projects: ['IBM SkillsBuild Capstone', 'NER NLP Pipeline'], orbit: 3, proficiency: 'Advanced' },
  { id: 'spacy', name: 'SpaCy', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'Named entity recognition, tokenization, sequence tagging & NLP pipeline parsing', projects: ['Named Entity Recognition System'], orbit: 3, proficiency: 'Advanced' },
  { id: 'pandas', name: 'Pandas', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'Data cleaning, tabular transformations, dataframe analysis & feature engineering', projects: ['LeetCode 49+ Pandas Solved', 'ML Analytics'], orbit: 3, proficiency: 'Expert' },
  { id: 'numpy', name: 'NumPy', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'High-performance n-dimensional arrays, vector math, linear algebra & matrix operations', projects: ['Scientific Computing & PyTorch'], orbit: 3, proficiency: 'Advanced' },

  // Orbit 4: Cloud, DevOps & Databases
  { id: 'vercel', name: 'Vercel', category: 'cloud', categoryLabel: 'Cloud & DevOps', context: 'Zero-config edge deployment, serverless functions, fluid compute & CI/CD', projects: ['Portfolio Live Deployment', 'arthaX Production'], orbit: 4, proficiency: 'Expert' },
  { id: 'render', name: 'Render', category: 'cloud', categoryLabel: 'Cloud & DevOps', context: 'Full-stack cloud hosting, background workers, automated git deployments & managed DBs', projects: ['Microservices Hosting', 'Backend Services'], orbit: 4, proficiency: 'Advanced' },
  { id: 'aws', name: 'AWS', category: 'cloud', categoryLabel: 'Cloud & DevOps', context: 'EC2 compute, S3 object storage, IAM role policies & secure cloud architecture', projects: ['CodTech Internship', 'Cloud Architecture'], orbit: 4, proficiency: 'Advanced' },
  { id: 'docker', name: 'Docker', category: 'cloud', categoryLabel: 'Cloud & DevOps', context: 'Containerized application packaging, multi-stage Dockerfiles & local dev orchestration', projects: ['CodTech Cloud Internship'], orbit: 4, proficiency: 'Advanced' },
  { id: 'devops', name: 'DevOps & CI/CD', category: 'cloud', categoryLabel: 'Cloud & DevOps', context: 'Automated testing workflows, GitHub Actions CI & repeatable cloud deployments', projects: ['Portfolio CI Pipeline', 'CodTech Internship'], orbit: 4, proficiency: 'Proficient' },
  { id: 'git', name: 'Git & GitHub', category: 'cloud', categoryLabel: 'Cloud & DevOps', context: 'Distributed version control, branch protection, CI/CD actions & team PR reviews', projects: ['GitHub @technosaran', 'arthaX'], orbit: 4, proficiency: 'Expert' },
  { id: 'supabase', name: 'Supabase', category: 'database', categoryLabel: 'Databases & Storage', context: 'Row-Level Security (RLS) policies, PostgreSQL realtime & user authentication', projects: ['arthaX Wealth Terminal'], orbit: 4, proficiency: 'Advanced' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', categoryLabel: 'Databases & Storage', context: 'Relational database schemas, B-tree indexes, transactions & ACID compliance', projects: ['arthaX Wealth Terminal', 'Neon Database'], orbit: 4, proficiency: 'Advanced' },
  { id: 'mongodb', name: 'MongoDB', category: 'database', categoryLabel: 'Databases & Storage', context: 'NoSQL document storage, flexible BSON schemas & aggregation pipelines', projects: ['Full-Stack Data Storage'], orbit: 4, proficiency: 'Proficient' },
  { id: 'neon', name: 'Neon', category: 'database', categoryLabel: 'Databases & Storage', context: 'Serverless Postgres with autoscaling, database branching & instant point-in-time restore', projects: ['Portfolio Live Database', 'arthaX Backend'], orbit: 4, proficiency: 'Advanced' },

  // Matrix-dedicated Core CS Fundamentals (keeps Orbital uncluttered)
  { id: 'dsa', name: 'Data Structures & Algorithms', category: 'fundamentals', categoryLabel: 'Core CS Fundamentals', context: 'Arrays, hash tables, two pointers, trees, graphs & complexity analysis', projects: ['LeetCode 90+ Solved', 'orion-algo'], orbit: 0, proficiency: 'Advanced' },
  { id: 'oop', name: 'OOP', category: 'fundamentals', categoryLabel: 'Core CS Fundamentals', context: 'Object-oriented modeling, SOLID design patterns, encapsulation & polymorphism in Java', projects: ['Enterprise Java Systems'], orbit: 0, proficiency: 'Expert' },
  { id: 'dbms', name: 'DBMS', category: 'fundamentals', categoryLabel: 'Core CS Fundamentals', context: 'Relational algebra, normalization (1NF–BCNF), indexing & ACID concurrency control', projects: ['arthaX Schema Design'], orbit: 0, proficiency: 'Advanced' },
  { id: 'os', name: 'Operating Systems', category: 'fundamentals', categoryLabel: 'Core CS Fundamentals', context: 'Process scheduling, memory management, deadlocks, threads & Linux environments', projects: ['Panimalar Engineering Core'], orbit: 0, proficiency: 'Proficient' },
  { id: 'networks', name: 'Computer Networks', category: 'fundamentals', categoryLabel: 'Core CS Fundamentals', context: 'TCP/IP, HTTP/HTTPS, DNS, TLS security & REST network architecture', projects: ['Full-Stack Production Networking'], orbit: 0, proficiency: 'Proficient' },
  { id: 'sdlc', name: 'Software Engineering (SDLC/Agile)', category: 'fundamentals', categoryLabel: 'Core CS Fundamentals', context: 'Iterative planning, automated testing with Vitest, code review & CI/CD', projects: ['arthaX', 'Portfolio Core'], orbit: 0, proficiency: 'Advanced' },
];

interface SkillsNucleusProps {
  skills?: Skill[];
}

export default function SkillsNucleus({ skills = [] }: SkillsNucleusProps) {
  const [viewMode, setViewMode] = useState<'orbital' | 'matrix'>('orbital');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const userToggledModeRef = useRef(false);
  const arenaRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef<boolean>(false);
  const badgeRefs = useRef<Map<string | number, HTMLDivElement>>(new Map());
  const anglesRef = useRef<{ [key: string]: number }>({});
  const lastTimeRef = useRef<number | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Sync pause state with hover and modal open
  useEffect(() => {
    isPausedRef.current = selectedSkill !== null || hoveredSkill !== null;
  }, [selectedSkill, hoveredSkill]);

  // Close detail modal on Escape
  useEffect(() => {
    if (!selectedSkill) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedSkill(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSkill]);

  // Auto-select readable Matrix view on narrow mobile screens on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640 && !userToggledModeRef.current) {
      setViewMode('matrix');
    }
  }, []);

  // Dynamic responsive fluid scale for orbit stage across all device widths
  useEffect(() => {
    const handleResize = () => {
      const arenaWidth = arenaRef.current ? arenaRef.current.clientWidth : window.innerWidth;
      const targetScale = Math.min(0.88, Math.max(0.38, (arenaWidth - 24) / ORBIT_STAGE_SIZE));
      setZoomScale(targetScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  // Map database skills into celestial orbital bodies with intelligent categorizations
  const allSkillsList: SkillItem[] = useMemo(() => {
    if (!skills || skills.length === 0) return [];

    const norm = (s: string) => s.toLowerCase().replace(/[\s.\-_]/g, '');

    const mapped = skills.map((dbSkill) => {
      const dbNorm = norm(dbSkill.name);
      const catalogMatch = DEFAULT_SKILLS_CATALOG.find(
        (cat) =>
          norm(cat.name) === dbNorm ||
          (dbNorm === 'reactjs' && cat.id === 'react') ||
          (dbNorm === 'awscloud' && cat.id === 'aws')
      );

      if (catalogMatch) {
        return {
          ...catalogMatch,
          id: dbSkill.id,
          name: dbSkill.name,
          proficiency: dbSkill.level || catalogMatch.proficiency,
          initialAngle: 0,
        };
      }

      const nameLower = dbSkill.name.toLowerCase();
      const catLower = (dbSkill.category || '').toLowerCase();

      let orbit = 1;
      let category: SkillItem['category'] = 'languages';

      if (catLower.includes('fundamental')) {
        orbit = 0;
        category = 'fundamentals';
      } else if (
        nameLower.includes('python') ||
        nameLower.includes('java') ||
        nameLower.includes('type') ||
        nameLower.includes('script') ||
        nameLower.includes('sql') ||
        nameLower.includes('c++') ||
        nameLower.includes('rust') ||
        nameLower.includes('golang') ||
        catLower.includes('lang')
      ) {
        orbit = 1;
        category = 'languages';
      } else if (
        nameLower.includes('react') ||
        nameLower.includes('next') ||
        nameLower.includes('vue') ||
        nameLower.includes('angular') ||
        nameLower.includes('express') ||
        nameLower.includes('node') ||
        nameLower.includes('tailwind') ||
        nameLower.includes('api') ||
        nameLower.includes('microservice') ||
        catLower.includes('web') ||
        catLower.includes('framework')
      ) {
        orbit = 2;
        category = 'frameworks';
      } else if (
        nameLower.includes('torch') ||
        nameLower.includes('tensor') ||
        nameLower.includes('opencv') ||
        nameLower.includes('learn') ||
        nameLower.includes('spacy') ||
        nameLower.includes('pandas') ||
        nameLower.includes('numpy') ||
        catLower.includes('ai') ||
        catLower.includes('machine')
      ) {
        orbit = 3;
        category = 'aiml';
      } else if (
        nameLower.includes('dbms') ||
        nameLower.includes('database') ||
        nameLower.includes('postgre') ||
        nameLower.includes('mongo') ||
        nameLower.includes('neon') ||
        nameLower.includes('supabase') ||
        nameLower.includes('redis') ||
        catLower.includes('database') ||
        catLower.includes('storage')
      ) {
        orbit = 4;
        category = 'database';
      } else {
        orbit = 4;
        category = 'cloud';
      }

      return {
        id: dbSkill.id,
        name: dbSkill.name,
        category,
        categoryLabel: dbSkill.category || 'Technical Skill',
        context: `${dbSkill.name} in modern full-stack production architecture (${dbSkill.level || 'Proficient'}).`,
        projects: ['Portfolio & Production Applications'],
        orbit,
        proficiency: dbSkill.level || 'Proficient',
        initialAngle: 0,
      };
    });

    const counts: { [orbit: number]: number } = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
    mapped.forEach((s) => {
      counts[s.orbit] = (counts[s.orbit] || 0) + 1;
    });

    const orbitCurrentIndex: { [orbit: number]: number } = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
    return mapped.map((skill) => {
      if (skill.orbit === 0) {
        return { ...skill, initialAngle: 0 };
      }

      const totalInOrbit = counts[skill.orbit] || 1;
      const idxInOrbit = orbitCurrentIndex[skill.orbit] || 0;
      orbitCurrentIndex[skill.orbit] = idxInOrbit + 1;

      const orbitKey = `orbit${skill.orbit}` as keyof typeof CELESTIAL_ORBITS;
      const orbitConfig = CELESTIAL_ORBITS[orbitKey] || CELESTIAL_ORBITS.orbit1;
      const angle = (360 / totalInOrbit) * idxInOrbit + orbitConfig.offset;

      return {
        ...skill,
        initialAngle: angle,
      };
    });
  }, [skills]);

  const orbitalSkills = useMemo(() => allSkillsList.filter((s) => s.orbit >= 1 && s.orbit <= 4), [allSkillsList]);

  // Grouped skills for the matrix view
  const groupedSkills = useMemo(() => {
    return groupSkillsByCategory(allSkillsList);
  }, [allSkillsList]);

  // Filtered skills for matrix search and category pills
  const filteredMatrix = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const filtered: Record<string, SkillItem[]> = {};

    Object.entries(groupedSkills).forEach(([cat, list]) => {
      if (activeCategory !== 'all' && cat !== activeCategory) return;
      if (list.length === 0) return;

      const matched = !q
        ? list
        : list.filter(
            (s) =>
              s.name.toLowerCase().includes(q) ||
              s.categoryLabel.toLowerCase().includes(q) ||
              s.context.toLowerCase().includes(q)
          );
      if (matched.length > 0) {
        filtered[cat] = matched;
      }
    });

    return filtered;
  }, [groupedSkills, searchQuery, activeCategory]);

  // Initialize angles for each skill
  useEffect(() => {
    orbitalSkills.forEach((skill) => {
      if (anglesRef.current[skill.id] === undefined) {
        anglesRef.current[skill.id] = skill.initialAngle;
      }
    });
  }, [orbitalSkills]);

  // High-performance direct RAF animation loop
  useEffect(() => {
    if (orbitalSkills.length === 0 || viewMode !== 'orbital') return;

    const prefersReduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const animate = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      if (!isPausedRef.current && delta < 0.2) {
        orbitalSkills.forEach((skill) => {
          const orbitKey = `orbit${skill.orbit}` as keyof typeof CELESTIAL_ORBITS;
          const config = CELESTIAL_ORBITS[orbitKey] || CELESTIAL_ORBITS.orbit1;
          const speed = 360 / config.duration;

          let currentAngle = (anglesRef.current[skill.id] ?? skill.initialAngle) - speed * delta;
          if (currentAngle < 0) currentAngle += 360;
          anglesRef.current[skill.id] = currentAngle;

          const el = badgeRefs.current.get(skill.id);
          if (el) {
            const rad = (currentAngle * Math.PI) / 180;
            const x = Math.round(config.radius * Math.cos(rad) * 10) / 10;
            const y = Math.round(config.radius * Math.sin(rad) * 10) / 10;
            el.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0)`;
          }
        });
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      lastTimeRef.current = null;
    };
  }, [orbitalSkills, viewMode]);

  if (!skills || skills.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#262b3a] bg-[#0c0e14]/50 p-8 sm:p-12 text-center space-y-3">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-[#2b3142] bg-[#141722] text-zinc-400">
          <Cpu className="h-5 w-5 text-emerald-400" />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-zinc-200">No skills published yet</h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Technical stack items added in the admin portal will appear here automatically.
        </p>
      </div>
    );
  }

  const activeInspected = hoveredSkill || selectedSkill;

  const getBadgeColors = (orbit: number, isCurrent: boolean) => {
    switch (orbit) {
      case 1:
        return {
          badge: isCurrent
            ? 'bg-cyan-950/90 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.65)] scale-105 z-30'
            : 'bg-[#081226]/90 hover:bg-[#101c38] border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_16px_rgba(56,189,248,0.45)] z-10',
          dot: 'bg-cyan-400 shadow-[0_0_8px_#38bdf8]',
          text: 'group-hover:text-cyan-300',
        };
      case 2:
        return {
          badge: isCurrent
            ? 'bg-blue-950/90 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.65)] scale-105 z-30'
            : 'bg-[#0a122e]/90 hover:bg-[#121c46] border-blue-500/40 hover:border-blue-400 hover:shadow-[0_0_16px_rgba(59,130,246,0.45)] z-10',
          dot: 'bg-blue-400 shadow-[0_0_8px_#60a5fa]',
          text: 'group-hover:text-blue-300',
        };
      case 3:
        return {
          badge: isCurrent
            ? 'bg-purple-950/90 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.65)] scale-105 z-30'
            : 'bg-[#140e2b]/90 hover:bg-[#1e153f] border-purple-500/40 hover:border-purple-400 hover:shadow-[0_0_16px_rgba(168,85,247,0.45)] z-10',
          dot: 'bg-purple-400 shadow-[0_0_8px_#c084fc]',
          text: 'group-hover:text-purple-300',
        };
      case 4:
      default:
        return {
          badge: isCurrent
            ? 'bg-emerald-950/90 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.65)] scale-105 z-30'
            : 'bg-[#081a16]/90 hover:bg-[#0f2e27] border-emerald-500/40 hover:border-emerald-400 hover:shadow-[0_0_16px_rgba(16,185,129,0.45)] z-10',
          dot: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
          text: 'group-hover:text-emerald-300',
        };
    }
  };

  const categoryHeadings: Record<string, { title: string; shortLabel: string; color: string }> = {
    languages: { title: 'Programming Languages', shortLabel: 'Languages', color: 'text-cyan-400' },
    frameworks: { title: 'Frameworks & Web Runtimes', shortLabel: 'Web & Frameworks', color: 'text-blue-400' },
    aiml: { title: 'AI & Machine Learning', shortLabel: 'AI & ML', color: 'text-purple-400' },
    cloud: { title: 'Cloud Infrastructure & DevOps', shortLabel: 'Cloud & DevOps', color: 'text-sky-400' },
    database: { title: 'Databases & Storage', shortLabel: 'Databases', color: 'text-emerald-400' },
    fundamentals: { title: 'Core CS Fundamentals', shortLabel: 'CS Fundamentals', color: 'text-amber-400' },
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center select-none py-2 space-y-5">
      {/* Top View Switcher Controls */}
      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl border border-[#1f2432] bg-[#0c0e14] w-full sm:w-fit">
          <button
            type="button"
            onClick={() => {
              userToggledModeRef.current = true;
              setViewMode('orbital');
            }}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              viewMode === 'orbital'
                ? 'bg-zinc-800 text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Orbit className="h-3.5 w-3.5 text-cyan-400" />
            <span>Orbital Simulation</span>
          </button>
          <button
            type="button"
            onClick={() => {
              userToggledModeRef.current = true;
              setViewMode('matrix');
            }}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              viewMode === 'matrix'
                ? 'bg-zinc-800 text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5 text-emerald-400" />
            <span>Skills Matrix View</span>
          </button>
        </div>

        {viewMode === 'matrix' && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools & frameworks..."
              aria-label="Search skills and frameworks"
              className="w-full pl-9 pr-8 py-1.5 rounded-lg border border-[#202534] bg-[#0f1118] text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear skill search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* MODE 1: CELESTIAL ORBITAL VIEW */}
      {viewMode === 'orbital' && (
        <div className="w-full space-y-4">
          <div
            ref={arenaRef}
            className="relative w-full flex items-center justify-center overflow-hidden rounded-2xl border border-[#1a1f2d] bg-[#0b0d14]/60 py-3"
            style={{
              height: `${Math.round(ORBIT_STAGE_SIZE * zoomScale + 24)}px`,
              minHeight: '340px',
            }}
          >
            {/* Ambient Radial Glowing Nebulae */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full bg-cyan-500/15 blur-[70px] pointer-events-none" />

            {/* Scaled Orbit System */}
            <div
              className="relative shrink-0 flex items-center justify-center origin-center transition-transform duration-200"
              style={{
                width: `${ORBIT_STAGE_SIZE}px`,
                height: `${ORBIT_STAGE_SIZE}px`,
                transform: `scale(${zoomScale})`,
              }}
            >
              {/* SVG Concentric Orbit Track Paths */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none select-none"
                viewBox={`0 0 ${ORBIT_STAGE_SIZE} ${ORBIT_STAGE_SIZE}`}
              >
                <line
                  x1={ORBIT_CENTER}
                  y1="30"
                  x2={ORBIT_CENTER}
                  y2={ORBIT_STAGE_SIZE - 30}
                  stroke="rgba(255,255,255,0.03)"
                  strokeDasharray="4 8"
                />
                <line
                  x1="30"
                  y1={ORBIT_CENTER}
                  x2={ORBIT_STAGE_SIZE - 30}
                  y2={ORBIT_CENTER}
                  stroke="rgba(255,255,255,0.03)"
                  strokeDasharray="4 8"
                />

                <circle cx={ORBIT_CENTER} cy={ORBIT_CENTER} r={CELESTIAL_ORBITS.orbit1.radius} fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" strokeDasharray="4 6" />
                <circle cx={ORBIT_CENTER} cy={ORBIT_CENTER} r={CELESTIAL_ORBITS.orbit2.radius} fill="none" stroke="rgba(59, 130, 246, 0.25)" strokeWidth="1.5" strokeDasharray="5 7" />
                <circle cx={ORBIT_CENTER} cy={ORBIT_CENTER} r={CELESTIAL_ORBITS.orbit3.radius} fill="none" stroke="rgba(168, 85, 247, 0.25)" strokeWidth="1.5" strokeDasharray="6 8" />
                <circle cx={ORBIT_CENTER} cy={ORBIT_CENTER} r={CELESTIAL_ORBITS.orbit4.radius} fill="none" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="1.5" strokeDasharray="6 10" />
              </svg>

              {/* Tech Nucleus */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 select-none pointer-events-none">
                <div className="absolute inset-0 rounded-full border border-cyan-400/25 animate-spacetime-ripple pointer-events-none" />
                <div className="absolute -inset-3 rounded-full border border-dashed border-cyan-400/35 animate-event-horizon pointer-events-none" />

                <div className="relative w-26 h-26 rounded-full flex flex-col items-center justify-center p-2 text-center border-2 border-cyan-400/60 bg-gradient-to-b from-[#0b162c] via-[#091024] to-[#04060c] shadow-[0_0_30px_rgba(56,189,248,0.45),0_0_60px_rgba(99,102,241,0.28),inset_0_0_16px_rgba(56,189,248,0.35)] transition-all duration-300 animate-nucleus-pulse">
                  {activeInspected ? (
                    <>
                      <div className="text-xs font-bold text-white tracking-tight line-clamp-1 px-1">
                        {activeInspected.name}
                      </div>
                      <div className="text-[8px] font-mono text-cyan-300 uppercase tracking-wider mt-0.5 line-clamp-1 px-1">
                        {activeInspected.categoryLabel}
                      </div>
                      <div className="mt-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[7px] font-mono text-cyan-300">
                        {activeInspected.proficiency || 'Active'}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-mono font-black text-base tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-blue-300 whitespace-nowrap">
                        Tech Stack
                      </div>
                      <div className="text-[9px] font-mono font-bold tracking-widest text-cyan-300 uppercase mt-0.5 leading-tight">
                        Orbits
                      </div>
                      <div className="text-[7.5px] font-mono text-zinc-400 mt-0.5">Click for details</div>
                    </>
                  )}
                </div>
              </div>

              {/* Orbiting Badges */}
              {orbitalSkills.map((skill) => {
                const isCurrent = activeInspected?.name === skill.name;
                const colors = getBadgeColors(skill.orbit, isCurrent);

                const orbitKey = `orbit${skill.orbit}` as keyof typeof CELESTIAL_ORBITS;
                const config = CELESTIAL_ORBITS[orbitKey] || CELESTIAL_ORBITS.orbit1;
                const initialRad = (skill.initialAngle * Math.PI) / 180;
                const initialX = Math.round(config.radius * Math.cos(initialRad) * 10) / 10;
                const initialY = Math.round(config.radius * Math.sin(initialRad) * 10) / 10;

                return (
                  <div
                    key={skill.id}
                    ref={(el) => {
                      if (el) badgeRefs.current.set(skill.id, el);
                      else badgeRefs.current.delete(skill.id);
                    }}
                    className="absolute left-1/2 top-1/2 pointer-events-auto will-change-transform"
                    style={{
                      transform: `translate3d(calc(-50% + ${initialX}px), calc(-50% + ${initialY}px), 0)`,
                    }}
                  >
                    <button
                      type="button"
                      onMouseEnter={() => {
                        setHoveredSkill(skill);
                        isPausedRef.current = true;
                      }}
                      onMouseLeave={() => {
                        setHoveredSkill(null);
                        isPausedRef.current = selectedSkill !== null;
                      }}
                      onClick={() => setSelectedSkill(skill)}
                      className="group relative flex flex-col items-center gap-1 cursor-pointer focus:outline-none"
                    >
                      <span
                        className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 shadow-lg group-hover:scale-110 group-active:scale-95 ${colors.badge} backdrop-blur-xl`}
                      >
                        <BrandLogo name={skill.name} size={22} badgeVariant="none" showGlow={isCurrent} />
                        <span
                          className={`absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full border border-[#090a0f] ${colors.dot}`}
                        />
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded-md border border-[#1d2230] bg-[#0c0e15]/95 text-[10px] font-semibold font-mono leading-none tracking-tight text-zinc-200 whitespace-nowrap shadow-sm transition-colors ${colors.text}`}
                      >
                        {skill.name}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Orbit Ring Legend + Matrix Link for Fundamentals */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-[11px] font-mono text-zinc-400">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              {Object.values(CELESTIAL_ORBITS).map((orb, idx) => (
                <span key={orb.label} className="inline-flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${orb.dotClass}`} />
                  <span>
                    Ring {idx + 1}: {orb.label}
                  </span>
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                userToggledModeRef.current = true;
                setViewMode('matrix');
              }}
              className="text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
            >
              Switch to full Matrix ({allSkillsList.length} skills) →
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: RECRUITER SKILLS MATRIX VIEW */}
      {viewMode === 'matrix' && (
        <div className="w-full space-y-6 pt-1">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-zinc-100 text-zinc-950 font-semibold'
                  : 'border border-[#1b1f2b] bg-[#0f1118] text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All ({allSkillsList.length})
            </button>
            {Object.entries(groupedSkills).map(([catKey, list]) => {
              if (list.length === 0) return null;
              const info = categoryHeadings[catKey] || { shortLabel: catKey };
              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setActiveCategory(catKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    activeCategory === catKey
                      ? 'bg-zinc-100 text-zinc-950 font-semibold'
                      : 'border border-[#1b1f2b] bg-[#0f1118] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {info.shortLabel} ({list.length})
                </button>
              );
            })}
          </div>

          {Object.keys(filteredMatrix).length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#262b3a] bg-[#0c0e14]/50 p-10 text-center space-y-3">
              <p className="text-xs font-mono text-zinc-400">
                No skills matched &quot;{searchQuery}&quot;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#262b3a] bg-[#12151e] hover:bg-[#181c28] px-3 py-1.5 text-xs font-mono text-zinc-200 cursor-pointer transition-colors"
              >
                Reset filters
              </button>
            </div>
          ) : (
            Object.entries(filteredMatrix).map(([catKey, catSkills]) => {
              const heading = categoryHeadings[catKey] || { title: catKey, color: 'text-zinc-200' };
              return (
                <div key={catKey} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-semibold uppercase tracking-wider ${heading.color}`}>
                      {heading.title}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">({catSkills.length})</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {catSkills.map((skill) => (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => setSelectedSkill(skill)}
                        className="group text-left flex flex-col justify-between rounded-xl border border-[#1f2432] bg-[#0f1118] card-bevel p-4 hover:border-[#2e364d] hover:bg-[#131620] transition-all cursor-pointer shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3 w-full">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <BrandLogo name={skill.name} size={24} badgeVariant="glass" />
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors truncate">
                                {skill.name}
                              </h4>
                              <span className="text-[10px] font-mono text-zinc-500 block">
                                {skill.proficiency || 'Advanced'}
                              </span>
                            </div>
                          </div>

                          <ArrowUpRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-zinc-300 transition-colors shrink-0" />
                        </div>

                        <p className="mt-2.5 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {skill.context}
                        </p>

                        {skill.projects && skill.projects.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-[#1b1f2b] flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 w-full">
                            <span className="text-emerald-400 font-semibold shrink-0">Applied in:</span>
                            <span className="truncate">{skill.projects[0]}</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* SKILL DETAIL DOSSIER MODAL (Portaled to body above sticky navbar) */}
      {selectedSkill &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedSkill.name} skill dossier`}
            onClick={() => setSelectedSkill(null)}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-2xl border border-[#262d40] bg-[#0c0e16] card-bevel p-6 shadow-2xl max-h-[88vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3">
                  <BrandLogo
                    name={selectedSkill.name}
                    size={46}
                    badgeVariant="glass"
                    showGlow
                    className="shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
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
                  aria-label="Close skill modal"
                  className="p-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 space-y-4 text-xs font-sans text-zinc-300">
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                    Practical Application &amp; Production Architecture
                  </span>
                  <p className="text-zinc-200 leading-relaxed bg-white/[0.02] border border-white/[0.06] rounded-xl p-3">
                    {selectedSkill.context}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                    Linked Projects &amp; Work
                  </span>
                  <div className="space-y-1.5">
                    {selectedSkill.projects.map((proj, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-zinc-200 bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                        <span>{proj}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-zinc-400 border-t border-white/[0.06]">
                  <span>
                    Proficiency: <strong className="text-cyan-400">{selectedSkill.proficiency || 'Advanced'}</strong>
                  </span>
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
          </div>,
          document.body
        )}
    </div>
  );
}
