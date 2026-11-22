import { describe, it, expect } from 'vitest';
import { getProjectDomainTag } from '@/components/ProjectsShowcase';

describe('getProjectDomainTag', () => {
  it('correctly categorizes computer vision projects', () => {
    const tag = getProjectDomainTag({
      id: 1,
      title: 'Real-Time Object Detection',
      description: 'Vision pipeline with YOLO and PyTorch',
      tech_stack: ['Python', 'PyTorch', 'OpenCV'],
      github_url: null,
      live_url: null,
      highlights: null,
    });
    expect(tag).toContain('Computer Vision');
  });

  it('correctly categorizes NLP projects', () => {
    const tag = getProjectDomainTag({
      id: 2,
      title: 'Named Entity Recognition',
      description: 'NLP pipeline with SpaCy and transformers',
      tech_stack: ['Python', 'SpaCy', 'Transformers'],
      github_url: null,
      live_url: null,
      highlights: null,
    });
    expect(tag).toContain('NLP');
  });

  it('correctly categorizes full-stack web applications', () => {
    const tag = getProjectDomainTag({
      id: 3,
      title: 'arthaX Terminal',
      description: 'Wealth tracking platform with PostgreSQL',
      tech_stack: ['Next.js 16', 'TypeScript', 'PostgreSQL'],
      github_url: null,
      live_url: null,
      highlights: null,
    });
    expect(tag).toContain('Full-Stack');
  });

  it('correctly categorizes cloud and infrastructure systems', () => {
    const tag = getProjectDomainTag({
      id: 4,
      title: 'Cloud Workload Deployer',
      description: 'Automated EC2 and Docker deployments',
      tech_stack: ['AWS', 'Docker', 'Linux'],
      github_url: null,
      live_url: null,
      highlights: null,
    });
    expect(tag).toContain('Cloud');
  });
});
