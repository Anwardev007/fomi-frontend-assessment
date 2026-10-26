# Fomi Frontend Assessment — Submission Package

## Deliverables

### 1. Live Web Application (Part A + Part B)
- **App URL:** Preview the running Next.js app at the sandbox preview link
- **Source code:** `/home/z/my-project/src/`
  - `src/app/page.tsx` — single-page composition (the only user-visible route)
  - `src/app/layout.tsx` — Fomi metadata + providers
  - `src/app/globals.css` — Fomi brand tokens (amber → fuchsia twilight)
  - `src/app/api/generate/route.ts` — mocked image generation endpoint
  - `src/app/api/gallery/route.ts` — community showcase gallery
  - `src/app/api/templates/route.ts` — curated templates and presets
  - `src/components/fomi/` — 15 reusable components (nav, hero, features, gallery, workspace, etc.)
  - `src/components/fomi/workspace/` — workspace sub-components (composer, variant-card, history, parameters)

### 2. Product Thinking Document (Part B written deliverable)
- **File:** `Fomi_Product_Thinking_Document.pdf` (5 pages)
- Answers all six required questions:
  1. What problem were you trying to solve? What type of user did you design for?
  2. What are the three most important UX decisions you made? Why?
  3. Which features did you intentionally leave out? Why?
  4. Which existing products inspired your thinking? What did you like? What would you improve?
  5. If you had another month to work on this product, what would you improve?
  6. What is the single feature or workflow that differentiates your workspace?

## Tech Stack
- Next.js 16 (App Router, Turbopack)
- TypeScript (strict)
- Tailwind CSS 4
- shadcn/ui (48 components)
- Framer Motion (entrance, stagger, hover)
- TanStack Query (server state for /api/generate)
- Zustand (workspace state shared with hero/templates)
- Lucide React (icons)

## Architecture Highlights
- **Single `/` route** containing both Part A (landing) and Part B (workspace)
- **Mock backend** via Next.js API routes — realistic response shape with variants, seeds, latency, scores
- **Reusable components** — every section is self-contained, composable, typed
- **Zustand store** connects the hero "Generate" button, template clicks, and the workspace composer
- **localStorage persistence** for workspace history (survives reloads)
- **Dynamic import** of the workspace (code-splitting, ssr:false)
- **Accessibility**: semantic landmarks, skip-link, keyboard shortcuts (⌘↵ generate, ⌘K focus prompt), aria-labels on icon buttons, alt text on all images
- **Performance**: next/image with whitelisted remote patterns, lazy gallery, stagger animations respect prefers-reduced-motion

## Design Decisions
- **Brand palette**: amber → ember rose → fuchsia twilight gradient (deliberately avoids generic indigo/blue)
- **Two visual modes**: light landing page + dark workspace (workspace opts into `dark` class locally)
- **Workspace is the hero**: 3-column layout (history / canvas / parameters), 2×2 persistent variant grid, hover-anchored actions per variant
- **Micro-interactions**: per-variant stagger entrance, aspect-ratio-matched skeletons, status bar (model · style · ratio · latency), metadata lightbox with score bars

## How to Verify
1. Open the preview URL
2. Scroll through the landing page (Part A): hero, live demo, features, showcase gallery, templates, stats, CTA
3. Click "Start creating" or scroll to the workspace section (Part B)
4. Type a prompt in the workspace composer (or click "Surprise me")
5. Click Generate (or press ⌘↵) — 4 variants appear after ~1-2s with stagger
6. Hover any variant → action bar (Upscale, Variations, Edit, Copy, Download, Delete)
7. Click any variant → metadata lightbox with seed, scores, full image
8. Reload the page → history persists from localStorage
9. Resize to mobile width → sidebars become slide-over drawers
