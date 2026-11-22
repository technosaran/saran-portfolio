import { describe, it, expect } from 'vitest';
import { groupSkillsByCategory, SkillItem } from '@/components/SkillsNucleus';

describe('groupSkillsByCategory', () => {
  it('groups skills into 5 distinct technical categories', () => {
    const mockSkills: SkillItem[] = [
      {
        id: 'python',
        name: 'Python',
        category: 'languages',
        categoryLabel: 'Programming Languages',
        context: 'AI and scripting',
        projects: ['Project 1'],
        orbit: 1,
        proficiency: 'Expert',
        initialAngle: 0,
      },
      {
        id: 'nextjs',
        name: 'Next.js',
        category: 'frameworks',
        categoryLabel: 'Frameworks & Web',
        context: 'Full-stack SSR',
        projects: ['arthaX'],
        orbit: 2,
        proficiency: 'Expert',
        initialAngle: 45,
      },
      {
        id: 'aws',
        name: 'AWS',
        category: 'cloud',
        categoryLabel: 'Cloud & DevOps',
        context: 'EC2 and S3',
        projects: ['Cloud Infra'],
        orbit: 3,
        proficiency: 'Advanced',
        initialAngle: 90,
      },
      {
        id: 'postgres',
        name: 'PostgreSQL',
        category: 'database',
        categoryLabel: 'Databases & Storage',
        context: 'Relational storage',
        projects: ['DB'],
        orbit: 4,
        proficiency: 'Advanced',
        initialAngle: 135,
      },
    ];

    const grouped = groupSkillsByCategory(mockSkills);
    expect(grouped['languages']).toBeDefined();
    expect(grouped['languages'].length).toBe(1);
    expect(grouped['frameworks']).toBeDefined();
    expect(grouped['frameworks'].length).toBe(1);
    expect(grouped['cloud']).toBeDefined();
    expect(grouped['database']).toBeDefined();
  });
});
