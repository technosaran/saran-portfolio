'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mail, Menu, X, Search, FileText } from 'lucide-react';
import { Profile } from '@/lib/neon/db';
import Link from 'next/link';

interface NavbarProps {
  profile?: Profile;
  onOpenCommandMenu?: () => void;
}

const NAV_LINKS = [
  { label: 'About', href: '#home', id: 'home' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Experience', href: '#experience', id: 'experience' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Activity', href: '#activity', id: 'activity' },
  { label: 'Certifications', href: '#certifications', id: 'certifications' },
  { label: 'Contact', href: '#contact', id: 'contact' },
] as const;

function formatDisplayName(name?: string): string {
  if (!name) return 'Saran R';
  if (name === 'SARAN R') return 'Saran R';
  return name;
}

export default function Navbar({ profile, onOpenCommandMenu }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  // Lock body scroll when mobile menu is open
  const toggleMobileMenu = useCallback((open: boolean) => {
    setMobileMenuOpen(open);
    if (open) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, []);

  // Clean up body lock on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, []);

  // Listen for Cmd+K / Ctrl+K keyboard shortcut and Escape to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleMobileMenu(false);
        onOpenCommandMenu?.();
      } else if (e.key === 'Escape') {
        toggleMobileMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenCommandMenu]);

  // Detect scroll offset and top/bottom edge active section fallback
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);

      if (y < 80) {
        setActiveSection('home');
        return;
      }

      const docHeight = document.documentElement.scrollHeight;
      if (window.innerHeight + y >= docHeight - 80) {
        setActiveSection('contact');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll spy: observe which section is in view
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          rootMargin: '-22% 0px -68% 0px',
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const displayName = formatDisplayName(profile?.full_name);

  return (
    <header className="sticky top-2 sm:top-3 z-50 w-full px-3 sm:px-6 transition-all duration-200">
      <div
        className={`mx-auto max-w-6xl rounded-2xl border transition-all duration-300 card-bevel ${
          scrolled
            ? 'border-[#272f44] bg-[#090b12]/90 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.75)] backdrop-blur-xl'
            : 'border-[#1b202e] bg-[#0a0c13]/80 backdrop-blur-md'
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-2.5">
          {/* Brand Identity — Logo links to homepage */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="Go to homepage">
            <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-sky-500/10 text-[11px] font-mono font-bold text-emerald-400 group-hover:border-emerald-400/60 group-hover:shadow-[0_0_16px_rgba(16,185,129,0.25)] transition-all">
              SR
            </span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-100 text-xs sm:text-sm tracking-tight font-sans group-hover:text-white transition-colors">
                {displayName}
              </span>
              <span
                className="relative flex h-1.5 w-1.5"
                title="Available for 2026/2027 engineering roles"
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
            </div>
          </Link>

          {/* Desktop Navigation with Scroll Spy */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-0.5 rounded-xl border border-[#1a1f2d] bg-[#0c0e15]/80 p-1 text-xs font-medium text-zinc-400"
          >
            {NAV_LINKS.filter((l) => l.id !== 'contact').map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'text-white bg-[#171c28] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]'
                      : 'hover:text-zinc-200 hover:bg-zinc-800/35'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Actions & Mobile Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {onOpenCommandMenu && (
              <button
                type="button"
                onClick={onOpenCommandMenu}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#22283a] bg-[#10131d] hover:bg-[#161a27] hover:border-zinc-600 px-2.5 py-1.5 min-h-[34px] text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
                aria-label="Open command search (Cmd+K)"
                title="Search portfolio (⌘K)"
              >
                <Search className="h-3.5 w-3.5 text-zinc-400" />
                <span className="hidden sm:inline text-[11px] text-zinc-400">Search</span>
                <kbd className="hidden md:inline-flex text-[10px] text-zinc-400 bg-zinc-800/90 border border-zinc-700/60 px-1.5 py-0.5 leading-none rounded font-mono">
                  ⌘K
                </kbd>
              </button>
            )}

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:inline-flex items-center gap-1.5 rounded-xl border border-[#22283a] bg-[#10131d] hover:bg-[#161a27] hover:border-zinc-600 px-2.5 py-1.5 min-h-[34px] text-xs font-medium text-zinc-300 hover:text-white transition-all whitespace-nowrap"
              title="Open Resume PDF"
            >
              <FileText className="h-3.5 w-3.5 text-sky-400" />
              <span>Resume</span>
            </a>

            <a
              href="#contact"
              aria-current={activeSection === 'contact' ? 'page' : undefined}
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 min-h-[34px] text-xs font-semibold transition-all active:scale-[0.98] whitespace-nowrap ${
                activeSection === 'contact'
                  ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.18)]'
                  : 'border-emerald-500/25 bg-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-400/45 text-emerald-300'
              }`}
            >
              <Mail className="h-3.5 w-3.5 text-emerald-400" />
              <span>Hire / Contact</span>
            </a>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => toggleMobileMenu(!mobileMenuOpen)}
              className="lg:hidden text-zinc-300 hover:text-white p-2 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer rounded-xl border border-[#1f2432] bg-[#10131d] hover:border-zinc-600 transition-colors"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown with backdrop */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay to dismiss menu on tap outside */}
            <div
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => toggleMobileMenu(false)}
              aria-hidden="true"
            />
            <div
              id="mobile-nav-drawer"
              className="lg:hidden relative z-50 border-t border-[#1b1f2b] px-3.5 py-3 space-y-3 bg-[#0b0d14] rounded-b-2xl max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain"
            >
              <div className="grid grid-cols-2 gap-1.5">
                {NAV_LINKS.filter((l) => l.id !== 'contact').map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={() => toggleMobileMenu(false)}
                    className={`min-h-[44px] flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      activeSection === link.id
                        ? 'text-white bg-[#171c28] border border-[#2a3144]'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/30'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="pt-2.5 border-t border-[#1b1f2b] grid grid-cols-2 gap-2">
                {onOpenCommandMenu && (
                  <button
                    type="button"
                    onClick={() => {
                      toggleMobileMenu(false);
                      onOpenCommandMenu();
                    }}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#222838] bg-[#11141e] px-3 py-2 min-h-[44px] text-xs font-mono text-zinc-300 active:scale-95 transition-transform cursor-pointer"
                  >
                    <Search className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Search (⌘K)</span>
                  </button>
                )}
                <a
                  href="#contact"
                  onClick={() => toggleMobileMenu(false)}
                  className={`${
                    onOpenCommandMenu ? '' : 'col-span-2'
                  } inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 min-h-[44px] text-xs font-semibold text-emerald-300 active:scale-95 transition-transform`}
                >
                  <Mail className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Get in Touch</span>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
