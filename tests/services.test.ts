import { describe, it, expect } from 'vitest';
import { normalizeArray } from '../src/lib/neon/db';

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
