'use client';

import React from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  MapPin,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { Experience, Profile } from '@/lib/neon/db';
import BrandLogo from './BrandLogo';

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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      
      {/* Left Column: Work Experience & Internships (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Briefcase className="h-4 w-4 text-emerald-400" />
          <span className="uppercase tracking-wider">Industry Experience</span>
        </div>

        <div className="space-y-6">
          {experience.map((exp) => (
            <div 
              key={exp.id}
              className="rounded-xl border border-[#20222a] bg-[#111216] p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-zinc-100">
                    {exp.role}
                  </h3>
                  <div className="text-xs font-medium text-emerald-400 mt-0.5">
                    {exp.company}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 shrink-0">
                  <Calendar className="h-3 w-3" />
                  <span>{exp.period}</span>
                </div>
              </div>

              {/* Bullet Points */}
              {exp.description && exp.description.length > 0 && (
                <ul className="mt-4 space-y-2 text-xs text-zinc-300 leading-relaxed">
                  {exp.description.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-zinc-600 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Meta details */}
              <div className="mt-4 pt-4 border-t border-[#20222a] flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-zinc-600" />
                  <span>{exp.location || 'Remote'}</span>
                </span>
                <span className="text-zinc-400">
                  {exp.intern_id.includes('ibm') ? 'Python · ML · Scikit-Learn' : 'AWS Cloud · Docker · DevOps'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Academic Foundation (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <GraduationCap className="h-4 w-4 text-sky-400" />
          <span className="uppercase tracking-wider">Education &amp; Foundations</span>
        </div>

        <div className="rounded-xl border border-[#20222a] bg-[#111216] p-6 space-y-5">
          <div>
            <div className="text-[11px] font-mono text-sky-400 font-medium">
              Undergraduate Degree
            </div>
            <h3 className="text-base font-bold text-zinc-100 mt-1">
              {profile.degree}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              {profile.college}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-zinc-500 py-2 border-y border-[#20222a]">
            <span>Graduation: {profile.graduation_year}</span>
            <span>{profile.location || 'Chennai, TN'}</span>
          </div>

          {/* Core Academic Coursework */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <BookOpen className="h-3 w-3 text-zinc-500" />
              <span>Core CS Fundamentals</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {displayedCoursework.map((course) => (
                <span
                  key={course}
                  className="rounded-md border border-[#20222a] bg-[#14151b] px-2.5 py-1 text-[11px] font-mono text-zinc-300"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-[#252834] bg-[#14151b] text-xs text-zinc-300 leading-relaxed">
            Rigorous four-year engineering curriculum integrating machine learning theory, algorithmic problem solving, database system design, and software engineering principles.
          </div>
        </div>
      </div>

    </div>
  );
}
