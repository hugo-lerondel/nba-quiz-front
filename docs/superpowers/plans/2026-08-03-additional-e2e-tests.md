# Additional E2E Tests (Classic, Quiz, Qui suis-je) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three more Playwright e2e tests covering the remaining game flows (classic enumeration, theme "Quiz" category, "Qui suis-je"), a `test:e2e:ui` script for Playwright's interactive UI mode, and a new CLAUDE.md section documenting the `e2e/` test structure and conventions.

**Architecture:** Same pattern as the existing `e2e/enumeration.spec.ts`: one Playwright spec file per game flow, driving the real app via role/text locators, no app code changes. No config changes are needed — `playwright.config.ts`'s `testDir: "./e2e"` auto-discovers any new `*.spec.ts` file, and lefthook's `pre-push` hook already runs `bun run test:e2e`, which will pick up the new specs automatically.

**Tech Stack:** `@playwright/test` (already installed), Chromium (already installed via `bunx playwright install chromium`), bun.

## Global Constraints

- Package manager is bun — use `bun`/`bunx`, never npm/yarn.
- Formatting: tabs, double quotes (per `biome.json`) — match existing code style. Where a string literal needs embedded double quotes (two of the quiz questions do), use a template literal (backticks) instead of escaping, matching how the rest of the codebase avoids escaped quotes.
- Selectors: Playwright role/text locators on visible French UI text only — no `data-testid` additions to app components (per `docs/superpowers/specs/2026-08-03-additional-e2e-tests-design.md`).
- Do not hardcode counts that can grow over time (e.g. a quiz's total answer/question count) — anchor assertions on what's actually being tested (e.g. the numerator of a score), matching the pattern already used in `e2e/enumeration.spec.ts:34`.
- `e2e/quiz.spec.ts` must not assume a fixed question order — `SimpleQuiz.tsx:18` shuffles questions on every run (`shuffle(data.questions)`).
- `e2e/whoami.spec.ts` targets the first player card by position (not by name/title) — this is a deliberate, documented exception because `WhoAmIListPage`'s `PlayerCard` never displays the player's name before the game is solved (`player.teaser ?? "??? ??? ???"`).
- No app source files are touched by any task in this plan — only `e2e/*.spec.ts`, `package.json`, and `CLAUDE.md`.
- Spec reference: `docs/superpowers/specs/2026-08-03-additional-e2e-tests-design.md`.

---

### Task 1: `e2e/enumeration-classic.spec.ts`

**Files:**
- Create: `e2e/enumeration-classic.spec.ts`

**Interfaces:**
- Consumes: existing `playwright.config.ts` (`baseURL`, `testDir`) and `bun run test:e2e` script — no changes needed.
- Consumes app UI as currently implemented: home page category button text "Énumération" (`src/app/pages/home/HomePage.tsx:30-44`), quiz card button text "Moyennes en triple-double sur une saison" (id `triple-double-season`, first `subType: "classic"` quiz, `src/app/data/classicEnumerationQuizzes.ts:5-16`, answers `["Oscar Robertson", "Russell Westbrook", "Nikola Jokic"]`), the answer input placeholder `"Entrez une réponse… (Entrée pour valider)"` and button text `"Révéler les réponses manquantes"` / `"Score final"` (`src/app/components/ClassicQuiz.tsx:154, 216, 251`).

- [ ] **Step 1: Write the test**

Create `e2e/enumeration-classic.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("parcourt le flow Énumération classique jusqu'à la fin du quiz triple-double", async ({
	page,
}) => {
	await page.goto("/");

	await page.getByRole("button", { name: "Énumération" }).click();
	await expect(page).toHaveURL(/\/enumeration$/);

	await page
		.getByRole("button", { name: "Moyennes en triple-double sur une saison" })
		.click();
	await expect(page).toHaveURL(/\/enumeration\/triple-double-season$/);

	const answerInput = page.getByPlaceholder(
		"Entrez une réponse… (Entrée pour valider)",
	);
	await answerInput.fill("Nikola Jokic");
	await answerInput.press("Enter");

	await page
		.getByRole("button", { name: "Révéler les réponses manquantes" })
		.click();

	await expect(page.getByText("Score final")).toBeVisible();
	// Assert only the numerator (1 correct answer); the denominator (total
	// answers for this quiz) could grow if more entries are added later.
	await expect(page.getByText(/^1\/\d+$/)).toBeVisible();
});
```

- [ ] **Step 2: Sanity-check the test can actually fail**

Temporarily change the last assertion's expected pattern to something that cannot match (e.g. `/^99\/\d+$/`):

```ts
	await expect(page.getByText(/^99\/\d+$/)).toBeVisible();
```

Run:
```bash
bun run test:e2e e2e/enumeration-classic.spec.ts
```

Expected: FAIL — timeout waiting for a `99/N`-shaped text to be visible. Confirms the assertion is load-bearing.

- [ ] **Step 3: Revert the sanity-check change**

Change the assertion back to:
```ts
	await expect(page.getByText(/^1\/\d+$/)).toBeVisible();
```

- [ ] **Step 4: Run the real test and verify it passes**

Run:
```bash
bun run test:e2e e2e/enumeration-classic.spec.ts
```

Expected: PASS — 1 passed.

- [ ] **Step 5: Commit**

```bash
git add e2e/enumeration-classic.spec.ts
git commit -m "test: add e2e test for classic enumeration flow"
```

---

### Task 2: `e2e/quiz.spec.ts`

**Files:**
- Create: `e2e/quiz.spec.ts`

**Interfaces:**
- Consumes: existing `playwright.config.ts` and `bun run test:e2e` script — no changes needed.
- Consumes app UI as currently implemented: home page category button text "Quiz" (`src/app/pages/home/HomePage.tsx:65-98`), quiz card button text "Légendes de la NBA" (id `quiz-legends`, first `subType: "theme"` quiz, `src/app/data/themeQuizzes.ts:5-85`, 7 multiple-choice questions), `QuestionCard.tsx`'s question text (`<p className="text-white text-base leading-relaxed">{question.question}</p>`, line 77-79), choice buttons (button text includes the choice string as a substring, line 158), the `"Valider"` button (line 278), the next-question button whose text is either `"Question suivante"` or `"Voir les résultats"` depending on whether more questions remain (lines 291-298), and `ScoreScreen.tsx`'s `"Score parfait !"` label (shown when `pct === 100`, line 19-21) and `"100% de bonnes réponses"` text (line 54-56, `{pct}% de bonnes réponses"`).
- `SimpleQuiz.tsx:18` shuffles `data.questions` on every run — the test cannot assume question order, so it matches the currently-visible question's text against a known table instead.

- [ ] **Step 1: Write the test**

Create `e2e/quiz.spec.ts`:

```ts
import { expect, type Page, test } from "@playwright/test";

// Question → correct answer, copied verbatim from
// src/app/data/themeQuizzes.ts (quiz id "quiz-legends"). The quiz shuffles
// question order on every run, so the test looks up the currently-displayed
// question in this table instead of assuming a fixed order.
const QUESTIONS_AND_ANSWERS: Record<string, string> = {
	"Qui détient le record de points en saison régulière en NBA ?":
		"LeBron James",
	"Combien de titres NBA Michael Jordan a-t-il remportés avec les Chicago Bulls ?":
		"6",
	[`Quel joueur était surnommé "The Logo" et a servi de silhouette pour le logo de la NBA ?`]:
		"Jerry West",
	[`Quel joueur était surnommé "The Answer" ?`]: "Allen Iverson",
	"Contre quelle équipe Wilt Chamberlain a-t-il marqué 100 points dans un seul match ?":
		"New York Knicks",
	"Quel joueur a été le premier à afficher en moyenne 30 points et 20 rebonds par match sur une saison ?":
		"Wilt Chamberlain",
	"Magic Johnson a joué toute sa carrière avec quelle équipe ?":
		"Los Angeles Lakers",
};

async function answerCurrentQuestion(page: Page) {
	for (const [question, answer] of Object.entries(QUESTIONS_AND_ANSWERS)) {
		const isCurrent = await page
			.getByText(question, { exact: true })
			.isVisible()
			.catch(() => false);
		if (!isCurrent) continue;

		await page.getByRole("button", { name: answer }).click();
		await page.getByRole("button", { name: "Valider" }).click();
		await page
			.getByRole("button", { name: /Question suivante|Voir les résultats/ })
			.click();
		return;
	}
	throw new Error(
		"Current question not found in QUESTIONS_AND_ANSWERS — quiz-legends data may have changed",
	);
}

test("parcourt le flow Quiz jusqu'à la fin du quiz Légendes de la NBA", async ({
	page,
}) => {
	await page.goto("/");

	await page.getByRole("button", { name: "Quiz" }).click();
	await expect(page).toHaveURL(/\/quiz$/);

	await page.getByRole("button", { name: "Légendes de la NBA" }).click();
	await expect(page).toHaveURL(/\/quiz\/quiz-legends$/);

	let attempts = 0;
	while (
		!(await page
			.getByText("Score final")
			.isVisible()
			.catch(() => false))
	) {
		attempts++;
		if (attempts > 20) {
			throw new Error(
				"Quiz did not finish after 20 answered questions — possible selector mismatch",
			);
		}
		await answerCurrentQuestion(page);
	}

	await expect(page.getByText("Score final")).toBeVisible();
	// All answers are correct, so the score is necessarily a perfect one —
	// asserted without hardcoding the question count.
	await expect(page.getByText("Score parfait !")).toBeVisible();
	await expect(page.getByText("100% de bonnes réponses")).toBeVisible();
});
```

- [ ] **Step 2: Sanity-check the test can actually fail**

Temporarily corrupt one answer in `QUESTIONS_AND_ANSWERS` (e.g. change `"6"` to `"5"` for the Michael Jordan titles question):

```ts
	"Combien de titres NBA Michael Jordan a-t-il remportés avec les Chicago Bulls ?":
		"5",
```

Run:
```bash
bun run test:e2e e2e/quiz.spec.ts
```

Expected: FAIL — either the `getByRole("button", { name: "5" })` click fails to find a matching choice for a question where "5" isn't offered, or (if "5" happens to be a valid choice for that question) the final `"Score parfait !"` / `"100% de bonnes réponses"` assertions fail because the wrong answer was selected. Either failure mode confirms the table drives real behavior.

- [ ] **Step 3: Revert the sanity-check change**

Change it back to:
```ts
	"Combien de titres NBA Michael Jordan a-t-il remportés avec les Chicago Bulls ?":
		"6",
```

- [ ] **Step 4: Run the real test and verify it passes, twice**

Run twice in a row (to catch flakiness from the shuffle):
```bash
bun run test:e2e e2e/quiz.spec.ts
bun run test:e2e e2e/quiz.spec.ts
```

Expected: PASS both times — 1 passed each run.

- [ ] **Step 5: Commit**

```bash
git add e2e/quiz.spec.ts
git commit -m "test: add e2e test for theme Quiz flow"
```

---

### Task 3: `e2e/whoami.spec.ts`

**Files:**
- Create: `e2e/whoami.spec.ts`

**Interfaces:**
- Consumes: existing `playwright.config.ts` and `bun run test:e2e` script — no changes needed.
- Consumes app UI as currently implemented: home page category button text "Qui suis-je ?" (`src/app/pages/home/HomePage.tsx:100-133`), the `WhoAmIListPage`/`PlayerCard` list where every card's accessible name includes the fixed label `"Joueur mystère"` (`src/app/pages/whoami/WhoAmIListPage.tsx:96`) regardless of which player it is — the first list item corresponds to `whoAmIPlayers[0]`, id `whoami-jordan`, name `"Michael Jordan"` (`src/app/data/whoAmIPlayersData.ts:4-19`). `WhoAmIGame.tsx`'s guess input placeholder `"Qui suis-je ? (Entrée pour valider)"` (line 271), victory screen text `"Bravo !"` (line 310), the guessed player's name rendered verbatim (line 316), and the `"Légendaire 🐐"` score label shown when `finalClues <= 1` (line 128) — guessing correctly using only the first (always-visible) clue guarantees `finalClues === 1`.

- [ ] **Step 1: Write the test**

Create `e2e/whoami.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("parcourt le flow Qui suis-je jusqu'à la victoire sur le premier joueur", async ({
	page,
}) => {
	await page.goto("/");

	await page.getByRole("button", { name: "Qui suis-je ?" }).click();
	await expect(page).toHaveURL(/\/whoami$/);

	// The list never shows player names before the game is solved (each card
	// shows a teaser or "??? ??? ???"), so there's no name/title to target —
	// unlike the other quiz lists, this test targets the first card by
	// position. whoAmIPlayers[0] is "Michael Jordan" (id "whoami-jordan"), a
	// static roster entry, not a value expected to change routinely.
	await page.getByRole("button", { name: /Joueur mystère/ }).first().click();
	await expect(page).toHaveURL(/\/whoami\/whoami-jordan$/);

	const guessInput = page.getByPlaceholder(
		"Qui suis-je ? (Entrée pour valider)",
	);
	await guessInput.fill("Michael Jordan");
	await guessInput.press("Enter");

	await expect(page.getByText("Bravo !")).toBeVisible();
	await expect(page.getByText("Michael Jordan")).toBeVisible();
	// Guessed right on the first (always-visible) clue, so exactly 1 clue was
	// used — the game labels that "Légendaire 🐐".
	await expect(page.getByText("Légendaire 🐐")).toBeVisible();
});
```

- [ ] **Step 2: Sanity-check the test can actually fail**

Temporarily change the guess to a wrong name:

```ts
	await guessInput.fill("Larry Bird");
```

Run:
```bash
bun run test:e2e e2e/whoami.spec.ts
```

Expected: FAIL — timeout waiting for `"Bravo !"` to be visible (a wrong guess clears the input and adds to the wrong-guesses list instead of solving the game).

- [ ] **Step 3: Revert the sanity-check change**

Change it back to:
```ts
	await guessInput.fill("Michael Jordan");
```

- [ ] **Step 4: Run the real test and verify it passes**

Run:
```bash
bun run test:e2e e2e/whoami.spec.ts
```

Expected: PASS — 1 passed.

- [ ] **Step 5: Commit**

```bash
git add e2e/whoami.spec.ts
git commit -m "test: add e2e test for Qui suis-je flow"
```

---

### Task 4: `test:e2e:ui` script + CLAUDE.md e2e docs section

**Files:**
- Modify: `package.json` (add `test:e2e:ui` script)
- Modify: `CLAUDE.md` (add `bun run test:e2e:ui` to the Commands block, add a new "E2E tests" Architecture subsection)

**Interfaces:**
- Consumes: the 4 spec files now under `e2e/` (`enumeration.spec.ts`, `enumeration-classic.spec.ts`, `quiz.spec.ts`, `whoami.spec.ts`) from Tasks 1-3 of this plan and the prior e2e setup plan — this task only documents them, no code depends on this task's output.

- [ ] **Step 1: Add the `test:e2e:ui` script**

Edit the `"scripts"` block in `package.json` to add `test:e2e:ui` right after `test:e2e`:

```json
	"scripts": {
		"dev": "vite",
		"build": "tsc -b && vite build",
		"lint": "biome check .",
		"lint:fix": "biome check --write .",
		"format": "biome format --write .",
		"preview": "vite preview",
		"test:e2e": "playwright test",
		"test:e2e:ui": "playwright test --ui",
		"prepare": "lefthook install"
	},
```

- [ ] **Step 2: Verify the script works**

Run:
```bash
timeout 5 bun run test:e2e:ui || true
```

Expected: Playwright's UI mode starts (it opens an interactive window/server and would otherwise block indefinitely — the `timeout 5` here is only to confirm the command launches without erroring, not a normal way to run it interactively). Look for Playwright UI-mode startup output (no "command not found" or "unknown option" errors) before the timeout kills it.

- [ ] **Step 3: Update the Commands block in CLAUDE.md**

In `CLAUDE.md`, find this fenced code block (around line 13-22):

```markdown
​```bash
bun install          # install dependencies
bun run dev          # start dev server (http://localhost:5173)
bun run build        # tsc -b type-check, then vite build
bun run preview      # preview production build
bun run lint         # biome check .
bun run lint:fix     # biome check --write .
bun run format       # biome format --write .
bun run test:e2e     # playwright e2e tests (auto-starts dev server)
​```
```

Add one line after `bun run test:e2e`:

```markdown
​```bash
bun install          # install dependencies
bun run dev          # start dev server (http://localhost:5173)
bun run build        # tsc -b type-check, then vite build
bun run preview      # preview production build
bun run lint         # biome check .
bun run lint:fix     # biome check --write .
bun run format       # biome format --write .
bun run test:e2e     # playwright e2e tests (auto-starts dev server)
bun run test:e2e:ui  # playwright e2e tests in interactive UI mode
​```
```

- [ ] **Step 4: Add the E2E tests subsection to CLAUDE.md**

In `CLAUDE.md`, find the `### PWA` section — it is the last subsection under `## Architecture`:

```markdown
### PWA

`vite-plugin-pwa` (`vite.config.ts`) generates the manifest and service worker (`autoUpdate`). Icons/manifest fields are defined inline in the Vite config, not in a separate `manifest.json` — edit them there.
```

Add a new subsection immediately after it (at the end of the file):

```markdown

### E2E tests (`e2e/`)

One spec file per game flow:
- `enumeration.spec.ts` — yearly enumeration
- `enumeration-classic.spec.ts` — classic enumeration
- `quiz.spec.ts` — theme quiz (multiple choice)
- `whoami.spec.ts` — Qui suis-je

Run via `bun run test:e2e` (headless) or `bun run test:e2e:ui` (Playwright's interactive UI mode, useful for debugging a single spec).

Conventions:
- Locators: role/text on visible French UI text, no `data-testid`.
- Prefer stable identifiers (quiz title) over list position; exception: the WhoAmI list hides player names until solved, so the first player card is targeted by position instead.
- Avoid hardcoding counts that grow over time (e.g. total yearly entries, or a quiz's exact question count) — anchor assertions on what's actually being tested (e.g. the numerator of a score, not the denominator).
- The theme quiz (`SimpleQuiz.tsx`) shuffles its questions on every run — `quiz.spec.ts` matches the currently-displayed question against a known question→answer table rather than assuming a fixed order.
```

- [ ] **Step 5: Run lint on the touched files**

Run:
```bash
bunx biome check package.json
```

Expected: no new errors introduced by this task's change (the repo has a pre-existing unrelated lint issue — don't try to fix that here). CLAUDE.md is markdown and isn't linted by Biome.

- [ ] **Step 6: Commit**

```bash
git add package.json CLAUDE.md
git commit -m "docs: document e2e test structure and add UI-mode script"
```

---

## Out of scope (per spec)

- Tests for other quizzes within each category/subtype (only the first of each is covered).
- CI (GitHub Actions) integration for e2e.
- `data-testid` additions to app components.
- Changes to `playwright.config.ts`, `e2e/enumeration.spec.ts`, or the lefthook `pre-push` hook — already in place from the prior plan and unaffected by adding new spec files.
