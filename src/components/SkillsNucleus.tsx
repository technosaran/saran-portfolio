'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
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
  orbit?: number; // 1: Inner, 2: Mid-Inner, 3: Mid-Outer, 4: Outer
  proficiency?: string;
}

// Physical Celestial Orbital Mechanics (Kepler's Third Law: T ∝ r^1.5)
// In real celestial systems (solar systems, accretion disks), conservation of angular momentum
// dictates that all orbits revolve in the same uniform prograde (counter-clockwise) direction,
// and inner celestial bodies revolve significantly faster than outer bodies.
const CELESTIAL_ORBITS = {
  orbit1: { radius: 135, duration: 24, offset: 0 },    // Core Languages: Fast inner orbit (24s)
  orbit2: { radius: 215, duration: 48, offset: 36 },   // AI & ML: Mid-inner orbit (~48s, Keplerian ratio ~2.01x)
  orbit3: { radius: 290, duration: 76, offset: 18 },   // Frameworks & Web: Mid-outer orbit (~76s, Keplerian ratio ~3.15x)
  orbit4: { radius: 365, duration: 108, offset: 45 },  // Cloud & Databases: Outer gas giant orbit (~108s, Keplerian ratio ~4.45x)
} as const;

// Curated 20 technologies perfectly balanced across the 4 celestial orbits
const DEFAULT_SKILLS: SkillItem[] = [
  // Orbit 1: Core Languages (Radius: 135px)
  { id: 'python', name: 'Python', category: 'languages', categoryLabel: 'Programming Languages', context: 'PyTorch Deep Learning, OpenCV Computer Vision, SpaCy NLP pipelines', projects: ['Real-Time Object Detection', 'NER NLP Pipeline', 'IBM SkillsBuild'], orbit: 1, proficiency: 'Expert' },
  { id: 'java', name: 'Java', category: 'languages', categoryLabel: 'Programming Languages', context: '90+ LeetCode DSA Solutions, Object-Oriented Architecture, Enterprise Runtimes', projects: ['LeetCode 90+ Problems', 'Panimalar Coursework'], orbit: 1, proficiency: 'Expert' },
  { id: 'typescript', name: 'TypeScript', category: 'languages', categoryLabel: 'Programming Languages', context: 'Type-safe full-stack engineering with Next.js 16, React 19 & Drizzle ORM', projects: ['arthaX Wealth Terminal', 'Portfolio Core'], orbit: 1, proficiency: 'Advanced' },
  { id: 'javascript', name: 'JavaScript', category: 'languages', categoryLabel: 'Programming Languages', context: 'Modern ESNext, asynchronous APIs, event loops & client DOM hydration', projects: ['arthaX Terminal', 'Web Microservices'], orbit: 1, proficiency: 'Advanced' },
  { id: 'sql', name: 'SQL', category: 'languages', categoryLabel: 'Programming Languages', context: 'Complex analytic queries, indexes, ACID transactions & schema normalization', projects: ['arthaX PostgreSQL Schema', 'DBMS Coursework'], orbit: 1, proficiency: 'Advanced' },

  // Orbit 2: AI & Machine Learning (Radius: 215px)
  { id: 'numpy', name: 'NumPy', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'Vectorized linear algebra, multi-dimensional tensor computation & numerical math', projects: ['Deep Learning & Matrix Math'], orbit: 2, proficiency: 'Advanced' },
  { id: 'pytorch', name: 'PyTorch', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'Deep neural network training, tensor math, autograd & computer vision architectures', projects: ['Real-Time Object Detection System'], orbit: 2, proficiency: 'Advanced' },
  { id: 'scikitlearn', name: 'Scikit-Learn', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'Supervised & unsupervised ML, regression algorithms, classification & PCA', projects: ['IBM SkillsBuild Capstone'], orbit: 2, proficiency: 'Advanced' },
  { id: 'spacy', name: 'SpaCy', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'Tokenization, Part-of-Speech tagging & Named Entity Recognition (NER)', projects: ['NER System NLP Pipeline'], orbit: 2, proficiency: 'Advanced' },
  { id: 'pandas', name: 'Pandas', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'High-speed DataFrame manipulation, ETL pipelines & exploratory data analysis', projects: ['Financial Data Analysis', 'ML Pipelines'], orbit: 2, proficiency: 'Advanced' },

  // Orbit 3: Frameworks & Web (Radius: 290px)
  { id: 'express', name: 'Express.js', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'RESTful API endpoints, secure middleware chains & routing architecture', projects: ['Backend Microservices'], orbit: 3, proficiency: 'Advanced' },
  { id: 'restapi', name: 'RESTful APIs', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'Idempotent HTTP routes, rate limiting, JSON serialization & error schemas', projects: ['arthaX Financial APIs'], orbit: 3, proficiency: 'Advanced' },
  { id: 'nextjs', name: 'Next.js 16', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'Turbopack, Server Components, Server Actions & App Router micro-frontends', projects: ['arthaX Wealth Terminal', 'Developer Portfolio'], orbit: 3, proficiency: 'Expert' },
  { id: 'opencv', name: 'OpenCV', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'Real-time video stream capture, bounding box tracking & frame manipulation', projects: ['Real-Time Object Detection System'], orbit: 3, proficiency: 'Advanced' },
  { id: 'tailwindcss', name: 'Tailwind CSS', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'Tailwind CSS 4, modern utility design, glassmorphism, responsive grids & tokens', projects: ['arthaX Terminal', 'Developer Portfolio'], orbit: 3, proficiency: 'Expert' },
  { id: 'nodejs', name: 'Node.js', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'Asynchronous event runtimes, high-throughput microservices & streaming APIs', projects: ['Full-Stack Microservices'], orbit: 3, proficiency: 'Advanced' },

  // Orbit 4: Cloud & Databases (Radius: 365px)
  { id: 'mongodb', name: 'MongoDB', category: 'database', categoryLabel: 'Databases & Storage', context: 'NoSQL document storage, flexible BSON schemas & aggregation pipelines', projects: ['Full-Stack Data Storage'], orbit: 4, proficiency: 'Proficient' },
  { id: 'aws', name: 'AWS Cloud', category: 'cloud', categoryLabel: 'Cloud & DevOps', context: 'EC2 compute, S3 object storage, IAM role policies & secure cloud architecture', projects: ['CodTech Internship', 'Cloud Architecture'], orbit: 4, proficiency: 'Advanced' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', categoryLabel: 'Databases & Storage', context: 'Relational database schemas, B-tree indexes, transactions & ACID compliance', projects: ['arthaX Wealth Terminal', 'Neon Database'], orbit: 4, proficiency: 'Advanced' },
  { id: 'supabase', name: 'Supabase', category: 'database', categoryLabel: 'Databases & Storage', context: 'Row-Level Security (RLS) policies, PostgreSQL realtime & user authentication', projects: ['arthaX Wealth Terminal'], orbit: 4, proficiency: 'Advanced' },
];

export default function SkillsNucleus({ skills = [] }: SkillsNucleusProps) {
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const arenaRef = useRef<HTMLDivElement>(null);

  // Dynamic responsive scale for orbit container across all device widths
  useEffect(() => {
    const handleResize = () => {
      const arenaWidth = arenaRef.current ? arenaRef.current.clientWidth : window.innerWidth;
      // 820px is coordinate diameter including outer badges; compute responsive fluid scale
      const targetScale = Math.min(1, Math.max(0.38, (arenaWidth - 20) / 820));
      setZoomScale(targetScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Merge database skills with default catalog if provided
  const allSkillsList: SkillItem[] = useMemo(() => {
    if (!skills || skills.length === 0) return DEFAULT_SKILLS;

    const mapped = DEFAULT_SKILLS.map((defaultItem) => {
      const match = skills.find(
        (s) => s.name.toLowerCase() === defaultItem.name.toLowerCase()
      );
      if (match) {
        return {
          ...defaultItem,
          id: match.id,
          proficiency: match.level || defaultItem.proficiency
        };
      }
      return defaultItem;
    });

    return mapped;
  }, [skills]);

  // Group skills into the 4 Bohr orbits matching exact visual choreography
  const orbit1Skills = useMemo(() => allSkillsList.filter((s) => s.orbit === 1), [allSkillsList]);
  const orbit2Skills = useMemo(() => allSkillsList.filter((s) => s.orbit === 2).slice(0, 5), [allSkillsList]);
  const orbit3Skills = useMemo(() => allSkillsList.filter((s) => s.orbit === 3).slice(0, 6), [allSkillsList]);
  const orbit4Skills = useMemo(() => allSkillsList.filter((s) => s.orbit === 4).slice(0, 4), [allSkillsList]);

  const activeInspected = hoveredSkill || selectedSkill;

  return (
    <div className="relative w-full flex flex-col items-center justify-center select-none">
      
      {/* ======================================================== */}
      {/* ORBIT ARENA STAGE (No container, no border, pure orbit)  */}
      {/* ======================================================== */}
      <div 
        ref={arenaRef}
        className="relative w-full flex items-center justify-center overflow-visible"
        style={{
          height: `${Math.round(800 * zoomScale)}px`,
          minHeight: '380px'
        }}
      >
        
        {/* Ambient Radial Glowing Nebula */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-cyan-500/15 blur-[90px] pointer-events-none" />

        {/* Scaled Orbit System (Responsive across all devices) */}
        <div 
          className="relative shrink-0 flex items-center justify-center origin-center transition-transform duration-200"
          style={{
            width: '780px',
            height: '780px',
            transform: `scale(${zoomScale})`
          }}
        >

          {/* SVG Concentric Orbit Track Paths */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none select-none">
            {/* Crosshairs & Axes */}
            <line x1="390" y1="30" x2="390" y2="750" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 8" />
            <line x1="30" y1="390" x2="750" y2="390" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 8" />
            <circle cx="390" cy="390" r="390" fill="none" stroke="rgba(255,255,255,0.02)" />

            {/* Orbit Track 1: Languages (r=135px) */}
            <circle
              cx="390"
              cy="390"
              r="135"
              fill="none"
              stroke="rgba(56, 189, 248, 0.35)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />

            {/* Orbit Track 2: AI & ML (r=215px) */}
            <circle
              cx="390"
              cy="390"
              r="215"
              fill="none"
              stroke="rgba(168, 85, 247, 0.35)"
              strokeWidth="1.5"
              strokeDasharray="5 7"
            />

            {/* Orbit Track 3: Frameworks & Web (r=290px) */}
            <circle
              cx="390"
              cy="390"
              r="290"
              fill="none"
              stroke="rgba(59, 130, 246, 0.35)"
              strokeWidth="1.5"
              strokeDasharray="6 8"
            />

            {/* Orbit Track 4: Cloud & Databases (r=365px) */}
            <circle
              cx="390"
              cy="390"
              r="365"
              fill="none"
              stroke="rgba(168, 85, 247, 0.35)"
              strokeWidth="1.5"
              strokeDasharray="6 10"
            />
          </svg>

          {/* =================================================== */}
          {/* 1. CENTER TECH NUCLEUS                              */}
          {/* =================================================== */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 select-none pointer-events-none"
          >
            {/* Gravitational Wave Ripples */}
            <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-spacetime-ripple pointer-events-none" />
            <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-spacetime-ripple pointer-events-none" style={{ animationDelay: '2s' }} />

            {/* Rotating Event Horizon Rings */}
            <div 
              className="absolute -inset-4 rounded-full border border-dashed border-cyan-400/40 animate-event-horizon pointer-events-none" 
            />
            <div 
              className="absolute -inset-7 rounded-full border border-dotted border-blue-400/20 pointer-events-none animate-event-horizon"
              style={{ animationDuration: '36s' }} 
            />

            {/* Pulsating Tech Nucleus Core Body */}
            <div 
              className="relative w-36 h-36 rounded-full flex flex-col items-center justify-center p-3 text-center border-2 border-cyan-400/60 bg-gradient-to-b from-[#0b162c] via-[#091024] to-[#04060c] shadow-[0_0_40px_rgba(56,189,248,0.5),0_0_80px_rgba(99,102,241,0.3),inset_0_0_20px_rgba(56,189,248,0.4)] transition-all duration-300 animate-nucleus-pulse"
            >
              {activeInspected ? (
                <>
                  <div className="text-base sm:text-lg font-bold text-white tracking-tight line-clamp-1">
                    {activeInspected.name}
                  </div>
                  <div className="text-[9px] font-mono text-cyan-300 uppercase tracking-wider mt-0.5 line-clamp-1">
                    {activeInspected.categoryLabel}
                  </div>
                  <div className="mt-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[8px] font-mono text-cyan-300/90">
                    {activeInspected.proficiency || 'Active'}
                  </div>
                </>
              ) : (
                <>
                  <div className="font-mono font-black text-xl sm:text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-blue-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.75)] whitespace-nowrap">
                    E = mc²
                  </div>
                  <div className="text-[10px] font-mono font-semibold tracking-wider text-cyan-300 uppercase mt-1 leading-tight">
                    Tech Stack
                  </div>
                  <div className="text-[8px] font-mono text-zinc-400 mt-0.5">
                    Full-Stack · AI
                  </div>
                </>
              )}
            </div>
          </div>

          {/* =================================================== */}
          {/* 2. ORBIT 1: LANGUAGES (Radius: 135px, Prograde CCW) */}
          {/* =================================================== */}
          <div
            className="orbit-ring absolute inset-0 pointer-events-none origin-center"
            style={{
              animation: `orbit-spin-ccw ${CELESTIAL_ORBITS.orbit1.duration}s linear infinite`,
              animationPlayState: selectedSkill ? 'paused' : 'running',
            }}
          >
            {orbit1Skills.map((skill, idx) => {
              const angle = (360 / orbit1Skills.length) * idx + CELESTIAL_ORBITS.orbit1.offset;
              const isCurrent = activeInspected?.name === skill.name;

              return (
                <div
                  key={skill.id}
                  className="absolute left-1/2 top-1/2 pointer-events-auto origin-center"
                  style={{
                    transform: `rotate(${angle}deg) translate(${CELESTIAL_ORBITS.orbit1.radius}px) rotate(-${angle}deg)`,
                  }}
                >
                  <div
                    className="orbit-counter w-0 h-0 flex items-center justify-center origin-center"
                    style={{
                      animation: `counter-spin-ccw ${CELESTIAL_ORBITS.orbit1.duration}s linear infinite`,
                      animationPlayState: selectedSkill ? 'paused' : 'running',
                    }}
                  >
                    <div
                      onMouseEnter={() => setHoveredSkill(skill)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      onClick={() => setSelectedSkill(skill)}
                      className={`group orbit-badge relative flex items-center gap-2 px-2.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                        isCurrent
                          ? 'bg-cyan-950/90 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.7)] scale-110 z-30'
                          : 'bg-[#0a0f1d]/90 hover:bg-[#101932] border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_16px_rgba(56,189,248,0.4)] hover:scale-105 z-10'
                      } backdrop-blur-md shrink-0`}
                    >
                      <BrandLogo name={skill.name} size={18} badgeVariant="glass" showGlow={isCurrent} />
                      <span className="text-xs font-mono font-medium text-white group-hover:text-cyan-300 whitespace-nowrap">
                        {skill.name}
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* =================================================== */}
          {/* 3. ORBIT 2: AI & ML (Radius: 215px, Prograde CCW)   */}
          {/* =================================================== */}
          <div
            className="orbit-ring absolute inset-0 pointer-events-none origin-center"
            style={{
              animation: `orbit-spin-ccw ${CELESTIAL_ORBITS.orbit2.duration}s linear infinite`,
              animationPlayState: selectedSkill ? 'paused' : 'running',
            }}
          >
            {orbit2Skills.map((skill, idx) => {
              const angle = (360 / orbit2Skills.length) * idx + CELESTIAL_ORBITS.orbit2.offset;
              const isCurrent = activeInspected?.name === skill.name;

              return (
                <div
                  key={skill.id}
                  className="absolute left-1/2 top-1/2 pointer-events-auto origin-center"
                  style={{
                    transform: `rotate(${angle}deg) translate(${CELESTIAL_ORBITS.orbit2.radius}px) rotate(-${angle}deg)`,
                  }}
                >
                  <div
                    className="orbit-counter w-0 h-0 flex items-center justify-center origin-center"
                    style={{
                      animation: `counter-spin-ccw ${CELESTIAL_ORBITS.orbit2.duration}s linear infinite`,
                      animationPlayState: selectedSkill ? 'paused' : 'running',
                    }}
                  >
                    <div
                      onMouseEnter={() => setHoveredSkill(skill)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      onClick={() => setSelectedSkill(skill)}
                      className={`group orbit-badge relative flex items-center gap-2 px-2.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                        isCurrent
                          ? 'bg-purple-950/90 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.7)] scale-110 z-30'
                          : 'bg-[#100c22]/90 hover:bg-[#1a1236] border-purple-500/30 hover:border-purple-400 hover:shadow-[0_0_16px_rgba(168,85,247,0.4)] hover:scale-105 z-10'
                      } backdrop-blur-md shrink-0`}
                    >
                      <BrandLogo name={skill.name} size={18} badgeVariant="glass" showGlow={isCurrent} />
                      <span className="text-xs font-mono font-medium text-white group-hover:text-purple-300 whitespace-nowrap">
                        {skill.name}
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* =================================================== */}
          {/* 4. ORBIT 3: FRAMEWORKS & WEB (Radius: 290px, CCW)   */}
          {/* =================================================== */}
          <div
            className="orbit-ring absolute inset-0 pointer-events-none origin-center"
            style={{
              animation: `orbit-spin-ccw ${CELESTIAL_ORBITS.orbit3.duration}s linear infinite`,
              animationPlayState: selectedSkill ? 'paused' : 'running',
            }}
          >
            {orbit3Skills.map((skill, idx) => {
              const angle = (360 / orbit3Skills.length) * idx + CELESTIAL_ORBITS.orbit3.offset;
              const isCurrent = activeInspected?.name === skill.name;

              return (
                <div
                  key={skill.id}
                  className="absolute left-1/2 top-1/2 pointer-events-auto origin-center"
                  style={{
                    transform: `rotate(${angle}deg) translate(${CELESTIAL_ORBITS.orbit3.radius}px) rotate(-${angle}deg)`,
                  }}
                >
                  <div
                    className="orbit-counter w-0 h-0 flex items-center justify-center origin-center"
                    style={{
                      animation: `counter-spin-ccw ${CELESTIAL_ORBITS.orbit3.duration}s linear infinite`,
                      animationPlayState: selectedSkill ? 'paused' : 'running',
                    }}
                  >
                    <div
                      onMouseEnter={() => setHoveredSkill(skill)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      onClick={() => setSelectedSkill(skill)}
                      className={`group orbit-badge relative flex items-center gap-2 px-2.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-950/90 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.7)] scale-110 z-30'
                          : 'bg-[#0a0f26]/90 hover:bg-[#121a42] border-blue-500/30 hover:border-blue-400 hover:shadow-[0_0_16px_rgba(59,130,246,0.4)] hover:scale-105 z-10'
                      } backdrop-blur-md shrink-0`}
                    >
                      <BrandLogo name={skill.name} size={18} badgeVariant="glass" showGlow={isCurrent} />
                      <span className="text-xs font-mono font-medium text-white group-hover:text-blue-300 whitespace-nowrap">
                        {skill.name}
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* =================================================== */}
          {/* 5. ORBIT 4: CLOUD & DATABASES (Radius: 365px, CCW)  */}
          {/* =================================================== */}
          <div
            className="orbit-ring absolute inset-0 pointer-events-none origin-center"
            style={{
              animation: `orbit-spin-ccw ${CELESTIAL_ORBITS.orbit4.duration}s linear infinite`,
              animationPlayState: selectedSkill ? 'paused' : 'running',
            }}
          >
            {orbit4Skills.map((skill, idx) => {
              const angle = (360 / orbit4Skills.length) * idx + CELESTIAL_ORBITS.orbit4.offset;
              const isCurrent = activeInspected?.name === skill.name;

              return (
                <div
                  key={skill.id}
                  className="absolute left-1/2 top-1/2 pointer-events-auto origin-center"
                  style={{
                    transform: `rotate(${angle}deg) translate(${CELESTIAL_ORBITS.orbit4.radius}px) rotate(-${angle}deg)`,
                  }}
                >
                  <div
                    className="orbit-counter w-0 h-0 flex items-center justify-center origin-center"
                    style={{
                      animation: `counter-spin-ccw ${CELESTIAL_ORBITS.orbit4.duration}s linear infinite`,
                      animationPlayState: selectedSkill ? 'paused' : 'running',
                    }}
                  >
                    <div
                      onMouseEnter={() => setHoveredSkill(skill)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      onClick={() => setSelectedSkill(skill)}
                      className={`group orbit-badge relative flex items-center gap-2 px-2.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                        isCurrent
                          ? 'bg-emerald-950/90 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.7)] scale-110 z-30'
                          : 'bg-[#091815]/90 hover:bg-[#0f2a24] border-emerald-500/30 hover:border-emerald-400 hover:shadow-[0_0_16px_rgba(16,185,129,0.4)] hover:scale-105 z-10'
                      } backdrop-blur-md shrink-0`}
                    >
                      <BrandLogo name={skill.name} size={18} badgeVariant="glass" showGlow={isCurrent} />
                      <span className="text-xs font-mono font-medium text-white group-hover:text-emerald-300 whitespace-nowrap">
                        {skill.name}
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

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
                  size={44}
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
