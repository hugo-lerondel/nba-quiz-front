# Answer Alias Matching Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic "any first/last name segment + typo tolerance" answer matching in `isAnswerMatch` with a strict-by-default rule (exact match, case/accents ignored) plus a curated per-answer alias table, unify `WhoAmIGame.tsx`'s duplicated matching logic onto the same function, and document the new mechanism.

**Architecture:** A new leaf data file, `src/app/data/answerAliases.ts`, holds a plain `Record<string, string[]>` of canonical answer → accepted aliases, with zero imports (no circular dependency risk). `quizHelpers.ts` imports that table, builds a normalized-key lookup once at module load, and `isAnswerMatch` consults it. `WhoAmIGame.tsx` drops its local duplicated normalize/match logic and calls the shared `isAnswerMatch`. No test framework exists in this repo (per `CLAUDE.md`) — verification is `bun run build` (type-check) for the logic changes plus the existing/updated Playwright e2e suite for behavior.

**Tech Stack:** TypeScript, no new dependencies.

## Global Constraints

- Package manager is bun.
- Formatting: tabs, double quotes (per `biome.json`).
- Scope: yearly enumeration (`YearlyQuiz.tsx`), classic enumeration (`ClassicQuiz.tsx`), and "Qui suis-je" (`WhoAmIGame.tsx`) — all three already call `isAnswerMatch`, or will after Task 2. The theme "Quiz" category (`QuestionCard.tsx`/`isMatch`) is not touched.
- Default behavior for any answer **without** an alias entry: exact match after normalizing case/accents/whitespace (`normalize()`) — no typo tolerance, no automatic partial (first/last name) matching.
- `isMatch` (used for MCQ choice validation) is not modified.
- `src/app/data/answerAliases.ts` must have **no imports** — in particular, it must not import `normalize` from `quizHelpers.ts`, since `quizHelpers.ts` imports the alias table from this file; importing `normalize` here would create a circular module dependency. Normalization of alias keys happens inside `quizHelpers.ts`, not in this file.
- Only add an alias when it identifies its answer unambiguously among **all** answers in the app (not just within one quiz) — e.g. "Malone" is excluded because both "Karl Malone" and "Moses Malone" are MVP-by-year answers.
- Initial curated alias list (verbatim, all confirmed present in `yearlyEnumerationQuizzes.ts` and/or `classicEnumerationQuizzes.ts`):
  ```
  LeBron James            -> Lebron
  Nikola Jokic            -> Jokic
  Shai Gilgeous-Alexander -> Shai
  Michael Jordan          -> Jordan
  Kobe Bryant             -> Kobe
  Stephen Curry           -> Curry
  Giannis Antetokounmpo   -> Giannis
  Kevin Durant            -> Durant
  Shaquille O'Neal        -> Shaq
  Magic Johnson           -> Magic
  Larry Bird              -> Bird
  Wilt Chamberlain        -> Wilt, Chamberlain
  Kareem Abdul-Jabbar     -> Kareem
  Tim Duncan              -> Duncan
  Hakeem Olajuwon         -> Hakeem, Olajuwon
  Dirk Nowitzki           -> Dirk, Nowitzki
  Luka Doncic             -> Luka, Doncic
  Joel Embiid             -> Embiid
  ```
- Spec reference: `docs/superpowers/specs/2026-08-03-answer-alias-matching-design.md`.

---

### Task 1: Alias table + `isAnswerMatch` rewrite

**Files:**
- Create: `src/app/data/answerAliases.ts`
- Modify: `src/app/utils/quizHelpers.ts:1, 47-71`

**Interfaces:**
- Produces: `ANSWER_ALIASES: Record<string, string[]>` (raw, unnormalized keys) exported from `src/app/data/answerAliases.ts`, consumed only by `quizHelpers.ts`.
- Produces: `isAnswerMatch(input: string, answer: string): boolean` in `quizHelpers.ts` — same name/signature as before, new behavior. Consumed by `YearlyQuiz.tsx` and `ClassicQuiz.tsx` already (unchanged call sites) and by `WhoAmIGame.tsx` in Task 2.
- Produces: `normalize(s: string): string` — unchanged, already exported, re-used here to build the normalized lookup.

- [ ] **Step 1: Create the alias data file**

Create `src/app/data/answerAliases.ts`:

```ts
// Canonical answer (as written in quiz/player data) -> list of shorter
// accepted aliases. Only add an alias when it identifies that answer
// unambiguously among ALL answers in the app (not just within one quiz) —
// e.g. "Malone" is deliberately absent because both "Karl Malone" and
// "Moses Malone" are MVP-by-year answers, and "Nikola" is absent for
// "Nikola Jokic" because several NBA players share that first name.
//
// No imports here on purpose: quizHelpers.ts imports ANSWER_ALIASES from
// this file and normalizes the keys itself. Importing `normalize` back
// from quizHelpers.ts here would create a circular module dependency.
export const ANSWER_ALIASES: Record<string, string[]> = {
	"LeBron James": ["Lebron"],
	"Nikola Jokic": ["Jokic"],
	"Shai Gilgeous-Alexander": ["Shai"],
	"Michael Jordan": ["Jordan"],
	"Kobe Bryant": ["Kobe"],
	"Stephen Curry": ["Curry"],
	"Giannis Antetokounmpo": ["Giannis"],
	"Kevin Durant": ["Durant"],
	"Shaquille O'Neal": ["Shaq"],
	"Magic Johnson": ["Magic"],
	"Larry Bird": ["Bird"],
	"Wilt Chamberlain": ["Wilt", "Chamberlain"],
	"Kareem Abdul-Jabbar": ["Kareem"],
	"Tim Duncan": ["Duncan"],
	"Hakeem Olajuwon": ["Hakeem", "Olajuwon"],
	"Dirk Nowitzki": ["Dirk", "Nowitzki"],
	"Luka Doncic": ["Luka", "Doncic"],
	"Joel Embiid": ["Embiid"],
};
```

- [ ] **Step 2: Rewrite `isAnswerMatch` in `quizHelpers.ts`**

Add this import as the new first line of `src/app/utils/quizHelpers.ts`:

```ts
import { ANSWER_ALIASES } from "../data/answerAliases";
```

Then replace this block (current lines 47-71):

```ts
/**
 * Like isMatch, but also accepts a single first or last word of the answer.
 * e.g. "Curry" matches "Stephen Curry", "Giannis" matches "Giannis Antetokoumpo".
 * Only applies when the input is a single word of at least 3 chars and the answer has multiple words.
 */
export function isAnswerMatch(input: string, answer: string): boolean {
	const normInput = normalize(input);
	const normAnswer = normalize(answer);

	if (fuzzy(normInput, normAnswer)) return true;

	// Partial match only for single-word inputs (no spaces)
	if (normInput.includes(" ") || normInput.length < 3) return false;

	const words = normAnswer.split(" ");
	if (words.length < 2) return false;

	const first = words[0];
	const last = words[words.length - 1];

	if (first.length >= 3 && fuzzy(normInput, first)) return true;
	if (last.length >= 3 && fuzzy(normInput, last)) return true;

	return false;
}
```

with:

```ts
// Aliases keyed by normalized answer, so accent/case variants of the same
// canonical answer (different quiz entries sometimes spell a name slightly
// differently) share the same alias entry.
const normalizedAliasLookup: Record<string, string[]> = Object.fromEntries(
	Object.entries(ANSWER_ALIASES).map(([answer, aliases]) => [
		normalize(answer),
		aliases,
	]),
);

/**
 * Strict match: the input must equal the answer (case/accents ignored), or
 * equal one of the answer's curated aliases in ANSWER_ALIASES
 * (src/app/data/answerAliases.ts). No typo tolerance, no automatic partial
 * (first/last name) matching — aliases must be explicitly curated per
 * answer, since a generic rule can't tell a safe short answer (e.g. "Shai")
 * from an ambiguous one (e.g. "Nikola", shared by several NBA players).
 */
export function isAnswerMatch(input: string, answer: string): boolean {
	const normInput = normalize(input);
	if (normInput === normalize(answer)) return true;
	const aliases = normalizedAliasLookup[normalize(answer)] ?? [];
	return aliases.some((alias) => normInput === normalize(alias));
}
```

- [ ] **Step 3: Type-check**

Run:
```bash
bun run build
```

Expected: succeeds with no TypeScript errors (this also runs `vite build`; a fresh `dist/` output is expected and fine — it's already gitignored).

- [ ] **Step 4: Regression-check the existing e2e suite**

Run:
```bash
bun run test:e2e
```

Expected: all 4 tests still PASS. None of the existing specs rely on partial-name matching yet (they all type full canonical names), so this proves the rewrite didn't break canonical exact-match behavior.

- [ ] **Step 5: Lint the touched files**

Run:
```bash
bunx biome check src/app/data/answerAliases.ts src/app/utils/quizHelpers.ts
```

Expected: no new errors (the repo has pre-existing unrelated lint warnings elsewhere — don't fix those here).

- [ ] **Step 6: Commit**

```bash
git add src/app/data/answerAliases.ts src/app/utils/quizHelpers.ts
git commit -m "feat: replace generic partial-name matching with curated answer aliases"
```

---

### Task 2: Unify `WhoAmIGame.tsx` onto `isAnswerMatch`

**Files:**
- Modify: `src/app/components/WhoAmIGame.tsx:1-19, 72-107`

**Interfaces:**
- Consumes: `isAnswerMatch(input: string, answer: string): boolean` and `normalize(s: string): string` from `src/app/utils/quizHelpers.ts` (Task 1).

- [ ] **Step 1: Import the shared matching functions**

In `src/app/components/WhoAmIGame.tsx`, replace this line (currently line 4):

```ts
import { formatTime } from "../utils/quizHelpers";
```

with:

```ts
import { formatTime, isAnswerMatch, normalize } from "../utils/quizHelpers";
```

- [ ] **Step 2: Remove the local duplicated `normalize` function**

Replace this block (currently lines 7-21, the `WhoAmIGameProps` interface through the start of the component):

```ts
interface WhoAmIGameProps {
	player: WhoAmIPlayer;
	onBack: () => void;
}

function normalize(s: string) {
	return s
		.toLowerCase()
		.trim()
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.replace(/\s+/g, " ");
}

export function WhoAmIGame({ player, onBack }: WhoAmIGameProps) {
```

with:

```ts
interface WhoAmIGameProps {
	player: WhoAmIPlayer;
	onBack: () => void;
}

export function WhoAmIGame({ player, onBack }: WhoAmIGameProps) {
```

- [ ] **Step 3: Replace the inline matching logic in `handleGuess`**

Replace this block (currently lines 72-107):

```ts
	const handleGuess = useCallback(() => {
		const trimmed = guess.trim();
		if (!trimmed) return;

		const normGuess = normalize(trimmed);
		const normAnswer = normalize(player.name);

		// Accept last name alone or full name
		const lastNames = normAnswer.split(" ");
		const isCorrect =
			normGuess === normAnswer ||
			lastNames.some((part) => part.length > 3 && normGuess === part);

		if (isCorrect) {
			const t = Date.now() - startRef.current;
			setFinalTime(t);
			setFinalClues(visibleClues);
			setSolved(true);
			if (timerRef.current) clearInterval(timerRef.current);
			if (autoRevealRef.current) clearInterval(autoRevealRef.current);
			saveResult({
				type: "whoami",
				id: player.id,
				timeMs: t,
				cluesUsed: visibleClues,
				errors: wrongGuesses.length,
				completedAt: Date.now(),
			});
		} else {
			if (!wrongGuesses.map(normalize).includes(normGuess)) {
				setWrongGuesses((prev) => [...prev, trimmed]);
			}
			setGuess("");
			inputRef.current?.focus();
		}
	}, [guess, player.name, visibleClues, wrongGuesses, player.id]);
```

with:

```ts
	const handleGuess = useCallback(() => {
		const trimmed = guess.trim();
		if (!trimmed) return;

		const isCorrect = isAnswerMatch(trimmed, player.name);

		if (isCorrect) {
			const t = Date.now() - startRef.current;
			setFinalTime(t);
			setFinalClues(visibleClues);
			setSolved(true);
			if (timerRef.current) clearInterval(timerRef.current);
			if (autoRevealRef.current) clearInterval(autoRevealRef.current);
			saveResult({
				type: "whoami",
				id: player.id,
				timeMs: t,
				cluesUsed: visibleClues,
				errors: wrongGuesses.length,
				completedAt: Date.now(),
			});
		} else {
			const normGuess = normalize(trimmed);
			if (!wrongGuesses.map(normalize).includes(normGuess)) {
				setWrongGuesses((prev) => [...prev, trimmed]);
			}
			setGuess("");
			inputRef.current?.focus();
		}
	}, [guess, player.name, visibleClues, wrongGuesses, player.id]);
```

- [ ] **Step 4: Type-check**

Run:
```bash
bun run build
```

Expected: succeeds with no TypeScript errors.

- [ ] **Step 5: Regression-check the existing e2e suite**

Run:
```bash
bun run test:e2e
```

Expected: all 4 tests still PASS — `e2e/whoami.spec.ts` still types the full canonical name `"Michael Jordan"` at this point (Task 3 changes it to the alias), so this proves the unification preserved exact-match behavior.

- [ ] **Step 6: Lint the touched file**

Run:
```bash
bunx biome check src/app/components/WhoAmIGame.tsx
```

Expected: no new errors.

- [ ] **Step 7: Commit**

```bash
git add src/app/components/WhoAmIGame.tsx
git commit -m "refactor: unify WhoAmIGame answer matching onto shared isAnswerMatch"
```

---

### Task 3: Prove the new behavior end-to-end via the e2e suite

**Files:**
- Modify: `e2e/enumeration.spec.ts:23-34`
- Modify: `e2e/whoami.spec.ts:25`

**Interfaces:**
- Consumes: the alias table and strict-by-default behavior from Task 1, applied transitively through the app's UI — no direct code interface, this task only changes what the tests type into the app.

- [ ] **Step 1: Update `e2e/enumeration.spec.ts` to exercise both the new alias and the new strict default**

Replace this block (currently lines 23-34):

```ts
	await rowInput(2024).fill("Nikola Jokic");
	await rowInput(2024).press("Enter");

	await rowInput(2023).fill("Joel Embiid");
	await rowInput(2023).press("Enter");

	await page.getByRole("button", { name: "Tout valider" }).click();

	await expect(page.getByText("Score final")).toBeVisible();
	// Assert only the numerator (correct answers); the denominator (total
	// entries) grows over time as new years are added to the quiz data.
	await expect(page.getByText(/^2\/\d+$/)).toBeVisible();
```

with:

```ts
	// "Jokic" is a curated alias for "Nikola Jokic" (src/app/data/answerAliases.ts) —
	// proves alias-based matching works end-to-end.
	await rowInput(2024).fill("Jokic");
	await rowInput(2024).press("Enter");

	await rowInput(2023).fill("Joel Embiid");
	await rowInput(2023).press("Enter");

	// "Harden" has no curated alias for "James Harden" (2018 MVP), so under
	// the new strict-by-default rule this attempt is deliberately left
	// wrong. The score assertion below proves it isn't silently counted
	// correct the way the old generic partial-name rule would have.
	await rowInput(2018).fill("Harden");
	await rowInput(2018).press("Enter");

	await page.getByRole("button", { name: "Tout valider" }).click();

	await expect(page.getByText("Score final")).toBeVisible();
	// Only 2024 (via the "Jokic" alias) and 2023 (full canonical name) count
	// as correct; the unaliased "Harden" attempt for 2018 does not. Only the
	// numerator is asserted; the denominator grows over time as new years
	// are added to the quiz data.
	await expect(page.getByText(/^2\/\d+$/)).toBeVisible();
```

- [ ] **Step 2: Update `e2e/whoami.spec.ts` to exercise the alias**

Replace this line (currently line 25):

```ts
	await guessInput.fill("Michael Jordan");
```

with:

```ts
	// "Jordan" is a curated alias for "Michael Jordan" (src/app/data/answerAliases.ts) —
	// proves the unified matching (Task 2) accepts it here too.
	await guessInput.fill("Jordan");
```

- [ ] **Step 3: Run the full e2e suite and verify it passes**

Run:
```bash
bun run test:e2e
```

Expected: PASS — 4 passed. This is the real proof: if Task 1's alias lookup or strict-default logic were wrong, `enumeration.spec.ts` would fail here (either the "Jokic" row wouldn't count, making the score `1/N` instead of `2/N`, or the "Harden" row would wrongly count, making it `3/N`), and `whoami.spec.ts` would time out waiting for "Bravo !".

- [ ] **Step 4: Run it a second time to confirm no flakiness**

Run:
```bash
bun run test:e2e
```

Expected: PASS — 4 passed again.

- [ ] **Step 5: Commit**

```bash
git add e2e/enumeration.spec.ts e2e/whoami.spec.ts
git commit -m "test: exercise answer alias matching in the e2e suite"
```

---

### Task 4: Document the new matching logic in CLAUDE.md

**Files:**
- Modify: `CLAUDE.md:59-61`

**Interfaces:**
- None — documentation only.

- [ ] **Step 1: Rewrite the "Answer matching" subsection**

In `CLAUDE.md`, replace this section (currently lines 59-61, under `## Architecture`):

```markdown
### Answer matching (`src/app/utils/quizHelpers.ts`)

Free-text answers aren't matched with strict equality. `normalize`/`normalizeAccents` strip case, whitespace, and accents; `isMatch` adds fuzzy (Levenshtein-based, ≥90% similarity) matching; `isAnswerMatch` additionally accepts a single first/last name matching a multi-word answer (e.g. "Curry" matches "Stephen Curry"). Use `isAnswerMatch` for player-name-style answers and `isMatch` for exact-ish string answers. This file also holds `shuffle`, `formatTime`, and the `difficultyColors` palette shared by difficulty badges.
```

with:

```markdown
### Answer matching (`src/app/utils/quizHelpers.ts`)

`normalize`/`normalizeAccents` strip case, whitespace, and accents. `isMatch` adds fuzzy (Levenshtein-based, ≥90% similarity) matching and is used for MCQ choice validation in `QuestionCard.tsx`, where the selected value is always one of the exact provided choices. `isAnswerMatch` is used for free-text player-name-style answers (`YearlyQuiz.tsx`, `ClassicQuiz.tsx`, `WhoAmIGame.tsx`) and requires an exact match once normalized — no typo tolerance, no automatic partial (first/last name) matching — *unless* the answer has a curated alias.

Aliases live in `src/app/data/answerAliases.ts`, a `Record<string, string[]>` mapping a canonical answer to shorter accepted forms (e.g. `"Nikola Jokic": ["Jokic"]`). Only add an alias when it identifies that answer unambiguously among **all** answers in the app, not just within one quiz — e.g. "Malone" is absent because both "Karl Malone" and "Moses Malone" are MVP-by-year answers, and "Nikola" is absent for "Nikola Jokic" because several NBA players share that first name. The table is curated by hand and not exhaustive; most answers have no alias and must be typed in full (case/accents still ignored).

This file also holds `shuffle`, `formatTime`, and the `difficultyColors` palette shared by difficulty badges.
```

- [ ] **Step 2: Verify the edit**

Run:
```bash
grep -n "Malone" CLAUDE.md
```

Expected: prints the line from the new subsection mentioning "Malone" — confirms the replacement landed.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: document the answer alias matching mechanism"
```

---

## Out of scope (per spec)

- Exhaustive audit/curation of all ~379 existing answers — only the 18 curated entries above are added.
- Aliases for team-name answers (e.g. "Celtics" for "Boston Celtics").
- Fixing the pre-existing data typo `"Karem Abdul-Jabbar"` (missing the second "e") in `classicEnumerationQuizzes.ts`'s `six-rings-players` quiz.
- The theme "Quiz" category / `isMatch` / `QuestionCard.tsx` — not modified.
