import dns from 'node:dns';

// Ensure IPv4 first to avoid Windows Node.js undici IPv6 connection timeouts
try {
  dns.setDefaultResultOrder('ipv4first');
} catch {
  // Ignore in environments where not supported
}

export interface LeetCodeDifficultyCount {
  difficulty: 'All' | 'Easy' | 'Medium' | 'Hard';
  count: number;
  submissions: number;
}

export interface LeetCodeLanguageStat {
  languageName: string;
  problemsSolved: number;
  share: number;
}

export interface LeetCodeTopicStat {
  title: string;
  tagSlug: string;
  count: number;
  complexity: string;
  desc: string;
  tag: string;
}

export interface LeetCodeRecentSubmission {
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
}

export interface LeetCodeSolutionItem {
  title: string;
  problemNumber: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  language: string;
  time: string;
  space: string;
  code: string;
  explanation: string;
}

export interface LeetCodeActivityData {
  username: string;
  ranking: number;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
  acceptanceRate: number;
  streak: number;
  totalActiveDays: number;
  languages: LeetCodeLanguageStat[];
  topics: LeetCodeTopicStat[];
  recentSubmissions: LeetCodeRecentSubmission[];
  solutions: LeetCodeSolutionItem[];
}

export const FALLBACK_LEETCODE_DATA: LeetCodeActivityData = {
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

export async function fetchLeetCodeData(username = 'Saran-R'): Promise<LeetCodeActivityData> {
  try {
    // 1. Primary: Direct LeetCode GraphQL Query
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            reputation
            starRating
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          languageProblemCount {
            languageName
            problemsSolved
          }
          tagProblemCounts {
            fundamental {
              tagName
              tagSlug
              problemsSolved
            }
            intermediate {
              tagName
              tagSlug
              problemsSolved
            }
            advanced {
              tagName
              tagSlug
              problemsSolved
            }
          }
          userCalendar {
            streak
            totalActiveDays
          }
        }
      }
    `;

    const gqlRes = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(6000)
    });

    if (gqlRes.ok) {
      const gqlData = await gqlRes.json();
      const matchedUser = gqlData?.data?.matchedUser;

      if (matchedUser) {
        const stats = matchedUser.submitStatsGlobal?.acSubmissionNum || [];
        const allStats = stats.find((s: LeetCodeDifficultyCount) => s.difficulty === 'All') || { count: 90, submissions: 274 };
        const easyStats = stats.find((s: LeetCodeDifficultyCount) => s.difficulty === 'Easy') || { count: 81, submissions: 257 };
        const mediumStats = stats.find((s: LeetCodeDifficultyCount) => s.difficulty === 'Medium') || { count: 9, submissions: 17 };
        const hardStats = stats.find((s: LeetCodeDifficultyCount) => s.difficulty === 'Hard') || { count: 0, submissions: 0 };

        // Parse language stats
        const rawLangs = matchedUser.languageProblemCount || [];
        const totalSolvedLang = rawLangs.reduce((acc: number, curr: { problemsSolved: number }) => acc + curr.problemsSolved, 0) || allStats.count;
        const languages: LeetCodeLanguageStat[] = rawLangs.map((l: { languageName: string; problemsSolved: number }) => ({
          languageName: l.languageName,
          problemsSolved: l.problemsSolved,
          share: Math.max(1, Math.round((l.problemsSolved / totalSolvedLang) * 100))
        })).sort((a: LeetCodeLanguageStat, b: LeetCodeLanguageStat) => b.problemsSolved - a.problemsSolved);

        // Parse topics from fundamental, intermediate, advanced
        const tagMap = new Map<string, number>();
        const addTags = (arr?: Array<{ tagName: string; problemsSolved: number }>) => {
          if (Array.isArray(arr)) {
            for (const item of arr) {
              tagMap.set(item.tagName, (tagMap.get(item.tagName) || 0) + item.problemsSolved);
            }
          }
        };
        addTags(matchedUser.tagProblemCounts?.fundamental);
        addTags(matchedUser.tagProblemCounts?.intermediate);
        addTags(matchedUser.tagProblemCounts?.advanced);

        const topics: LeetCodeTopicStat[] = Array.from(tagMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([name, count]) => {
            const fallback = FALLBACK_LEETCODE_DATA.topics.find(t => t.title.toLowerCase().includes(name.toLowerCase()));
            return {
              title: fallback?.title || name,
              tagSlug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              count,
              complexity: fallback?.complexity || 'O(N) Optimal',
              desc: fallback?.desc || `Demonstrated proficiency in ${name} algorithmic paradigms.`,
              tag: fallback?.tag || name
            };
          });

        // 2. Fetch Recent Submissions (Public mirror or fallback)
        let recentSubs = FALLBACK_LEETCODE_DATA.recentSubmissions;
        try {
          const mirrorRes = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`, {
            next: { revalidate: 3600 },
            signal: AbortSignal.timeout(4000)
          });
          if (mirrorRes.ok) {
            const mData = await mirrorRes.json();
            if (Array.isArray(mData?.recentSubmissions) && mData.recentSubmissions.length > 0) {
              recentSubs = mData.recentSubmissions.slice(0, 8).map((s: {
                title: string;
                titleSlug: string;
                timestamp: string;
                statusDisplay: string;
                lang: string;
              }) => ({
                title: s.title,
                titleSlug: s.titleSlug,
                timestamp: s.timestamp,
                statusDisplay: s.statusDisplay,
                lang: s.lang
              }));
            }
          }
        } catch {
          // Use verified fallback
        }

        return {
          username,
          ranking: matchedUser.profile?.ranking || FALLBACK_LEETCODE_DATA.ranking,
          totalSolved: allStats.count,
          totalQuestions: 4114,
          easySolved: easyStats.count,
          totalEasy: 976,
          mediumSolved: mediumStats.count,
          totalMedium: 2148,
          hardSolved: hardStats.count,
          totalHard: 990,
          totalSubmissions: 450,
          acceptedSubmissions: allStats.submissions,
          acceptanceRate: Math.round((allStats.submissions / 450) * 1000) / 10 || 60.9,
          streak: matchedUser.userCalendar?.streak || 9,
          totalActiveDays: matchedUser.userCalendar?.totalActiveDays || 13,
          languages: languages.length > 0 ? languages : FALLBACK_LEETCODE_DATA.languages,
          topics: topics.length > 0 ? topics : FALLBACK_LEETCODE_DATA.topics,
          recentSubmissions: recentSubs,
          solutions: FALLBACK_LEETCODE_DATA.solutions
        };
      }
    }

    // 3. Secondary: Try public mirror if direct GraphQL was blocked
    const mirrorRes = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000)
    });

    if (mirrorRes.ok) {
      const data = await mirrorRes.json();
      return {
        ...FALLBACK_LEETCODE_DATA,
        ranking: data.ranking || FALLBACK_LEETCODE_DATA.ranking,
        totalSolved: data.totalSolved || FALLBACK_LEETCODE_DATA.totalSolved,
        easySolved: data.easySolved || FALLBACK_LEETCODE_DATA.easySolved,
        mediumSolved: data.mediumSolved || FALLBACK_LEETCODE_DATA.mediumSolved,
        hardSolved: data.hardSolved || FALLBACK_LEETCODE_DATA.hardSolved,
        recentSubmissions: Array.isArray(data.recentSubmissions) ? data.recentSubmissions.slice(0, 8) : FALLBACK_LEETCODE_DATA.recentSubmissions
      };
    }
  } catch (err) {
    console.warn('[LEETCODE SERVICE ERROR] Engaging verified fallback:', err instanceof Error ? err.message : String(err));
  }

  return FALLBACK_LEETCODE_DATA;
}
