'use client';

import { useState } from 'react';
import { 
  ArrowUpRight, 
  Copy, 
  Check, 
  ExternalLink, 
  Code2, 
  Layers, 
  CheckCircle2,
  Terminal,
  Cpu,
  Database
} from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { Project } from '@/lib/neon/db';
import { useToast } from './Toast';
import BrandLogo from './BrandLogo';

interface ProjectsShowcaseProps {
  projects: Project[];
}

export default function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const copyCloneCommand = (project: Project) => {
    const gitUrl = project.github_url || 'https://github.com/technosaran/arthax';
    const cmd = `git clone ${gitUrl}.git`;
    try {
      navigator.clipboard.writeText(cmd);
      setCopiedId(project.id);
      toast('Clone command copied to clipboard', 'success');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast('Failed to copy clone command', 'error');
    }
  };

  // Find flagship project (arthaX or first project)
  const flagship = projects.find(p => p.title.toLowerCase().includes('arthax')) || projects[0];
  const secondaryProjects = projects.filter(p => p.id !== flagship?.id);

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
      
      {/* 1. Flagship Featured Project */}
      {flagship && (
        <div className="rounded-xl border border-[#1f2432] bg-[#0f1118] p-6 sm:p-8 hover:border-[#2d3448] transition-all duration-200">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            
            {/* Left Content */}
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-mono font-medium text-emerald-400">
                  Featured Project · Full-Stack
                </span>
                {flagship.live_url && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>Live</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
                  {flagship.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
                  {flagship.description}
                </p>
              </div>

              {/* Highlights */}
              {flagship.highlights && flagship.highlights.length > 0 && (
                <ul className="space-y-2 text-xs text-zinc-400 pt-1">
                  {flagship.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                {flagship.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#202534] bg-[#131620] px-2.5 py-1 text-xs font-mono text-zinc-300"
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
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 px-4 py-2.5 text-xs font-semibold transition-all shadow-sm active:scale-[0.98]"
                >
                  <span>Live Demo</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}

              {flagship.github_url && (
                <a
                  href={flagship.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-[#262b3a] bg-[#12151e] hover:bg-[#181c28] hover:border-zinc-500 px-4 py-2.5 text-xs font-medium text-zinc-200 transition-all"
                >
                  <GithubIcon className="h-4 w-4 text-zinc-300" />
                  <span>View Source Code</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => copyCloneCommand(flagship)}
                className="w-full inline-flex items-center justify-between rounded-lg border border-[#1b1f2b] bg-[#0c0e14] hover:bg-[#12151e] px-3 py-2 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
                title="Copy git clone command"
              >
                <span className="truncate">git clone {flagship.github_url?.replace('https://github.com/', '')}</span>
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

      {/* 2. Secondary Engineering Works Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {secondaryProjects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col justify-between rounded-xl border border-[#1f2432] bg-[#0f1118] p-6 hover:border-[#2d3448] transition-all duration-200"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-md border border-[#202534] bg-[#131620] px-2.5 py-0.5 text-[11px] font-mono text-zinc-400">
                  {project.title.toLowerCase().includes('object') ? 'Computer Vision · PyTorch' : 'NLP · Scikit-Learn'}
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
                <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {project.highlights && (
                <ul className="space-y-1.5 text-xs text-zinc-400">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-zinc-600 mt-1">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="pt-5 mt-4 border-t border-[#20222a] space-y-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {project.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 rounded border border-[#20222a] bg-[#0d0e12] px-2 py-0.5 text-[11px] font-mono text-zinc-400"
                  >
                    <BrandLogo name={tech} size={12} badgeVariant="none" />
                    <span>{tech}</span>
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-zinc-300 hover:text-white font-medium"
                  >
                    <span>Inspect Code</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => copyCloneCommand(project)}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 hover:text-zinc-300 cursor-pointer"
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
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
