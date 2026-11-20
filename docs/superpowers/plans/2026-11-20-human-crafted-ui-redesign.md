# Human-Crafted Portfolio UI & Design Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the portfolio UI, typography, color palette, and component design to replace generic "AI-generated" sci-fi tropes (spinning Bohr solar system, neon gradient scatter, generic font tracking, and fake terminal headers) with a refined, human-crafted modern engineering aesthetic (Linear/Raycast style).

**Architecture:** Establish a cohesive dark design system in `globals.css` with an obsidian canvas, subtle borders, and intentional single-accent styling. Re-architect the core components: replace the spinning 3D planetary orbits in `SkillsNucleus.tsx` with a high-utility, categorized interactive skills matrix; refine `InteractiveHero.tsx` with grounded human copywriting; streamline `Navbar.tsx` and `ProjectsShowcase.tsx` with crisp 1px borders and refined micro-interactions.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Lucide Icons, Vitest.

**Spec:** In-session design decision opting for Direction A (Minimalist Engineering Craft / Linear style) removing AI tropes.

## Global Constraints
- Preserve all existing database connections, Supabase/Neon data fetching, and API routes.
- Preserve full functionality of LeetCode, GitHub, Contact, and Admin authentication.
- Ensure 100% build pass (`npx next build`) and 100% test pass (`npm test`).
- Fully accessible with `prefers-reduced-motion` support and keyboard navigation.

## Review Focus
1. Elimination of all Bohr orbit keyframes, rotating badges, and neon glowing drop shadows.
2. Responsive layout integrity across mobile (<640px), tablet (768px), and desktop (1024px+).
3. Cohesive typography hierarchy (tight display headings, relaxed body, crisp mono labels).
4. Interactive skill selection that maps cleanly to Saran's real projects and context.
5. Zero regressions in dynamic DB fallbacks or external services (GitHub/LeetCode).

---

### Task 1: Design System & Color Palette Foundation
Establish the new obsidian canvas, unified typography scale, refined border tokens, and clean utility classes in `src/app/globals.css`.

- [x] Remove all orbit and celestial animation keyframes (`orbit-spin-cw`, `orbit-spin-ccw`, `event-horizon-spin`, `spacetime-ripple`, `nucleus-pulse`).
- [x] Define cohesive design tokens in `:root`: deep obsidian canvas (`#090a0f`), elevated surface (`#11131a`), card surface (`#151821`), crisp borders (`#1f2430` / `#2d3345`), and a focused accent (refined emerald `#10b981` / slate `#94a3b8`).
- [x] Update typography rules for headings (`tracking-[-0.03em]`, `font-semibold`), clean body (`leading-relaxed`), and subtle focus states.
- [x] Verify test suite runs cleanly: `npm test`.

### Task 2: Human-Crafted Sticky Navigation
Redesign `src/components/Navbar.tsx` to remove neon cyan/indigo gradients and heavy glow boxes, replacing them with a frosted, minimalist floating navigation bar.

- [x] Strip out `card-shine`, `shadow-[0_0_20px_rgba(...)]`, and multi-color gradient underlines.
- [x] Implement a clean, frosted floating bar with subtle border (`border-white/[0.08]`), clean brand wordmark, and subtle active tab pills.
- [x] Ensure mobile drawer is clean, accessible, and matches the minimalist design.
- [x] Run `npm test` to ensure no component regressions.

### Task 3: Grounded, Confident Hero Section
Redesign `src/components/InteractiveHero.tsx` with authentic human engineering narrative, clean typography, and high-utility quick links.

- [x] Remove fake terminal window bars and generic sci-fi ambient blurs.
- [x] Implement high-impact display typography: "Hey, I'm Saran R." with clear subheadline stating his core engineering focus (Next.js & PostgreSQL, PyTorch Vision/NLP, AWS Cloud).
- [x] Create an authentic, compact "Engineering Focus" summary card on the right that highlights real project deliverables and stats without fake window buttons.
- [x] Refine CTA buttons: "View Work", "Resume", "Copy Email" with tactile, clean border hover effects.
- [x] Run `npm test` to verify.

### Task 4: Replace Spinning "Skills Nucleus" with High-Utility Interactive Skills Matrix
Completely replace the spinning solar system in `src/components/SkillsNucleus.tsx` with a modern, human-crafted interactive skills matrix organized by core engineering domains.

- [x] Replace the 4 rotating Bohr celestial orbits with a clean, responsive category view (Languages, AI & Machine Learning, Full-Stack & Web, Cloud & Databases).
- [x] Provide interactive category filtering (All, Languages, AI/ML, Full-Stack, Cloud/DB) with smooth state transitions.
- [x] On click or hover of each skill item, display real engineering context (e.g. PyTorch: "Real-time object detection & deep learning models", PostgreSQL: "Schema design, RLS, ACID transactions") and direct tags linking to Saran's real projects (arthaX, Object Detection, etc.).
- [x] Ensure full mobile responsiveness and touch-friendly interaction targets.
- [x] Run `npm test` to verify.

### Task 5: Refine Projects Showcase & Experience Timeline
Polish `src/components/ProjectsShowcase.tsx` and `src/components/ExperienceTimeline.tsx` to align with the minimalist engineering craft style.

- [x] In `ProjectsShowcase.tsx`: Refine the flagship **arthaX** card and secondary cards with clean 1px borders, subtle badge indicators ("Featured", "Live"), crisp tech stack pills with brand logos, and clear GitHub/Live action links.
- [x] In `ExperienceTimeline.tsx`: Refine the timeline markers, remove harsh glowing lines, and format internship and education accomplishments with clean editorial bullet points.
- [x] Run `npm test` to verify.

### Task 6: Refine Activity, Certifications, Contact, and Main Page Structure
Polish `src/app/page.tsx`, `src/components/ActivityShowcase.tsx`, `src/components/CertificatesShowcase.tsx`, and `src/components/ContactSection.tsx`.

- [x] In `src/app/page.tsx`: Replace generic numbered headings (`01 / Featured Work`, `03 / Capabilities`) with clean, natural human section headers (e.g., "Projects", "Experience & Education", "Technical Tooling", "Engineering Activity", "Certifications").
- [x] Refine `ActivityShowcase.tsx` and `CertificatesShowcase.tsx` cards for clean visual harmony.
- [x] Ensure `ContactSection.tsx` has a warm, direct, professional contact card.
- [x] Run full test suite: `npm test`.
- [x] Run full production build: `npx next build`.
