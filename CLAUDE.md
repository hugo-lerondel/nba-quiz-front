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
```

There is no test suite/framework configured in this repo (no vitest/jest, no test files).

Biome is the sole linter/formatter (tabs, double quotes, import organization on save/check — see `biome.json`). Lefthook runs `biome check` on staged `*.{ts,tsx,js,jsx,json}` files as a pre-commit hook (`lefthook.yml`); run `bun run prepare` (or reinstall deps, which triggers it) if hooks aren't active locally.

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

Free-text answers aren't matched with strict equality. `normalize`/`normalizeAccents` strip case, whitespace, and accents; `isMatch` adds fuzzy (Levenshtein-based, ≥90% similarity) matching; `isAnswerMatch` additionally accepts a single first/last name matching a multi-word answer (e.g. "Curry" matches "Stephen Curry"). Use `isAnswerMatch` for player-name-style answers and `isMatch` for exact-ish string answers. This file also holds `shuffle`, `formatTime`, and the `difficultyColors` palette shared by difficulty badges.

### Results persistence (`src/app/utils/storage.ts`)

Results are stored in `localStorage` under a single versioned key (`nba-quiz-results-v1`) as a map keyed by quiz `id`. Two result shapes: `ScoredResult` (score/total, for regular quizzes) and `WhoAmIResult` (time/clues/errors). `saveResult` only overwrites the stored result if the new one is a personal best (highest score, or fastest time with tie-break on fewer clues) — callers don't need to check this themselves. Bump the storage key suffix (`-v1` → `-v2`) if the stored shape changes incompatibly.

### Styling

Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js` — config lives in `src/styles/tailwind.css`/`theme.css` using CSS-based Tailwind v4 config). Path alias `@` maps to `src/` (`vite.config.ts` + `tsconfig`).

### PWA

`vite-plugin-pwa` (`vite.config.ts`) generates the manifest and service worker (`autoUpdate`). Icons/manifest fields are defined inline in the Vite config, not in a separate `manifest.json` — edit them there.