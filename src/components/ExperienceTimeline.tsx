'use client';

import React from 'react';
import {
  Briefcase,
  GraduationCap,
  Calendar,
  MapPin,
  BookOpen,
} from 'lucide-react';
import { Experience, Profile } from '@/lib/neon/db';
import BrandLogo from './BrandLogo';

interface ExperienceTimelineProps {
  experience: Experience[];
  profile: Profile;
  displayedCoursework: string[];
}

function getExperienceTechSummary(exp: Experience): string {
  const haystack = `${exp.intern_id} ${exp.role} ${exp.company} ${(exp.description || []).join(' ')}`.toLowerCase();

  if (haystack.includes('ibm') || haystack.includes('scikit') || haystack.includes('ai') || haystack.includes('ml')) {
    return 'Python · ML · Scikit-Learn';
  }
  if (haystack.includes('aws') || haystack.includes('docker') || haystack.includes('cloud') || haystack.includes('devops')) {
    return 'AWS Cloud · Docker · DevOps';
  }
  if (haystack.includes('next') || haystack.includes('react') || haystack.includes('full')) {
    return 'Next.js · TypeScript · PostgreSQL';
  }
  return 'Software Engineering';
}

export default function ExperienceTimeline({
  experience,
  profile,
  displayedCoursework,
}: ExperienceTimelineProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      {/* Left Column: Work Experience & Internships (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Briefcase className="h-4 w-4 text-emerald-400" />
          <span className="uppercase tracking-wider">Industry Experience</span>
        </div>

        {experience.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#262b3a] bg-[#0c0e14]/50 p-6 text-center space-y-2">
            <Briefcase className="mx-auto h-5 w-5 text-zinc-500" />
            <p className="text-xs text-zinc-400">No industry experience records published yet.</p>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-6">
            {/* Vertical Timeline Rail */}
            <div
              aria-hidden="true"
              className="absolute left-[7px] top-3 bottom-3 w-px bg-gradient-to-b from-emerald-500/70 via-[#262b3a] to-transparent"
            />

            {experience.map((exp) => (
              <div key={exp.id} className="relative">
                {/* Timeline Node */}
                <span
                  aria-hidden="true"
                  className="absolute -left-6 sm:-left-8 top-6 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-emerald-400/60 bg-[#090a0f] shadow-[0_0_12px_rgba(16,185,129,0.45)]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>

                <div className="rounded-xl border border-[#1f2432] bg-[#0f1118] card-bevel p-5 sm:p-6 hover:border-[#2e364d] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <BrandLogo name={exp.company} size={34} badgeVariant="glass" className="mt-0.5" />
                      <div>
                        <h3 className="text-base font-bold text-zinc-100">{exp.role}</h3>
                        <div className="text-xs font-medium text-emerald-400 mt-0.5 leading-snug">
                          {exp.company}
                        </div>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-md border border-[#1f2432] bg-[#131620] px-2.5 py-1 text-[11px] font-mono text-zinc-400 shrink-0 self-start">
                      <Calendar className="h-3 w-3 text-zinc-500" />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  {/* Bullet Points */}
                  {exp.description && exp.description.length > 0 && (
                    <ul className="mt-4 space-y-2 text-xs text-zinc-300 leading-relaxed">
                      {exp.description.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400/80 mt-0.5 shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Meta details */}
                  <div className="mt-4 pt-3.5 border-t border-[#1b1f2b] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-zinc-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-zinc-500" />
                      <span>{exp.location || 'Remote'}</span>
                    </span>
                    <span className="text-zinc-400">{getExperienceTechSummary(exp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Academic Foundation (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <GraduationCap className="h-4 w-4 text-emerald-400" />
          <span className="uppercase tracking-wider">Education &amp; Foundations</span>
        </div>

        <div className="rounded-xl border border-[#1f2432] bg-[#0f1118] card-bevel p-6 space-y-5">
          <div>
            <div className="text-[11px] font-mono text-emerald-400 font-medium">
              Undergraduate Degree
            </div>
            <h3 className="text-base font-bold text-zinc-100 mt-1">{profile.degree}</h3>
            <p className="text-xs text-zinc-400 mt-1">{profile.college}</p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-400 py-2.5 border-y border-[#1b1f2b]">
            <span>Graduation: {profile.graduation_year}</span>
            <span>{profile.location || 'Chennai, Tamil Nadu'}</span>
          </div>

          {/* Core Academic Coursework */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <BookOpen className="h-3 w-3 text-zinc-500" />
              <span>Core CS Fundamentals</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {displayedCoursework.map((course) => (
                <span
                  key={course}
                  className="rounded-md border border-[#202534] bg-[#131620] px-2.5 py-1 text-[11px] font-mono text-zinc-300"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-[#202534] bg-[#131620] text-xs text-zinc-300 leading-relaxed">
            Rigorous four-year engineering curriculum integrating machine learning theory, algorithmic problem solving, database system design, and software engineering principles.
          </div>
        </div>
      </div>
    </div>
  );
}
