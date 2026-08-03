# Playwright E2E Setup + First Enumeration Test Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up Playwright e2e tooling in nba-quiz-front and add a first test that walks the "Énumération" category → first quiz → answer a few rows → finish flow, runnable via `bun run test:e2e` and wired into a lefthook `pre-push` hook.

**Architecture:** Playwright Test drives a real Chromium browser against the Vite dev server, which Playwright starts itself via the `webServer` option. Tests live in a top-level `e2e/` directory, separate from `src/`. No application code changes are needed — the test only exercises existing UI.

**Tech Stack:** `@playwright/test` (devDependency), Chromium browser (via `playwright install`), bun as package manager/script runner, lefthook for git hooks (already in the repo).

## Global Constraints

- Package manager is bun — use `bun`/`bunx`, never npm/yarn (per `CLAUDE.md`).
- Formatting: tabs, double quotes (per `biome.json`) — match existing code style in all new files.
- `bun run test:e2e` must work standalone (no manually-started dev server required) — Playwright's `webServer` starts `bun run dev` itself.
- App is served under base path `/nba-quiz-front/` (see `vite.config.ts:9`), dev server runs on port 5173 (see `CLAUDE.md`) — full local URL is `http://localhost:5173/nba-quiz-front/`.
- Chromium only for this first pass — no Firefox/WebKit projects.
- e2e tests run on lefthook's `pre-push` hook, not `pre-commit` (which stays biome-only, per `lefthook.yml:1-5`).
- Test selectors use visible French UI text via Playwright's role/text locators — no `data-testid` additions to app components.
- Spec reference: `docs/superpowers/specs/2026-08-02-playwright-e2e-setup-design.md`.

---

### Task 1: Install Playwright and scaffold config

**Files:**
- Modify: `package.json` (add devDependency, add `test:e2e` script)
- Create: `playwright.config.ts`
- Modify: `.gitignore` (add Playwright artifact directories)

**Interfaces:**
- Produces: `playwright.config.ts` exporting a Playwright config with `testDir: "./e2e"` and `baseURL: "http://localhost:5173/nba-quiz-front/"`, which Task 2's test file relies on for relative `page.goto()` calls and for `bunx playwright test --list`/`bun run test:e2e` to work.
- Produces: `package.json` script `"test:e2e": "playwright test"`, which Task 2 and Task 3 both invoke.

- [ ] **Step 1: Install the Playwright Test package**

Run:
```bash
bun add -d @playwright/test
```

- [ ] **Step 2: Install the Chromium browser binary**

Run:
```bash
bunx playwright install chromium
```

Expected: downloads and installs a Chromium build into Playwright's local browser cache (not versioned in the repo).

- [ ] **Step 3: Add the `test:e2e` script to `package.json`**

Edit the `"scripts"` block in `package.json` to add `test:e2e` right after `"preview"`:

```json
	"scripts": {
		"dev": "vite",
		"build": "tsc -b && vite build",
		"lint": "biome check .",
		"lint:fix": "biome check --write .",
		"format": "biome format --write .",
		"preview": "vite preview",
		"test:e2e": "playwright test",
		"prepare": "lefthook install"
	},
```

- [ ] **Step 4: Create `playwright.config.ts`**

Create `playwright.config.ts` at the repo root:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: "html",
	use: {
		baseURL: "http://localhost:5173/nba-quiz-front/",
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: {
		command: "bun run dev",
		url: "http://localhost:5173/nba-quiz-front/",
		reuseExistingServer: !process.env.CI,
	},
});
```

- [ ] **Step 5: Add Playwright artifact directories to `.gitignore`**

Append to `.gitignore`:

```
# Playwright
test-results/
playwright-report/
playwright/.cache/
```

- [ ] **Step 6: Verify the config loads with no test files yet**

Run:
```bash
bunx playwright test --list
```

Expected: exits successfully, prints `Total: 0 tests in 0 files` (or equivalent) — confirms `playwright.config.ts` parses and `testDir` resolves, with no errors about missing browsers or bad config.

- [ ] **Step 7: Commit**

```bash
git add package.json bun.lock playwright.config.ts .gitignore
git commit -m "chore: add Playwright e2e tooling"
```

---

### Task 2: Write the Enumeration flow e2e test

**Files:**
- Create: `e2e/enumeration.spec.ts`

**Interfaces:**
- Consumes: `playwright.config.ts` from Task 1 (`baseURL`, `testDir`, `webServer`) and the `test:e2e` script.
- Consumes application UI text/roles as currently implemented: home page category button text "Énumération" (`src/app/pages/home/HomePage.tsx:42-44`), quiz card button text "MVP de saison régulière" (first entry of `quizzes`, from `src/app/data/yearlyEnumerationQuizzes.ts:5-6`), per-row input placeholder `"Votre réponse…"` and submit button text `"Tout valider"` (`src/app/components/YearlyQuiz.tsx`), result text `"Score final"`.
- Produces: nothing consumed by later tasks — this is the terminal test artifact for the scenario.

- [ ] **Step 1: Write the test**

Create `e2e/enumeration.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("parcourt le flow Énumération jusqu'à la fin du premier quiz", async ({
	page,
}) => {
	await page.goto("/");

	await page.getByRole("button", { name: "Énumération" }).click();
	await expect(page).toHaveURL(/\/enumeration$/);

	await page.getByRole("button", { name: "MVP de saison régulière" }).click();
	await expect(page).toHaveURL(/\/enumeration\/mvp-by-year$/);

	const answerInputs = page.getByPlaceholder("Votre réponse…");

	// Ligne d'index 2 = année 2024, réponse "Nikola Jokic"
	await answerInputs.nth(2).fill("Nikola Jokic");
	await answerInputs.nth(2).press("Enter");

	// Ligne d'index 3 = année 2023, réponse "Joel Embiid"
	await answerInputs.nth(3).fill("Joel Embiid");
	await answerInputs.nth(3).press("Enter");

	await page.getByRole("button", { name: "Tout valider" }).click();

	await expect(page.getByText("Score final")).toBeVisible();
	await expect(page.getByText("2/71")).toBeVisible();
});
```

- [ ] **Step 2: Sanity-check the test can actually fail**

Temporarily change the last assertion's expected text to `"99/71"`:

```ts
	await expect(page.getByText("99/71")).toBeVisible();
```

Run:
```bash
bun run test:e2e
```

Expected: FAIL — timeout waiting for text "99/71" to be visible. This confirms the assertion is load-bearing and not a false positive.

- [ ] **Step 3: Revert the sanity-check change**

Change the assertion back to:
```ts
	await expect(page.getByText("2/71")).toBeVisible();
```

- [ ] **Step 4: Run the real test and verify it passes**

Run:
```bash
bun run test:e2e
```

Expected: PASS — 1 passed. Playwright will start the dev server itself (via `webServer`), run the scenario in Chromium headless, and tear the server down after.

- [ ] **Step 5: Commit**

```bash
git add e2e/enumeration.spec.ts
git commit -m "test: add first Playwright e2e test for Enumeration flow"
```

---

### Task 3: Run e2e tests on lefthook pre-push

**Files:**
- Modify: `lefthook.yml`

**Interfaces:**
- Consumes: `test:e2e` script from Task 1, which must succeed standalone (no separately-running dev server) for this hook to work reliably on any machine.

- [ ] **Step 1: Add the `pre-push` hook**

Edit `lefthook.yml` to add a `pre-push` section below the existing `pre-commit` one, leaving `pre-commit` untouched:

```yaml
pre-commit:
  commands:
    lint:
      glob: "*.{ts,tsx,js,jsx,json}"
      run: npx biome check --no-errors-on-unmatched {staged_files}

pre-push:
  commands:
    e2e:
      run: bun run test:e2e
```

- [ ] **Step 2: Reinstall lefthook hooks so the new pre-push hook is active locally**

Run:
```bash
bun run prepare
```

Expected: reports lefthook hooks synced/installed, no errors.

- [ ] **Step 3: Verify the pre-push hook actually runs the e2e suite**

Run:
```bash
lefthook run pre-push
```

Expected: runs the `e2e` command (`bun run test:e2e`), ends with the Playwright test passing (1 passed), same result as Task 2 Step 4.

- [ ] **Step 4: Commit**

```bash
git add lefthook.yml
git commit -m "chore: run e2e tests on pre-push via lefthook"
```

---

## Out of scope (per spec)

- Multi-browser projects (Firefox/WebKit).
- CI (GitHub Actions) integration for e2e.
- `data-testid` additions to app components.
- Coverage of other quiz modes (theme quiz, Qui suis-je, classic enumeration).
