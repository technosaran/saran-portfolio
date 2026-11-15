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
  Layers, 
  TrendingUp, 
  Cpu, 
  Terminal,
  CheckCircle2,
  Code2
} from 'lucide-react';
import { GithubIcon, LeetCodeIcon } from './SocialIcons';
import { Profile, Project, Skill } from '@/lib/neon/db';
import { useToast } from './Toast';
import BrandLogo from './BrandLogo';

interface ActivityShowcaseProps {
  profile: Profile;
  projects?: Project[];
  skills?: Skill[];
}

const SAMPLE_JAVA_SOLUTIONS = [
  {
    title: 'Two Sum (LeetCode 1)',
    difficulty: 'Easy',
    time: 'O(N)',
    space: 'O(N)',
    code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`
  },
  {
    title: 'Valid Anagram (LeetCode 242)',
    difficulty: 'Easy',
    time: 'O(N)',
    space: 'O(1)',
    code: `class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] freq = new int[26];
        for (int i = 0; i < s.length(); i++) {
            freq[s.charAt(i) - 'a']++;
            freq[t.charAt(i) - 'a']--;
        }
        for (int count : freq) {
            if (count != 0) return false;
        }
        return true;
    }
}`
  },
  {
    title: 'Reverse Linked List (LeetCode 206)',
    difficulty: 'Easy',
    time: 'O(N)',
    space: 'O(1)',
    code: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }
}`
  }
];

export default function ActivityShowcase({ profile, projects = [], skills = [] }: ActivityShowcaseProps) {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'all' | 'github' | 'leetcode'>('all');
  const [githubTab, setGithubTab] = useState<'heatmap' | 'repos' | 'commits'>('heatmap');
  const [leetcodeTab, setLeetcodeTab] = useState<'metrics' | 'patterns' | 'solutions' | 'practices'>('metrics');
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);
  const [copiedRepoClone, setCopiedRepoClone] = useState<string | null>(null);
  const [selectedSolutionIdx, setSelectedSolutionIdx] = useState(0);
  const [hoveredLang, setHoveredLang] = useState<string | null>(null);

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

  const copyJavaCode = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
      toast('Java solution copied to clipboard!', 'success');
    } catch {
      toast('Failed to copy code', 'error');
    }
  };

  // Stack breakdown calculation
  const stackBreakdown = useMemo(() => {
    return [
      { name: 'Java', share: 40, color: 'bg-amber-500', textColor: 'text-amber-400', usage: 'Core DSA (90+ LeetCode problems), Object-Oriented Programming' },
      { name: 'TypeScript / React', share: 30, color: 'bg-blue-500', textColor: 'text-blue-400', usage: 'Next.js 16 App Router, arthaX Wealth Terminal, Web UI' },
      { name: 'Python', share: 20, color: 'bg-emerald-500', textColor: 'text-emerald-400', usage: 'PyTorch deep learning, OpenCV computer vision, SpaCy NLP' },
      { name: 'SQL & Cloud', share: 10, color: 'bg-indigo-500', textColor: 'text-indigo-400', usage: 'PostgreSQL, Supabase RLS, AWS EC2 & S3, Docker' }
    ];
  }, []);

  // Featured repositories
  const featuredRepos = useMemo(() => {
    if (projects && projects.length > 0) {
      return projects.map((p) => {
        const titleLower = p.title.toLowerCase();
        let lang = 'TypeScript';
        if (titleLower.includes('object') || titleLower.includes('vision') || titleLower.includes('detection') || titleLower.includes('ner') || titleLower.includes('nlp')) {
          lang = 'Python';
        } else if (titleLower.includes('java') || titleLower.includes('dsa')) {
          lang = 'Java';
        }

        const safeSlug = p.title
          .split('–')[0]
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-');

        return {
          name: safeSlug || `project-${p.id}`,
          desc: p.description,
          lang,
          tags: p.tech_stack || [],
          url: p.github_url || profile.github_url || 'https://github.com/technosaran'
        };
      });
    }

    return [
      {
        name: 'arthaX',
        desc: 'Personal wealth tracking application with PostgreSQL and Supabase Row Level Security.',
        lang: 'TypeScript',
        tags: ['Next.js 16', 'PostgreSQL', 'Supabase', 'Tailwind CSS'],
        url: 'https://github.com/technosaran/arthax'
      },
      {
        name: 'realtime-object-detection',
        desc: 'Computer vision application detecting objects in live video using PyTorch and OpenCV.',
        lang: 'Python',
        tags: ['Python', 'OpenCV', 'PyTorch'],
        url: 'https://github.com/technosaran/realtime-object-detection'
      },
      {
        name: 'ner-system-nlp',
        desc: 'Natural Language Processing pipeline extracting structured entities from text datasets.',
        lang: 'Python',
        tags: ['Python', 'NLP', 'SpaCy'],
        url: 'https://github.com/technosaran/ner-system-nlp'
      }
    ];
  }, [projects, profile.github_url]);

  // Clean, realistic repository updates
  const recentCommits = [
    {
      hash: 'b30176f',
      branch: 'main',
      message: 'feat: add site verification meta tags and structured schemas',
      tag: 'Latest',
      scope: 'technosaran/arthax'
    },
    {
      hash: '9858cf8',
      branch: 'main',
      message: 'feat: add privacy policy and terms of service documentation',
      tag: 'Release',
      scope: 'technosaran/arthax'
    },
    {
      hash: '7068d5f',
      branch: 'main',
      message: 'refactor: integrate brand logos and clean UI asset fallbacks',
      tag: 'Update',
      scope: 'technosaran/arthax'
    },
    {
      hash: '6bf27ca',
      branch: 'main',
      message: 'fix: optimize responsive layout and card contrast for dark mode',
      tag: 'Fix',
      scope: 'technosaran/arthax'
    },
    {
      hash: 'facf804',
      branch: 'main',
      message: 'feat: dynamic database hydration and clean portfolio architecture',
      tag: 'Milestone',
      scope: 'technosaran/saran-portfolio'
    }
  ];

  // Algorithmic patterns
  const algorithmicPatterns = [
    {
      title: 'Arrays & Two Pointers',
      count: '25 Solved',
      complexity: 'O(N) Time · O(1) Space',
      desc: 'Sorted array pairs, sliding window substrings, container with most water, and deduplication.',
      tag: 'Arrays'
    },
    {
      title: 'Hash Tables & Sets',
      count: '20 Solved',
      complexity: 'O(1) Average Lookup',
      desc: 'Frequency mapping, element complement lookups, anagram grouping, and duplicate detection.',
      tag: 'Hash Table'
    },
    {
      title: 'Binary Trees & BFS/DFS',
      count: '15 Solved',
      complexity: 'O(N) Traversal',
      desc: 'Inorder/preorder/postorder traversals, tree depth, symmetry checking, and subtree validation.',
      tag: 'Trees'
    },
    {
      title: 'Linked Lists',
      count: '12 Solved',
      complexity: 'O(N) Time · O(1) Space',
      desc: 'List reversal, fast/slow pointer cycle detection, merging sorted lists, and removal of nodes.',
      tag: 'Linked List'
    },
    {
      title: 'Stack & Queue',
      count: '10 Solved',
      complexity: 'O(N) Time · O(N) Space',
      desc: 'Valid parentheses matching, monotonic stacks, and breadth-first level order traversal.',
      tag: 'Stack'
    },
    {
      title: 'Binary Search & Math',
      count: '8 Solved',
      complexity: 'O(log N) Time',
      desc: 'Search in sorted arrays, search insert position, square root calculation, and peak finding.',
      tag: 'Binary Search'
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Coding Activity &amp; Problem Solving</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            GitHub repository development and algorithmic problem solving on LeetCode.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center rounded-xl bg-white/[0.04] p-1 border border-white/[0.08]">
          <button
            type="button"
            onClick={() => setViewMode('all')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Unified View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('github')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'github'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <GithubIcon className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('leetcode')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'leetcode'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LeetCodeIcon className="h-3.5 w-3.5" />
            <span>LeetCode</span>
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
            className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0c0d15]/95 p-6 backdrop-blur-xl hover:border-blue-500/30 transition-all shadow-xl card-shine card-spotlight"
          >
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.08] text-white">
                    <GithubIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">GitHub Development</h3>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                      <span>github.com/technosaran</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('technosaran', 'github')}
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
                    <span>Public Repositories</span>
                  </span>
                </div>
              </div>

              {/* Sub Tabs */}
              <div className="flex items-center gap-1 rounded-xl bg-black/40 p-1 border border-white/[0.06] text-xs">
                <button
                  type="button"
                  onClick={() => setGithubTab('heatmap')}
                  className={`flex-1 rounded-lg py-1.5 font-medium transition-all text-center cursor-pointer ${
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
                  className={`flex-1 rounded-lg py-1.5 font-medium transition-all text-center cursor-pointer ${
                    githubTab === 'repos'
                      ? 'bg-white/[0.08] text-white font-semibold shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Repositories
                </button>
                <button
                  type="button"
                  onClick={() => setGithubTab('commits')}
                  className={`flex-1 rounded-lg py-1.5 font-medium transition-all text-center cursor-pointer ${
                    githubTab === 'commits'
                      ? 'bg-white/[0.08] text-white font-semibold shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Recent Updates
                </button>
              </div>

              {/* TAB 1: HEATMAP & STACK BREAKDOWN */}
              {githubTab === 'heatmap' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  
                  {/* Heatmap */}
                  <div className="rounded-xl border border-white/[0.08] bg-black/50 p-4 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="font-mono text-zinc-300 flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-blue-400" />
                        <span>Contribution Graph</span>
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        @technosaran
                      </span>
                    </div>

                    <div className="overflow-x-auto pb-1 scrollbar-thin">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/api/github-chart"
                        alt="Saran R GitHub Contribution Heatmap"
                        className="w-full min-w-[500px] h-auto rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Tech Stack Breakdown */}
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                        <Code2 className="h-3.5 w-3.5 text-blue-400" />
                        <span>Primary Code Distribution</span>
                      </span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden flex">
                      {stackBreakdown.map((item) => (
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
                      {stackBreakdown.map((item) => (
                        <div
                          key={item.name}
                          onMouseEnter={() => setHoveredLang(item.name)}
                          onMouseLeave={() => setHoveredLang(null)}
                          className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                            hoveredLang === item.name ? 'bg-white/[0.06]' : ''
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <BrandLogo name={item.name} size={14} badgeVariant="none" />
                            <span className="font-semibold text-white text-[11px]">{item.name}</span>
                          </div>
                          <div className="text-[11px] font-mono text-zinc-400 pl-3.5">{item.share}%</div>
                        </div>
                      ))}
                    </div>

                    {hoveredLang && (
                      <div className="mt-2.5 rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2 text-[11px] text-zinc-300 font-mono animate-in fade-in">
                        <span className="text-blue-400 font-bold">{hoveredLang}:</span>{' '}
                        {stackBreakdown.find(s => s.name === hoveredLang)?.usage}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 2: REPOSITORIES */}
              {githubTab === 'repos' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  {featuredRepos.map((repo) => (
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
                    {recentCommits.map((c) => (
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
                href={profile.github_url || 'https://github.com/technosaran'}
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
            className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0c0d15]/95 p-6 backdrop-blur-xl hover:border-amber-500/30 transition-all shadow-xl card-shine card-spotlight"
          >
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <LeetCodeIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">LeetCode Problem Solving</h3>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                      <span>leetcode.com/u/Saran-R</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('Saran-R', 'leetcode')}
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
                    <span>Java Solutions</span>
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
                  onClick={() => setLeetcodeTab('patterns')}
                  className={`flex-1 rounded-lg py-1.5 font-medium transition-all text-center cursor-pointer whitespace-nowrap px-2 ${
                    leetcodeTab === 'patterns'
                      ? 'bg-amber-500/15 text-amber-300 font-semibold shadow border border-amber-500/20'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Topics
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

              {/* TAB 1: METRICS */}
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
                              strokeDashoffset="30"
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
                              strokeDashoffset="190"
                              strokeLinecap="round"
                              fill="transparent"
                            />
                          </svg>

                          <div className="absolute flex flex-col items-center justify-center text-center">
                            <span className="text-2xl font-black text-white font-mono tracking-tight">90+</span>
                            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Solved</span>
                          </div>
                        </div>

                        <div className="mt-2 text-center">
                          <div className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <TrendingUp className="h-3 w-3" />
                            <span>81 Easy · 9 Medium (Java)</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Breakdown Bars */}
                      <div className="sm:col-span-7 space-y-3 text-xs">
                        <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-2.5">
                          <div className="flex justify-between font-mono text-zinc-300 mb-1.5">
                            <span className="text-blue-400 font-bold flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-blue-500" />
                              Easy
                            </span>
                            <span className="text-zinc-200">81 Solved</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full w-[90%]" />
                          </div>
                          <p className="mt-1 text-[10px] text-zinc-400 font-mono">
                            Arrays, Strings, Hash Tables, Two Pointers
                          </p>
                        </div>

                        <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-2.5">
                          <div className="flex justify-between font-mono text-zinc-300 mb-1.5">
                            <span className="text-amber-400 font-bold flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-amber-500" />
                              Medium
                            </span>
                            <span className="text-zinc-200">9 Solved</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full w-[10%]" />
                          </div>
                          <p className="mt-1 text-[10px] text-zinc-400 font-mono">
                            Binary Trees, BFS/DFS, Linked Lists, Stack
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                      <div className="text-sm font-bold text-white font-mono flex items-center justify-center gap-1">
                        <Terminal className="h-3.5 w-3.5 text-amber-400" />
                        <span>Java</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-1">Primary Language</div>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                      <div className="text-sm font-bold text-blue-400 font-mono flex items-center justify-center gap-1">
                        <Code2 className="h-3.5 w-3.5 text-blue-400" />
                        <span>Arrays &amp; Strings</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-1">Strongest Topics</div>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                      <div className="text-sm font-bold text-emerald-400 font-mono flex items-center justify-center gap-1">
                        <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                        <span>O(1) Space</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-1">Optimized Solutions</div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: PATTERNS & TOPICS */}
              {leetcodeTab === 'patterns' && (
                <div className="space-y-2.5 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {algorithmicPatterns.map((p) => (
                      <div
                        key={p.title}
                        className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 hover:border-amber-500/30 hover:bg-white/[0.04] transition-all"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-xs font-bold text-white tracking-tight">
                            {p.title}
                          </span>
                          <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-mono text-amber-300 shrink-0">
                            {p.count}
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

              {/* TAB 3: CODE SAMPLES */}
              {leetcodeTab === 'solutions' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400">Sample Solution:</span>
                    <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/[0.06]">
                      {SAMPLE_JAVA_SOLUTIONS.map((sol, idx) => (
                        <button
                          key={sol.title}
                          type="button"
                          onClick={() => setSelectedSolutionIdx(idx)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                            selectedSolutionIdx === idx
                              ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                              : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          #{idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/[0.08] bg-black/60 p-4 font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <span className="text-white font-bold">{SAMPLE_JAVA_SOLUTIONS[selectedSolutionIdx].title}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-blue-400">Time: {SAMPLE_JAVA_SOLUTIONS[selectedSolutionIdx].time}</span>
                        <span className="text-[10px] text-emerald-400">Space: {SAMPLE_JAVA_SOLUTIONS[selectedSolutionIdx].space}</span>
                        <button
                          type="button"
                          onClick={() => copyJavaCode(SAMPLE_JAVA_SOLUTIONS[selectedSolutionIdx].code)}
                          className="p-1 rounded hover:bg-white/[0.06] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          title="Copy Java code"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <pre className="text-[11px] text-zinc-300 overflow-x-auto max-h-48 pt-1 leading-relaxed">
                      <code>{SAMPLE_JAVA_SOLUTIONS[selectedSolutionIdx].code}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 4: BEST PRACTICES */}
              {leetcodeTab === 'practices' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="rounded-xl border border-white/[0.06] bg-black/40 p-4 space-y-3 text-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                        1
                      </div>
                      <div>
                        <div className="font-bold text-white font-mono">Time &amp; Space Complexity Analysis</div>
                        <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">
                          Evaluating input constraints upfront to ensure optimal algorithmic bounds (e.g. O(N) or O(N log N)).
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                        2
                      </div>
                      <div>
                        <div className="font-bold text-white font-mono">Edge Case Validation</div>
                        <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">
                          Handling empty arrays, single-element collections, boundary indices, and numeric overflow.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                        3
                      </div>
                      <div>
                        <div className="font-bold text-white font-mono">Efficient Data Structures</div>
                        <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">
                          Applying HashMaps for instant lookup, Two Pointers for space savings, and Stacks for balanced matching.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                        4
                      </div>
                      <div>
                        <div className="font-bold text-white font-mono">Clean Java Implementation</div>
                        <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">
                          Descriptive variable naming, modular helper functions, and readable algorithmic logic.
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
                href={profile.leetcode_url || 'https://leetcode.com/u/Saran-R/'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 px-4 py-2.5 text-xs font-semibold text-amber-300 transition-all shadow-sm group"
              >
                <LeetCodeIcon className="h-3.5 w-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>View Full LeetCode Profile</span>
                <ExternalLink className="h-3 w-3 text-amber-400/80 group-hover:text-amber-300 transition-colors" />
              </a>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
