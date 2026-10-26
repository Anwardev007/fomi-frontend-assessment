# Fomi AI Content Generation Platform — Worklog

## Task 5+6+7 — Frontend Developer Technical Assessment

**Agent:** Frontend Developer (Z.ai Code)
**Status:** ✅ Complete
**Scope:** Single-page Next.js 16 application combining a polished Fomi marketing landing page (Part A) with a redesigned Image Generation Workspace (Part B).

### Files Created

| File | Purpose |
|------|---------|
| `src/app/providers.tsx` | TanStack Query `QueryClientProvider` (client) |
| `src/components/fomi/store.ts` | Zustand store for shared workspace state + `scrollToWorkspace()` helper |
| `src/components/fomi/nav-bar.tsx` | Sticky glassmorphism nav with mobile Sheet menu |
| `src/components/fomi/hero.tsx` | Aurora hero with prompt composer + sample chips + trust stats |
| `src/components/fomi/live-demo.tsx` | Independent "try it now" card calling `/api/generate` |
| `src/components/fomi/features.tsx` | 5-feature grid + CTA tile |
| `src/components/fomi/showcase-gallery.tsx` | Masonry gallery from `/api/gallery` with dialog lightbox |
| `src/components/fomi/templates-section.tsx` | Tabbed template browser from `/api/templates` |
| `src/components/fomi/stats-section.tsx` | Animated count-up stats |
| `src/components/fomi/cta-section.tsx` | Final gradient CTA |
| `src/components/fomi/workspace.tsx` | **Part B hero** — 3-column pro workspace |
| `src/components/fomi/footer.tsx` | Sticky footer with 4 link columns + socials |
| `src/components/fomi/workspace/prompt-composer.tsx` | Prompt textarea + model badge + ⌘↵ hint + Surprise me |
| `src/components/fomi/workspace/variant-card.tsx` | Variant card with hover actions + metadata dialog |
| `src/components/fomi/workspace/history-panel.tsx` | Left sidebar history list + recent prompts |
| `src/components/fomi/workspace/parameter-panel.tsx` | Right sidebar: model / style / ratio / batch / advanced |

### Files Modified

| File | Change |
|------|--------|
| `src/app/layout.tsx` | Fomi metadata (title/description/OG/Twitter), Geist fonts kept, switched Toaster from radix to **sonner**, wrapped app in `Providers` |
| `src/app/globals.css` | Added Fomi accent CSS variables (`--fomi-accent`, `-2`, `-3`, ink/surface tokens), brand gradient utilities (`.fomi-gradient-text`, `.fomi-gradient-bg`, `.fomi-ring`), aurora background, dotted grid, shimmer, slim scrollbar, reduced-motion guards |
| `src/app/page.tsx` | Clean composition of all sections; workspace lazy-loaded via `dynamic(..., { ssr: false })` with a skeleton fallback |

### Design Decisions

- **Brand palette — "sunset over twilight"**: deliberately avoided generic indigo/blue. Three accent tokens form a 115° gradient: golden amber (`oklch(0.8 0.165 75)`) → ember rose (`oklch(0.62 0.235 24)`) → fuchsia twilight (`oklch(0.56 0.255 342)`). Exposed as `--color-fomi-accent[-2|-3]` in `@theme inline` so `bg-fomi-accent`, `text-fomi-accent`, etc. work as native Tailwind utilities.
- **Two visual modes on one route**: the landing page stays in the default light theme; the workspace section opts into dark by adding the `dark` class to its `<section>` (and to the mobile Sheet drawers + variant dialog). This flips all shadcn tokens (slider tracks, inputs, badges) to dark values without touching `next-themes`, while a custom `.fomi-workspace` background adds a subtle fuchsia-tinted radial glow over near-black ink.
- **Performance**: workspace is the heaviest subtree (TanStack Query mutation, localStorage, framer-motion, dialogs) so it is `dynamic`-imported with `ssr: false` — the marketing page above ships first and the workspace hydrates on its own chunk. All images use `next/image` with explicit `sizes`; below-the-fold gallery/template thumbnails use `loading="lazy"`.
- **Real-tool feel for the workspace**: per-variant stagger entrance (12% delay × index), skeleton loaders that match the selected aspect ratio, an always-visible canvas status bar (model · style · ratio · latency), variant hover action bar (upscale / variations / edit / copy-prompt / download / delete), a metadata lightbox with aesthetic + adherence score bars, `⌘↵` to generate and `⌘K` to focus the prompt, and history persisted to `localStorage` (key `fomi-history-v1`) with a skip-first-run ref guard so the initial load never clobbers stored state.
- **State sharing**: a single Zustand store (`store.ts`) holds the working prompt + params + in-memory history. The hero prompt input, the templates section, and the workspace all read/write the same store, so a template click or hero "Generate" pre-fills the workspace composer and smooth-scrolls to it.
- **Accessibility**: skip-to-content link, semantic landmarks (`header`/`nav`/`main`/`section`/`article`/`footer`), `aria-label` on every icon-only button, `alt` text derived from prompts, keyboard-reachable controls, visible focus rings, and a global `prefers-reduced-motion` block that disables aurora drift + shimmer.

### Issues Encountered & Resolved

1. **`react-hooks/set-state-in-effect` lint error** — the initial `setMounted(true)` inside the load effect was flagged. Resolved by replacing the boolean `mounted` gate with a `skipPersistRef` that skips only the first run of the persist effect (effects fire in declaration order, so the load effect runs first and hydrates the store before the persist effect's second run writes).
2. **Dark tokens not cascading into the workspace** — shadcn components (Slider track `bg-muted`, Input `bg-background`) rendered with light values inside the dark workspace. Resolved by adding the `dark` class to the workspace `<section>` and to both mobile Sheet drawers + the variant metadata dialog, so the `.dark { --background: … }` CSS-variable cascade flips every descendant token.
3. **`scrollToWorkspace` targeted the wrong id** — the helper looked for `#fomi-workspace` but the section uses `id="workspace"`. Aligned the helper to `getElementById("workspace")`.
4. **Port collision in dev log** — an earlier stale `next dev` attempt left an `EADDRINUSE` line in `dev.log`, but the running server (started by the init script) serves `GET / 200` cleanly. No action needed.

### Verification

- `bun run lint` → ✅ passes with zero errors/warnings.
- `dev.log` → ✅ clean: `GET / 200`, `GET /api/gallery 200`, `GET /api/templates 200`, `POST /api/generate 200`, no hydration or compile errors.
- Server-rendered HTML contains all key sections (hero headline, features, showcase, templates, stats, CTA, workspace skeleton).
- `POST /api/generate` returns the expected `{ok, requestId, latencyMs, variants[], meta}` shape.
