import dns from 'node:dns';

// Ensure IPv4 first to avoid Windows Node.js undici IPv6 connection timeouts
try {
  dns.setDefaultResultOrder('ipv4first');
} catch {
  // Ignore in environments where not supported
}

export interface GitHubRepoItem {
  name: string;
  desc: string;
  lang: string;
  tags: string[];
  url: string;
  stars: number;
  forks: number;
  pushedAt: string;
}

export interface GitHubCommitItem {
  hash: string;
  branch: string;
  message: string;
  tag: string;
  scope: string;
  date: string;
}

export interface GitHubLanguageItem {
  name: string;
  share: number;
  bytes: number;
  color: string;
  textColor: string;
  usage: string;
}

export interface GitHubActivityData {
  username: string;
  name: string;
  avatarUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  languages: GitHubLanguageItem[];
  repos: GitHubRepoItem[];
  commits: GitHubCommitItem[];
  totalContributions: number;
}

const FALLBACK_GITHUB_DATA: GitHubActivityData = {
  username: 'technosaran',
  name: 'SARAN',
  avatarUrl: 'https://avatars.githubusercontent.com/u/130437013?v=4',
  publicRepos: 3,
  followers: 5,
  following: 5,
  totalContributions: 67,
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

export async function fetchGitHubData(username = 'technosaran'): Promise<GitHubActivityData> {
  const headers: HeadersInit = {
    'User-Agent': 'technosaran-portfolio-app',
    'Accept': 'application/vnd.github.v3+json'
  };

  try {
    // 1. Fetch User Profile
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers,
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000)
    });

    if (!userRes.ok) {
      console.warn(`[GITHUB API] User fetch failed with ${userRes.status}, using verified fallback`);
      return FALLBACK_GITHUB_DATA;
    }

    const userData = await userRes.json();

    // 2. Fetch Repositories
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=10`, {
      headers,
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000)
    });

    let reposList = FALLBACK_GITHUB_DATA.repos;
    const langTotals: Record<string, number> = {};

    if (reposRes.ok) {
      const rawRepos = await reposRes.json();
      if (Array.isArray(rawRepos) && rawRepos.length > 0) {
        reposList = rawRepos.map((r: {
          name: string;
          description: string | null;
          language: string | null;
          html_url: string;
          stargazers_count: number;
          forks_count: number;
          pushed_at: string;
          topics?: string[];
        }) => {
          const tags: string[] = [];
          if (r.language) tags.push(r.language);
          if (r.topics && Array.isArray(r.topics)) tags.push(...r.topics);
          if (r.name.toLowerCase().includes('portfolio')) tags.push('Next.js', 'Postgres');
          if (r.name.toLowerCase().includes('arthax')) tags.push('Supabase', 'Next.js');
          if (r.name.toLowerCase().includes('algo')) tags.push('DSA', 'Algorithms');

          return {
            name: r.name,
            desc: r.description || (r.name === 'arthaX' 
              ? 'Full-stack personal wealth tracking terminal engineered with PostgreSQL and Next.js.' 
              : r.name === 'orion-algo' 
              ? 'Algorithmic problem solving and data structure implementations.'
              : 'Production portfolio web application built with Next.js 16 and Neon Serverless Postgres.'),
            lang: r.language || 'TypeScript',
            tags: Array.from(new Set(tags)).slice(0, 4),
            url: r.html_url,
            stars: r.stargazers_count || 0,
            forks: r.forks_count || 0,
            pushedAt: r.pushed_at
          };
        });

        // 3. Fetch Languages per repo
        for (const r of rawRepos.slice(0, 5)) {
          if (r.languages_url) {
            try {
              const lRes = await fetch(r.languages_url, {
                headers,
                next: { revalidate: 3600 },
                signal: AbortSignal.timeout(3000)
              });
              if (lRes.ok) {
                const langs = await lRes.json();
                for (const [k, v] of Object.entries(langs)) {
                  langTotals[k] = (langTotals[k] || 0) + (Number(v) || 0);
                }
              }
            } catch {
              // Ignore single repo language failure
            }
          }
        }
      }
    }

    // Compute language percentages
    let calculatedLanguages = FALLBACK_GITHUB_DATA.languages;
    const totalBytes = Object.values(langTotals).reduce((a, b) => a + b, 0);

    if (totalBytes > 0) {
      const langEntries = Object.entries(langTotals)
        .map(([name, bytes]) => ({
          name,
          bytes,
          share: Math.max(1, Math.round((bytes / totalBytes) * 100))
        }))
        .sort((a, b) => b.bytes - a.bytes);

      // Normalize percentages to sum to 100
      const sumShare = langEntries.reduce((acc, curr) => acc + curr.share, 0);
      if (sumShare !== 100 && langEntries.length > 0) {
        langEntries[0].share += 100 - sumShare;
      }

      calculatedLanguages = langEntries.slice(0, 4).map(l => {
        let color = 'bg-blue-500';
        let textColor = 'text-blue-400';
        let usage = 'Core development';

        if (l.name === 'TypeScript') {
          color = 'bg-blue-500';
          textColor = 'text-blue-400';
          usage = 'Next.js 16 App Router, arthaX Wealth Terminal, Modern UI components';
        } else if (l.name === 'PLpgSQL' || l.name === 'SQL') {
          color = 'bg-indigo-500';
          textColor = 'text-indigo-400';
          usage = 'PostgreSQL schemas, Supabase Row-Level Security, Database functions';
        } else if (l.name === 'Python') {
          color = 'bg-emerald-500';
          textColor = 'text-emerald-400';
          usage = 'PyTorch deep learning, OpenCV computer vision, SpaCy NLP pipelines';
        } else if (l.name === 'JavaScript' || l.name === 'HTML' || l.name === 'CSS') {
          color = 'bg-amber-500';
          textColor = 'text-amber-400';
          usage = 'Interactive DOM interactions, Tailwind styling, automation tooling';
        }

        return {
          name: l.name === 'PLpgSQL' ? 'SQL & PLpgSQL' : l.name,
          share: l.share,
          bytes: l.bytes,
          color,
          textColor,
          usage
        };
      });
    }

    // 4. Fetch Real Commits from primary repos
    let commitList = FALLBACK_GITHUB_DATA.commits;
    try {
      const [portfolioCommitsRes, arthaCommitsRes] = await Promise.allSettled([
        fetch(`https://api.github.com/repos/${username}/saran-portfolio/commits?per_page=4`, {
          headers,
          next: { revalidate: 3600 },
          signal: AbortSignal.timeout(4000)
        }),
        fetch(`https://api.github.com/repos/${username}/arthaX/commits?per_page=3`, {
          headers,
          next: { revalidate: 3600 },
          signal: AbortSignal.timeout(4000)
        })
      ]);

      const allFetchedCommits: GitHubCommitItem[] = [];

      if (portfolioCommitsRes.status === 'fulfilled' && portfolioCommitsRes.value.ok) {
        const raw = await portfolioCommitsRes.value.json();
        if (Array.isArray(raw)) {
          for (const c of raw) {
            allFetchedCommits.push({
              hash: c.sha ? c.sha.substring(0, 7) : 'facf804',
              branch: 'main',
              message: (c.commit?.message || 'feat: update portfolio').split('\n')[0],
              tag: allFetchedCommits.length === 0 ? 'Latest' : 'Update',
              scope: `${username}/saran-portfolio`,
              date: c.commit?.author?.date || new Date().toISOString()
            });
          }
        }
      }

      if (arthaCommitsRes.status === 'fulfilled' && arthaCommitsRes.value.ok) {
        const raw = await arthaCommitsRes.value.json();
        if (Array.isArray(raw)) {
          for (const c of raw) {
            allFetchedCommits.push({
              hash: c.sha ? c.sha.substring(0, 7) : 'a8907a1',
              branch: 'main',
              message: (c.commit?.message || 'feat: update arthaX').split('\n')[0],
              tag: 'Release',
              scope: `${username}/arthaX`,
              date: c.commit?.author?.date || new Date().toISOString()
            });
          }
        }
      }

      if (allFetchedCommits.length > 0) {
        allFetchedCommits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        commitList = allFetchedCommits.slice(0, 5);
      }
    } catch {
      // Use fallback commits
    }

    // 5. Total Contributions count
    let totalContribs = 67;
    try {
      const contribRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(4000)
      });
      if (contribRes.ok) {
        const cData = await contribRes.json();
        if (cData?.total?.lastYear) {
          totalContribs = cData.total.lastYear;
        }
      }
    } catch {
      // Fallback
    }

    return {
      username,
      name: userData.name || 'SARAN',
      avatarUrl: userData.avatar_url || FALLBACK_GITHUB_DATA.avatarUrl,
      publicRepos: userData.public_repos || reposList.length,
      followers: userData.followers || 5,
      following: userData.following || 5,
      totalContributions: totalContribs,
      languages: calculatedLanguages,
      repos: reposList,
      commits: commitList
    };
  } catch (err) {
    console.warn('[GITHUB SERVICE ERROR] Fallback engaged:', err instanceof Error ? err.message : String(err));
    return FALLBACK_GITHUB_DATA;
  }
}
