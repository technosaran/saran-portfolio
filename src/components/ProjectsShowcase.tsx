'use client';

import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowUpRight,
  Copy,
  Check,
  CheckCircle2,
  Terminal,
  FolderGit2,
  X,
  Layers,
} from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { Project } from '@/lib/neon/db';
import { useToast } from './Toast';
import BrandLogo from './BrandLogo';

export function getProjectDomainTag(project: Project): string {
  const title = (project.title || '').toLowerCase();
  const desc = (project.description || '').toLowerCase();
  const stack = (project.tech_stack || []).map((t) => t.toLowerCase());

  const hasTech = (...terms: string[]) =>
    terms.some((term) => stack.some((s) => s.includes(term)) || title.includes(term) || desc.includes(term));

  if (hasTech('yolo', 'opencv', 'vision', 'detection', 'image', 'video')) {
    return 'Computer Vision · PyTorch';
  }
  if (hasTech('spacy', 'nlp', 'ner', 'transformer', 'bert', 'text', 'huggingface')) {
    return 'NLP · Scikit-Learn';
  }
  if (hasTech('aws', 'docker', 'cloud', 'kubernetes', 'ec2', 's3', 'infra')) {
    return 'Cloud Systems · AWS';
  }
  if (hasTech('next', 'react', 'postgres', 'drizzle', 'supabase', 'neon', 'full-stack', 'wealth')) {
    return 'Full-Stack · Next.js 16';
  }
  if (hasTech('pytorch', 'tensorflow', 'model', 'learning')) {
    return 'Deep Learning · PyTorch';
  }
  return 'Software Engineering';
}

function getDomainBadgeClasses(domainTag: string): string {
  const lower = domainTag.toLowerCase();
  if (lower.includes('vision')) {
    return 'border-sky-500/25 bg-sky-500/10 text-sky-300';
  }
  if (lower.includes('nlp')) {
    return 'border-violet-500/25 bg-violet-500/10 text-violet-300';
  }
  if (lower.includes('cloud')) {
    return 'border-indigo-500/25 bg-indigo-500/10 text-indigo-300';
  }
  if (lower.includes('full-stack')) {
    return 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300';
  }
  return 'border-[#202534] bg-[#131620] text-zinc-300';
}

interface ProjectsShowcaseProps {
  projects: Project[];
}

export default function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [inspectedProject, setInspectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!inspectedProject) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setInspectedProject(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [inspectedProject]);

  const copyCloneCommand = async (project: Project) => {
    const gitUrl = project.github_url || 'https://github.com/technosaran/arthax';
    const cmd = `git clone ${gitUrl}.git`;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(cmd);
        setCopiedId(project.id);
        toast('Clone command copied to clipboard', 'success');
        setTimeout(() => setCopiedId(null), 2000);
        return;
      }
    } catch {
      // fallback
    }
    toast('Failed to copy clone command', 'error');
  };

  // Find flagship project (arthaX or first project)
  const flagship = useMemo(() => {
    return projects.find((p) => p.title.toLowerCase().includes('arthax')) || projects[0];
  }, [projects]);

  const secondaryProjects = useMemo(() => {
    return projects.filter((p) => p.id !== flagship?.id);
  }, [projects, flagship]);

  const availableFilters = useMemo(() => {
    const filters: { id: string; label: string; count: number }[] = [
      { id: 'all', label: 'All', count: secondaryProjects.length },
    ];
    const visionCount = secondaryProjects.filter((p) =>
      getProjectDomainTag(p).toLowerCase().includes('vision')
    ).length;
    const nlpCount = secondaryProjects.filter((p) =>
      getProjectDomainTag(p).toLowerCase().includes('nlp')
    ).length;
    const webCount = secondaryProjects.filter((p) => {
      const t = getProjectDomainTag(p).toLowerCase();
      return t.includes('full-stack') || t.includes('cloud');
    }).length;

    if (visionCount > 0) filters.push({ id: 'vision', label: 'Computer Vision', count: visionCount });
    if (nlpCount > 0) filters.push({ id: 'nlp', label: 'NLP & ML', count: nlpCount });
    if (webCount > 0) filters.push({ id: 'web', label: 'Full-Stack & Cloud', count: webCount });

    return filters;
  }, [secondaryProjects]);

  const filteredSecondary = useMemo(() => {
    if (activeFilter === 'all') return secondaryProjects;
    return secondaryProjects.filter((p) => {
      const tag = getProjectDomainTag(p).toLowerCase();
      if (activeFilter === 'vision') return tag.includes('vision') || tag.includes('learning');
      if (activeFilter === 'nlp') return tag.includes('nlp');
      if (activeFilter === 'web') return tag.includes('full-stack') || tag.includes('cloud');
      return true;
    });
  }, [secondaryProjects, activeFilter]);

  if (!projects || projects.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#262b3a] bg-[#0c0e14]/50 p-8 sm:p-12 text-center space-y-3">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-[#2b3142] bg-[#141722] text-zinc-400">
          <Terminal className="h-5 w-5 text-emerald-400" />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-zinc-200">No projects published yet</h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          New engineering systems added via the admin dashboard will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Flagship Featured Project Card */}
      {flagship && (
        <div className="relative rounded-2xl border border-[#232a3e] bg-[#0f1118] card-bevel p-6 sm:p-8 hover:border-[#323c57] transition-all duration-300 shadow-xl overflow-hidden group">
          {/* Subtle gradient accent highlight */}
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-emerald-500/[0.04] blur-3xl pointer-events-none group-hover:bg-emerald-500/[0.07] transition-all"
          />

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 relative z-10">
            {/* Left Content */}
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-mono font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Flagship Production System</span>
                </span>
                {flagship.live_url && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-300 border border-[#22283a] bg-[#131620] px-2 py-0.5 rounded-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>Live Deployment</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                  {flagship.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-300 leading-relaxed font-normal">
                  {flagship.description}
                </p>
              </div>

              {/* Highlights */}
              {flagship.highlights && flagship.highlights.length > 0 && (
                <ul className="space-y-2 text-xs text-zinc-400 pt-1">
                  {flagship.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                {flagship.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#202534] bg-[#131620] px-2.5 py-1 text-xs font-mono text-zinc-300 hover:border-zinc-600 transition-colors"
                  >
                    <BrandLogo name={tech} size={14} badgeVariant="none" />
                    <span>{tech}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Right Action Box */}
            <div className="lg:w-72 shrink-0 flex flex-col gap-2.5 pt-2 lg:pt-0">
              {flagship.live_url && (
                <a
                  href={flagship.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 px-4 py-2.5 text-xs font-semibold transition-all shadow-md active:scale-[0.98]"
                >
                  <span>Launch Live Platform</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}

              {flagship.github_url && (
                <a
                  href={flagship.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#262b3a] bg-[#12151e] hover:bg-[#181c28] hover:border-zinc-500 px-4 py-2.5 text-xs font-medium text-zinc-200 transition-all"
                >
                  <GithubIcon className="h-4 w-4 text-zinc-300" />
                  <span>Inspect Source Code</span>
                </a>
              )}

              {flagship.github_url && (
                <button
                  type="button"
                  onClick={() => copyCloneCommand(flagship)}
                  className="w-full inline-flex items-center justify-between rounded-xl border border-[#1b1f2b] bg-[#0c0e14] hover:bg-[#131622] hover:border-zinc-700 px-3 py-2 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
                  title="Copy git clone command"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <FolderGit2 className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                    <span className="truncate">
                      git clone {flagship.github_url.replace('https://github.com/', '')}
                    </span>
                  </div>
                  {copiedId === flagship.id ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 ml-2" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-zinc-500 shrink-0 ml-2" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Secondary Projects Controls / Filter Pills */}
      {secondaryProjects.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <span>Engineering Systems &amp; Pipelines</span>
              <span className="text-zinc-500">({secondaryProjects.length})</span>
            </h3>

            {availableFilters.length > 2 && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                {availableFilters.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveFilter(f.id)}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      activeFilter === f.id
                        ? 'bg-zinc-800 text-white font-medium border border-[#2e3547]'
                        : 'text-zinc-400 hover:text-zinc-200 border border-transparent hover:bg-zinc-800/40'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Secondary Engineering Works Grid */}
          {filteredSecondary.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#22283a] bg-[#0c0e14]/60 p-8 text-center space-y-3">
              <p className="text-xs font-mono text-zinc-400">
                No projects match the selected filter.
              </p>
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#262b3a] bg-[#12151e] hover:bg-[#181c28] px-3 py-1.5 text-xs font-mono text-zinc-200 cursor-pointer transition-colors"
              >
                Show all systems
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSecondary.map((project) => {
                const domainTag = getProjectDomainTag(project);
                return (
                  <div
                    key={project.id}
                    className="flex flex-col justify-between rounded-xl border border-[#1f2432] bg-[#0f1118] card-bevel p-6 hover:border-[#2e364d] transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-mono ${getDomainBadgeClasses(
                            domainTag
                          )}`}
                        >
                          {domainTag}
                        </span>

                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                            aria-label={`View ${project.title} on GitHub`}
                            title="View GitHub Repository"
                          >
                            <GithubIcon className="h-4 w-4" />
                          </a>
                        )}
                      </div>

                      <div>
                        <h4 className="text-lg font-bold tracking-tight text-zinc-100">
                          {project.title}
                        </h4>
                        <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed font-normal">
                          {project.description}
                        </p>
                      </div>

                      {project.highlights && project.highlights.length > 0 && (
                        <ul className="space-y-1.5 text-xs text-zinc-300/90">
                          {project.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-400 mt-0.5 shrink-0">•</span>
                              <span className="leading-relaxed">{h}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="pt-5 mt-4 border-t border-[#1b1f2b] space-y-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {project.tech_stack.map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center gap-1.5 rounded-md border border-[#202534] bg-[#131620] px-2 py-0.5 text-[11px] font-mono text-zinc-300"
                          >
                            <BrandLogo name={tech} size={12} badgeVariant="none" />
                            <span>{tech}</span>
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between gap-2 text-xs pt-1">
                        {project.github_url ? (
                          <>
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-zinc-300 hover:text-white font-medium"
                            >
                              <span>Inspect Code</span>
                              <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
                            </a>

                            <button
                              type="button"
                              onClick={() => copyCloneCommand(project)}
                              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 cursor-pointer"
                              title="Copy git clone command"
                            >
                              {copiedId === project.id ? (
                                <>
                                  <Check className="h-3 w-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  <span>clone</span>
                                </>
                              )}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => setInspectedProject(project)}
                              className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-emerald-300 font-medium cursor-pointer transition-colors"
                            >
                              <Layers className="h-3.5 w-3.5 text-emerald-400" />
                              <span>Architecture Brief</span>
                            </button>
                            <span className="text-[11px] font-mono text-zinc-500">
                              AI &amp; ML Lab
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Architecture Brief Modal (Portaled to body above sticky navbar) */}
      {inspectedProject &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${inspectedProject.title} architecture details`}
            onClick={() => setInspectedProject(null)}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-[#262d40] bg-[#0d1018] card-bevel p-6 shadow-2xl space-y-5 max-h-[88vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-4 border-b border-[#1b1f2b] pb-4">
                <div className="space-y-1.5">
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-mono ${getDomainBadgeClasses(
                      getProjectDomainTag(inspectedProject)
                    )}`}
                  >
                    {getProjectDomainTag(inspectedProject)}
                  </span>
                  <h3 className="text-lg font-bold text-zinc-100 leading-snug">
                    {inspectedProject.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectedProject(null)}
                  aria-label="Close project details"
                  className="p-1.5 rounded-lg border border-[#222838] bg-[#131620] text-zinc-400 hover:text-white cursor-pointer transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {inspectedProject.description}
              </p>

              {inspectedProject.highlights && inspectedProject.highlights.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Key Engineering Outcomes
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {inspectedProject.highlights.map((h, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 rounded-lg border border-[#1b1f2b] bg-[#11141e] p-3"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  Technology Stack
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {inspectedProject.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[#202534] bg-[#131620] px-2.5 py-1 text-xs font-mono text-zinc-200"
                    >
                      <BrandLogo name={tech} size={13} badgeVariant="none" />
                      <span>{tech}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#1b1f2b] flex justify-end">
                <button
                  type="button"
                  onClick={() => setInspectedProject(null)}
                  className="px-4 py-2 rounded-lg border border-[#262b3a] bg-[#141824] hover:bg-[#1a2030] text-xs font-medium text-zinc-100 cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
