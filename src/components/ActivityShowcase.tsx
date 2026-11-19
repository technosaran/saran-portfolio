'use client';

import { useState, useEffect } from 'react';
import { 
  ExternalLink, 
  Copy, 
  Check, 
  Flame,
  Activity,
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

const DEFAULT_REAL_GITHUB: GitHubActivityData = {
  username: 'technosaran',
  name: 'SARAN',
  avatarUrl: 'https://avatars.githubusercontent.com/u/130437013?v=4',
  publicRepos: 3,
  followers: 5,
  following: 5,
  totalContributions: 67,
  languages: [
    { name: 'TypeScript', share: 86, bytes: 2954244, color: 'bg-blue-500', textColor: 'text-blue-400', usage: 'Next.js 16 App Router, arthaX Wealth Terminal, Modern UI components' },
    { name: 'SQL & PLpgSQL', share: 6, bytes: 209420, color: 'bg-indigo-500', textColor: 'text-indigo-400', usage: 'PostgreSQL schemas, Supabase Row-Level Security, Database functions' },
    { name: 'Python', share: 5, bytes: 170146, color: 'bg-emerald-500', textColor: 'text-emerald-400', usage: 'PyTorch deep learning, OpenCV computer vision, SpaCy NLP pipelines' },
    { name: 'JavaScript', share: 1, bytes: 23299, color: 'bg-amber-500', textColor: 'text-amber-400', usage: 'Interactive DOM interactions, Tailwind styling, automation tooling' }
  ],
  commits: [],
  repos: [
    {
      name: 'arthaX',
      desc: 'Full-stack personal wealth tracking terminal engineered with PostgreSQL and Next.js.',
      stars: 0,
      forks: 0,
      lang: 'TypeScript',
      tags: ['Next.js 16', 'PostgreSQL', 'Supabase', 'Tailwind CSS'],
      url: 'https://github.com/technosaran/arthaX',
      pushedAt: '2026-11-18'
    },
    {
      name: 'saran-portfolio',
      desc: 'Production portfolio web application built with Next.js 16 and Neon Serverless Postgres.',
      stars: 0,
      forks: 0,
      lang: 'TypeScript',
      tags: ['Next.js 16', 'Neon Postgres', 'Drizzle ORM', 'Tailwind 4'],
      url: 'https://github.com/technosaran/saran-portfolio',
      pushedAt: '2026-11-18'
    },
    {
      name: 'orion-algo',
      desc: 'Algorithmic problem solving and data structure implementations.',
      stars: 0,
      forks: 0,
      lang: 'TypeScript',
      tags: ['TypeScript', 'DSA', 'Algorithms'],
      url: 'https://github.com/technosaran/orion-algo',
      pushedAt: '2026-11-16'
    }
  ]
};

const DEFAULT_REAL_LEETCODE: LeetCodeActivityData = {
  username: 'Saran-R',
  ranking: 1871936,
  totalSolved: 90,
  totalQuestions: 4114,
  easySolved: 81,
  totalEasy: 976,
  mediumSolved: 9,
  totalMedium: 2148,
  hardSolved: 0,
  totalHard: 990,
  totalSubmissions: 450,
  acceptedSubmissions: 275,
  acceptanceRate: 61.1,
  streak: 9,
  totalActiveDays: 14,
  languages: [
    { languageName: 'Pandas', problemsSolved: 49, share: 41 },
    { languageName: 'Python3', problemsSolved: 31, share: 26 },
    { languageName: 'PostgreSQL', problemsSolved: 19, share: 16 },
    { languageName: 'MySQL', problemsSolved: 15, share: 13 },
    { languageName: 'Python', problemsSolved: 3, share: 3 },
    { languageName: 'C', problemsSolved: 2, share: 2 }
  ],
  topics: [
    { title: 'Database & SQL Engineering', tagSlug: 'database', count: 43, complexity: 'O(N) Scan · Index Scans', desc: 'Inner/Left Joins, window functions, conditional aggregations, grouping', tag: 'Database' },
    { title: 'Arrays & Slicing', tagSlug: 'array', count: 15, complexity: 'O(N) Time · O(1) Space', desc: 'In-place transformations, element frequency tracking, prefix sums', tag: 'Arrays' },
    { title: 'Strings & Parsing', tagSlug: 'string', count: 14, complexity: 'O(N) Time · O(1) Space', desc: 'Sub-string matching, pattern evaluation, character frequencies', tag: 'Strings' },
    { title: 'Two Pointers & Intervals', tagSlug: 'two-pointers', count: 11, complexity: 'O(N) Time · O(1) Space', desc: 'Fast and slow pointer cycles, converging boundary searches', tag: 'Pointers' },
    { title: 'Hash Tables & Sets', tagSlug: 'hash-table', count: 10, complexity: 'O(1) Average Lookup', desc: 'Constant-time complement lookups, frequency counting, duplicate detection', tag: 'Hash Table' },
    { title: 'Sorting & Ranking', tagSlug: 'sorting', count: 4, complexity: 'O(N log N) Time', desc: 'Custom multi-key sorting, stable rank ordering', tag: 'Sorting' }
  ],
  recentSubmissions: [],
  solutions: []
};

export default function ActivityShowcase({ 
  profile, 
  projects,
  skills,
  initialGithubData,
  initialLeetcodeData
}: ActivityShowcaseProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'all' | 'github' | 'leetcode'>('all');
  const [githubData, setGithubData] = useState<GitHubActivityData>(initialGithubData || DEFAULT_REAL_GITHUB);
  const [leetcodeData, setLeetcodeData] = useState<LeetCodeActivityData>(initialLeetcodeData || DEFAULT_REAL_LEETCODE);

  useEffect(() => {
    fetch('/api/activity/github')
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (d) setGithubData(d); })
      .catch(() => {});

    fetch('/api/activity/leetcode')
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (d) setLeetcodeData(d); })
      .catch(() => {});
  }, []);

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

            {/* GitHub Contribution Heatmap */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Activity className="h-3.5 w-3.5 text-sky-400" />
                  <span>Contribution Activity</span>
                </span>
                <span className="text-zinc-400 text-[10px] font-mono">
                  {githubData.totalContributions} contributions in the last year
                </span>
              </div>
              <div className="p-3 rounded-lg border border-[#20222a] bg-[#14151b] overflow-hidden">
                <div className="overflow-x-auto pb-1 scrollbar-thin">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/api/github-chart"
                    alt={`Contribution Heatmap for ${githubData.username}`}
                    className="w-full min-w-[540px] h-auto rounded select-none"
                    loading="eager"
                  />
                </div>
                <div className="flex items-center justify-between pt-1.5 text-[10px] font-mono text-zinc-500 border-t border-[#20222a]/50 mt-1">
                  <span>Verified live from GitHub</span>
                  <span className="text-sky-400">@{githubData.username}</span>
                </div>
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
                <span className="text-zinc-500">{leetcodeData.easySolved} Easy · {leetcodeData.mediumSolved} Medium</span>
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

            {/* LeetCode Submission Heatmap */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Flame className="h-3.5 w-3.5 text-amber-500" />
                  <span>Submission Activity Calendar</span>
                </span>
                <span className="text-amber-400/90 font-mono text-[10px]">
                  {leetcodeData.streak} Days Streak · {leetcodeData.totalActiveDays} Active Days
                </span>
              </div>
              <div className="p-3 rounded-lg border border-[#20222a] bg-[#14151b] overflow-hidden">
                <div className="overflow-x-auto pb-1 scrollbar-thin">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/api/leetcode-chart"
                    alt={`LeetCode Submission Heatmap for ${leetcodeData.username}`}
                    className="w-full min-w-[540px] h-auto rounded select-none"
                    loading="eager"
                  />
                </div>
                <div className="flex items-center justify-between pt-1.5 text-[10px] font-mono text-zinc-500 border-t border-[#20222a]/50 mt-1">
                  <span>Verified live from LeetCode GraphQL</span>
                  <span className="text-amber-500">u/{leetcodeData.username}</span>
                </div>
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
              <span>Primary Practice: {leetcodeData.languages?.slice(0, 2).map((l) => l.languageName).join(' & ') || 'Pandas & Python3'}</span>
              <span className="text-zinc-400">Continuous Problem Solving</span>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
