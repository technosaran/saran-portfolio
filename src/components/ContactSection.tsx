'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Copy, Check, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';
import { Profile } from '@/lib/neon/db';
import { useToast } from './Toast';

interface ContactSectionProps {
  profile: Profile;
}

const TOPICS = [
  'Full-Time Engineering (2026/2027)',
  'AI/ML Internship',
  'Technical Collaboration',
  'General Inquiry',
];

export default function ContactSection({ profile }: ContactSectionProps) {
  const { toast } = useToast();
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [copiedMsg, setCopiedMsg] = useState(false);

  // Form State
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState('');

  const copyDetail = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      toast(`${type} copied to clipboard!`, 'success');
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      toast(`Failed to copy ${type}`, 'error');
    }
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast('Please write a message before sending', 'error');
      return;
    }

    const subject = encodeURIComponent(`[${topic}] from ${senderName || 'Recruiter/Engineer'}`);
    const body = encodeURIComponent(
      `Hello Saran,\n\n${message}\n\nFrom: ${senderName || 'Anonymous'}\nContact: ${senderEmail || 'N/A'}`
    );

    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    toast('Opening email client...', 'info');
  };

  const handleCopyMessage = async () => {
    if (!message.trim()) {
      toast('Please write a message first', 'error');
      return;
    }

    const fullText = `To: ${profile.email}\nSubject: [${topic}] from ${
      senderName || 'Recruiter/Engineer'
    }\n\nHello Saran,\n\n${message}\n\nFrom: ${senderName || 'Anonymous'}\nContact: ${
      senderEmail || 'N/A'
    }`;

    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedMsg(true);
      toast('Message drafted & copied to clipboard!', 'success');
      setTimeout(() => setCopiedMsg(false), 2000);
    } catch {
      toast('Failed to copy message', 'error');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Direct Channels & Info (5 cols) */}
      <div className="lg:col-span-5 space-y-5">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-zinc-100">Direct Channels</h3>
          <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">
            Actively seeking AI/ML engineering, cloud infrastructure, and full-stack roles for 2026/2027. Reach out directly or compose a message on the right.
          </p>
        </div>

        {/* Contact Details List */}
        <div className="space-y-3 text-xs font-mono">
          <div className="rounded-xl border border-[#1f2432] bg-[#0f1118] card-bevel p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-zinc-500 uppercase">Email Address</div>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-zinc-200 hover:text-emerald-300 transition-colors mt-0.5 block truncate"
                >
                  {profile.email}
                </a>
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyDetail(profile.email, 'Email')}
              aria-label="Copy email address"
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors cursor-pointer shrink-0"
              title="Copy email"
            >
              {copiedType === 'Email' ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="rounded-xl border border-[#1f2432] bg-[#0f1118] card-bevel p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Phone className="h-4 w-4 text-zinc-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-zinc-500 uppercase">Phone</div>
                <a
                  href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                  className="text-zinc-200 hover:text-white transition-colors mt-0.5 block truncate"
                >
                  {profile.phone}
                </a>
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyDetail(profile.phone, 'Phone')}
              aria-label="Copy phone number"
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors cursor-pointer shrink-0"
              title="Copy phone"
            >
              {copiedType === 'Phone' ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="rounded-xl border border-[#1f2432] bg-[#0f1118] card-bevel p-4 flex items-center gap-3">
            <MapPin className="h-4 w-4 text-zinc-400 shrink-0" />
            <div>
              <div className="text-[10px] text-zinc-500 uppercase">Location</div>
              <div className="text-zinc-200 mt-0.5">{profile.location} · IST (UTC+5:30)</div>
            </div>
          </div>
        </div>

        {/* Profiles */}
        <div className="pt-1 flex items-center gap-3">
          <a
            href={profile.github_url || 'https://github.com/technosaran'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 p-3 rounded-xl border border-[#1f2432] bg-[#0f1118] card-bevel hover:border-[#2e364d] flex items-center justify-between text-xs text-zinc-300 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <GithubIcon className="h-4 w-4 text-zinc-400" />
              <span>GitHub</span>
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
          </a>

          <a
            href={profile.linkedin_url || 'https://linkedin.com/in/saran-r-b2b1a5275'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 p-3 rounded-xl border border-[#1f2432] bg-[#0f1118] card-bevel hover:border-[#2e364d] flex items-center justify-between text-xs text-zinc-300 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <LinkedinIcon className="h-4 w-4 text-zinc-400" />
              <span>LinkedIn</span>
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
          </a>
        </div>
      </div>

      {/* Right Column: Clean Direct Message Form (7 cols) */}
      <div className="lg:col-span-7">
        <form
          onSubmit={handleSendEmail}
          className="rounded-xl border border-[#1f2432] bg-[#0f1118] card-bevel p-5 sm:p-6 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="text-[11px] font-mono text-zinc-400 block">
                Your Name
              </label>
              <input
                id="contact-name"
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full rounded-lg border border-[#1b1f2b] bg-[#12151e] px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="text-[11px] font-mono text-zinc-400 block">
                Your Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="jane@company.com"
                className="w-full rounded-lg border border-[#1b1f2b] bg-[#12151e] px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-topic" className="text-[11px] font-mono text-zinc-400 block">
              Subject / Topic
            </label>
            <select
              id="contact-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-lg border border-[#1b1f2b] bg-[#12151e] px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/60 cursor-pointer"
            >
              {TOPICS.map((t) => (
                <option key={t} value={t} className="bg-zinc-900 text-zinc-200">
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-message" className="text-[11px] font-mono text-zinc-400 block">
              Message <span className="text-emerald-400">*</span>
            </label>
            <textarea
              id="contact-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi Saran, we're building..."
              className="w-full rounded-lg border border-[#1b1f2b] bg-[#12151e] px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60 resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 px-5 py-2.5 text-xs font-semibold transition-all cursor-pointer active:scale-[0.98]"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send via Email Client</span>
            </button>

            <button
              type="button"
              onClick={handleCopyMessage}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#222838] bg-[#12151e] hover:bg-[#181c28] px-4 py-2.5 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              {copiedMsg ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Message</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
