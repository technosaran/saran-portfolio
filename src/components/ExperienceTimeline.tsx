'use client';

import React, { useState } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Terminal, 
  Download, 
  ArrowUpRight, 
  Calendar, 
  MapPin,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { Experience, Profile } from '@/lib/neon/db';
import BrandLogo from './BrandLogo';
import { getSkillLogo } from './TechLogos';

interface ExperienceTimelineProps {
  experience: Experience[];
  profile: Profile;
  displayedCoursework: string[];
}

export default function ExperienceTimeline({
  experience,
  profile,
  displayedCoursework,
}: ExperienceTimelineProps) {
  const [expandedExpId, setExpandedExpId] = useState<number | null>(null);

  // Card mouse movement for spotlight
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-start">
      
      {/* Left: Professional Background Timeline */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs font-mono font-medium text-blue-300 backdrop-blur-md">
          <Briefcase className="h-3.5 w-3.5" />
          <span>Experience</span>
        </div>
        
        <h2 className="mt-2 text-3xl font-extrabold text-white tracking-tight">
          Work Experience
        </h2>
        
        <p className="mt-1 text-xs sm:text-sm text-zinc-400">
          Engineering internships focused on machine learning, cloud infrastructure, and software development.
        </p>

        {/* Vertical Connected Timeline */}
        <div className="mt-8 relative pl-6 sm:pl-8 border-l-2 border-blue-500/20 space-y-8">
          {experience.map((exp) => {
            const isExpanded = expandedExpId === exp.id;

            return (
              <div key={exp.id} className="relative group">
                
                {/* Timeline Node */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 flex items-center justify-center">
                  <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-[#07080c] border-2 border-blue-400"></span>
                  </span>
                </div>

                {/* Card Container */}
                <div 
                  onMouseMove={handleCardMouseMove}
                  className="rounded-2xl border border-white/[0.08] bg-[#0c0d15]/85 p-5 md:p-6 backdrop-blur-2xl hover:border-blue-500/40 transition-all duration-300 shadow-xl card-shine group-hover:shadow-blue-950/20 card-spotlight"
                >
                  <div className="flex items-start gap-4">
                    <BrandLogo
                      name={exp.company}
                      size={46}
                      badgeVariant="glass"
                      showGlow
                      className="mt-0.5 group-hover:scale-105 transition-transform shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-base font-bold text-white tracking-tight group-hover:text-blue-300 transition-colors">
                          {exp.role}
                        </h3>
                        <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-mono font-medium text-blue-300 border border-blue-500/20 flex items-center gap-1 shrink-0">
                          <Calendar className="h-3 w-3 text-blue-400" />
                          <span>{exp.period}</span>
                        </span>
                      </div>

                      <p className="mt-1 text-xs font-medium text-blue-400 flex flex-wrap items-center gap-1.5">
                        <span>{exp.company}</span>
                        <span className="text-zinc-600">·</span>
                        <span className="text-zinc-400 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-zinc-500" />
                          <span>{exp.location}</span>
                        </span>
                      </p>

                      {/* Partner Badges */}
                      {exp.company.toLowerCase().includes('ibm') && (
                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-zinc-300">
                            <BrandLogo name="IBM SkillsBuild" size={14} badgeVariant="none" />
                            <span>IBM SkillsBuild</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-zinc-300">
                            <BrandLogo name="AICTE" size={14} badgeVariant="none" />
                            <span>AICTE Partner</span>
                          </span>
                        </div>
                      )}

                      {exp.company.toLowerCase().includes('codtech') && (
                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-zinc-300">
                            <BrandLogo name="AWS Cloud" size={14} badgeVariant="none" />
                            <span>AWS Cloud</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-zinc-300">
                            <BrandLogo name="Docker" size={14} badgeVariant="none" />
                            <span>Docker</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2 text-xs text-zinc-300/90 leading-relaxed border-t border-white/[0.06] pt-3">
                    {exp.description?.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Expandable Tech Details */}
                  <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setExpandedExpId(isExpanded ? null : exp.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Technologies' : 'View Technologies Applied'}</span>
                      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                    <span className="text-[10px] font-mono text-emerald-400">Verified Internship</span>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 p-3 rounded-xl bg-black/50 border border-white/[0.06] space-y-2 text-[11px] font-mono text-zinc-300 animate-in fade-in">
                      <div className="text-zinc-500 uppercase text-[10px]">Applied Tech Stack</div>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.company.toLowerCase().includes('ibm') ? (
                          <>
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">Python 3</span>
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">Scikit-Learn</span>
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">Supervised Learning</span>
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">IBM SkillsBuild</span>
                          </>
                        ) : (
                          <>
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">AWS EC2 &amp; S3</span>
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">Docker</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">IAM Security</span>
                            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">DevOps</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Academic Foundation */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs font-mono font-medium text-blue-300 backdrop-blur-md">
          <GraduationCap className="h-3.5 w-3.5" />
          <span>Education</span>
        </div>
        
        <h2 className="mt-2 text-3xl font-extrabold text-white tracking-tight">
          Education &amp; Academics
        </h2>
        
        <p className="mt-1 text-xs sm:text-sm text-zinc-400">
          Undergraduate studies in Artificial Intelligence and Machine Learning.
        </p>

        <div 
          onMouseMove={handleCardMouseMove}
          className="mt-8 rounded-2xl border border-white/[0.08] bg-[#0c0d15]/85 p-6 backdrop-blur-2xl shadow-xl space-y-6 card-shine card-spotlight"
        >
          {/* Degree & College Info */}
          <div className="flex items-start gap-4 border-b border-white/[0.06] pb-5">
            <BrandLogo
              name={profile.college || 'Panimalar Engineering College'}
              size={52}
              badgeVariant="glass"
              showGlow
              className="mt-0.5 group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">{profile.college}</h3>
                <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-mono font-medium text-blue-300 border border-blue-500/20 shrink-0">
                  {profile.graduation_year}
                </span>
              </div>
              <p className="mt-0.5 text-sm font-medium text-blue-300">
                {profile.degree}
              </p>
              <p className="mt-0.5 text-xs text-zinc-400 flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-zinc-500" />
                <span>{profile.location} · Anna University Affiliated · Autonomous</span>
              </p>
            </div>
          </div>

          {/* Core Coursework List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                <span>Core Computer Science Subjects</span>
              </h4>
              <span className="text-[10px] font-mono text-zinc-500">Undergraduate Curriculum</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {displayedCoursework.map((course) => {
                const CourseLogo = getSkillLogo(course);

                return (
                  <div
                    key={course}
                    className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-left text-zinc-300 transition-colors"
                  >
                    <div className="h-4 w-4 shrink-0 flex items-center justify-center">
                      <CourseLogo className="w-full h-full object-contain" />
                    </div>
                    <span className="truncate">{course}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Problem Solving Summary Card */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-center justify-between hover:border-amber-500/35 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Terminal className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Java Algorithmic Problem Solving</div>
                <div className="text-[11px] text-zinc-400">90+ Problems Solved on LeetCode (81 Easy, 9 Medium)</div>
              </div>
            </div>
            <a
              href={profile.leetcode_url || 'https://leetcode.com/u/Saran-R/'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 shrink-0"
            >
              <span>LeetCode</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>

          {/* Resume Download Card */}
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex items-center justify-between hover:border-blue-500/35 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                <Download className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Curriculum Vitae</div>
                <div className="text-[11px] text-zinc-400">Download Saran R&apos;s Resume (PDF)</div>
              </div>
            </div>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 shrink-0"
            >
              <span>Download</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}
