'use client';

import { useState } from 'react';
import { 
  ExternalLink, 
  CheckCircle2, 
  TrendingUp
} from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { Project } from '@/lib/neon/db';

interface ProjectShowcaseProps {
  projects: Project[];
}

export default function ProjectsShowcase({ projects }: ProjectShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'fullstack' | 'vision' | 'nlp'>('all');

  // Categorize projects with MNC-tier aesthetics
  const categorized = projects.map(p => {
    const t = p.title.toLowerCase();
    let category: 'fullstack' | 'vision' | 'nlp' = 'fullstack';
    let categoryLabel = 'Enterprise & Full-Stack';
    let badgeColor = 'text-blue-400 border-blue-500/25 bg-blue-500/10';

    if (t.includes('object') || t.includes('detection') || t.includes('vision')) {
      category = 'vision';
      categoryLabel = 'Computer Vision & Deep Learning';
      badgeColor = 'text-indigo-400 border-indigo-500/25 bg-indigo-500/10';
    } else if (t.includes('entity') || t.includes('ner') || t.includes('nlp')) {
      category = 'nlp';
      categoryLabel = 'NLP & Text Analytics';
      badgeColor = 'text-sky-400 border-sky-500/25 bg-sky-500/10';
    }

    return {
      ...p,
      category,
      categoryLabel,
      badgeColor
    };
  });

  const filteredProjects = categorized.filter(p => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  return (
    <div className="space-y-10">
      
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-white text-zinc-950 font-bold shadow-md shadow-white/10'
                : 'bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
            }`}
          >
            All Systems ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('fullstack')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeCategory === 'fullstack'
                ? 'bg-white text-zinc-950 font-bold shadow-md shadow-white/10'
                : 'bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
            }`}
          >
            FinTech &amp; Systems
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('vision')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeCategory === 'vision'
                ? 'bg-white text-zinc-950 font-bold shadow-md shadow-white/10'
                : 'bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
            }`}
          >
            Computer Vision
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('nlp')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeCategory === 'nlp'
                ? 'bg-white text-zinc-950 font-bold shadow-md shadow-white/10'
                : 'bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
            }`}
          >
            NLP Analytics
          </button>
        </div>

        <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
          Showing {filteredProjects.length} of {projects.length} systems
        </span>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d15]/60 p-12 text-center backdrop-blur-xl">
          <p className="text-zinc-400 font-mono text-sm">No systems found matching this category filter.</p>
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-mono bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 transition-all cursor-pointer"
          >
            Reset filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
        {filteredProjects.map((project) => {
          const isArthaX = project.title.toLowerCase().includes('arthax');
          const isVision = project.category === 'vision';
          const isNLP = project.category === 'nlp';

          return (
            <div
              key={project.id}
              className="group relative rounded-3xl border border-white/[0.08] bg-[#0c0d15]/90 p-6 sm:p-8 lg:p-9 backdrop-blur-xl hover:border-blue-500/40 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-950/20"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Column: Project Info & Actions (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  
                  {/* Category & Status Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-medium border ${project.badgeColor}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {project.categoryLabel}
                    </span>

                    {project.live_url ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-mono text-blue-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                        Live Production
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800/40 px-2.5 py-0.5 text-[11px] font-mono text-zinc-400">
                        Open-Source Core
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-blue-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-2.5 text-sm text-zinc-300 leading-relaxed font-normal">
                      {project.description}
                    </p>
                  </div>

                  {/* Engineering Highlights */}
                  <div className="space-y-2 pt-1 border-t border-white/[0.06]">
                    {project.highlights?.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300/90 leading-relaxed">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-400 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.tech_stack?.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs font-mono text-zinc-300 group-hover:border-white/20 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-3">
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-zinc-200 px-5 py-2.5 text-xs font-bold text-zinc-950 shadow-md shadow-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-zinc-950" />
                        <span>Launch App</span>
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] hover:border-blue-500/40 px-4 py-2.5 text-xs font-semibold text-zinc-200 transition-all"
                      >
                        <GithubIcon className="h-3.5 w-3.5" />
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>

                </div>

                {/* Right Column: Custom Visual App Preview Window (5 cols) */}
                <div className="lg:col-span-5">
                  <div className="rounded-2xl border border-white/[0.1] bg-[#080a10] overflow-hidden shadow-2xl">
                    
                    {/* Window Titlebar */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e111a] border-b border-white/[0.06] text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                        <div className="h-2.5 w-2.5 rounded-full bg-blue-500/80" />
                        <span className="ml-1 text-[11px] text-zinc-400">
                          {isArthaX ? 'arthax.vercel.app' : isVision ? 'cv-stream:60fps' : 'nlp-tagger.py'}
                        </span>
                      </div>
                      <span className="text-[10px] text-blue-400 font-mono">v1.0</span>
                    </div>

                    {/* Window Visual Body */}
                    <div className="p-5 font-mono text-xs space-y-4">
                      
                      {/* Visual Preview 1: arthaX Financial Dashboard */}
                      {isArthaX && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                            <div>
                              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Asset Valuation</div>
                              <div className="text-xl font-bold font-mono text-white flex items-center gap-2">
                                <span>$142,850.00</span>
                                <span className="text-xs text-blue-400 font-semibold inline-flex items-center">
                                  <TrendingUp className="h-3 w-3 mr-0.5" /> +18.4%
                                </span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 text-[10px] border border-blue-500/20">
                              Supabase RLS
                            </span>
                          </div>

                          {/* Allocation breakdown */}
                          <div className="space-y-2 text-[11px]">
                            <div className="flex justify-between text-zinc-400">
                              <span>Asset Class</span>
                              <span>Allocation</span>
                            </div>
                            <div className="space-y-1.5">
                              <div>
                                <div className="flex justify-between text-zinc-200">
                                  <span>Equities &amp; ETFs</span>
                                  <span className="text-blue-400">65%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-500 rounded-full w-[65%]" />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-zinc-200">
                                  <span>Cash &amp; Fixed Income</span>
                                  <span className="text-indigo-400">25%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                                  <div className="h-full bg-indigo-500 rounded-full w-[25%]" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-zinc-400">
                            <span>PostgreSQL + Next.js 16</span>
                            <span className="text-blue-400">Sub-30ms Query</span>
                          </div>
                        </div>
                      )}

                      {/* Visual Preview 2: Computer Vision Object Detection Viewfinder */}
                      {isVision && (
                        <div className="space-y-3.5">
                          <div className="relative h-36 rounded-xl border border-dashed border-indigo-500/30 bg-black/60 p-3 flex flex-col justify-between overflow-hidden">
                            
                            {/* Viewfinder corner crosshairs */}
                            <div className="absolute top-2 left-2 text-[9px] text-indigo-400 font-mono">
                              [REC] 1080p @ 60 FPS
                            </div>
                            <div className="absolute top-2 right-2 text-[9px] text-sky-400 font-mono">
                              LATENCY: 14.2ms
                            </div>

                            {/* Simulated Detection Bounding Boxes */}
                            <div className="my-auto grid grid-cols-2 gap-2 text-[10px]">
                              <div className="rounded border border-blue-400/80 bg-blue-500/10 p-2 text-center">
                                <div className="font-bold text-blue-300">Target 01: Person</div>
                                <div className="text-[9px] text-blue-400">Confidence: 98.6%</div>
                              </div>
                              <div className="rounded border border-indigo-400/80 bg-indigo-500/10 p-2 text-center">
                                <div className="font-bold text-indigo-300">Target 02: Vehicle</div>
                                <div className="text-[9px] text-indigo-400">Confidence: 96.2%</div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[9px] text-zinc-400 border-t border-white/[0.06] pt-1">
                              <span>PyTorch + OpenCV</span>
                              <span className="text-blue-400">Inference Active</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                            <div className="rounded-lg bg-white/[0.03] p-2 border border-white/[0.06]">
                              <div className="text-white font-bold">60 FPS</div>
                              <div className="text-zinc-500">Stream Rate</div>
                            </div>
                            <div className="rounded-lg bg-white/[0.03] p-2 border border-white/[0.06]">
                              <div className="text-blue-400 font-bold">98.4%</div>
                              <div className="text-zinc-500">mAP Score</div>
                            </div>
                            <div className="rounded-lg bg-white/[0.03] p-2 border border-white/[0.06]">
                              <div className="text-indigo-400 font-bold">CUDA</div>
                              <div className="text-zinc-500">Hardware Accel</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Visual Preview 3: Named Entity Recognition Parser */}
                      {isNLP && (
                        <div className="space-y-3.5">
                          <div className="text-[11px] text-zinc-400">
                            Sequence Tagging &amp; Token Classifier:
                          </div>

                          {/* Annotated token visualization */}
                          <div className="rounded-xl border border-white/[0.08] bg-black/60 p-3.5 space-y-2.5 text-xs font-sans leading-relaxed">
                            <p className="text-zinc-300">
                              <span className="inline-block px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono text-[11px] mr-1">
                                Saran R [PER]
                              </span>
                              engineered algorithms with
                              <span className="inline-block px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono text-[11px] mx-1">
                                IBM SkillsBuild [ORG]
                              </span>
                              in
                              <span className="inline-block px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono text-[11px] ml-1">
                                Chennai [LOC]
                              </span>
                              .
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                            <div className="rounded-lg bg-white/[0.03] p-2 border border-white/[0.06]">
                              <div className="text-blue-400 font-bold">94.8%</div>
                              <div className="text-zinc-500">Precision</div>
                            </div>
                            <div className="rounded-lg bg-white/[0.03] p-2 border border-white/[0.06]">
                              <div className="text-indigo-400 font-bold">SpaCy</div>
                              <div className="text-zinc-500">Pipeline</div>
                            </div>
                            <div className="rounded-lg bg-white/[0.03] p-2 border border-white/[0.06]">
                              <div className="text-sky-400 font-bold">Bi-LSTM</div>
                              <div className="text-zinc-500">Architecture</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Visual Preview 4: Dynamic Database Project Architecture */}
                      {!isArthaX && !isVision && !isNLP && (
                        <div className="space-y-3.5">
                          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-[11px] text-zinc-400">
                            <span>System Architecture</span>
                            <span className="text-blue-400 font-mono">Status: Verified</span>
                          </div>

                          <div className="rounded-xl border border-white/[0.08] bg-black/60 p-3.5 space-y-2 text-xs">
                            <div className="text-[10px] uppercase font-mono text-zinc-500">Core Technologies</div>
                            <div className="flex flex-wrap gap-1.5">
                              {project.tech_stack?.map((t) => (
                                <span key={t} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px]">
                                  {t}
                                </span>
                              ))}
                            </div>
                            <div className="pt-2 border-t border-white/[0.06] text-[11px] text-zinc-300">
                              {project.highlights?.[0] || project.description}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono">
                            <div className="rounded-lg bg-white/[0.03] p-2 border border-white/[0.06]">
                              <div className="text-white font-bold">PostgreSQL</div>
                              <div className="text-zinc-500">Database Engine</div>
                            </div>
                            <div className="rounded-lg bg-white/[0.03] p-2 border border-white/[0.06]">
                              <div className="text-blue-400 font-bold">Production</div>
                              <div className="text-zinc-500">Deployment State</div>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                  </div>
                </div>

              </div>
            </div>
          );
        })}
        </div>
      )}

    </div>
  );
}
