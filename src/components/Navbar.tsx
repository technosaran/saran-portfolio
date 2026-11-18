'use client';

import { useState, useEffect } from 'react';
import { Mail, Menu, X } from 'lucide-react';
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

  // Listen for Cmd+K / Ctrl+K keyboard shortcut and Escape to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenCommandMenu?.();
      } else if (e.key === 'Escape') {
        setMobileMenuOpen(false);
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

  const fullName = profile?.full_name || 'SARAN R';

  return (
    <header className="sticky top-2 sm:top-3.5 z-50 w-full px-3 sm:px-6 transition-all duration-300">
      <div 
        className={`mx-auto max-w-6xl rounded-2xl border transition-all duration-300 ${
          scrolled 
            ? 'border-white/[0.12] bg-[#050609]/90 shadow-[0_12px_45px_rgba(0,0,0,0.75)] backdrop-blur-2xl' 
            : 'border-white/[0.08] bg-[#080a12]/75 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl'
        } card-shine`}
      >
        <div className="flex items-center justify-between px-4 py-2.5 sm:px-5 sm:py-2.5">
          
          {/* Brand */}
          <a href="#home" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/25 via-cyan-500/15 to-purple-600/15 text-cyan-300 border border-indigo-500/40 group-hover:border-cyan-400/80 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.45)] transition-all duration-300">
              <span className="font-mono font-black text-xs tracking-tighter text-cyan-300 group-hover:text-white transition-colors">
                &lt;S/&gt;
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs sm:text-sm tracking-tight font-sans group-hover:text-cyan-300 transition-colors">
                {fullName}
              </span>
              <span className="relative flex h-1.5 w-1.5" title="Available for opportunities">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
              </span>
            </div>
          </a>

          {/* Desktop Navigation with Scroll Spy */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-400">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`relative px-3 py-1.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-white/[0.08] shadow-inner font-semibold'
                      : 'hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400 shadow-[0_0_10px_rgba(99,102,241,0.9)]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action CTA & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-white via-slate-100 to-slate-200 hover:from-slate-100 hover:to-white px-3.5 py-1.5 text-xs font-bold text-slate-950 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.35)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Mail className="h-3 w-3 text-slate-950" />
              <span>Contact</span>
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-zinc-400 hover:text-white p-2 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer rounded-xl hover:bg-white/[0.06] transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/[0.08] px-4 sm:px-5 py-4 space-y-3 bg-[#08090f]/95 rounded-b-2xl backdrop-blur-2xl max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain">
            <div className="grid grid-cols-2 gap-1.5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`min-h-[42px] flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    activeSection === link.id
                      ? 'text-white bg-indigo-500/15 border border-indigo-500/30 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-2 border-t border-white/[0.08]">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-white via-slate-100 to-slate-200 px-4 py-2.5 min-h-[40px] text-xs font-bold text-slate-950 shadow-md active:scale-95 transition-transform"
              >
                <Mail className="h-3.5 w-3.5 text-slate-950" />
                <span>Contact</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
