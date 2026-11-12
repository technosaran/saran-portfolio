'use client';

import { useState } from 'react';
import { Terminal, Mail, Menu, X } from 'lucide-react';
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from './SocialIcons';
import { Profile } from '@/lib/neon/db';

interface NavbarProps {
  profile?: Profile;
}

export default function Navbar({ profile }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Overview', href: '#home' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Activity', href: '#activity' },
    { label: 'Contact', href: '#contact' },
  ];

  const githubUrl = profile?.github_url || 'https://github.com/technosaran';
  const linkedinUrl = profile?.linkedin_url || 'https://linkedin.com/in/saran-r-b2b1a5275';
  const leetcodeUrl = profile?.leetcode_url || 'https://leetcode.com/u/technosaran/';
  const fullName = profile?.full_name || 'SARAN R';
  const headline = profile?.title || 'AI/ML & Systems Engineer';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#07080c]/85 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        
        {/* Brand */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/25 group-hover:border-blue-500/50 group-hover:bg-blue-500/15 transition-all">
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm tracking-tight font-sans">{fullName}</span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
            </div>
            <p className="text-[10px] text-zinc-400 font-mono">{headline}</p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-zinc-400">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.06] transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action icons & Contact CTA */}
        <div className="hidden sm:flex items-center gap-2">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all cursor-pointer"
            title="GitHub Profile"
          >
            <GithubIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all cursor-pointer"
            title="LinkedIn Profile"
          >
            <LinkedinIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href={leetcodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-amber-400 hover:border-amber-500/30 hover:bg-white/[0.08] transition-all cursor-pointer"
            title="LeetCode Profile"
          >
            <LeetCodeIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white hover:bg-zinc-200 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 transition-all ml-1 shadow-sm"
          >
            <Mail className="h-3.5 w-3.5 text-zinc-950" />
            <span>Contact</span>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-zinc-400 hover:text-white p-2 cursor-pointer rounded-lg hover:bg-white/[0.05]"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#0c0d14]/95 backdrop-blur-2xl px-6 py-5 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-zinc-300 hover:text-blue-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
            <div className="flex items-center gap-2">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-300 hover:text-white"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-300 hover:text-white"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
              <a
                href={leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400"
              >
                <LeetCodeIcon className="h-4 w-4" />
              </a>
            </div>

            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-xs font-semibold text-zinc-950"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Get in Touch</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
