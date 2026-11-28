'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Terminal,
  Briefcase,
  Layers,
  Code2,
  Award,
  Activity,
  Mail,
  Download,
  Copy,
  X,
  Lock,
  Cpu,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from './SocialIcons';
import { useToast } from './Toast';
import { useRealtimeData } from './RealtimePortfolioProvider';

type CommandCategory =
  | 'Navigation'
  | 'Systems'
  | 'Skills'
  | 'Credentials'
  | 'Actions'
  | 'Socials';

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: CommandCategory;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  badge?: string;
}

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  phone?: string;
  resumeUrl?: string;
}

export default function CommandMenu({
  isOpen,
  onClose,
  email = 'iamsaran.ai@gmail.com',
  phone = '+91 6384957740',
  resumeUrl = '/resume.pdf',
}: CommandMenuProps) {
  const router = useRouter();
  const { profile, projects, skills, experience, certificates } = useRealtimeData();
  const [query, setQuery] = useState('');
  const [rawIndex, setRawIndex] = useState(0);
  const { toast } = useToast();
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const navigateTo = useCallback(
    (hash: string) => {
      onClose();
      const el = document.getElementById(hash.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = hash;
      }
    },
    [onClose]
  );

  const copyText = useCallback(
    async (text: string, label: string) => {
      try {
        await navigator.clipboard.writeText(text);
        toast(`${label} copied to clipboard!`, 'success');
      } catch {
        toast(`Failed to copy ${label}`, 'error');
      }
      onClose();
    },
    [toast, onClose]
  );

  const items: CommandItem[] = useMemo(() => {
    const projectNavBadge = `${projects.length} ${projects.length === 1 ? 'System' : 'Systems'}`;
    const skillNavBadge = `${skills.length} Skills`;
    const certNavBadge = `${certificates.length} Certs`;

    const systemItems: CommandItem[] = projects.map((p) => ({
      id: `system-${p.id}`,
      title: p.title,
      subtitle: p.tech_stack?.slice(0, 4).join(', ') || p.description,
      category: 'Systems',
      icon: Layers,
      action: () => navigateTo('#projects'),
      badge: p.live_url ? 'Live' : 'System',
    }));

    const skillItems: CommandItem[] = skills.map((s) => ({
      id: `skill-${s.id}`,
      title: s.name,
      subtitle: `${s.category} · ${s.level || 'Proficient'}`,
      category: 'Skills',
      icon: Cpu,
      action: () => navigateTo('#skills'),
      badge: s.level || undefined,
    }));

    const experienceItems: CommandItem[] = experience.map((e) => ({
      id: `exp-${e.id}`,
      title: `${e.role} — ${e.company}`,
      subtitle: `${e.period} · ${e.location || 'Remote'}`,
      category: 'Credentials',
      icon: Briefcase,
      action: () => navigateTo('#experience'),
      badge: 'Role',
    }));

    const certItems: CommandItem[] = certificates.map((c) => ({
      id: `cert-${c.id}`,
      title: c.title,
      subtitle: `${c.provider}${c.credential_id ? ` · ${c.credential_id}` : ''}`,
      category: 'Credentials',
      icon: Award,
      action: () => navigateTo('#certifications'),
      badge: c.issue_date || 'Verified',
    }));

    return [
      // Navigation
      {
        id: 'nav-home',
        title: 'Overview & Hero',
        subtitle: 'Introduction, engineering focus & telemetry console',
        category: 'Navigation',
        icon: Terminal,
        action: () => navigateTo('#home'),
      },
      {
        id: 'nav-projects',
        title: 'Featured Projects',
        subtitle: 'arthaX Wealth Terminal, Computer Vision & NLP pipelines',
        category: 'Navigation',
        icon: Layers,
        action: () => navigateTo('#projects'),
        badge: projectNavBadge,
      },
      {
        id: 'nav-experience',
        title: 'Experience & Education',
        subtitle: 'Internships, cloud deployments & CS coursework',
        category: 'Navigation',
        icon: Briefcase,
        action: () => navigateTo('#experience'),
      },
      {
        id: 'nav-skills',
        title: 'Technical Tooling',
        subtitle: 'Interactive orbital view & recruiter skills matrix',
        category: 'Navigation',
        icon: Code2,
        action: () => navigateTo('#skills'),
        badge: skillNavBadge,
      },
      {
        id: 'nav-activity',
        title: 'Activity & Problem Solving',
        subtitle: 'GitHub commits, contribution heatmap & LeetCode solutions',
        category: 'Navigation',
        icon: Activity,
        action: () => navigateTo('#activity'),
        badge: '90+ Solved',
      },
      {
        id: 'nav-certifications',
        title: 'Certifications',
        subtitle: 'Oracle, AWS, IBM SkillsBuild, Infosys & NASSCOM',
        category: 'Navigation',
        icon: Award,
        action: () => navigateTo('#certifications'),
        badge: certNavBadge,
      },
      {
        id: 'nav-contact',
        title: 'Contact & Collaboration',
        subtitle: 'Reach out directly for engineering roles & projects',
        category: 'Navigation',
        icon: Mail,
        action: () => navigateTo('#contact'),
      },

      // Systems
      ...systemItems,

      // Credentials (Experience & Certificates)
      ...experienceItems,
      ...certItems,

      // Skills (searchable directly)
      ...skillItems,

      // Actions
      {
        id: 'action-email',
        title: 'Copy Email Address',
        subtitle: email,
        category: 'Actions',
        icon: Copy,
        action: () => copyText(email, 'Email address'),
      },
      {
        id: 'action-phone',
        title: 'Copy Phone Number',
        subtitle: phone,
        category: 'Actions',
        icon: Copy,
        action: () => copyText(phone, 'Phone number'),
      },
      {
        id: 'action-resume',
        title: 'Download Resume (PDF)',
        subtitle: 'Curriculum Vitae in PDF format',
        category: 'Actions',
        icon: Download,
        action: () => {
          onClose();
          window.open(resumeUrl, '_blank', 'noopener,noreferrer');
        },
        badge: 'PDF',
      },
      {
        id: 'action-admin',
        title: 'Admin Control Panel',
        subtitle: 'Manage profile, projects, experience, skills & certificates',
        category: 'Actions',
        icon: Lock,
        action: () => {
          onClose();
          router.push('/admin');
        },
        badge: 'Admin',
      },

      // Socials
      {
        id: 'social-github',
        title: 'GitHub Profile',
        subtitle: 'github.com/technosaran',
        category: 'Socials',
        icon: GithubIcon,
        action: () => {
          onClose();
          window.open(profile.github_url || 'https://github.com/technosaran', '_blank', 'noopener,noreferrer');
        },
      },
      {
        id: 'social-linkedin',
        title: 'LinkedIn Profile',
        subtitle: 'linkedin.com/in/saran-r-b2b1a5275',
        category: 'Socials',
        icon: LinkedinIcon,
        action: () => {
          onClose();
          window.open(
            profile.linkedin_url || 'https://linkedin.com/in/saran-r-b2b1a5275',
            '_blank',
            'noopener,noreferrer'
          );
        },
      },
      {
        id: 'social-leetcode',
        title: 'LeetCode Profile',
        subtitle: 'leetcode.com/u/Saran-R/ (90+ Solved)',
        category: 'Socials',
        icon: LeetCodeIcon,
        action: () => {
          onClose();
          window.open(profile.leetcode_url || 'https://leetcode.com/u/Saran-R/', '_blank', 'noopener,noreferrer');
        },
      },
    ];
  }, [
    projects,
    skills,
    experience,
    certificates,
    email,
    phone,
    resumeUrl,
    profile,
    navigateTo,
    copyText,
    onClose,
    router,
  ]);

  // Filter items based on query (limit unfiltered view to core items + top systems so list stays crisp; show all matches when searching)
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return items.filter((item) => item.category !== 'Skills');
    }
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
    );
  }, [items, query]);

  const selectedIndex = rawIndex >= filteredItems.length ? 0 : rawIndex;

  useEffect(() => {
    const activeBtn = itemRefs.current[selectedIndex];
    if (activeBtn) {
      activeBtn.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setRawIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setRawIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio command spotlight"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-14 sm:pt-20 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="w-full max-w-xl rounded-2xl border border-[#283044] bg-[#0d1018] card-bevel shadow-[0_24px_64px_-12px_rgba(0,0,0,0.85)] overflow-hidden max-h-[82vh] flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1b1f2b] bg-[#0a0c12] shrink-0">
          <Search className="h-4 w-4 text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setRawIndex(0);
            }}
            placeholder="Search sections, projects, skills (e.g. PyTorch), certs..."
            aria-label="Search commands, projects, skills, or actions"
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-sans min-h-[36px]"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setRawIndex(0);
              }}
              aria-label="Clear search query"
              className="text-zinc-400 hover:text-white p-1.5 rounded-md transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close command menu"
              className="inline-flex items-center gap-0.5 rounded border border-[#222838] bg-[#141722] px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 hover:text-white cursor-pointer"
            >
              ESC
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[400px] overflow-y-auto p-2 space-y-1 scroll-py-2">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-zinc-500">
              No matching commands found for &quot;{query}&quot;.
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const Icon = item.icon;
              const prevCategory = index > 0 ? filteredItems[index - 1].category : null;
              const showGroupHeader = item.category !== prevCategory;

              return (
                <React.Fragment key={item.id}>
                  {showGroupHeader && (
                    <div className="px-3 pt-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                      {item.category}
                    </div>
                  )}
                  <button
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    type="button"
                    onClick={item.action}
                    onMouseEnter={() => setRawIndex(index)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#181d2b] text-white' : 'text-zinc-300 hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors shrink-0 ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                            : 'bg-[#131620] border-[#202534] text-zinc-400'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-zinc-100 truncate">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.subtitle && (
                          <p className="text-[11px] text-zinc-400 truncate font-mono mt-0.5">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected && (
                        <kbd className="hidden sm:inline-flex rounded bg-zinc-700 px-1.5 py-0.5 text-[10px] font-mono text-zinc-200">
                          ↵
                        </kbd>
                      )}
                    </div>
                  </button>
                </React.Fragment>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#1b1f2b] bg-[#0a0c12] text-[11px] font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-[#222838] bg-[#141722] px-1.5 py-0.5 text-[10px]">↑</kbd>
              <kbd className="rounded border border-[#222838] bg-[#141722] px-1.5 py-0.5 text-[10px]">↓</kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-[#222838] bg-[#141722] px-1.5 py-0.5 text-[10px]">↵</kbd>
              <span>select</span>
            </span>
          </div>
          <span className="text-zinc-500">Type any skill, project, or cert</span>
        </div>
      </div>
    </div>
  );
}
