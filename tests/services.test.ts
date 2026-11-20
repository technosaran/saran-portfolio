import { describe, it, expect } from 'vitest';
import { normalizeArray } from '../src/lib/neon/db';
import { fetchGitHubData } from '../src/services/github.service';
import { fetchLeetCodeData } from '../src/services/leetcode.service';

describe('Data Utility Functions & Transformations', () => {
  it('normalizes string inputs into clean trimmed arrays', () => {
    const input = 'Next.js 16, TypeScript,   Neon PostgreSQL \n Tailwind CSS ';
    const normalized = normalizeArray(input);
    expect(normalized).toEqual(['Next.js 16', 'TypeScript', 'Neon PostgreSQL', 'Tailwind CSS']);
  });

  it('normalizes array inputs by trimming and filtering empties', () => {
    const input = [' Java 21 ', '  ', 'Python ', ''];
    const normalized = normalizeArray(input);
    expect(normalized).toEqual(['Java 21', 'Python']);
  });

  it('returns empty array on non-string, non-array inputs', () => {
    expect(normalizeArray(null)).toEqual([]);
    expect(normalizeArray(undefined)).toEqual([]);
    expect(normalizeArray(123)).toEqual([]);
  });
});

describe('External Activity Services (Real Data & Graceful Fallbacks)', () => {
  it('fetchGitHubData returns valid profile, repos, and language distribution for technosaran', async () => {
    const data = await fetchGitHubData('technosaran');
    expect(data.username).toBe('technosaran');
    expect(data.publicRepos).toBeGreaterThanOrEqual(3);
    expect(data.repos.length).toBeGreaterThan(0);
    expect(data.languages.length).toBeGreaterThan(0);
    expect(data.commits.length).toBeGreaterThan(0);
    expect(data.totalContributions).toBeGreaterThan(0);
    
    // Check that top language is TypeScript
    const topLang = data.languages[0];
    expect(topLang.name).toBe('TypeScript');
    expect(topLang.share).toBeGreaterThan(50);
  }, 20000);

  it('fetchLeetCodeData returns valid real metrics, languages and topics for Saran-R', async () => {
    const data = await fetchLeetCodeData('Saran-R');
    expect(data.username).toBe('Saran-R');
    expect(data.totalSolved).toBeGreaterThanOrEqual(90);
    expect(data.easySolved).toBeGreaterThanOrEqual(81);
    expect(data.mediumSolved).toBeGreaterThanOrEqual(9);
    expect(data.ranking).toBeGreaterThan(0);
    expect(data.languages.length).toBeGreaterThan(0);
    expect(data.topics.length).toBeGreaterThan(0);
    expect(data.recentSubmissions.length).toBeGreaterThan(0);
    expect(data.solutions.length).toBeGreaterThan(0);

    // Verify top languages solved include Pandas / Python and SQL
    const langNames = data.languages.map(l => l.languageName);
    expect(langNames).toContain('Pandas');
    expect(langNames).toContain('Python3');
    expect(langNames).toContain('PostgreSQL');
  }, 20000);
});
