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
    { label: 'Activity', href: '#activity', id: 'activity' },
    { label: 'Certifications', href: '#certifications', id: 'certifications' },
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
    <header className="sticky top-2 sm:top-3 z-50 w-full px-3 sm:px-6 transition-all duration-200">
      <div 
        className={`mx-auto max-w-6xl rounded-xl border transition-all duration-200 ${
          scrolled 
            ? 'border-[#262b3a] bg-[#0c0e14]/90 shadow-xl backdrop-blur-md' 
            : 'border-[#1b1f2b] bg-[#0a0c12]/80 backdrop-blur-sm'
        }`}
      >
        <div className="flex items-center justify-between px-3.5 py-2.5 sm:px-4 sm:py-2.5">
          
          {/* Brand */}
          <a href="#home" className="flex items-center gap-2.5 group">
            <span className="font-semibold text-zinc-100 text-xs sm:text-sm tracking-tight font-sans group-hover:text-white transition-colors">
              {fullName}
            </span>
            <span className="relative flex h-1.5 w-1.5" title="Available for engineering roles">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
            </span>
          </a>

          {/* Desktop Navigation with Scroll Spy */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-zinc-400">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg transition-all duration-150 ${
                    isActive
                      ? 'text-zinc-100 bg-zinc-800/80 font-medium'
                      : 'hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Action CTA & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#2b3142] bg-[#141722] hover:bg-[#1a1f2c] hover:border-zinc-500 px-3.5 py-1.5 text-xs font-medium text-zinc-200 transition-all active:scale-[0.98]"
            >
              <Mail className="h-3 w-3 text-zinc-300" />
              <span>Contact</span>
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-zinc-400 hover:text-white p-2 min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer rounded-lg hover:bg-zinc-800/50 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#1b1f2b] px-3.5 py-3 space-y-2 bg-[#0c0e14] rounded-b-xl max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain">
            <div className="grid grid-cols-2 gap-1.5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`min-h-[38px] flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    activeSection === link.id
                      ? 'text-zinc-100 bg-zinc-800/80 font-medium'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/30'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-2 border-t border-[#1b1f2b]">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#2b3142] bg-[#141722] px-3.5 py-2 min-h-[38px] text-xs font-medium text-zinc-200 active:scale-95 transition-transform"
              >
                <Mail className="h-3.5 w-3.5 text-zinc-300" />
                <span>Contact</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
