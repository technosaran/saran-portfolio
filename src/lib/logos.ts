/**
 * High-Resolution Universal Logo Resolver & Logo.dev Integration
 * Multi-tier logo resolution system supporting Logo.dev API, Devicon Vector SVGs,
 * Unavatar, Google Favicon V2, and handcrafted SVG fallbacks.
 */

export interface EntityInfo {
  domain: string;
  brandColor?: string;
  deviconName?: string;
  displayName?: string;
}

// Canonical Domain & Vector Registry for Corporations, Providers, Partners & Tech
export const ENTITY_REGISTRY: Record<string, EntityInfo> = {
  // --- Certification Providers & Academic Institutions ---
  'infosys': { domain: 'infosys.com', brandColor: '#007cc3', displayName: 'Infosys' },
  'infosys springboard': { domain: 'infosys.com', brandColor: '#007cc3', displayName: 'Infosys Springboard' },
  'oracle': { domain: 'oracle.com', brandColor: '#f80000', deviconName: 'oracle', displayName: 'Oracle' },
  'oracle university': { domain: 'oracle.com', brandColor: '#f80000', displayName: 'Oracle University' },
  'ibm': { domain: 'ibm.com', brandColor: '#0f62fe', displayName: 'IBM' },
  'ibm skillsbuild': { domain: 'ibm.com', brandColor: '#0f62fe', displayName: 'IBM SkillsBuild' },
  'aws': { domain: 'aws.amazon.com', brandColor: '#ff9900', deviconName: 'amazonwebservices', displayName: 'Amazon Web Services' },
  'amazon web services': { domain: 'aws.amazon.com', brandColor: '#ff9900', deviconName: 'amazonwebservices', displayName: 'Amazon Web Services' },
  'coursera': { domain: 'coursera.org', brandColor: '#0056d2', displayName: 'Coursera' },
  'guvi': { domain: 'guvi.in', brandColor: '#00b074', displayName: 'GUVI Geek Networks' },
  'guvi geek networks': { domain: 'guvi.in', brandColor: '#00b074', displayName: 'GUVI Geek Networks' },
  'google': { domain: 'google.com', brandColor: '#4285f4', deviconName: 'google', displayName: 'Google' },
  'google for education': { domain: 'google.com', brandColor: '#4285f4', displayName: 'Google for Education' },
  'nasscom': { domain: 'nasscom.in', brandColor: '#0d47a1', displayName: 'NASSCOM' },
  'futureskills prime': { domain: 'futureskillsprime.in', brandColor: '#ff6f00', displayName: 'FutureSkills Prime' },
  'edunet': { domain: 'edunetfoundation.org', brandColor: '#00838f', displayName: 'Edunet Foundation' },
  'edunet foundation': { domain: 'edunetfoundation.org', brandColor: '#00838f', displayName: 'Edunet Foundation' },
  'aicte': { domain: 'aicte-india.org', brandColor: '#ff7043', displayName: 'AICTE' },
  'codtech': { domain: 'codtechitsolutions.com', brandColor: '#2563eb', displayName: 'CodTech IT Solutions' },
  'codtech it solutions': { domain: 'codtechitsolutions.com', brandColor: '#2563eb', displayName: 'CodTech IT Solutions' },
  'panimalar': { domain: 'panimalar.ac.in', brandColor: '#1e3a8a', displayName: 'Panimalar Engineering College' },
  'panimalar engineering college': { domain: 'panimalar.ac.in', brandColor: '#1e3a8a', displayName: 'Panimalar Engineering College' },

  // --- Programming Languages & Frameworks ---
  'python': { domain: 'python.org', deviconName: 'python', brandColor: '#3776ab', displayName: 'Python' },
  'java': { domain: 'oracle.com', deviconName: 'java', brandColor: '#f89820', displayName: 'Java' },
  'typescript': { domain: 'typescriptlang.org', deviconName: 'typescript', brandColor: '#3178c6', displayName: 'TypeScript' },
  'ts': { domain: 'typescriptlang.org', deviconName: 'typescript', brandColor: '#3178c6', displayName: 'TypeScript' },
  'javascript': { domain: 'developer.mozilla.org', deviconName: 'javascript', brandColor: '#f7df1e', displayName: 'JavaScript' },
  'js': { domain: 'developer.mozilla.org', deviconName: 'javascript', brandColor: '#f7df1e', displayName: 'JavaScript' },
  'next.js': { domain: 'nextjs.org', deviconName: 'nextjs', brandColor: '#ffffff', displayName: 'Next.js' },
  'next.js 16': { domain: 'nextjs.org', deviconName: 'nextjs', brandColor: '#ffffff', displayName: 'Next.js 16' },
  'nextjs': { domain: 'nextjs.org', deviconName: 'nextjs', brandColor: '#ffffff', displayName: 'Next.js' },
  'next js': { domain: 'nextjs.org', deviconName: 'nextjs', brandColor: '#ffffff', displayName: 'Next.js' },
  'react': { domain: 'react.dev', deviconName: 'react', brandColor: '#61dafb', displayName: 'React' },
  'react.js': { domain: 'react.dev', deviconName: 'react', brandColor: '#61dafb', displayName: 'React.js' },
  'node.js': { domain: 'nodejs.org', deviconName: 'nodejs', brandColor: '#339933', displayName: 'Node.js' },
  'nodejs': { domain: 'nodejs.org', deviconName: 'nodejs', brandColor: '#339933', displayName: 'Node.js' },
  'express': { domain: 'expressjs.com', deviconName: 'express', brandColor: '#ffffff', displayName: 'Express.js' },
  'express.js': { domain: 'expressjs.com', deviconName: 'express', brandColor: '#ffffff', displayName: 'Express.js' },
  'tailwind': { domain: 'tailwindcss.com', deviconName: 'tailwindcss', brandColor: '#38bdf8', displayName: 'Tailwind CSS' },
  'tailwindcss': { domain: 'tailwindcss.com', deviconName: 'tailwindcss', brandColor: '#38bdf8', displayName: 'Tailwind CSS' },
  'tailwind css': { domain: 'tailwindcss.com', deviconName: 'tailwindcss', brandColor: '#38bdf8', displayName: 'Tailwind CSS' },

  // --- AI, Machine Learning & Data Science ---
  'pytorch': { domain: 'pytorch.org', deviconName: 'pytorch', brandColor: '#ee4c2c', displayName: 'PyTorch' },
  'torch': { domain: 'pytorch.org', deviconName: 'pytorch', brandColor: '#ee4c2c', displayName: 'PyTorch' },
  'opencv': { domain: 'opencv.org', deviconName: 'opencv', brandColor: '#5c3ee8', displayName: 'OpenCV' },
  'scikit-learn': { domain: 'scikit-learn.org', deviconName: 'scikitlearn', brandColor: '#f7931e', displayName: 'Scikit-Learn' },
  'sklearn': { domain: 'scikit-learn.org', deviconName: 'scikitlearn', brandColor: '#f7931e', displayName: 'Scikit-Learn' },
  'pandas': { domain: 'pandas.pydata.org', deviconName: 'pandas', brandColor: '#150458', displayName: 'Pandas' },
  'numpy': { domain: 'numpy.org', deviconName: 'numpy', brandColor: '#013243', displayName: 'NumPy' },
  'spacy': { domain: 'spacy.io', brandColor: '#09a3d5', displayName: 'SpaCy' },
  'computer vision': { domain: 'opencv.org', deviconName: 'opencv', brandColor: '#5c3ee8', displayName: 'Computer Vision' },
  'cuda': { domain: 'nvidia.com', brandColor: '#76b900', displayName: 'NVIDIA CUDA' },

  // --- Databases, Cloud & DevOps ---
  'postgresql': { domain: 'postgresql.org', deviconName: 'postgresql', brandColor: '#336791', displayName: 'PostgreSQL' },
  'postgres': { domain: 'postgresql.org', deviconName: 'postgresql', brandColor: '#336791', displayName: 'PostgreSQL' },
  'supabase': { domain: 'supabase.com', deviconName: 'supabase', brandColor: '#3ecf8e', displayName: 'Supabase' },
  'mongodb': { domain: 'mongodb.com', deviconName: 'mongodb', brandColor: '#47a248', displayName: 'MongoDB' },
  'docker': { domain: 'docker.com', deviconName: 'docker', brandColor: '#2496ed', displayName: 'Docker' },
  'aws cloud': { domain: 'aws.amazon.com', deviconName: 'amazonwebservices', brandColor: '#ff9900', displayName: 'AWS Cloud' },
  'git': { domain: 'git-scm.com', deviconName: 'git', brandColor: '#f05032', displayName: 'Git' },
  'github': { domain: 'github.com', deviconName: 'github', brandColor: '#ffffff', displayName: 'GitHub' },
  'git & github': { domain: 'github.com', deviconName: 'github', brandColor: '#ffffff', displayName: 'Git & GitHub' },
  'vercel': { domain: 'vercel.com', brandColor: '#ffffff', displayName: 'Vercel' },
  'render': { domain: 'render.com', brandColor: '#46e3b7', displayName: 'Render' },
  'neon': { domain: 'neon.tech', brandColor: '#00e599', displayName: 'Neon' },
  'sql': { domain: 'mysql.com', deviconName: 'mysql', brandColor: '#00758f', displayName: 'SQL' },
  'mysql': { domain: 'mysql.com', deviconName: 'mysql', brandColor: '#00758f', displayName: 'MySQL' },
  'linux': { domain: 'linux.org', deviconName: 'linux', brandColor: '#fcc624', displayName: 'Linux' },
  'leetcode': { domain: 'leetcode.com', brandColor: '#ffa116', displayName: 'LeetCode' },
  'linkedin': { domain: 'linkedin.com', deviconName: 'linkedin', brandColor: '#0a66c2', displayName: 'LinkedIn' },
};

/**
 * Normalizes input name to find registry entry
 */
export function getEntityInfo(name: string): EntityInfo | null {
  if (!name) return null;
  const clean = name.toLowerCase().trim();

  // 1. Direct match
  if (ENTITY_REGISTRY[clean]) return ENTITY_REGISTRY[clean];

  // 2. Substring matching
  for (const [key, val] of Object.entries(ENTITY_REGISTRY)) {
    if (clean.includes(key) || key.includes(clean)) {
      return val;
    }
  }

  // 3. Heuristic domain extraction if already a domain or URL
  if (clean.includes('.')) {
    const extracted = clean.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    if (extracted.length > 3) {
      return { domain: extracted };
    }
  }

  return null;
}

/**
 * Returns user-configured Logo.dev high-resolution PNG URL
 */
export function getLogoDevUrl(domain: string, size: number = 160): string {
  const token =
    process.env.NEXT_PUBLIC_LOGOS_DEV_API_KEY ||
    'pk_bIuq9jRhRO-QRCdxlZWt4Q';

  const params = new URLSearchParams();
  if (token) params.set('token', token);
  // High-density 3x retina scaling for razor-sharp rendering on 4K/Retina displays
  params.set('size', String(Math.max(size * 3, 200)));
  params.set('format', 'png');
  params.set('retina', 'true');

  return `https://img.logo.dev/${encodeURIComponent(domain)}?${params.toString()}`;
}

/**
 * Returns Devicon Vector SVG for programming languages and frameworks
 */
export function getDeviconVectorUrl(deviconName: string): string {
  // Use jsdelivr CDN for fast worldwide edge caching of official Devicon SVGs
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${encodeURIComponent(
    deviconName
  )}/${encodeURIComponent(deviconName)}-original.svg`;
}

/**
 * Returns Unavatar Vector/High-res brand logo
 */
export function getUnavatarUrl(domain: string): string {
  return `https://unavatar.io/${encodeURIComponent(domain)}?fallback=false`;
}

/**
 * Returns Google Favicon V2 128px
 */
export function getGoogleFaviconUrl(domain: string, size: number = 128): string {
  return `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${encodeURIComponent(
    domain
  )}&size=${size}`;
}

/**
 * Multi-tier Candidate URL Generator
 * Generates an ordered cascade of high-definition URLs:
 * 1. Logo.dev Retina PNG (Primary, user-provided token)
 * 2. Devicon Vector SVG (Lossless vectors for tech)
 * 3. Unavatar Brand Vector
 * 4. Google Favicon V2
 */
export function getCandidateLogoUrls(name: string, size: number = 64): string[] {
  const info = getEntityInfo(name);
  if (!info) return [];

  const urls: string[] = [];

  // If tech with known official Devicon vector, prioritize Devicon vector for crispness, then Logo.dev
  if (info.deviconName) {
    urls.push(getDeviconVectorUrl(info.deviconName));
  }

  // Logo.dev (Tier 1 for corporations, providers, banks, institutions)
  if (info.domain) {
    urls.push(getLogoDevUrl(info.domain, size));
    urls.push(getUnavatarUrl(info.domain));
    urls.push(getGoogleFaviconUrl(info.domain, 128));
  }

  return urls;
}
