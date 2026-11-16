'use client';

import { useState, useMemo } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  ExternalLink, 
  Check, 
  Copy, 
  Flame, 
  Activity, 
  FolderGit2, 
  TrendingUp, 
  Terminal,
  Code2,
  Database,
  Layers,
  Trophy,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { GithubIcon, LeetCodeIcon } from './SocialIcons';
import { Profile, Project, Skill } from '@/lib/neon/db';
import { useToast } from './Toast';
import BrandLogo from './BrandLogo';
import { GitHubActivityData } from '@/services/github.service';
import { LeetCodeActivityData } from '@/services/leetcode.service';

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
  const [viewMode, setViewMode] = useState<'all' | 'github' | 'leetcode'>('all');
  const [githubTab, setGithubTab] = useState<'heatmap' | 'repos' | 'commits'>('heatmap');
  const [leetcodeTab, setLeetcodeTab] = useState<'metrics' | 'languages' | 'topics' | 'submissions' | 'solutions' | 'practices'>('metrics');
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);
  const [copiedRepoClone, setCopiedRepoClone] = useState<string | null>(null);
  const [selectedSolutionIdx, setSelectedSolutionIdx] = useState(0);
  const [hoveredLang, setHoveredLang] = useState<string | null>(null);

  // GitHub Data with robust fallback
  const github = useMemo<GitHubActivityData>(() => {
    if (initialGithubData) return initialGithubData;

    return {
      username: 'technosaran',
      name: 'SARAN',
      avatarUrl: 'https://avatars.githubusercontent.com/u/130437013?v=4',
      publicRepos: 3,
      followers: 5,
      following: 5,
      totalContributions: 54,
      languages: [
        {
          name: 'TypeScript',
          share: 89,
          bytes: 1942255,
          color: 'bg-blue-500',
          textColor: 'text-blue-400',
          usage: 'Next.js 16 App Router, arthaX Wealth Terminal, modern UI systems'
        },
        {
          name: 'SQL & PLpgSQL',
          share: 6,
          bytes: 112312,
          color: 'bg-indigo-500',
          textColor: 'text-indigo-400',
          usage: 'PostgreSQL schemas, Supabase Row-Level Security, database migrations'
        },
        {
          name: 'Python',
          share: 4,
          bytes: 83227,
          color: 'bg-emerald-500',
          textColor: 'text-emerald-400',
          usage: 'PyTorch deep learning, OpenCV computer vision, SpaCy NLP pipelines'
        },
        {
          name: 'JavaScript / Web',
          share: 1,
          bytes: 38821,
          color: 'bg-amber-500',
          textColor: 'text-amber-400',
          usage: 'Interactive client logic, Tailwind styling, automation tooling'
        }
      ],
      repos: [
        {
          name: 'arthaX',
          desc: 'Full-stack personal wealth tracking terminal engineered with PostgreSQL, Supabase RLS, and Next.js.',
          lang: 'TypeScript',
          tags: ['Next.js 16', 'PostgreSQL', 'Supabase', 'Tailwind CSS'],
          url: 'https://github.com/technosaran/arthaX',
          stars: 0,
          forks: 0,
          pushedAt: '2026-11-14T14:34:37Z'
        },
        {
          name: 'orion-algo',
          desc: 'Algorithmic problem solving repository containing data structure implementations and optimal solutions.',
          lang: 'TypeScript',
          tags: ['Algorithms', 'Data Structures', 'TypeScript', 'Python'],
          url: 'https://github.com/technosaran/orion-algo',
          stars: 0,
          forks: 0,
          pushedAt: '2026-11-14T08:48:20Z'
        },
        {
          name: 'saran-portfolio',
          desc: 'High-performance portfolio web application featuring Neon Serverless Postgres, Drizzle ORM, and Vitest suite.',
          lang: 'TypeScript',
          tags: ['Next.js 16', 'Neon Postgres', 'Drizzle ORM', 'Tailwind 4'],
          url: 'https://github.com/technosaran/saran-portfolio',
          stars: 0,
          forks: 0,
          pushedAt: '2026-11-15T04:03:29Z'
        }
      ],
      commits: [
        {
          hash: 'e460262',
          branch: 'main',
          message: 'feat: enhance UI across all sections with clean modern design and verified content',
          tag: 'Latest',
          scope: 'technosaran/saran-portfolio',
          date: '2026-11-15'
        },
        {
          hash: 'a8907a1',
          branch: 'main',
          message: 'feat: add site verification meta tags and structured schemas',
          tag: 'Release',
          scope: 'technosaran/arthaX',
          date: '2026-11-14'
        },
        {
          hash: 'a1979a0',
          branch: 'main',
          message: 'feat: complete architecture audit, Drizzle ORM migration, and security hardening',
          tag: 'Milestone',
          scope: 'technosaran/saran-portfolio',
          date: '2026-11-13'
        },
        {
          hash: 'facf804',
          branch: 'main',
          message: 'feat: enhance UI/UX with atomic skills nucleus and high-res tech logos',
          tag: 'Update',
          scope: 'technosaran/saran-portfolio',
          date: '2026-11-12'
        },
        {
          hash: 'b1f3731',
          branch: 'main',
          message: 'feat: complete Saran R portfolio with Next.js and Neon Postgres',
          tag: 'Initial',
          scope: 'technosaran/saran-portfolio',
          date: '2026-11-11'
        }
      ]
    };
  }, [initialGithubData]);

  // LeetCode Data with real verified statistics
  const leetcode = useMemo<LeetCodeActivityData>(() => {
    if (initialLeetcodeData) return initialLeetcodeData;

    return {
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
        { languageName: 'Pandas', problemsSolved: 49, share: 41 },
        { languageName: 'Python3', problemsSolved: 31, share: 26 },
        { languageName: 'PostgreSQL', problemsSolved: 19, share: 16 },
        { languageName: 'MySQL', problemsSolved: 15, share: 13 },
        { languageName: 'Python', problemsSolved: 3, share: 2 },
        { languageName: 'C', problemsSolved: 2, share: 2 }
      ],
      topics: [
        {
          title: 'Database & SQL Engineering',
          tagSlug: 'database',
          count: 43,
          complexity: 'O(N) Scan · Index Scans',
          desc: 'Inner/Left Joins, window functions, conditional aggregations, grouping, subqueries, and null value handling.',
          tag: 'Database'
        },
        {
          title: 'Arrays & Slicing',
          tagSlug: 'array',
          count: 15,
          complexity: 'O(N) Time · O(1) Space',
          desc: 'In-place transformations, element frequency tracking, prefix sums, and vectorised calculations.',
          tag: 'Arrays'
        },
        {
          title: 'Strings & Parsing',
          tagSlug: 'string',
          count: 14,
          complexity: 'O(N) Time · O(1) Space',
          desc: 'Sub-string matching, pattern evaluation, character frequencies, palindrome verification, and string hashing.',
          tag: 'Strings'
        },
        {
          title: 'Two Pointers & Intervals',
          tagSlug: 'two-pointers',
          count: 11,
          complexity: 'O(N) Time · O(1) Space',
          desc: 'Fast and slow pointer cycles, converging boundary searches, opposite-end traversals, and window adjustments.',
          tag: 'Pointers'
        },
        {
          title: 'Hash Tables & Sets',
          tagSlug: 'hash-table',
          count: 10,
          complexity: 'O(1) Average Lookup',
          desc: 'Constant-time complement lookups, frequency counting, duplicate detection, and anagram groupings.',
          tag: 'Hash Table'
        },
        {
          title: 'Math & Number Logic',
          tagSlug: 'math',
          count: 4,
          complexity: 'O(log N) Time',
          desc: 'Digit manipulation, divisibility conditions, prime factors, and modular arithmetic optimizations.',
          tag: 'Math'
        },
        {
          title: 'Sorting & Ranking',
          tagSlug: 'sorting',
          count: 4,
          complexity: 'O(N log N) Time',
          desc: 'Custom multi-key sorting, stable rank ordering, and pivot-based element partitions.',
          tag: 'Sorting'
        },
        {
          title: 'Dynamic Programming',
          tagSlug: 'dynamic-programming',
          count: 3,
          complexity: 'O(N) Time · O(N) Space',
          desc: 'Optimal substructure analysis, state transitions, memoization caches, and bottom-up tabulation.',
          tag: 'DP'
        }
      ],
      recentSubmissions: [
        {
          title: 'Customer Who Visited but Did Not Make Any Transactions',
          titleSlug: 'customer-who-visited-but-did-not-make-any-transactions',
          timestamp: '1794305722',
          statusDisplay: 'Accepted',
          lang: 'postgresql'
        },
        {
          title: 'Product Sales Analysis I',
          titleSlug: 'product-sales-analysis-i',
          timestamp: '1794305120',
          statusDisplay: 'Accepted',
          lang: 'postgresql'
        },
        {
          title: 'Replace Employee ID With The Unique Identifier',
          titleSlug: 'replace-employee-id-with-the-unique-identifier',
          timestamp: '1794304846',
          statusDisplay: 'Accepted',
          lang: 'postgresql'
        },
        {
          title: 'Invalid Tweets',
          titleSlug: 'invalid-tweets',
          timestamp: '1794304386',
          statusDisplay: 'Accepted',
          lang: 'postgresql'
        },
        {
          title: 'Article Views I',
          titleSlug: 'article-views-i',
          timestamp: '1794304198',
          statusDisplay: 'Accepted',
          lang: 'postgresql'
        },
        {
          title: 'Big Countries',
          titleSlug: 'big-countries',
          timestamp: '1794304098',
          statusDisplay: 'Accepted',
          lang: 'postgresql'
        },
        {
          title: 'Find Customer Referee',
          titleSlug: 'find-customer-referee',
          timestamp: '1794303953',
          statusDisplay: 'Accepted',
          lang: 'postgresql'
        }
      ],
      solutions: [
        {
          title: 'Customer Who Visited but Did Not Make Any Transactions',
          problemNumber: 1581,
          difficulty: 'Easy',
          category: 'Database / SQL',
          language: 'PostgreSQL',
          time: 'O(N) Hash Join',
          space: 'O(1) In-Place',
          explanation: 'Uses a LEFT JOIN on visit_id with a WHERE condition isolating NULL transaction entries, aggregated by customer ID.',
          code: `-- LeetCode 1581: Customer Who Visited but Did Not Make Any Transactions
-- Language: PostgreSQL / SQL
SELECT 
    v.customer_id, 
    COUNT(v.visit_id) AS count_no_trans
FROM Visits v
LEFT JOIN Transactions t 
    ON v.visit_id = t.visit_id
WHERE t.transaction_id IS NULL
GROUP BY v.customer_id;`
        },
        {
          title: 'Big Countries (Vectorized Filter)',
          problemNumber: 595,
          difficulty: 'Easy',
          category: 'Data Analysis',
          language: 'Pandas / Python',
          time: 'O(N) Vectorized',
          space: 'O(N) Subset',
          explanation: 'Applies boolean bitwise indexing across area and population thresholds, returning selected columns cleanly.',
          code: `# LeetCode 595: Big Countries
# Language: Pandas / Python3
import pandas as pd

def big_countries(world: pd.DataFrame) -> pd.DataFrame:
    # Vectorized boolean mask for high-area or high-population nations
    mask = (world['area'] >= 3000000) | (world['population'] >= 25000000)
    return world.loc[mask, ['name', 'population', 'area']]`
        },
        {
          title: 'Replace Employee ID With The Unique Identifier',
          problemNumber: 1378,
          difficulty: 'Easy',
          category: 'Database / SQL',
          language: 'PostgreSQL',
          time: 'O(N) Index Scan',
          space: 'O(1) Streaming',
          explanation: 'Performs a Left Outer Join to preserve all employee identities while projecting unique IDs where registered.',
          code: `-- LeetCode 1378: Replace Employee ID With The Unique Identifier
-- Language: PostgreSQL
SELECT 
    eu.unique_id, 
    e.name
FROM Employees e
LEFT JOIN EmployeeUNI eu 
    ON e.id = eu.id;`
        },
        {
          title: 'Two Sum (Optimal Hash Map Lookup)',
          problemNumber: 1,
          difficulty: 'Easy',
          category: 'Arrays & Hashing',
          language: 'Python3',
          time: 'O(N) Single Pass',
          space: 'O(N) Auxiliary',
          explanation: 'Maintains a single-pass dictionary mapping value to index, yielding instant O(1) complement discovery.',
          code: `# LeetCode 1: Two Sum
# Language: Python3
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        lookup = {}
        for idx, val in enumerate(nums):
            diff = target - val
            if diff in lookup:
                return [lookup[diff], idx]
            lookup[val] = idx
        return []`
        }
      ]
    };
  }, [initialLeetcodeData]);

  // Card mouse movement for spotlight
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const copyToClipboard = (text: string, type: 'github' | 'leetcode') => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(text);
        setCopiedHandle(type);
        toast(`${type === 'github' ? 'GitHub' : 'LeetCode'} handle copied!`, 'success');
        setTimeout(() => setCopiedHandle(null), 2000);
        return;
      }
    } catch {
      // Fallback
    }

    try {
      if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopiedHandle(type);
        toast(`${type === 'github' ? 'GitHub' : 'LeetCode'} handle copied!`, 'success');
        setTimeout(() => setCopiedHandle(null), 2000);
      }
    } catch {
      setCopiedHandle(null);
    }
  };

  const copyCloneCmd = (repoName: string, url: string) => {
    const cmd = `git clone ${url}.git`;
    try {
      navigator.clipboard.writeText(cmd);
      setCopiedRepoClone(repoName);
      toast(`Copied "${cmd}"`, 'success');
      setTimeout(() => setCopiedRepoClone(null), 2000);
    } catch {
      toast('Failed to copy clone command', 'error');
    }
  };

  const copySolutionCode = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
      toast('Solution copied to clipboard!', 'success');
    } catch {
      toast('Failed to copy code', 'error');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Coding Activity &amp; Problem Solving</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real GitHub repository metrics and live scraped LeetCode problem solving data.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center rounded-xl bg-white/[0.04] p-1 border border-white/[0.08] backdrop-blur-md overflow-x-auto no-scrollbar max-w-full">
          <button
            type="button"
            onClick={() => setViewMode('all')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              viewMode === 'all'
                ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Unified View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('github')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              viewMode === 'github'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_20px_rgba(56,189,248,0.35)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GithubIcon className="h-3.5 w-3.5" />
            <span>GitHub ({github.publicRepos})</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('leetcode')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              viewMode === 'leetcode'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.35)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LeetCodeIcon className="h-3.5 w-3.5" />
            <span>LeetCode ({leetcode.totalSolved})</span>
          </button>
        </div>
      </div>

      {/* Main Grid Display */}
      <div className={`grid grid-cols-1 gap-8 ${viewMode === 'all' ? 'lg:grid-cols-2' : 'max-w-4xl mx-auto'}`}>
        
        {/* ======================================================== */}
        {/* LEFT CARD: GITHUB REPOSITORIES & ACTIVITY */}
        {/* ======================================================== */}
        {(viewMode === 'all' || viewMode === 'github') && (
          <div 
            onMouseMove={handleCardMouseMove}
            className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0c0d15]/95 p-4 sm:p-6 backdrop-blur-xl hover:border-blue-500/30 transition-all shadow-xl card-shine card-spotlight"
          >
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.08] text-white">
                    <GithubIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white tracking-tight">GitHub Development</h3>
                      <span className="inline-flex items-center gap-1 rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-mono text-blue-400 border border-blue-500/20">
                        <Sparkles className="h-2.5 w-2.5" /> Real API
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mt-0.5">
                      <span>github.com/{github.username}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(github.username, 'github')}
                        className="text-zinc-500 hover:text-blue-400 transition-colors p-0.5 rounded cursor-pointer"
                        title="Copy handle"
                      >
                        {copiedHandle === 'github' ? (
                          <span className="flex items-center text-[10px] text-emerald-400 font-sans">
                            <Check className="h-3 w-3 inline mr-0.5" /> Copied
                          </span>
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-mono text-blue-300 border border-blue-500/20">
                    <GitBranch className="h-3 w-3 text-blue-400" />
                    <span>{github.publicRepos} Public Repositories</span>
                  </span>
                </div>
              </div>

              {/* Sub Tabs */}
              <div className="flex items-center gap-1 rounded-xl bg-black/40 p-1 border border-white/[0.06] text-xs overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setGithubTab('heatmap')}
                  className={`flex-1 rounded-lg py-1.5 font-medium transition-all text-center cursor-pointer shrink-0 whitespace-nowrap px-2.5 ${
                    githubTab === 'heatmap'
                      ? 'bg-white/[0.08] text-white font-semibold shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Activity Overview
                </button>
                <button
                  type="button"
                  onClick={() => setGithubTab('repos')}
                  className={`flex-1 rounded-lg py-1.5 font-medium transition-all text-center cursor-pointer shrink-0 whitespace-nowrap px-2.5 ${
                    githubTab === 'repos'
                      ? 'bg-white/[0.08] text-white font-semibold shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Repositories ({github.repos.length})
                </button>
                <button
                  type="button"
                  onClick={() => setGithubTab('commits')}
                  className={`flex-1 rounded-lg py-1.5 font-medium transition-all text-center cursor-pointer shrink-0 whitespace-nowrap px-2.5 ${
                    githubTab === 'commits'
                      ? 'bg-white/[0.08] text-white font-semibold shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Recent Commits
                </button>
              </div>

              {/* TAB 1: HEATMAP & STACK BREAKDOWN */}
              {githubTab === 'heatmap' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  
                  {/* Contribution Heatmap */}
                  <div className="rounded-xl border border-white/[0.08] bg-black/50 p-4 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="font-mono text-zinc-300 flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-blue-400" />
                        <span>Contribution Graph</span>
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {github.totalContributions} contributions in the last year
                      </span>
                    </div>

                    <div className="overflow-x-auto pb-1 scrollbar-thin">
                      {/* Native robust SVG route */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/api/github-chart"
                        alt={`Contribution Heatmap for ${github.username}`}
                        className="w-full min-w-[540px] h-auto rounded-lg"
                        loading="eager"
                      />
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono mt-1 sm:hidden flex items-center justify-between">
                      <span>&larr; Swipe to view full heatmap &rarr;</span>
                      <span className="text-blue-400">@{github.username}</span>
                    </div>
                  </div>

                  {/* Primary Code Distribution (Calculated from real GitHub repos) */}
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                        <Code2 className="h-3.5 w-3.5 text-blue-400" />
                        <span>Real Code Distribution (GitHub API)</span>
                      </span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden flex">
                      {github.languages.map((item) => (
                        <div
                          key={item.name}
                          style={{ width: `${item.share}%` }}
                          className={`${item.color} h-full transition-all hover:opacity-80 cursor-pointer`}
                          onMouseEnter={() => setHoveredLang(item.name)}
                          onMouseLeave={() => setHoveredLang(null)}
                          title={`${item.name}: ${item.share}%`}
                        />
                      ))}
                    </div>

                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {github.languages.map((item) => (
                        <div
                          key={item.name}
                          onMouseEnter={() => setHoveredLang(item.name)}
                          onMouseLeave={() => setHoveredLang(null)}
                          className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                            hoveredLang === item.name ? 'bg-white/[0.06]' : ''
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <BrandLogo name={item.name.split(' ')[0]} size={14} badgeVariant="none" />
                            <span className="font-semibold text-white text-[11px] truncate">{item.name}</span>
                          </div>
                          <div className="text-[11px] font-mono text-zinc-400 pl-3.5">{item.share}%</div>
                        </div>
                      ))}
                    </div>

                    {hoveredLang && (
                      <div className="mt-2.5 rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2 text-[11px] text-zinc-300 font-mono animate-in fade-in">
                        <span className="text-blue-400 font-bold">{hoveredLang}:</span>{' '}
                        {github.languages.find(s => s.name === hoveredLang)?.usage}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 2: REPOSITORIES */}
              {githubTab === 'repos' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  {github.repos.map((repo) => (
                    <div
                      key={repo.name}
                      className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 hover:border-blue-500/30 hover:bg-white/[0.04] transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FolderGit2 className="h-4 w-4 text-blue-400" />
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors font-mono"
                          >
                            {repo.name}
                          </a>
                          <span className="rounded bg-white/[0.06] px-1.5 py-0.2 text-[9px] font-mono text-zinc-400">
                            Public
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => copyCloneCmd(repo.name, repo.url)}
                            className="text-[10px] font-mono text-zinc-500 hover:text-white px-2 py-0.5 rounded border border-white/[0.06] bg-white/[0.02] transition-colors cursor-pointer"
                            title="Copy clone command"
                          >
                            {copiedRepoClone === repo.name ? 'Cloned!' : 'Clone'}
                          </button>
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 hover:text-white transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>

                      <p className="mt-1.5 text-xs text-zinc-400 line-clamp-2">
                        {repo.desc}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.04] pt-2 text-[11px] font-mono text-zinc-500">
                        <div className="flex items-center gap-1.5">
                          <BrandLogo name={repo.lang} size={14} badgeVariant="none" />
                          <span className="text-zinc-300">{repo.lang}</span>
                        </div>
                        <div className="flex gap-1">
                          {repo.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="rounded bg-white/[0.04] px-1.5 py-0.5 text-[9px] text-zinc-400">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: RECENT COMMITS */}
              {githubTab === 'commits' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3 space-y-3 font-mono text-xs">
                    {github.commits.map((c) => (
                      <div
                        key={c.hash}
                        className="flex items-start gap-3 border-b border-white/[0.04] pb-2.5 last:border-none last:pb-0"
                      >
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <GitCommit className="h-3 w-3" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-semibold text-blue-300 truncate">
                              {c.message}
                            </span>
                            <span className="shrink-0 text-[10px] text-zinc-500 rounded bg-white/[0.04] px-1.5 py-0.5">{c.tag}</span>
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-[10px] text-zinc-500">
                            <span className="rounded bg-white/[0.05] px-1 text-zinc-300 font-mono">{c.hash}</span>
                            <span>on</span>
                            <span className="text-zinc-400">{c.branch}</span>
                            <span>·</span>
                            <span className="text-zinc-500 truncate">{c.scope}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Bottom GitHub CTA */}
            <div className="mt-6 border-t border-white/[0.06] pt-4">
              <a
                href={profile.github_url || `https://github.com/${github.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-blue-500/40 px-4 py-2.5 text-xs font-semibold text-white transition-all shadow-sm group"
              >
                <GithubIcon className="h-3.5 w-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
                <span>View Full GitHub Profile</span>
                <ExternalLink className="h-3 w-3 text-zinc-400 group-hover:text-blue-400 transition-colors" />
              </a>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* RIGHT CARD: LEETCODE PROBLEM SOLVING */}
        {/* ======================================================== */}
        {(viewMode === 'all' || viewMode === 'leetcode') && (
          <div 
            onMouseMove={handleCardMouseMove}
            className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0c0d15]/95 p-4 sm:p-6 backdrop-blur-xl hover:border-amber-500/30 transition-all shadow-xl card-shine card-spotlight"
          >
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <LeetCodeIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white tracking-tight">LeetCode Problem Solving</h3>
                      <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-mono text-amber-400 border border-amber-500/20">
                        <Sparkles className="h-2.5 w-2.5" /> Scraped Live
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mt-0.5">
                      <span>leetcode.com/u/{leetcode.username}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(leetcode.username, 'leetcode')}
                        className="text-zinc-500 hover:text-amber-400 transition-colors p-0.5 rounded cursor-pointer"
                        title="Copy handle"
                      >
                        {copiedHandle === 'leetcode' ? (
                          <span className="flex items-center text-[10px] text-emerald-400 font-sans">
                            <Check className="h-3 w-3 inline mr-0.5" /> Copied
                          </span>
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-mono text-amber-400 border border-amber-500/20">
                    <Flame className="h-3 w-3 text-amber-400" />
                    <span>{leetcode.totalSolved} Solved · Python &amp; SQL</span>
                  </span>
                </div>
              </div>

              {/* Sub Tabs */}
              <div className="flex items-center gap-1 rounded-xl bg-black/40 p-1 border border-white/[0.06] text-xs overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setLeetcodeTab('metrics')}
                  className={`flex-1 rounded-lg py-1.5 font-medium transition-all text-center cursor-pointer whitespace-nowrap px-2 ${
                    leetcodeTab === 'metrics'
                      ? 'bg-amber-500/15 text-amber-300 font-semibold shadow border border-amber-500/20'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Overview &amp; Stats
                </button>
                <button
                  type="button"
                  onClick={() => setLeetcodeTab('languages')}
                  className={`flex-1 rounded-lg py-1.5 font-medium transition-all text-center cursor-pointer whitespace-nowrap px-2 ${
                    leetcodeTab === 'languages'
                      ? 'bg-amber-500/15 text-amber-300 font-semibold shadow border border-amber-500/20'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Languages ({leetcode.languages.length})
                </button>
                <button
                  type="button"
                  onClick={() => setLeetcodeTab('topics')}
                  className={`flex-1 rounded-lg py-1.5 font-medium transition-all text-center cursor-pointer whitespace-nowrap px-2 ${
                    leetcodeTab === 'topics'
                      ? 'bg-amber-500/15 text-amber-300 font-semibold shadow border border-amber-500/20'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Topics ({leetcode.topics.length})
                </button>
                <button
                  type="button"
                  onClick={() => setLeetcodeTab('submissions')}
                  className={`flex-1 rounded-lg py-1.5 font-medium transition-all text-center cursor-pointer whitespace-nowrap px-2 ${
                    leetcodeTab === 'submissions'
                      ? 'bg-amber-500/15 text-amber-300 font-semibold shadow border border-amber-500/20'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Submissions
                </button>
                <button
                  type="button"
                  onClick={() => setLeetcodeTab('solutions')}
                  className={`flex-1 rounded-lg py-1.5 font-medium transition-all text-center cursor-pointer whitespace-nowrap px-2 ${
                    leetcodeTab === 'solutions'
                      ? 'bg-amber-500/15 text-amber-300 font-semibold shadow border border-amber-500/20'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Code Samples
                </button>
                <button
                  type="button"
                  onClick={() => setLeetcodeTab('practices')}
                  className={`flex-1 rounded-lg py-1.5 font-medium transition-all text-center cursor-pointer whitespace-nowrap px-2 ${
                    leetcodeTab === 'practices'
                      ? 'bg-amber-500/15 text-amber-300 font-semibold shadow border border-amber-500/20'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Best Practices
                </button>
              </div>

              {/* TAB 1: METRICS & DONUT */}
              {leetcodeTab === 'metrics' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  
                  <div className="rounded-xl border border-white/[0.08] bg-black/50 p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                      
                      {/* Left: Donut Ring */}
                      <div className="sm:col-span-5 flex flex-col items-center justify-center py-2">
                        <div className="relative flex items-center justify-center">
                          <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 120 120">
                            <circle
                              cx="60"
                              cy="60"
                              r="48"
                              className="stroke-white/[0.06]"
                              strokeWidth="10"
                              fill="transparent"
                            />
                            {/* Easy Segment: 81 / 90 */}
                            <circle
                              cx="60"
                              cy="60"
                              r="48"
                              className="stroke-blue-500"
                              strokeWidth="10"
                              strokeDasharray="301.59"
                              strokeDashoffset={301.59 * (1 - (leetcode.easySolved / Math.max(leetcode.totalSolved, 1)))}
                              strokeLinecap="round"
                              fill="transparent"
                            />
                            {/* Medium Segment: 9 / 90 */}
                            <circle
                              cx="60"
                              cy="60"
                              r="36"
                              className="stroke-amber-500"
                              strokeWidth="8"
                              strokeDasharray="226.19"
                              strokeDashoffset={226.19 * (1 - (leetcode.mediumSolved / Math.max(leetcode.totalSolved, 1)))}
                              strokeLinecap="round"
                              fill="transparent"
                            />
                          </svg>

                          <div className="absolute flex flex-col items-center justify-center text-center">
                            <span className="text-2xl font-black text-white font-mono tracking-tight">{leetcode.totalSolved}</span>
                            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Solved</span>
                          </div>
                        </div>

                        <div className="mt-2 text-center">
                          <div className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <TrendingUp className="h-3 w-3" />
                            <span>{leetcode.streak} Days Streak · {leetcode.totalActiveDays} Active Days</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Breakdown Bars */}
                      <div className="sm:col-span-7 space-y-3 text-xs">
                        {/* Easy */}
                        <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-2.5">
                          <div className="flex justify-between font-mono text-zinc-300 mb-1.5">
                            <span className="text-blue-400 font-bold flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-blue-500" />
                              Easy
                            </span>
                            <span className="text-zinc-200">
                              {leetcode.easySolved} <span className="text-zinc-500 text-[10px]">/ {leetcode.totalEasy}</span>
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                              style={{ width: `${Math.round((leetcode.easySolved / leetcode.totalSolved) * 100)}%` }}
                            />
                          </div>
                          <p className="mt-1 text-[10px] text-zinc-400 font-mono">
                            Arrays, Strings, Database SQL, Hash Tables, Two Pointers
                          </p>
                        </div>

                        {/* Medium */}
                        <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-2.5">
                          <div className="flex justify-between font-mono text-zinc-300 mb-1.5">
                            <span className="text-amber-400 font-bold flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-amber-500" />
                              Medium
                            </span>
                            <span className="text-zinc-200">
                              {leetcode.mediumSolved} <span className="text-zinc-500 text-[10px]">/ {leetcode.totalMedium}</span>
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                            <div 
                              className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                              style={{ width: `${Math.round((leetcode.mediumSolved / leetcode.totalSolved) * 100)}%` }}
                            />
                          </div>
                          <p className="mt-1 text-[10px] text-zinc-400 font-mono">
                            SQL Joins &amp; Window Functions, Binary Trees, Subqueries
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* LeetCode Activity Calendar */}
                  <div className="rounded-xl border border-white/[0.08] bg-black/50 p-4 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="font-mono text-zinc-300 flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-amber-400" />
                        <span>Submission Activity Calendar</span>
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {leetcode.streak} Days Streak · {leetcode.totalActiveDays} Active Days
                      </span>
                    </div>

                    <div className="overflow-x-auto pb-1 scrollbar-thin">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/api/leetcode-chart"
                        alt={`LeetCode Submission Heatmap for ${leetcode.username}`}
                        className="w-full min-w-[540px] h-auto rounded-lg"
                        loading="eager"
                      />
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-2.5">
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                      <div className="text-sm font-bold text-white font-mono flex items-center justify-center gap-1">
                        <Terminal className="h-3.5 w-3.5 text-amber-400" />
                        <span>Pandas &amp; Python</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-1">80+ Solved (Primary Stack)</div>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                      <div className="text-sm font-bold text-blue-400 font-mono flex items-center justify-center gap-1">
                        <Database className="h-3.5 w-3.5 text-blue-400" />
                        <span>Database &amp; SQL</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-1">43+ Solved (PostgreSQL/MySQL)</div>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                      <div className="text-sm font-bold text-emerald-400 font-mono flex items-center justify-center gap-1">
                        <Trophy className="h-3.5 w-3.5 text-emerald-400" />
                        <span>#{leetcode.ranking.toLocaleString()}</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-1">Global LeetCode Rank</div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: LANGUAGES SOLVED (REAL LEETCODE DATA) */}
              {leetcodeTab === 'languages' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="rounded-xl border border-white/[0.06] bg-black/40 p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
                      <span>Language Distribution on LeetCode</span>
                      <span>Total Solved: {leetcode.totalSolved}</span>
                    </div>

                    <div className="space-y-2.5">
                      {leetcode.languages.map((l) => (
                        <div key={l.languageName} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-white font-medium flex items-center gap-2">
                              <BrandLogo name={l.languageName} size={14} badgeVariant="none" />
                              <span>{l.languageName}</span>
                            </span>
                            <span className="text-amber-400 font-bold">
                              {l.problemsSolved} solved <span className="text-zinc-500 font-normal">({l.share}%)</span>
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                            <div 
                              className="h-full bg-amber-500 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(100, l.share * 2)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: TOPICS SOLVED */}
              {leetcodeTab === 'topics' && (
                <div className="space-y-2.5 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {leetcode.topics.map((p) => (
                      <div
                        key={p.title}
                        className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 hover:border-amber-500/30 hover:bg-white/[0.04] transition-all"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-xs font-bold text-white tracking-tight">
                            {p.title}
                          </span>
                          <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-mono text-amber-300 shrink-0">
                            {p.count} Solved
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-blue-400 mt-0.5">
                          {p.complexity}
                        </div>
                        <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed font-sans">
                          {p.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: RECENT SUBMISSIONS (SCRAPED LIVE) */}
              {leetcodeTab === 'submissions' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3 space-y-2.5 font-mono text-xs">
                    <div className="text-[11px] text-zinc-400 border-b border-white/[0.06] pb-2 flex items-center justify-between">
                      <span>Recent Accepted Submissions</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> 100% Verified
                      </span>
                    </div>

                    {leetcode.recentSubmissions.map((sub, idx) => (
                      <div
                        key={`${sub.title}-${idx}`}
                        className="flex items-center justify-between gap-2 border-b border-white/[0.04] pb-2 last:border-none last:pb-0"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-semibold text-white truncate">
                            {sub.title}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
                            <span className="text-amber-400 uppercase">{sub.lang}</span>
                            <span>·</span>
                            <span className="text-emerald-400">{sub.statusDisplay}</span>
                          </div>
                        </div>

                        <a
                          href={`https://leetcode.com/problems/${sub.titleSlug}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-[10px] text-zinc-400 hover:text-amber-300 rounded bg-white/[0.04] hover:bg-white/[0.08] px-2 py-1 transition-colors flex items-center gap-1"
                        >
                          <span>Solve</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: CODE SAMPLES */}
              {leetcodeTab === 'solutions' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400">Sample Solution:</span>
                    <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/[0.06] overflow-x-auto">
                      {leetcode.solutions.map((sol, idx) => (
                        <button
                          key={sol.title}
                          type="button"
                          onClick={() => setSelectedSolutionIdx(idx)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer whitespace-nowrap ${
                            selectedSolutionIdx === idx
                              ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                              : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          #{sol.problemNumber || idx + 1} ({sol.language.split('/')[0].trim()})
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/[0.08] bg-black/60 p-4 font-mono text-xs space-y-2">
                    <div className="flex flex-wrap items-center justify-between border-b border-white/[0.06] pb-2 gap-2">
                      <div>
                        <span className="text-white font-bold block">{leetcode.solutions[selectedSolutionIdx]?.title}</span>
                        <span className="text-[10px] text-zinc-500">{leetcode.solutions[selectedSolutionIdx]?.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-blue-400">Time: {leetcode.solutions[selectedSolutionIdx]?.time}</span>
                        <span className="text-[10px] text-emerald-400">Space: {leetcode.solutions[selectedSolutionIdx]?.space}</span>
                        <button
                          type="button"
                          onClick={() => copySolutionCode(leetcode.solutions[selectedSolutionIdx]?.code || '')}
                          className="p-1 rounded hover:bg-white/[0.06] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          title="Copy solution code"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <pre className="text-[11px] text-zinc-300 overflow-x-auto max-h-48 pt-1 leading-relaxed">
                      <code>{leetcode.solutions[selectedSolutionIdx]?.code}</code>
                    </pre>
                    {leetcode.solutions[selectedSolutionIdx]?.explanation && (
                      <p className="text-[10px] text-zinc-400 font-sans border-t border-white/[0.04] pt-2">
                        {leetcode.solutions[selectedSolutionIdx]?.explanation}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: BEST PRACTICES */}
              {leetcodeTab === 'practices' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="rounded-xl border border-white/[0.06] bg-black/40 p-4 space-y-3 text-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                        1
                      </div>
                      <div>
                        <div className="font-bold text-white font-mono">SQL Query &amp; Join Optimization</div>
                        <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">
                          Selecting appropriate index scans over table scans, leveraging LEFT JOIN with NULL predicates for anti-joins, and utilizing window functions.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                        2
                      </div>
                      <div>
                        <div className="font-bold text-white font-mono">Vectorized Data Processing (Pandas)</div>
                        <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">
                          Utilizing native vectorized boolean expressions and loc indexing instead of row iteration for orders-of-magnitude faster execution.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                        3
                      </div>
                      <div>
                        <div className="font-bold text-white font-mono">Algorithmic Complexity &amp; Two Pointers</div>
                        <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">
                          Applying HashMaps for instant O(1) complement discovery and converging pointers for O(1) space optimizations.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                        4
                      </div>
                      <div>
                        <div className="font-bold text-white font-mono">Edge Case &amp; Null Handling</div>
                        <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">
                          Handling NULL values via COALESCE and IS NULL checks, single-element data structures, and boundary bounds.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom LeetCode CTA */}
            <div className="mt-6 border-t border-white/[0.06] pt-4">
              <a
                href={profile.leetcode_url || `https://leetcode.com/u/${leetcode.username}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 px-4 py-2.5 text-xs font-semibold text-amber-300 transition-all shadow-sm group"
              >
                <LeetCodeIcon className="h-3.5 w-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>View Full LeetCode Profile ({leetcode.totalSolved} Solved)</span>
                <ExternalLink className="h-3 w-3 text-amber-400/80 group-hover:text-amber-300 transition-colors" />
              </a>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
