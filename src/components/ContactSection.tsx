'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Download, 
  Send, 
  Copy, 
  Check, 
  MessageSquare,
  Sparkles,
  Zap,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from './SocialIcons';
import { Profile } from '@/lib/neon/db';
import { useToast } from './Toast';

interface ContactSectionProps {
  profile: Profile;
}

const TEMPLATES = [
  {
    label: 'Recruiter / SDE Opportunity',
    subject: 'Interview Invitation / Engineering Opportunity',
    message: "Hi Saran, we reviewed your work on arthaX and your computer vision inference pipelines. We have an engineering opening and would love to schedule a preliminary conversation."
  },
  {
    label: 'AI/ML Engineering Role',
    subject: 'AI/ML Role Inquiry (PyTorch & Systems)',
    message: "Hi Saran, your hands-on experience with PyTorch and NLP sequence tagging aligns with our AI initiatives. Are you available for a brief discussion regarding upcoming 2026/2027 openings?"
  },
  {
    label: 'Technical Discussion',
    subject: 'Technical Inquiry / Collaboration',
    message: "Hi Saran, I came across your portfolio and was impressed by your architectural breakdown of Neon PostgreSQL and Supabase RLS. Would love to connect and exchange thoughts."
  }
];

export default function ContactSection({ profile }: ContactSectionProps) {
  const { toast } = useToast();
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Form State
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [roleType, setRoleType] = useState('Full-Time Software Engineer (2026/2027)');
  const [message, setMessage] = useState('');
  const [isCopiedMessage, setIsCopiedMessage] = useState(false);

  // Card mouse movement for spotlight
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const copyDetail = (text: string, type: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedType(type);
      toast(`${type} copied to clipboard!`, 'success');
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      toast(`Failed to copy ${type}`, 'error');
    }
  };

  const applyTemplate = (tpl: typeof TEMPLATES[0]) => {
    setMessage(tpl.message);
    setRoleType(tpl.subject);
    toast(`Template applied: "${tpl.label}"`, 'info');
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast('Please write a short message before sending', 'error');
      return;
    }

    const subject = encodeURIComponent(`[Inquiry: ${roleType}] from ${senderName || 'Recruiter/Engineer'}`);
    const body = encodeURIComponent(
      `Hello Saran,\n\n${message}\n\nBest regards,\n${senderName || 'Prospective Collaborator'}\nContact: ${senderEmail || 'N/A'}`
    );

    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    toast('Opening default mail client...', 'info');
  };

  const handleCopyMessage = () => {
    if (!message.trim()) {
      toast('Please write a short message first', 'error');
      return;
    }

    const formatted = `To: ${profile.email}\nSubject: [Inquiry: ${roleType}] from ${senderName || 'Recruiter'}\n\n${message}\n\nFrom: ${senderName} (${senderEmail})`;
    try {
      navigator.clipboard.writeText(formatted);
      setIsCopiedMessage(true);
      toast('Formatted email draft copied to clipboard!', 'success');
      setTimeout(() => setIsCopiedMessage(false), 2500);
    } catch {
      toast('Failed to copy draft', 'error');
    }
  };

  return (
    <div className="relative">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 relative">
        
        {/* Section Heading */}
        <div className="text-center space-y-2.5 max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3.5 py-1 text-xs font-mono font-medium text-blue-300 backdrop-blur-md">
            <Mail className="h-3.5 w-3.5" />
            <span>Get in Touch</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Let&apos;s Connect
          </h2>
          
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
            I am open to software engineering, full-stack, and AI/ML opportunities. Feel free to reach out directly or send a message below.
          </p>

          <div className="inline-flex items-center gap-2 pt-1 text-[11px] font-mono text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Open to opportunities · Chennai, India (IST / UTC+5:30)</span>
          </div>
        </div>

        {/* 2-Column Grid: Left Contact Info Cards & Right Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Info Cards & Quick Copy (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Email Card */}
            <div 
              onMouseMove={handleCardMouseMove}
              className="rounded-2xl border border-white/[0.08] bg-[#0c0d15]/85 p-5 backdrop-blur-xl card-shine hover:border-blue-500/30 transition-all card-spotlight"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-zinc-400">Direct Email</div>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => copyDetail(profile.email, 'Email address')}
                  className="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                  title="Copy email"
                >
                  {copiedType === 'Email address' ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Phone Card */}
            <div 
              onMouseMove={handleCardMouseMove}
              className="rounded-2xl border border-white/[0.08] bg-[#0c0d15]/85 p-5 backdrop-blur-xl card-shine hover:border-blue-500/30 transition-all card-spotlight"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-zinc-400">Direct Phone</div>
                    <a
                      href={`tel:${profile.phone}`}
                      className="text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                    >
                      {profile.phone}
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => copyDetail(profile.phone, 'Phone number')}
                  className="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                  title="Copy phone"
                >
                  {copiedType === 'Phone number' ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Location Card */}
            <div 
              onMouseMove={handleCardMouseMove}
              className="rounded-2xl border border-white/[0.08] bg-[#0c0d15]/85 p-5 backdrop-blur-xl card-shine hover:border-blue-500/30 transition-all card-spotlight"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-zinc-400">Location Base</div>
                    <div className="text-sm font-semibold text-white">
                      {profile.location} (India)
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-zinc-500 pt-1">
                  IST (UTC+5:30)
                </span>
              </div>
            </div>

            {/* Quick Action Pills */}
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2.5 text-xs font-semibold text-blue-300 transition-all"
              >
                <Download className="h-3.5 w-3.5 text-blue-400" />
                <span>Resume PDF</span>
              </a>

              <a
                href={profile.linkedin_url || 'https://linkedin.com/in/saran-r-b2b1a5275'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] px-4 py-2.5 text-xs font-semibold text-white transition-all"
                title="LinkedIn"
              >
                <LinkedinIcon className="h-3.5 w-3.5" />
              </a>

              <a
                href={profile.github_url || 'https://github.com/technosaran'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] px-4 py-2.5 text-xs font-semibold text-white transition-all"
                title="GitHub"
              >
                <GithubIcon className="h-3.5 w-3.5" />
              </a>

              <a
                href={profile.leetcode_url || 'https://leetcode.com/u/Saran-R/'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 px-4 py-2.5 text-xs font-semibold text-amber-300 transition-all"
                title="LeetCode"
              >
                <LeetCodeIcon className="h-3.5 w-3.5" />
              </a>
            </div>

          </div>

          {/* Right Column: Direct Interactive Note / Draft Form (7 cols) */}
          <div className="lg:col-span-7">
            <div 
              onMouseMove={handleCardMouseMove}
              className="rounded-3xl border border-white/[0.1] bg-[#0c0d15]/90 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl card-shine card-spotlight"
            >
              
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <MessageSquare className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Quick Message Composer</h3>
                </div>
                <span className="text-[11px] font-mono text-zinc-500">Fast Connect</span>
              </div>

              {/* Quick Template Chips */}
              <div className="mb-4">
                <span className="text-[10px] font-mono text-zinc-500 block mb-1.5">Quick Starters:</span>
                <div className="flex flex-wrap gap-1.5">
                  {TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.label}
                      type="button"
                      onClick={() => applyTemplate(tpl)}
                      className="text-[10px] font-mono px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:text-white hover:border-blue-500/40 transition-colors cursor-pointer"
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSendEmail} className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 text-[11px] mb-1">Your Name</label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Alex Mercer"
                      className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.02] text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 font-sans text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-[11px] mb-1">Your Email</label>
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.02] text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 font-sans text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 text-[11px] mb-1">Inquiry / Role Focus</label>
                  <select
                    value={roleType}
                    onChange={(e) => setRoleType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-[#080910] text-zinc-200 focus:outline-none focus:border-blue-500/50 font-sans text-xs cursor-pointer"
                  >
                    <option value="Full-Time Software Engineer">Full-Time Software Engineer (2026/2027)</option>
                    <option value="AI / Machine Learning Engineer">AI / Machine Learning Engineer</option>
                    <option value="Full-Stack Cloud Developer">Full-Stack Cloud Developer (AWS / Next.js)</option>
                    <option value="Summer / Fall 2026 Internship">Summer / Fall 2026 Internship</option>
                    <option value="Project Collaboration / Open-Source">Project Collaboration / Open-Source</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 text-[11px] mb-1">Message</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hi Saran, I came across your portfolio and would love to connect regarding..."
                    className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.02] text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 font-sans text-xs resize-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-zinc-200 px-5 py-3 text-xs font-bold text-zinc-950 transition-all shadow-md shadow-white/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5 text-zinc-950" />
                    <span>Send via Email Client</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] hover:border-blue-500/40 px-4 py-3 text-xs font-semibold text-zinc-200 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    title="Copy formatted email text"
                  >
                    {isCopiedMessage ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-zinc-400" />
                        <span>Copy Draft</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
