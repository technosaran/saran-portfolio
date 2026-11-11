'use client';

import { useState } from 'react';
import { Terminal, Mail, Menu, X, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.07] bg-[#09090b]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/15 transition-all shadow-sm">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-tight font-sans">SARAN R</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">AI/ML & Cloud Engineer</p>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-zinc-400">
          <a href="#projects" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/[0.06] transition-all">Projects</a>
          <a href="#experience" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/[0.06] transition-all">Experience</a>
          <a href="#skills" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/[0.06] transition-all">Skills</a>
          <a href="#certifications" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/[0.06] transition-all">Certifications</a>
          <a href="#neon-stack" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Neon Stack
          </a>
          <a href="#connect" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/[0.06] transition-all">Guestbook</a>
        </nav>

        {/* Action icons */}
        <div className="hidden sm:flex items-center gap-2.5">
          <a
            href="https://github.com/technosaran"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all"
            title="GitHub Profile"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <a
            href="https://linkedin.com/in/saran-r-b2b1a5275"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all"
            title="LinkedIn Profile"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>
          <a
            href="mailto:iamsaran.ai@gmail.com"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 px-3.5 py-2 text-xs font-semibold text-black shadow-md shadow-emerald-500/20 transition-all ml-1"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Contact</span>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-zinc-400 hover:text-white p-2"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#0c0d12] px-6 py-4 space-y-2 text-sm">
          <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-zinc-300 hover:text-emerald-400">Projects</a>
          <a href="#experience" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-zinc-300 hover:text-emerald-400">Experience</a>
          <a href="#skills" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-zinc-300 hover:text-emerald-400">Skills</a>
          <a href="#certifications" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-zinc-300 hover:text-emerald-400">Certifications</a>
          <a href="#neon-stack" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-zinc-300 hover:text-emerald-400">Neon Architecture</a>
          <a href="#connect" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-zinc-300 hover:text-emerald-400">Guestbook</a>
        </div>
      )}
    </header>
  );
}
