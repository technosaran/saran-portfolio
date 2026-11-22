# Portfolio Comprehensive UI/UX, Layout, SEO & Quality Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a comprehensive UI/UX overhaul, standard-compliant SEO architecture, and zero-warning code quality across Saran R's full-stack portfolio.

**Architecture:** Refactor metadata and sitemap into standard Next.js 16 App Router route handlers (`robots.ts`, `sitemap.ts`). Unify the obsidian dark-mode design system and responsive tokens. Enhance the interactive hero HUD with 4 balanced metrics and an active ⌘K command launcher. Upgrade the skills section with a dual-view switcher (Celestial Orbital Physics + Recruiter Skills Matrix). Resolve all 29 ESLint warnings and ensure 100% test suite reliability.

**Tech Stack:** Next.js 16.4.6 (Turbopack, App Router), React 19, TypeScript 5, Tailwind CSS 4, Lucide React, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-22-portfolio-enhancements-design.md`

## Global Constraints
- Must comply with Next.js 16 App Router standards (no relative internal location navigation, dynamic sitemap/robots).
- Strict dark-mode obsidian aesthetic (`#090a0f` base, `#0f1118` surface, `#1b1f2b` borders, emerald `#10b981` / sky `#0ea5e9` accents).
- Zero external package additions; use existing installed packages.
- Zero ESLint errors or warnings on `npm run lint`.
- 100% test pass rate on `npm run test`.

## Review Focus
- Sitemap URLs must not contain fragment identifiers (`#`) to satisfy Google Search Console standards.
- Command Menu internal navigation must use Next.js `useRouter().push()` rather than raw `window.location.href`.
- Project categorization must dynamically evaluate tech stacks and not output fallback `'NLP · Scikit-Learn'` for unrelated systems.
- Orbital skill badges and recruiter matrix cards must maintain high contrast (WCAG AA) and responsive tap sizing.
- All SVG charts and interactive dialogs must preserve responsive viewport limits without causing horizontal overflow.

---

### Task 1: SEO, Sitemap, Dynamic Robots, and Structured Data

**Files:**
- Create: `src/app/robots.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/page.tsx`
- Delete: `public/robots.txt`
- Test: `tests/seo.test.ts`

**Interfaces:**
- Produces: `sitemap()` returning `MetadataRoute.Sitemap` with only canonical indexable routes.
- Produces: `robots()` returning `MetadataRoute.Robots` with rules for Googlebot, Bingbot, and wildcard user-agents.

- [ ] **Step 1: Write test for SEO sitemap and robots generation**

```typescript
// tests/seo.test.ts
import { describe, it, expect } from 'vitest';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';

describe('SEO & Metadata specifications', () => {
  it('sitemap generates valid canonical URLs without fragment identifiers (#)', () => {
    const entries = sitemap();
    expect(entries.length).toBeGreaterThan(0);
    entries.forEach((entry) => {
      expect(entry.url).not.toContain('#');
      expect(entry.url.startsWith('http')).toBe(true);
    });
  });

  it('robots generates proper disallow rules for admin endpoints and dynamic sitemap', () => {
    const rules = robots();
    expect(rules.rules).toBeDefined();
    expect(rules.sitemap).toBeDefined();
    expect(String(rules.sitemap)).toContain('/sitemap.xml');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/seo.test.ts`
Expected: FAIL (missing `src/app/robots.ts` or fragment violation in `sitemap.ts`)

- [ ] **Step 3: Implement `src/app/robots.ts`, update `src/app/sitemap.ts`, clean `public/robots.txt` and enrich JSON-LD in `src/app/page.tsx`**

1. Create `src/app/robots.ts` using `MetadataRoute.Robots`.
2. Clean `src/app/sitemap.ts` to return only `${BASE_URL}`.
3. Remove static `public/robots.txt`.
4. Refine JSON-LD in `src/app/page.tsx` ensuring all URLs are valid and schemas conform to Schema.org standards.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/seo.test.ts`
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add src/app/robots.ts src/app/sitemap.ts src/app/page.tsx tests/seo.test.ts
git rm public/robots.txt
git commit -m "fix(seo): implement dynamic robots, clean canonical sitemap and JSON-LD schema"
```

---

### Task 2: Design System Token & Palette Unification

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/PortfolioClientShell.tsx`

**Interfaces:**
- Consumes: Tailwind CSS 4 `@theme` and `@layer base` CSS custom properties.
- Produces: Unified dark obsidian background (`#090a0f`), surface (`#0f1118`), border tokens (`#1b1f2b`), and selection colors (`bg-emerald-500/20 text-emerald-200`).

- [ ] **Step 1: Unify root colors and body styles in `src/app/layout.tsx` and `src/components/PortfolioClientShell.tsx`**

Align `themeColor: "#090a0f"`, body background classes to `bg-[#090a0f] text-zinc-100 selection:bg-emerald-500/20 selection:text-emerald-200`.

- [ ] **Step 2: Update `src/app/globals.css` base layers**

Ensure consistent card utilities (`.card-craft`, `.card-spotlight`) and scrollbar aesthetics.

- [ ] **Step 3: Verify styling builds cleanly**

Run: `npm run build`
Expected: Build compiles successfully with consistent layout tokens.

- [ ] **Step 4: Commit changes**

```bash
git add src/app/globals.css src/app/layout.tsx src/components/PortfolioClientShell.tsx
git commit -m "style: unify dark obsidian palette and selection tokens"
```

---

### Task 3: Interactive Hero Section UI/UX Polish & HUD Metrics

**Files:**
- Modify: `src/components/InteractiveHero.tsx`
- Modify: `src/components/PortfolioSectionsLive.tsx`

**Interfaces:**
- Consumes: `profile: Profile`, `projectCount: number`, `certCount: number`, `internshipCount: number`.
- Produces: Balanced 4-metric HUD card (Projects, LeetCode, Internships, Certificates), visible Search (⌘K) action button, refined copy interactions with toast feedback.

- [ ] **Step 1: Update `InteractiveHero.tsx`**

1. Remove unused Lucide imports (`Briefcase`, `Code2`, `Terminal`, `Layers`, `Database`).
2. Integrate `projectCount` into a 4-item grid (Projects, LeetCode 90+, Internships, Verified Certs).
3. Ensure Search button renders and connects to `openCommandMenu`.
4. Add IST timezone indicator and micro-interaction on copy.

- [ ] **Step 2: Update `PortfolioSectionsLive.tsx`**

Ensure `projectCount={projects.length}` and other live counters are passed down seamlessly.

- [ ] **Step 3: Verify ESLint warnings for InteractiveHero are cleared**

Run: `npx eslint src/components/InteractiveHero.tsx`
Expected: 0 errors, 0 warnings.

- [ ] **Step 4: Commit changes**

```bash
git add src/components/InteractiveHero.tsx src/components/PortfolioSectionsLive.tsx
git commit -m "feat(hero): polish hero HUD with 4-metric grid and activate search trigger"
```

---

### Task 4: Dynamic Project Categorization & Projects Showcase Polish

**Files:**
- Modify: `src/components/ProjectsShowcase.tsx`
- Test: `tests/projects-categorization.test.ts`

**Interfaces:**
- Consumes: `projects: Project[]`.
- Produces: Dynamic categorization helper `getProjectDomainTag(project: Project): string` based on tech stack and title.

- [ ] **Step 1: Write unit test for dynamic project categorization**

```typescript
// tests/projects-categorization.test.ts
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
      highlights: null
    });
    expect(tag).toContain('Computer Vision');
  });

  it('correctly categorizes full-stack web applications', () => {
    const tag = getProjectDomainTag({
      id: 2,
      title: 'arthaX Terminal',
      description: 'Wealth tracking platform with PostgreSQL',
      tech_stack: ['Next.js 16', 'TypeScript', 'PostgreSQL'],
      github_url: null,
      live_url: null,
      highlights: null
    });
    expect(tag).toContain('Full-Stack');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/projects-categorization.test.ts`
Expected: FAIL (`getProjectDomainTag` is not exported or defined)

- [ ] **Step 3: Implement `getProjectDomainTag` and clean `ProjectsShowcase.tsx`**

1. Export `getProjectDomainTag` with intelligent keyword & tech matching (`Computer Vision · PyTorch`, `NLP · Scikit-Learn`, `Full-Stack · Next.js`, `Cloud Systems · AWS`).
2. Remove unused state (`selectedProject`, `setSelectedProject`) and unused Lucide icons (`ExternalLink`, `Code2`, `Layers`, `Cpu`, `Database`).
3. Enhance card action buttons and visual styling.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/projects-categorization.test.ts`
Expected: PASS

- [ ] **Step 5: Verify ESLint clean**

Run: `npx eslint src/components/ProjectsShowcase.tsx`
Expected: 0 errors, 0 warnings.

- [ ] **Step 6: Commit changes**

```bash
git add src/components/ProjectsShowcase.tsx tests/projects-categorization.test.ts
git commit -m "feat(projects): add dynamic domain categorization and clean up unused state"
```

---

### Task 5: Skills Section: Dual-Mode UI/UX (Orbital View & Recruiter Matrix)

**Files:**
- Modify: `src/components/SkillsNucleus.tsx`
- Test: `tests/skills-matrix.test.ts`

**Interfaces:**
- Consumes: `skills?: Skill[]`.
- Produces: Dual-view interface with an accessible view toggle button (`Orbital Simulation` / `Skills Matrix`), search filter in matrix view, and accessible dialog modal.

- [ ] **Step 1: Add unit test for skills categorization helper**

```typescript
// tests/skills-matrix.test.ts
import { describe, it, expect } from 'vitest';
import { groupSkillsByCategory } from '@/components/SkillsNucleus';

describe('groupSkillsByCategory', () => {
  it('groups skills into 5 distinct technical categories', () => {
    const skills = [
      { id: 1, name: 'Python', category: 'languages', level: 'Expert' },
      { id: 2, name: 'Next.js', category: 'frameworks', level: 'Expert' },
      { id: 3, name: 'AWS', category: 'cloud', level: 'Advanced' },
      { id: 4, name: 'PostgreSQL', category: 'database', level: 'Advanced' },
    ];
    const grouped = groupSkillsByCategory(skills as any);
    expect(grouped['languages']).toBeDefined();
    expect(grouped['frameworks']).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/skills-matrix.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement Dual-Mode UI/UX in `SkillsNucleus.tsx`**

1. Export `groupSkillsByCategory`.
2. Add interactive mode switch: `viewMode: 'orbital' | 'matrix'`.
3. In `orbital` mode: maintain celestial orbit simulation with fluid scaling.
4. In `matrix` mode: render categorized cards grouped by Programming Languages, Frameworks & Web, Cloud & DevOps, Databases & Storage, and AI/ML, with a live search filter.
5. Retain modal technical dossier on click in both modes.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/skills-matrix.test.ts`
Expected: PASS

- [ ] **Step 5: Verify ESLint clean**

Run: `npx eslint src/components/SkillsNucleus.tsx`
Expected: 0 errors, 0 warnings.

- [ ] **Step 6: Commit changes**

```bash
git add src/components/SkillsNucleus.tsx tests/skills-matrix.test.ts
git commit -m "feat(skills): introduce dual-mode orbital physics and recruiter matrix view"
```

---

### Task 6: Polish Activity, Experience, Certifications, Contact & Command Menu

**Files:**
- Modify: `src/components/ActivityShowcase.tsx`
- Modify: `src/components/CertificatesShowcase.tsx`
- Modify: `src/components/ContactSection.tsx`
- Modify: `src/components/ExperienceTimeline.tsx`
- Modify: `src/components/CommandMenu.tsx`
- Modify: `src/components/ScrollProgressBar.tsx`

**Interfaces:**
- Cleans all remaining ESLint warnings.
- Replaces `window.location.href = '/admin'` with `router.push('/admin')` in `CommandMenu.tsx`.

- [ ] **Step 1: Clean `ActivityShowcase.tsx`**
Remove unused imports `Copy`, `Check`, `CheckCircle2`, unused state/props `profile`, `projects`, `skills`, `toast`.

- [ ] **Step 2: Clean `CertificatesShowcase.tsx`**
Remove unused imports `Award`, `ShieldCheck`. Add "Clear filter" helper when search returns 0 items.

- [ ] **Step 3: Clean `ContactSection.tsx`**
Remove unused imports `Download`, `LeetCodeIcon`.

- [ ] **Step 4: Clean `ExperienceTimeline.tsx`**
Remove unused imports `CheckCircle2`, `BrandLogo`. Add glowing timeline dot connectors.

- [ ] **Step 5: Clean `CommandMenu.tsx` and `ScrollProgressBar.tsx`**
In `CommandMenu.tsx`: Remove unused `Sparkles`, import `useRouter`, replace `window.location.href = '/admin'` with `router.push('/admin')`.
In `ScrollProgressBar.tsx`: Remove unused `onOpenCommandMenu`.

- [ ] **Step 6: Verify ESLint across all modified components**

Run: `npx eslint src/components/`
Expected: 0 errors, 0 warnings!

- [ ] **Step 7: Commit changes**

```bash
git add src/components/
git commit -m "refactor: eliminate all component lint warnings and modernize navigation"
```

---

### Task 7: Full System Verification, Testing & Build Validation

**Files:** Repository-wide.

- [ ] **Step 1: Run comprehensive lint audit**

Run: `npm run lint`
Expected: 0 errors, 0 warnings.

- [ ] **Step 2: Run all Vitest unit and service tests**

Run: `npm run test`
Expected: All test suites PASS (rate-limit, auth-password, validation, services, seo, projects, skills).

- [ ] **Step 3: Run full Next.js Turbopack production build**

Run: `npm run build`
Expected: All routes compile without error; `/sitemap.xml`, `/robots.txt`, and static pages generated cleanly.

- [ ] **Step 4: Commit final verification**

```bash
git add -A
git commit -m "chore: complete full-stack UI/UX, SEO, and layout enhancements"
```
