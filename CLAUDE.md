# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

NBA Quiz Front — a French-language NBA trivia Progressive Web App built with React 19, TypeScript, and Vite. Deployed to GitHub Pages (`https://hugo-lerondel.github.io/nba-quiz-front/`) on every push to `main` via `.github/workflows/`. No backend — all quiz content is static data bundled into the app, and results/progress are persisted client-side in `localStorage`.

Package manager is **bun** (see `packageManager` in `package.json` and `bun.lock`). Use `bun`/`bun run`, not npm/yarn.

## Commands

```bash
bun install          # install dependencies
bun run dev          # start dev server (http://localhost:5173)
bun run build        # tsc -b type-check, then vite build
bun run preview      # preview production build
bun run lint         # biome check .
bun run lint:fix     # biome check --write .
bun run format       # biome format --write .
bun run test:e2e     # playwright e2e tests (auto-starts dev server)
bun run test:e2e:ui  # playwright e2e tests in interactive UI mode
```

E2e tests live under `e2e/` (Playwright, config in `playwright.config.ts`), split into `e2e/desktop/` and `e2e/mobile/`, run via `bun run test:e2e` (auto-starts the dev server). One-time setup: `bunx playwright install chromium` before the first run. Lefthook also runs the full e2e suite as a `pre-push` hook — see below. There is no unit test suite/framework configured (no vitest/jest).

Biome is the sole linter/formatter (tabs, double quotes, import organization on save/check — see `biome.json`). Lefthook runs `biome check` on staged `*.{ts,tsx,js,jsx,json}` files as a pre-commit hook, and `bun run test:e2e` as a `pre-push` hook (`lefthook.yml`); run `bun run prepare` (or reinstall deps, which triggers it) if hooks aren't active locally.

## Architecture

### Routing (`src/app/routes.tsx`)

A single `createBrowserRouter` with `basename: import.meta.env.BASE_URL` (required because the app is served from the `/nba-quiz-front/` subpath — see `base` in `vite.config.ts`). Routes are list pages + detail pages per quiz category:
- `/enumeration`, `/enumeration/:id`
- `/quiz`, `/quiz/:id`
- `/whoami`, `/whoami/:id`

Detail pages look up the quiz by `id` from the in-memory `quizzes` array and `<Navigate>` back to the list if not found (see `EnumerationQuizPage.tsx`).

### Quiz data model (`src/app/data/quizData.ts`)

All quiz content lives in static TypeScript data files, merged into one `quizzes: Quiz[]` array:
- `yearlyEnumerationQuizzes.ts` → `YearlyEnumerationQuiz` (subType `"yearly"`): guess the answer for each year in a range.
- `classicEnumerationQuizzes.ts` → `ClassicEnumerationQuiz` (subType `"classic"`): guess N answers to one prompt, order-independent.
- `themeQuizzes.ts` → `QuizThemeData` (subType `"theme"`): classic Q&A, optionally multiple-choice (`choices`).
- `whoAmIPlayersData.ts` → `WhoAmIPlayer`, a separate game mode (not part of `quizzes`), re-exported alongside it.

Every `Quiz` has a `category` (`"enumeration" | "quiz"`) and a `difficulty` (`"Easy" | "Medium" | "Hard"`), and its `data.subType` discriminates the three enumeration/quiz shapes above. Adding new quiz content means adding entries to the relevant data file with a unique `id` — no schema/registration step elsewhere.

### Component dispatch pattern

Category pages render a small dispatcher component that switches on `data.subType`/game type and delegates to the actual game component:
- `EnumerationQuiz.tsx` dispatches `YearlyQuiz` vs `ClassicQuiz` based on `subType`.
- `SimpleQuiz.tsx` handles theme quizzes.
- `WhoAmIGame.tsx` handles the "who am I" clue-reveal game.

`QuestionCard.tsx` is the shared answer-input/feedback UI used across quiz types. `QuizCard.tsx`/`QuizListView.tsx` render the list/browse pages, and `ScoreScreen.tsx` is the shared end-of-quiz results screen.

### Answer matching (`src/app/utils/quizHelpers.ts`)

`normalize`/`normalizeAccents` strip case, whitespace, and accents. `isMatch` adds fuzzy (Levenshtein-based, ≥90% similarity) matching and is used for MCQ choice validation in `QuestionCard.tsx`, where the selected value is always one of the exact provided choices. `isAnswerMatch` is used for free-text player-name-style answers (`YearlyQuiz.tsx`, `ClassicQuiz.tsx`, `WhoAmIGame.tsx`, and `QuestionCard.tsx`'s non-MCQ branch — currently unreachable since every theme question has `choices`) and requires an exact match once normalized — no typo tolerance, no automatic partial (first/last name) matching — *unless* the answer has a curated alias.

Aliases live in `src/app/data/answerAliases.ts`, a `Record<string, string[]>` mapping a canonical answer to shorter accepted forms (e.g. `"Nikola Jokic": ["Jokic"]`). Only add an alias when it identifies that answer unambiguously among **all** answers in the app, not just within one quiz — e.g. "Malone" is absent because both "Karl Malone" and "Moses Malone" are MVP-by-year answers, and "Nikola" is absent for "Nikola Jokic" because several NBA players share that first name. The table is curated by hand and not exhaustive; most answers have no alias and must be typed in full (case/accents still ignored).

This file also holds `shuffle`, `formatTime`, and the `difficultyColors` palette shared by difficulty badges.

### Results persistence (`src/app/utils/storage.ts`)

Results are stored in `localStorage` under a single versioned key (`nba-quiz-results-v1`) as a map keyed by quiz `id`. Two result shapes: `ScoredResult` (score/total, for regular quizzes) and `WhoAmIResult` (time/clues/errors). `saveResult` only overwrites the stored result if the new one is a personal best (highest score, or fastest time with tie-break on fewer clues) — callers don't need to check this themselves. Bump the storage key suffix (`-v1` → `-v2`) if the stored shape changes incompatibly.

### Styling

Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js` — config lives in `src/styles/tailwind.css`/`theme.css` using CSS-based Tailwind v4 config). Path alias `@` maps to `src/` (`vite.config.ts` + `tsconfig`).

### Design system

The app is dark-only (no theme toggle). The real palette is **hardcoded per-component** via inline `style` props and Tailwind arbitrary-value classes (`bg-[#fbbf24]`, `text-[#fbbf24]`, …) — not via Tailwind color utilities or CSS variables. When touching UI, match these values literally rather than reaching for `bg-primary`/`bg-card`/etc.

- **Background**: `#08080f` (near-black navy) on every page root — also `theme_color`/`background_color` in the PWA manifest (`vite.config.ts`) and `<meta name="theme-color">` in `index.html`, so it must stay in sync in all three places.
- **Surface**: `#14141f` for cards, inputs, and panels sitting on the background.
- **Accent (brand)**: `#fbbf24` (amber/gold) — icons, active/selected states, links, progress-bar fill, and primary-button background. Primary buttons use the background color (`#08080f`) as text color on the accent fill, with `fontWeight: 700`.
- **Borders**: low-opacity white for default separation (`border-white/5` / `/8` / `/10`, or `rgba(255,255,255,0.05–0.12)`); accent-tinted borders (`rgba(251,191,36,0.3–0.6)`) on hover/selected states.
- **Text**: white for primary content; Tailwind gray scale (`text-gray-300` → `text-gray-600`, darkest = least prominent) for secondary/tertiary text and placeholders.
- **Semantic feedback colors**: success/correct `#4ade80`, medium/warning `#fbbf24`, danger/hard/incorrect `#f87171`. Each is paired with a ~10% opacity background tint and ~30–50% opacity border tint of the same color. `difficultyColors` in `src/app/utils/quizHelpers.ts` is the one shared constant (used for difficulty badges); the same three colors are otherwise re-derived ad hoc at each usage site (`QuestionCard.tsx` correctness states, `QuizCard.tsx`'s `ResultBadge`, `ScoreScreen.tsx`'s progress bar) — there's no shared "semantic colors" export, so a color change means updating every site by hand.
- **Typography**: no custom font is loaded — default Tailwind/browser sans-serif stack. Sizes come from Tailwind utility classes (`text-xs` … `text-4xl`); weight is set via inline `style={{ fontWeight }}` (600 for headings/emphasis, 700 for CTAs and score numbers) rather than Tailwind's `font-*` classes.
- **Shape**: `rounded-full` for pills/badges/progress bars/avatar-style icon circles, `rounded-xl` for cards/inputs/buttons, `rounded-2xl` for hero and score panels.
- **Layout**: content constrained to `max-w-3xl mx-auto` (list/detail pages) or `max-w-4xl` (home grid), with `px-4` page gutters and `gap-2`/`gap-3`/`space-y-3` for list spacing.
- **Elevation/interaction**: no real box-shadow elevation; hover state on cards/buttons is an accent-colored glow via arbitrary Tailwind shadow (`hover:shadow-[0_0_20-30px_rgba(251,191,36,0.1-0.12)]`) plus a border-color transition toward the accent, animated with `transition-all duration-200`/`duration-300`.
- **Icons**: `lucide-react` exclusively, sized 11–34px by context, colored via inline `style={{ color }}` (not Tailwind text-color classes).

`src/styles/theme.css` defines a full shadcn/ui-style CSS variable theme (oklch tokens, `--primary: #030213`, a `.dark` class, base-layer `h1`–`h4`/`button`/`input` typography defaults) inherited from project scaffolding — **none of it is referenced anywhere under `src/app`**. Don't treat it as the source of truth; the hardcoded values above are what's actually rendered.

### PWA

`vite-plugin-pwa` (`vite.config.ts`) generates the manifest and service worker (`autoUpdate`). Icons/manifest fields are defined inline in the Vite config, not in a separate `manifest.json` — edit them there.

### E2E tests (`e2e/`)

Two Playwright projects, defined in `playwright.config.ts`, each with its own `testDir` — `bun run test:e2e` runs both by default:
- `desktop` — `e2e/desktop/`, `devices["Desktop Chrome"]`.
- `mobile` — `e2e/mobile/`, `devices["Pixel 7"]` (mobile viewport + touch emulation).

Run a single project with `bunx playwright test --project=desktop` (or `=mobile`).

One spec file per game flow, duplicated across both folders:
- `enumeration.spec.ts` — yearly enumeration
- `enumeration-classic.spec.ts` — classic enumeration
- `quiz.spec.ts` — theme quiz (multiple choice)
- `whoami.spec.ts` — Qui suis-je

The `desktop` and `mobile` versions of a spec run the identical flow to catch responsive layout regressions on phone-sized screens; keep them in sync by hand (no shared/parameterized spec) when editing a flow.

`e2e/mobile/whoami.spec.ts` has three extra mobile-only tests guarding `WhoAmIGame.tsx`'s small-screen behavior:

- **Keyboard-safe layout**: the component tracks `window.visualViewport.height` in state and sizes its root container from that (instead of `100dvh`), because on both iOS Safari and Chrome an on-screen keyboard shrinks `visualViewport` but leaves the CSS layout viewport (and `dvh`) untouched — `dvh` alone never reacts to the keyboard. `page.setViewportSize` doesn't reproduce this either, since it resizes the real layout viewport. So the test instead: uses `page.clock` to fast-forward through several of `whoami-jordan`'s clue auto-reveals (stacking enough clue cards to matter, no real wall-clock wait), then directly overrides `window.visualViewport.height` and dispatches the `resize` event the component listens for — the same signal a real keyboard opening sends — and asserts the guess input's bounding rect stays within that shrunk height and the first clue stays in the (real, unresized) viewport. Playwright cannot open a real OS keyboard, so this is a deliberate approximation of its effect, not a substitute for manual testing on a real device.
- **Auto-scroll to the latest clue**: the clue list scrolls itself (`scrollIntoView` on a sentinel div) whenever `visibleClues` changes, so a newly auto-revealed clue is never hidden below the fold on a small screen. This test uses real wall-clock waiting (`expect(...).toBeVisible({ timeout: 15_000 })`) against `whoami-livingston` (the fastest `clueInterval`, 5s) rather than `page.clock`, deliberately: fast-forwarding a single `page.clock.runFor()` call across several clue-reveal intervals at once was found to be flaky — some interval firings don't reliably commit their React state update before the call returns — whereas polling in real time is not. Prefer real-time waiting over `page.clock` for any future test that depends on an exact number of these auto-reveals having fired; `page.clock` remains fine (as in the keyboard-layout test above) when the assertion doesn't depend on a precise reveal count.
- **Page scroll lock**: even with the height/layout fixes above, a real on-screen keyboard still pans/scrolls the whole document to keep the focused input visible — a browser-level behavior tied to the (unshrunk) layout viewport, not something our own overflow handling can intercept. So `WhoAmIGame` takes itself out of document flow (`position: fixed`, height still driven by `visualViewport`) and sets `document.body`/`documentElement` to `overflow: hidden` for as long as it's mounted, restoring the previous value on unmount. The test checks `getComputedStyle(document.body).overflow` is `"hidden"` while the game is open, then `expect.poll`s (not an immediate assertion — the unmount cleanup trails the route change slightly) that it's back to `"visible"` after navigating back to the player list.

Run via `bun run test:e2e` (headless) or `bun run test:e2e:ui` (Playwright's interactive UI mode, useful for debugging a single spec).

Conventions:
- Locators: role/text on visible French UI text, no `data-testid`.
- Prefer stable identifiers (quiz title) over list position; exception: the WhoAmI list hides player names until solved, so the first player card is targeted by position instead.
- Avoid hardcoding counts that grow over time (e.g. total yearly entries, or a quiz's exact question count) — anchor assertions on what's actually being tested (e.g. the numerator of a score, not the denominator).
- The theme quiz (`SimpleQuiz.tsx`) shuffles its questions on every run — `quiz.spec.ts` matches the currently-displayed question against a known question→answer table rather than assuming a fixed order.