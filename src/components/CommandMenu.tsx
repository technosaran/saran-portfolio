'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Sparkles,
  Lock
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from './SocialIcons';
import { useToast } from './Toast';

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Navigation' | 'Systems' | 'Actions' | 'Socials';
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
  const [query, setQuery] = useState('');
  const [rawIndex, setRawIndex] = useState(0);
  const { toast } = useToast();

  const navigateTo = useCallback((hash: string) => {
    onClose();
    const el = document.getElementById(hash.replace('#', ''));
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = hash;
    }
  }, [onClose]);

  const copyText = useCallback((text: string, label: string) => {
    try {
      navigator.clipboard.writeText(text);
      toast(`${label} copied to clipboard!`, 'success');
    } catch {
      toast(`Failed to copy ${label}`, 'error');
    }
    onClose();
  }, [toast, onClose]);

  const items: CommandItem[] = useMemo(() => [
    // Navigation
    {
      id: 'nav-home',
      title: 'Overview & Hero',
      subtitle: 'Introduction, engineering discipline & telemetry',
      category: 'Navigation',
      icon: Terminal,
      action: () => navigateTo('#home'),
    },
    {
      id: 'nav-projects',
      title: 'Featured Systems',
      subtitle: 'arthaX Wealth Terminal, CV Stream & NLP Pipeline',
      category: 'Navigation',
      icon: Layers,
      action: () => navigateTo('#projects'),
      badge: '3 Core Systems',
    },
    {
      id: 'nav-experience',
      title: 'Work Experience & Education',
      subtitle: 'Edunet IBM SkillsBuild & CodTech Cloud Internships',
      category: 'Navigation',
      icon: Briefcase,
      action: () => navigateTo('#experience'),
    },
    {
      id: 'nav-skills',
      title: 'Skills Nucleus',
      subtitle: 'Interactive atomic orbit visualizer & tech stack matrix',
      category: 'Navigation',
      icon: Code2,
      action: () => navigateTo('#skills'),
      badge: 'E = mc²',
    },
    {
      id: 'nav-activity',
      title: 'Activity & Problem Solving',
      subtitle: 'GitHub activity & LeetCode problem solving',
      category: 'Navigation',
      icon: Activity,
      action: () => navigateTo('#activity'),
      badge: '90+ Solved',
    },
    {
      id: 'nav-certifications',
      title: 'Certifications & Honors',
      subtitle: 'Oracle, AWS, IBM SkillsBuild, Infosys & NASSCOM',
      category: 'Navigation',
      icon: Award,
      action: () => navigateTo('#certifications'),
      badge: '6 Certs',
    },
    {
      id: 'nav-contact',
      title: 'Contact & Collaboration',
      subtitle: 'Reach out directly for engineering roles and collaborations',
      category: 'Navigation',
      icon: Mail,
      action: () => navigateTo('#contact'),
    },

    // Systems
    {
      id: 'system-arthax',
      title: 'arthaX – Personal Wealth Terminal',
      subtitle: 'Next.js 16, TypeScript, Supabase RLS & PostgreSQL',
      category: 'Systems',
      icon: Layers,
      action: () => {
        navigateTo('#projects');
      },
      badge: 'Live',
    },
    {
      id: 'system-cv',
      title: 'Real-Time Object Detection System',
      subtitle: 'Computer vision video analysis with PyTorch & OpenCV',
      category: 'Systems',
      icon: Terminal,
      action: () => {
        navigateTo('#projects');
      },
      badge: 'Computer Vision',
    },
    {
      id: 'system-nlp',
      title: 'Named Entity Recognition (NER) Pipeline',
      subtitle: 'Structured information extraction with SpaCy & Scikit-Learn',
      category: 'Systems',
      icon: Code2,
      action: () => {
        navigateTo('#projects');
      },
      badge: 'NLP Pipeline',
    },

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
        window.location.href = '/admin';
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
        window.open('https://github.com/technosaran', '_blank', 'noopener,noreferrer');
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
        window.open('https://linkedin.com/in/saran-r-b2b1a5275', '_blank', 'noopener,noreferrer');
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
        window.open('https://leetcode.com/u/Saran-R/', '_blank', 'noopener,noreferrer');
      },
    },
  ], [navigateTo, copyText, email, phone, resumeUrl, onClose]);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
    );
  }, [items, query]);

  // Clamp selected index cleanly without setState in effect
  const selectedIndex = rawIndex >= filteredItems.length ? 0 : rawIndex;

  // Keyboard navigation
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
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      {/* Background click dismiss */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="w-full max-w-xl rounded-xl border border-[#20222a] bg-[#111216] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col m-2 sm:m-auto">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#20222a] bg-[#0d0e12] shrink-0">
          <Search className="h-4 w-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setRawIndex(0);
            }}
            placeholder="Search commands, projects, skills, or actions..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-sans min-h-[36px]"
          />
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                setRawIndex(0);
              }}
              className="text-zinc-500 hover:text-white p-2 rounded-md transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-[#20222a] bg-[#14151b] px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[340px] sm:max-h-[380px] overflow-y-auto p-2 space-y-1 scrollbar-thin">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-zinc-500">
              No matching commands found for &quot;{query}&quot;.
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  onMouseEnter={() => setRawIndex(index)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-300 hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors shrink-0 ${
                        isSelected
                          ? 'bg-zinc-700 border-zinc-600 text-zinc-100'
                          : 'bg-[#14151b] border-[#20222a] text-zinc-400'
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
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-emerald-400 border border-zinc-700">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="text-[11px] text-zinc-400 truncate font-mono">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">
                      {item.category}
                    </span>
                    {isSelected && (
                      <kbd className="hidden sm:inline-flex rounded bg-zinc-700 px-1 py-0.5 text-[10px] font-mono text-zinc-300">
                        ↵
                      </kbd>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#20222a] bg-[#0d0e12] text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-[#20222a] bg-[#14151b] px-1 py-0.2">↑</kbd>
              <kbd className="rounded border border-[#20222a] bg-[#14151b] px-1 py-0.2">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-[#20222a] bg-[#14151b] px-1 py-0.2">↵</kbd>
              <span>to select</span>
            </span>
          </div>
          <span className="flex items-center gap-1 text-zinc-400">
            <span>Saran R Spotlight</span>
          </span>
        </div>
      </div>
    </div>
  );
}
