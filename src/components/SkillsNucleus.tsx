'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { X, Cpu } from 'lucide-react';
import { Skill } from '@/lib/neon/db';
import BrandLogo from './BrandLogo';

interface SkillsNucleusProps {
  skills?: Skill[];
}

export interface SkillItem {
  id: number | string;
  name: string;
  category: 'languages' | 'frameworks' | 'aiml' | 'cloud' | 'database';
  categoryLabel: string;
  context: string;
  projects: string[];
  orbit: number; // 1: Inner, 2: Mid-Inner, 3: Mid-Outer, 4: Outer
  proficiency?: string;
  initialAngle: number;
}

// Compact Celestial Orbital Mechanics (Scaled for viewport perfection)
// Outer radius: 275px (diameter 550px). With badges (~140px), stage is ~640px.
// Uniform prograde revolution with outer orbits moving progressively slower.
const CELESTIAL_ORBITS = {
  orbit1: { radius: 95, duration: 28, offset: 0, label: 'Languages' },
  orbit2: { radius: 155, duration: 44, offset: 35, label: 'Frameworks' },
  orbit3: { radius: 215, duration: 66, offset: 70, label: 'Cloud & DevOps' },
  orbit4: { radius: 275, duration: 92, offset: 15, label: 'Databases & Storage' },
} as const;

// Curated technical knowledge catalog with rich production contexts
const DEFAULT_SKILLS_CATALOG: Omit<SkillItem, 'initialAngle'>[] = [
  // Orbit 1: Core Languages (Radius: 95px)
  { id: 'python', name: 'Python', category: 'languages', categoryLabel: 'Programming Languages', context: 'PyTorch Deep Learning, OpenCV Computer Vision, SpaCy NLP pipelines', projects: ['Real-Time Object Detection', 'NER NLP Pipeline', 'IBM SkillsBuild'], orbit: 1, proficiency: 'Expert' },
  { id: 'java', name: 'Java', category: 'languages', categoryLabel: 'Programming Languages', context: '90+ LeetCode DSA Solutions, Object-Oriented Architecture, Enterprise Runtimes', projects: ['LeetCode 90+ Problems', 'Panimalar Coursework'], orbit: 1, proficiency: 'Expert' },
  { id: 'typescript', name: 'TypeScript', category: 'languages', categoryLabel: 'Programming Languages', context: 'Type-safe full-stack engineering with Next.js 16, React 19 & Drizzle ORM', projects: ['arthaX Wealth Terminal', 'Portfolio Core'], orbit: 1, proficiency: 'Advanced' },
  { id: 'javascript', name: 'JavaScript', category: 'languages', categoryLabel: 'Programming Languages', context: 'Modern ESNext, asynchronous APIs, event loops & client DOM hydration', projects: ['arthaX Terminal', 'Web Microservices'], orbit: 1, proficiency: 'Advanced' },
  { id: 'sql', name: 'SQL', category: 'languages', categoryLabel: 'Programming Languages', context: 'Complex analytic queries, indexes, ACID transactions & schema normalization', projects: ['arthaX PostgreSQL Schema', 'DBMS Coursework'], orbit: 1, proficiency: 'Advanced' },

  // Orbit 2: Frameworks & Web (Radius: 155px)
  { id: 'react', name: 'React', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'React 19 Server Components, custom hooks, concurrent rendering & state management', projects: ['arthaX Terminal', 'Developer Portfolio'], orbit: 2, proficiency: 'Expert' },
  { id: 'nextjs', name: 'Next.js', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'Turbopack, Server Components, Server Actions & App Router micro-frontends', projects: ['arthaX Wealth Terminal', 'Developer Portfolio'], orbit: 2, proficiency: 'Expert' },
  { id: 'nodejs', name: 'Node.js', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'Asynchronous event runtimes, high-throughput microservices & streaming APIs', projects: ['Full-Stack Microservices'], orbit: 2, proficiency: 'Advanced' },
  { id: 'express', name: 'Express.js', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'RESTful API endpoints, secure middleware chains & routing architecture', projects: ['Backend Microservices'], orbit: 2, proficiency: 'Advanced' },
  { id: 'tailwindcss', name: 'Tailwind CSS', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'Tailwind CSS 4, modern utility design, glassmorphism, responsive grids & tokens', projects: ['arthaX Terminal', 'Developer Portfolio'], orbit: 2, proficiency: 'Expert' },

  // Orbit 3: Cloud, AI & DevOps (Radius: 215px)
  { id: 'vercel', name: 'Vercel', category: 'cloud', categoryLabel: 'Cloud & DevOps', context: 'Zero-config edge deployment, serverless functions, fluid compute & CI/CD', projects: ['Portfolio Live Deployment', 'arthaX Production'], orbit: 3, proficiency: 'Expert' },
  { id: 'render', name: 'Render', category: 'cloud', categoryLabel: 'Cloud & DevOps', context: 'Full-stack cloud hosting, background workers, automated git deployments & managed DBs', projects: ['Microservices Hosting', 'Backend Services'], orbit: 3, proficiency: 'Advanced' },
  { id: 'aws', name: 'AWS', category: 'cloud', categoryLabel: 'Cloud & DevOps', context: 'EC2 compute, S3 object storage, IAM role policies & secure cloud architecture', projects: ['CodTech Internship', 'Cloud Architecture'], orbit: 3, proficiency: 'Advanced' },
  { id: 'docker', name: 'Docker', category: 'cloud', categoryLabel: 'Cloud & DevOps', context: 'Containerized application packaging, multi-stage Dockerfiles & local dev orchestration', projects: ['Full-Stack Deployment'], orbit: 3, proficiency: 'Advanced' },
  { id: 'pytorch', name: 'PyTorch', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'Deep neural network training, tensor math, autograd & computer vision architectures', projects: ['Real-Time Object Detection System'], orbit: 3, proficiency: 'Advanced' },

  // Orbit 4: Databases & Storage (Radius: 275px)
  { id: 'supabase', name: 'Supabase', category: 'database', categoryLabel: 'Databases & Storage', context: 'Row-Level Security (RLS) policies, PostgreSQL realtime & user authentication', projects: ['arthaX Wealth Terminal'], orbit: 4, proficiency: 'Advanced' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', categoryLabel: 'Databases & Storage', context: 'Relational database schemas, B-tree indexes, transactions & ACID compliance', projects: ['arthaX Wealth Terminal', 'Neon Database'], orbit: 4, proficiency: 'Advanced' },
  { id: 'mongodb', name: 'MongoDB', category: 'database', categoryLabel: 'Databases & Storage', context: 'NoSQL document storage, flexible BSON schemas & aggregation pipelines', projects: ['Full-Stack Data Storage'], orbit: 4, proficiency: 'Proficient' },
  { id: 'neon', name: 'Neon', category: 'database', categoryLabel: 'Databases & Storage', context: 'Serverless Postgres with autoscaling, database branching & instant point-in-time restore', projects: ['Portfolio Live Database', 'arthaX Backend'], orbit: 4, proficiency: 'Advanced' },
];

export default function SkillsNucleus({ skills = [] }: SkillsNucleusProps) {
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const arenaRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef<boolean>(false);
  const badgeRefs = useRef<Map<string | number, HTMLDivElement>>(new Map());
  const anglesRef = useRef<{ [key: string]: number }>({});
  const lastTimeRef = useRef<number | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Synchronize pause state with hover and modal open
  useEffect(() => {
    isPausedRef.current = selectedSkill !== null || hoveredSkill !== null;
  }, [selectedSkill, hoveredSkill]);

  // Dynamic responsive fluid scale for orbit stage across all device widths
  useEffect(() => {
    const handleResize = () => {
      const arenaWidth = arenaRef.current ? arenaRef.current.clientWidth : window.innerWidth;
      // 640px is stage diameter; compute fluid scale with a sensible mobile minimum
      const targetScale = Math.min(1, Math.max(0.48, (arenaWidth - 16) / 640));
      setZoomScale(targetScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Map database skills into celestial orbital bodies with intelligent categorizations
  const allSkillsList: SkillItem[] = useMemo(() => {
    if (!skills || skills.length === 0) return [];

    const norm = (s: string) => s.toLowerCase().replace(/[\s\.\-_]/g, '');

    // Classify skills into the 4 orbits
    const mapped = skills.map((dbSkill) => {
      const dbNorm = norm(dbSkill.name);
      const catalogMatch = DEFAULT_SKILLS_CATALOG.find((cat) => norm(cat.name) === dbNorm);

      if (catalogMatch) {
        return {
          ...catalogMatch,
          id: dbSkill.id,
          name: dbSkill.name,
          proficiency: dbSkill.level || catalogMatch.proficiency,
          initialAngle: 0,
        };
      }

      // Dynamic heuristic classification based on skill name & category
      const nameLower = dbSkill.name.toLowerCase();
      const catLower = (dbSkill.category || '').toLowerCase();

      let orbit = 1;
      let category: SkillItem['category'] = 'languages';

      if (
        nameLower.includes('python') || nameLower.includes('java') || nameLower.includes('type') ||
        nameLower.includes('script') || nameLower.includes('sql') || nameLower.includes('c++') ||
        nameLower.includes('rust') || nameLower.includes('golang') || nameLower.includes('go') ||
        catLower.includes('lang')
      ) {
        orbit = 1;
        category = 'languages';
      } else if (
        nameLower.includes('react') || nameLower.includes('next') || nameLower.includes('vue') ||
        nameLower.includes('angular') || nameLower.includes('express') || nameLower.includes('node') ||
        nameLower.includes('tailwind') || nameLower.includes('html') || nameLower.includes('css') ||
        catLower.includes('web') || catLower.includes('frontend') || catLower.includes('framework')
      ) {
        orbit = 2;
        category = 'frameworks';
      } else if (
        nameLower.includes('torch') || nameLower.includes('tensor') || nameLower.includes('opencv') ||
        nameLower.includes('learn') || nameLower.includes('spacy') || nameLower.includes('pandas') ||
        nameLower.includes('numpy') || catLower.includes('ai') || catLower.includes('machine')
      ) {
        orbit = 3;
        category = 'aiml';
      } else if (
        nameLower.includes('vercel') || nameLower.includes('render') || nameLower.includes('aws') ||
        nameLower.includes('docker') || nameLower.includes('git') || catLower.includes('cloud') ||
        catLower.includes('devops')
      ) {
        orbit = 3;
        category = 'cloud';
      } else if (
        nameLower.includes('base') || nameLower.includes('data') || nameLower.includes('postgre') ||
        nameLower.includes('mongo') || nameLower.includes('neon') || nameLower.includes('redis') ||
        catLower.includes('database') || catLower.includes('storage')
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

    // Count skills per orbit
    const counts: { [orbit: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0 };
    mapped.forEach((s) => { counts[s.orbit] = (counts[s.orbit] || 0) + 1; });

    // Distribute initial angles evenly across 360 degrees for each orbit
    const orbitCurrentIndex: { [orbit: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0 };
    return mapped.map((skill) => {
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

  // Initialize angles for each skill
  useEffect(() => {
    allSkillsList.forEach((skill) => {
      if (anglesRef.current[skill.id] === undefined) {
        anglesRef.current[skill.id] = skill.initialAngle;
      }
    });
  }, [allSkillsList]);

  // High-performance direct RAF animation loop:
  // Updates Cartesian (x, y) coordinates with translate3d WITHOUT ANY ROTATION.
  // Guarantees badges are ALWAYS 100% level, upright, and never tilted or upside down.
  useEffect(() => {
    if (allSkillsList.length === 0) return;

    const animate = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      // Only advance position if not paused and delta is reasonable (prevents big jumps on tab focus)
      if (!isPausedRef.current && delta < 0.2) {
        allSkillsList.forEach((skill) => {
          const orbitKey = `orbit${skill.orbit}` as keyof typeof CELESTIAL_ORBITS;
          const config = CELESTIAL_ORBITS[orbitKey] || CELESTIAL_ORBITS.orbit1;
          const speed = 360 / config.duration; // degrees per second (counter-clockwise)

          // Counter-clockwise motion (subtract angle)
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
  }, [allSkillsList]);

  // Clean empty state if database has no skills
  if (!skills || skills.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#262b3a] bg-[#0c0e14]/50 p-8 sm:p-12 text-center space-y-3">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-[#2b3142] bg-[#141722] text-zinc-400">
          <Cpu className="h-5 w-5 text-emerald-400" />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-zinc-200">
          No skills in database
        </h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Database was cleared. All newly added technical skills from the admin panel or database will orbit here in real time without refreshing.
        </p>
      </div>
    );
  }

  const activeInspected = hoveredSkill || selectedSkill;

  // Category visual accent helper
  const getBadgeColors = (orbit: number, isCurrent: boolean) => {
    switch (orbit) {
      case 1:
        return {
          badge: isCurrent
            ? 'bg-cyan-950/90 border-cyan-400 shadow-[0_0_24px_rgba(56,189,248,0.7)] scale-110 z-30'
            : 'bg-[#081226]/90 hover:bg-[#101c38] border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_18px_rgba(56,189,248,0.5)] z-10',
          dot: 'bg-cyan-400 shadow-[0_0_8px_#38bdf8]',
          text: 'group-hover:text-cyan-300',
        };
      case 2:
        return {
          badge: isCurrent
            ? 'bg-blue-950/90 border-blue-400 shadow-[0_0_24px_rgba(59,130,246,0.7)] scale-110 z-30'
            : 'bg-[#0a122e]/90 hover:bg-[#121c46] border-blue-500/40 hover:border-blue-400 hover:shadow-[0_0_18px_rgba(59,130,246,0.5)] z-10',
          dot: 'bg-blue-400 shadow-[0_0_8px_#60a5fa]',
          text: 'group-hover:text-blue-300',
        };
      case 3:
        return {
          badge: isCurrent
            ? 'bg-purple-950/90 border-purple-400 shadow-[0_0_24px_rgba(168,85,247,0.7)] scale-110 z-30'
            : 'bg-[#140e2b]/90 hover:bg-[#1e153f] border-purple-500/40 hover:border-purple-400 hover:shadow-[0_0_18px_rgba(168,85,247,0.5)] z-10',
          dot: 'bg-purple-400 shadow-[0_0_8px_#c084fc]',
          text: 'group-hover:text-purple-300',
        };
      case 4:
      default:
        return {
          badge: isCurrent
            ? 'bg-emerald-950/90 border-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.7)] scale-110 z-30'
            : 'bg-[#081a16]/90 hover:bg-[#0f2e27] border-emerald-500/40 hover:border-emerald-400 hover:shadow-[0_0_18px_rgba(16,185,129,0.5)] z-10',
          dot: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
          text: 'group-hover:text-emerald-300',
        };
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center select-none py-2">
      
      {/* ======================================================== */}
      {/* COMPACT CELESTIAL STAGE (Scaled proportionally)          */}
      {/* ======================================================== */}
      <div 
        ref={arenaRef}
        className="relative w-full flex items-center justify-center overflow-visible"
        style={{
          height: `${Math.round(590 * zoomScale)}px`,
          minHeight: '340px'
        }}
      >
        
        {/* Ambient Radial Glowing Nebulae */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full bg-cyan-500/15 blur-[70px] pointer-events-none" />

        {/* Scaled Orbit System (640px coordinate diameter) */}
        <div 
          className="relative shrink-0 flex items-center justify-center origin-center transition-transform duration-200"
          style={{
            width: '640px',
            height: '640px',
            transform: `scale(${zoomScale})`
          }}
        >

          {/* SVG Concentric Orbit Track Paths */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none select-none" viewBox="0 0 640 640">
            {/* Subtle Crosshairs */}
            <line x1="320" y1="35" x2="320" y2="605" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 8" />
            <line x1="35" y1="320" x2="605" y2="320" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 8" />

            {/* Orbit Track 1: Languages (r=95px) */}
            <circle
              cx="320"
              cy="320"
              r={CELESTIAL_ORBITS.orbit1.radius}
              fill="none"
              stroke="rgba(56, 189, 248, 0.3)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />

            {/* Orbit Track 2: Frameworks & Web (r=155px) */}
            <circle
              cx="320"
              cy="320"
              r={CELESTIAL_ORBITS.orbit2.radius}
              fill="none"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth="1.5"
              strokeDasharray="5 7"
            />

            {/* Orbit Track 3: Cloud & AI (r=215px) */}
            <circle
              cx="320"
              cy="320"
              r={CELESTIAL_ORBITS.orbit3.radius}
              fill="none"
              stroke="rgba(168, 85, 247, 0.3)"
              strokeWidth="1.5"
              strokeDasharray="6 8"
            />

            {/* Orbit Track 4: Databases & Storage (r=275px) */}
            <circle
              cx="320"
              cy="320"
              r={CELESTIAL_ORBITS.orbit4.radius}
              fill="none"
              stroke="rgba(16, 185, 129, 0.3)"
              strokeWidth="1.5"
              strokeDasharray="6 10"
            />
          </svg>

          {/* =================================================== */}
          {/* 1. CENTER TECH NUCLEUS (Compact & Refined)          */}
          {/* =================================================== */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 select-none pointer-events-none"
          >
            {/* Gravitational Wave Ripples */}
            <div className="absolute inset-0 rounded-full border border-cyan-400/25 animate-spacetime-ripple pointer-events-none" />
            <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-spacetime-ripple pointer-events-none" style={{ animationDelay: '1.8s' }} />

            {/* Event Horizon Accretion Ring */}
            <div 
              className="absolute -inset-3 sm:-inset-4 rounded-full border border-dashed border-cyan-400/35 animate-event-horizon pointer-events-none" 
            />

            {/* Compact Nucleus Body (96px - 108px) */}
            <div 
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center p-2 text-center border-2 border-cyan-400/60 bg-gradient-to-b from-[#0b162c] via-[#091024] to-[#04060c] shadow-[0_0_30px_rgba(56,189,248,0.5),0_0_60px_rgba(99,102,241,0.3),inset_0_0_16px_rgba(56,189,248,0.4)] transition-all duration-300 animate-nucleus-pulse"
            >
              {activeInspected ? (
                <>
                  <div className="text-xs sm:text-sm font-bold text-white tracking-tight line-clamp-1 px-1">
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
                  <div className="font-mono font-black text-base sm:text-lg tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-blue-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.7)] whitespace-nowrap">
                    E = mc²
                  </div>
                  <div className="text-[9px] font-mono font-bold tracking-widest text-cyan-300 uppercase mt-0.5 leading-tight">
                    Tech Stack
                  </div>
                  <div className="text-[7.5px] font-mono text-zinc-400 mt-0.5">
                    Full-Stack · AI
                  </div>
                </>
              )}
            </div>
          </div>

          {/* =================================================== */}
          {/* 2. CELESTIAL ORBITING BODIES (Level, Upright & Bold) */}
          {/* =================================================== */}
          {allSkillsList.map((skill) => {
            const isCurrent = activeInspected?.name === skill.name;
            const colors = getBadgeColors(skill.orbit, isCurrent);

            // Compute initial Cartesian position for instant SSR/first paint
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
                <div
                  onMouseEnter={() => {
                    setHoveredSkill(skill);
                    isPausedRef.current = true;
                  }}
                  onMouseLeave={() => {
                    setHoveredSkill(null);
                    isPausedRef.current = selectedSkill !== null;
                  }}
                  onClick={() => setSelectedSkill(skill)}
                  className={`group relative flex items-center gap-2.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border transition-all duration-200 cursor-pointer shadow-lg hover:scale-105 active:scale-95 ${colors.badge} backdrop-blur-xl shrink-0 whitespace-nowrap`}
                >
                  <BrandLogo
                    name={skill.name}
                    size={24}
                    badgeVariant="glass"
                    showGlow={isCurrent}
                  />
                  <span className={`text-xs sm:text-sm font-semibold font-mono tracking-wide text-zinc-100 ${colors.text}`}>
                    {skill.name}
                  </span>
                  <span className={`h-2 w-2 rounded-full shrink-0 ${colors.dot}`} />
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* ======================================================== */}
      {/* SKILL DETAIL DOSSIER MODAL                               */}
      {/* ======================================================== */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-white/[0.12] bg-[#0c0d16] p-6 sm:p-7 shadow-2xl card-shine">
            
            {/* Modal Header */}
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
                className="p-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content */}
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
                    <div key={i} className="flex items-center gap-2 text-zinc-200 bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                      <span>{proj}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-white/[0.06]">
                <span>Proficiency Level: <strong className="text-cyan-400">{selectedSkill.proficiency || 'Advanced'}</strong></span>
                <button
                  type="button"
                  onClick={() => setSelectedSkill(null)}
                  className="px-4 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
