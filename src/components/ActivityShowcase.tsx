'use client';

import { useState } from 'react';
import { 
  ExternalLink, 
  Copy, 
  Check, 
  Flame,
  CheckCircle2
} from 'lucide-react';
import { GithubIcon, LeetCodeIcon } from './SocialIcons';
import { Profile, Project, Skill } from '@/lib/neon/db';
import { useToast } from './Toast';
import { GitHubActivityData, GitHubRepoItem } from '@/services/github.service';
import { LeetCodeActivityData, LeetCodeTopicStat } from '@/services/leetcode.service';

interface ActivityShowcaseProps {
  profile: Profile;
  projects?: Project[];
  skills?: Skill[];
  initialGithubData?: GitHubActivityData;
  initialLeetcodeData?: LeetCodeActivityData;
}

export default function ActivityShowcase({ 
  profile, 
  projects,
  skills,
  initialGithubData,
  initialLeetcodeData
}: ActivityShowcaseProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'all' | 'github' | 'leetcode'>('all');

  const githubData: GitHubActivityData = initialGithubData || {
    username: 'technosaran',
    name: 'SARAN',
    avatarUrl: 'https://avatars.githubusercontent.com/u/130437013?v=4',
    publicRepos: 3,
    followers: 5,
    following: 5,
    totalContributions: 54,
    languages: [
      { name: 'TypeScript', share: 89, bytes: 1942255, color: 'bg-blue-500', textColor: 'text-blue-400', usage: 'Next.js 16, arthaX Terminal' },
      { name: 'SQL & PLpgSQL', share: 6, bytes: 112312, color: 'bg-indigo-500', textColor: 'text-indigo-400', usage: 'PostgreSQL schemas & RLS' },
      { name: 'Python', share: 4, bytes: 83227, color: 'bg-emerald-500', textColor: 'text-emerald-400', usage: 'PyTorch CV, OpenCV, SpaCy NLP' },
      { name: 'JavaScript', share: 1, bytes: 38821, color: 'bg-amber-500', textColor: 'text-amber-400', usage: 'Client hydration & DOM APIs' }
    ],
    commits: [],
    repos: [
      {
        name: 'arthax',
        desc: 'Personal Wealth & Financial Terminal built with Next.js 16 & PostgreSQL',
        stars: 3,
        forks: 0,
        lang: 'TypeScript',
        tags: ['Next.js', 'PostgreSQL', 'TypeScript'],
        url: 'https://github.com/technosaran/arthax',
        pushedAt: '2025'
      },
      {
        name: 'realtime-object-detection',
        desc: 'Live video stream object detection application using PyTorch & OpenCV',
        stars: 2,
        forks: 0,
        lang: 'Python',
        tags: ['PyTorch', 'OpenCV', 'Computer Vision'],
        url: 'https://github.com/technosaran/realtime-object-detection',
        pushedAt: '2025'
      },
      {
        name: 'ner-system-nlp',
        desc: 'Named Entity Recognition NLP pipeline extracting structured entities from text',
        stars: 1,
        forks: 0,
        lang: 'Python',
        tags: ['SpaCy', 'NLP', 'Scikit-Learn'],
        url: 'https://github.com/technosaran/ner-system-nlp',
        pushedAt: '2025'
      }
    ]
  };

  const leetcodeData: LeetCodeActivityData = initialLeetcodeData || {
    username: 'Saran-R',
    ranking: 1868242,
    totalSolved: 90,
    totalQuestions: 4114,
    easySolved: 81,
    totalEasy: 976,
    mediumSolved: 9,
    totalMedium: 2148,
    hardSolved: 0,
    totalHard: 990,
    totalSubmissions: 450,
    acceptedSubmissions: 274,
    acceptanceRate: 60.9,
    streak: 9,
    totalActiveDays: 13,
    languages: [
      { languageName: 'Java', problemsSolved: 52, share: 58 },
      { languageName: 'Python', problemsSolved: 38, share: 42 }
    ],
    topics: [
      { title: 'Array', tagSlug: 'array', count: 42, complexity: 'O(N)', desc: 'Two Pointers, Prefix Sum', tag: 'Linear' },
      { title: 'String', tagSlug: 'string', count: 28, complexity: 'O(N)', desc: 'Parsing, Substrings', tag: 'Text' },
      { title: 'Hash Table', tagSlug: 'hash-table', count: 22, complexity: 'O(1)', desc: 'Frequency Maps, Sets', tag: 'Lookup' },
      { title: 'Math', tagSlug: 'math', count: 18, complexity: 'O(log N)', desc: 'Number Theory, Modular', tag: 'Theory' },
      { title: 'Two Pointers', tagSlug: 'two-pointers', count: 14, complexity: 'O(N)', desc: 'Sliding Windows', tag: 'Optimization' },
      { title: 'Binary Search', tagSlug: 'binary-search', count: 8, complexity: 'O(log N)', desc: 'Divide & Conquer', tag: 'Search' }
    ],
    recentSubmissions: [],
    solutions: []
  };

  return (
    <div className="space-y-6">
      
      {/* View Switcher */}
      <div className="flex items-center gap-1.5 p-1 rounded-lg border border-[#20222a] bg-[#111216] w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          All Activity
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('github')}
          className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer ${
            activeTab === 'github'
              ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          GitHub (@{githubData.username})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('leetcode')}
          className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer ${
            activeTab === 'leetcode'
              ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          LeetCode ({leetcodeData.totalSolved} Solved)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* GitHub Card */}
        {(activeTab === 'all' || activeTab === 'github') && (
          <div className="rounded-xl border border-[#20222a] bg-[#111216] p-6 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#20222a]">
              <div className="flex items-center gap-2.5">
                <GithubIcon className="h-5 w-5 text-zinc-100" />
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">
                    GitHub Profile
                  </h3>
                  <a
                    href={`https://github.com/${githubData.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-zinc-400 hover:text-white"
                  >
                    @{githubData.username}
                  </a>
                </div>
              </div>

              <a
                href={`https://github.com/${githubData.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-white"
              >
                <span>View Profile</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-lg border border-[#20222a] bg-[#14151b]">
                <div className="font-mono text-lg font-bold text-zinc-100">{githubData.totalContributions}</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Contributions</div>
              </div>
              <div className="p-3 rounded-lg border border-[#20222a] bg-[#14151b]">
                <div className="font-mono text-lg font-bold text-zinc-100">{githubData.publicRepos}</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Public Repos</div>
              </div>
              <div className="p-3 rounded-lg border border-[#20222a] bg-[#14151b]">
                <div className="font-mono text-lg font-bold text-zinc-100">{githubData.followers}</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Followers</div>
              </div>
            </div>

            {/* Language Breakdown */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                Primary Language Distribution
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-800 flex overflow-hidden">
                {githubData.languages.map((l) => (
                  <div
                    key={l.name}
                    className={`${l.color} h-full`}
                    style={{ width: `${l.share}%` }}
                    title={`${l.name}: ${l.share}%`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs font-mono text-zinc-400">
                {githubData.languages.map((l) => (
                  <span key={l.name} className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${l.color}`} />
                    <span>{l.name} ({l.share}%)</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Public Repositories */}
            <div className="space-y-2.5 pt-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                Pinned Engineering Repositories
              </div>
              <div className="space-y-2">
                {githubData.repos.map((repo: GitHubRepoItem) => (
                  <a
                    key={repo.name}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg border border-[#20222a] bg-[#14151b] hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-zinc-200">
                        {repo.name}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {repo.lang}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                      {repo.desc}
                    </p>
                  </a>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* LeetCode Card */}
        {(activeTab === 'all' || activeTab === 'leetcode') && (
          <div className="rounded-xl border border-[#20222a] bg-[#111216] p-6 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#20222a]">
              <div className="flex items-center gap-2.5">
                <LeetCodeIcon className="h-5 w-5 text-amber-500" />
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">
                    LeetCode Algorithmic Practice
                  </h3>
                  <a
                    href={`https://leetcode.com/u/${leetcodeData.username}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-zinc-400 hover:text-amber-400"
                  >
                    u/{leetcodeData.username}
                  </a>
                </div>
              </div>

              <a
                href={`https://leetcode.com/u/${leetcodeData.username}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-white"
              >
                <span>View Profile</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Solved Counts */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-lg border border-[#20222a] bg-[#14151b]">
                <div className="font-mono text-lg font-bold text-amber-400">{leetcodeData.totalSolved}</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Total Solved</div>
              </div>
              <div className="p-3 rounded-lg border border-[#20222a] bg-[#14151b]">
                <div className="font-mono text-lg font-bold text-emerald-400">{leetcodeData.easySolved}</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Easy Problems</div>
              </div>
              <div className="p-3 rounded-lg border border-[#20222a] bg-[#14151b]">
                <div className="font-mono text-lg font-bold text-amber-500">{leetcodeData.mediumSolved}</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Medium Problems</div>
              </div>
            </div>

            {/* Solved Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>Problem Difficulty Ratio</span>
                <span className="text-zinc-500">81 Easy · 9 Medium</span>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-800 flex overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full" 
                  style={{ width: `${(leetcodeData.easySolved / leetcodeData.totalSolved) * 100}%` }} 
                />
                <div 
                  className="bg-amber-500 h-full" 
                  style={{ width: `${(leetcodeData.mediumSolved / leetcodeData.totalSolved) * 100}%` }} 
                />
              </div>
            </div>

            {/* Top Algorithmic Topics */}
            {leetcodeData.topics && leetcodeData.topics.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                  Core Algorithmic Focus Areas
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {leetcodeData.topics.slice(0, 6).map((t: LeetCodeTopicStat) => (
                    <div
                      key={t.title}
                      className="p-2.5 rounded-lg border border-[#20222a] bg-[#14151b] flex items-center justify-between"
                    >
                      <span className="text-xs text-zinc-300 font-medium">{t.title}</span>
                      <span className="text-[10px] font-mono text-zinc-500">{t.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 text-[11px] text-zinc-500 font-mono flex items-center justify-between">
              <span>Primary Practice: Java &amp; Python</span>
              <span className="text-zinc-400">Continuous Problem Solving</span>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
