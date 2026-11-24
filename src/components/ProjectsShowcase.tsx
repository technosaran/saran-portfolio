'use client';

import { useState, useMemo } from 'react';
import { 
  ArrowUpRight, 
  Copy, 
  Check, 
  CheckCircle2,
  Terminal,
  FolderGit2
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

interface ProjectsShowcaseProps {
  projects: Project[];
}

export default function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const copyCloneCommand = (project: Project) => {
    const gitUrl = project.github_url || 'https://github.com/technosaran/arthax';
    const cmd = `git clone ${gitUrl}.git`;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(cmd);
        setCopiedId(project.id);
        toast('Clone command copied to clipboard', 'success');
        setTimeout(() => setCopiedId(null), 2000);
      }
    } catch {
      toast('Failed to copy clone command', 'error');
    }
  };

  // Find flagship project (arthaX or first project)
  const flagship = useMemo(() => {
    return projects.find((p) => p.title.toLowerCase().includes('arthax')) || projects[0];
  }, [projects]);

  const secondaryProjects = useMemo(() => {
    return projects.filter((p) => p.id !== flagship?.id);
  }, [projects, flagship]);

  const filteredSecondary = useMemo(() => {
    if (activeFilter === 'all') return secondaryProjects;
    return secondaryProjects.filter((p) => {
      const tag = getProjectDomainTag(p).toLowerCase();
      if (activeFilter === 'ai') return tag.includes('vision') || tag.includes('learning') || tag.includes('nlp');
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
        <h3 className="text-sm sm:text-base font-semibold text-zinc-200">
          No projects in database
        </h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Database was cleared. All newly added projects from the admin panel or database will stream here in real time without refreshing.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* 1. Flagship Featured Project Card */}
      {flagship && (
        <div className="relative rounded-2xl border border-[#22283a] bg-[#0f1118] p-6 sm:p-8 hover:border-[#2f374e] transition-all duration-300 shadow-xl overflow-hidden group">
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
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 border border-[#22283a] bg-[#131620] px-2 py-0.5 rounded-md">
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
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-900 px-4 py-2.5 text-xs font-semibold transition-all shadow-md active:scale-[0.98]"
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

              <button
                type="button"
                onClick={() => copyCloneCommand(flagship)}
                className="w-full inline-flex items-center justify-between rounded-xl border border-[#1b1f2b] bg-[#0c0e14] hover:bg-[#131622] hover:border-zinc-700 px-3 py-2 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
                title="Copy git clone command"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <FolderGit2 className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate">git clone {flagship.github_url?.replace('https://github.com/', '') || 'technosaran/arthax'}</span>
                </div>
                {copiedId === flagship.id ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 ml-2" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-zinc-500 shrink-0 ml-2" />
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Secondary Projects Controls / Filter Pills */}
      {secondaryProjects.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <span>Engineering Systems &amp; Pipelines</span>
              <span className="text-zinc-600">({secondaryProjects.length})</span>
            </h3>

            <div className="flex items-center gap-1.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-zinc-800 text-white font-medium'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('ai')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeFilter === 'ai'
                    ? 'bg-zinc-800 text-white font-medium'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                AI &amp; Vision
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('web')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeFilter === 'web'
                    ? 'bg-zinc-800 text-white font-medium'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Full-Stack
              </button>
            </div>
          </div>

          {/* 2. Secondary Engineering Works Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSecondary.map((project) => {
              const domainTag = getProjectDomainTag(project);
              return (
                <div
                  key={project.id}
                  className="flex flex-col justify-between rounded-xl border border-[#1f2432] bg-[#0f1118] p-6 hover:border-[#2d3448] transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-md border border-[#202534] bg-[#131620] px-2.5 py-0.5 text-[11px] font-mono text-zinc-300">
                        {domainTag}
                      </span>
                      
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-zinc-400 hover:text-white transition-colors"
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

                    {project.highlights && (
                      <ul className="space-y-1.5 text-xs text-zinc-400">
                        {project.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-500 mt-1">•</span>
                            <span>{h}</span>
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
                          className="inline-flex items-center gap-1.5 rounded-md border border-[#202534] bg-[#131620] px-2 py-0.5 text-[11px] font-mono text-zinc-400"
                        >
                          <BrandLogo name={tech} size={12} badgeVariant="none" />
                          <span>{tech}</span>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
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
                            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 hover:text-zinc-300 cursor-pointer"
                            title="Copy git clone"
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
                        <div className="flex items-center justify-between w-full text-[11px] font-mono text-zinc-500">
                          <span className="inline-flex items-center gap-1 text-zinc-400">
                            <span>Deep Learning Workload</span>
                          </span>
                          <span className="text-zinc-600">Panimalar AI &amp; ML</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
