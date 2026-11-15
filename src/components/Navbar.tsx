'use client';

import { useState, useEffect } from 'react';
import { Terminal, Mail, Menu, X, Download, Search, Command } from 'lucide-react';
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from './SocialIcons';
import { Profile } from '@/lib/neon/db';

interface NavbarProps {
  profile?: Profile;
  onOpenCommandMenu?: () => void;
}

export default function Navbar({ profile, onOpenCommandMenu }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { label: 'About', href: '#home', id: 'home' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Certifications', href: '#certifications', id: 'certifications' },
    { label: 'Activity', href: '#activity', id: 'activity' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  // Listen for Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenCommandMenu?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenCommandMenu]);

  // Detect scroll offset for backdrop shadow tuning
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll spy: observe which section is in view
  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.id);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          rootMargin: '-20% 0px -70% 0px',
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const githubUrl = profile?.github_url || 'https://github.com/technosaran';
  const linkedinUrl = profile?.linkedin_url || 'https://linkedin.com/in/saran-r-b2b1a5275';
  const leetcodeUrl = profile?.leetcode_url || 'https://leetcode.com/u/Saran-R/';
  const fullName = profile?.full_name || 'SARAN R';

  return (
    <header className="sticky top-2 sm:top-3.5 z-50 w-full px-3 sm:px-6 transition-all duration-300">
      <div 
        className={`mx-auto max-w-6xl rounded-2xl border transition-all duration-300 ${
          scrolled 
            ? 'border-white/[0.12] bg-[#07080c]/85 shadow-[0_12px_40px_rgba(0,0,0,0.65)] backdrop-blur-2xl' 
            : 'border-white/[0.08] bg-[#07080c]/70 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl'
        } card-shine`}
      >
        <div className="flex items-center justify-between px-4 py-2.5 sm:px-5 sm:py-2.5">
          
          {/* Brand */}
          <a href="#home" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-transparent text-blue-300 border border-blue-500/30 group-hover:border-blue-400/60 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.35)] transition-all duration-300">
              <span className="font-mono font-black text-xs tracking-tighter text-blue-400 group-hover:text-blue-300">
                &lt;S/&gt;
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs sm:text-sm tracking-tight font-sans group-hover:text-blue-300 transition-colors">
                {fullName}
              </span>
              <span className="relative flex h-1.5 w-1.5" title="Available for opportunities">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
              </span>
            </div>
          </a>

          {/* Desktop Navigation with Scroll Spy */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-zinc-400">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`relative px-3 py-1.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-white/[0.08] shadow-inner font-semibold'
                      : 'hover:text-zinc-200 hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-3.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action icons & Spotlight Trigger */}
          <div className="flex items-center gap-2">
            {/* Spotlight Command Search Trigger */}
            {onOpenCommandMenu && (
              <button
                type="button"
                onClick={onOpenCommandMenu}
                className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:border-blue-500/30 text-xs text-zinc-400 hover:text-white transition-all cursor-pointer group"
                title="Search portfolio (⌘K)"
                aria-label="Open spotlight search"
              >
                <Search className="h-3.5 w-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="hidden xl:inline text-[11px] font-sans">Quick Search</span>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-white/[0.1] bg-white/[0.05] px-1.5 py-0.2 text-[9px] font-mono text-zinc-400 group-hover:text-zinc-200">
                  <Command className="h-2.5 w-2.5" /> K
                </kbd>
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1.5">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all cursor-pointer"
                title="GitHub Profile (@technosaran)"
              >
                <GithubIcon className="h-3.5 w-3.5" />
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-blue-400 hover:border-blue-500/30 hover:bg-white/[0.08] transition-all cursor-pointer"
                title="LinkedIn Profile"
              >
                <LinkedinIcon className="h-3.5 w-3.5" />
              </a>
              <a
                href={leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-amber-400 hover:border-amber-500/30 hover:bg-white/[0.08] transition-all cursor-pointer"
                title="LeetCode (90+ Java Problems)"
              >
                <LeetCodeIcon className="h-3.5 w-3.5" />
              </a>

              <div className="h-4 w-px bg-white/[0.08] mx-0.5" />

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:border-blue-500/30 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer"
                title="Download Resume (PDF)"
              >
                <Download className="h-3 w-3 text-blue-400" />
                <span>CV</span>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white hover:bg-zinc-200 px-3.5 py-1.5 text-xs font-bold text-zinc-950 transition-all shadow-md shadow-white/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Mail className="h-3 w-3 text-zinc-950" />
                <span>Contact</span>
              </a>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-zinc-400 hover:text-white p-1.5 cursor-pointer rounded-xl hover:bg-white/[0.06] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/[0.08] px-5 py-4 space-y-3 bg-[#08090f]/95 rounded-b-2xl backdrop-blur-2xl">
            {onOpenCommandMenu && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCommandMenu();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono bg-blue-500/10 border border-blue-500/25 text-blue-300 hover:bg-blue-500/20 transition-all text-left"
              >
                <span className="flex items-center gap-2">
                  <Search className="h-3.5 w-3.5" />
                  <span>Spotlight Search...</span>
                </span>
                <span className="text-[10px] bg-blue-500/20 px-1.5 py-0.5 rounded">⌘K</span>
              </button>
            )}

            <div className="grid grid-cols-2 gap-1.5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    activeSection === link.id
                      ? 'text-white bg-blue-500/15 border border-blue-500/30 font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
              <div className="flex items-center gap-2">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-300 hover:text-white"
                  title="GitHub"
                >
                  <GithubIcon className="h-3.5 w-3.5" />
                </a>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-300 hover:text-white"
                  title="LinkedIn"
                >
                  <LinkedinIcon className="h-3.5 w-3.5" />
                </a>
                <a
                  href={leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400"
                  title="LeetCode"
                >
                  <LeetCodeIcon className="h-3.5 w-3.5" />
                </a>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400"
                  title="Resume PDF"
                >
                  <Download className="h-3.5 w-3.5" />
                </a>
              </div>

              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-zinc-950 shadow-md"
              >
                <Mail className="h-3 w-3" />
                <span>Contact</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
