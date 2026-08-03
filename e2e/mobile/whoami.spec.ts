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
	await page
		.getByRole("button", { name: /Joueur mystère/ })
		.first()
		.click();
	await expect(page).toHaveURL(/\/whoami\/whoami-jordan$/);

	const guessInput = page.getByPlaceholder(
		"Qui suis-je ? (Entrée pour valider)",
	);
	// "Jordan" is a curated alias for "Michael Jordan" (src/app/data/answerAliases.ts) —
	// proves the unified matching (Task 2) accepts it here too.
	await guessInput.fill("Jordan");
	await guessInput.press("Enter");

	await expect(page.getByText("Bravo !")).toBeVisible();
	await expect(page.getByText("Michael Jordan")).toBeVisible();
	// Guessed right on the first (always-visible) clue, so exactly 1 clue was
	// used — the game labels that "Légendaire 🐐".
	await expect(page.getByText("Légendaire 🐐")).toBeVisible();
});

test("le champ de réponse reste visible quand plusieurs indices se sont accumulés sur un petit viewport", async ({
	page,
}) => {
	// Installed before navigating so every timer the page schedules on mount
	// (WhoAmIGame's clue auto-reveal interval) runs on virtual time — lets the
	// test fast-forward through several real clue reveals instead of waiting
	// on wall-clock seconds.
	await page.clock.install();

	await page.goto("/");
	await page.getByRole("button", { name: "Qui suis-je ?" }).click();
	await page
		.getByRole("button", { name: /Joueur mystère/ })
		.first()
		.click();
	await expect(page).toHaveURL(/\/whoami\/whoami-jordan$/);

	const guessInput = page.getByPlaceholder(
		"Qui suis-je ? (Entrée pour valider)",
	);
	// First clue for "whoami-jordan", copied verbatim from
	// src/app/data/whoAmIPlayersData.ts, always visible on load.
	const firstClue = page.getByText(
		"Je suis né le 17 février 1963 à Brooklyn, New York, et j'ai grandi en Caroline du Nord.",
	);
	await expect(firstClue).toBeVisible();

	// whoami-jordan reveals a new clue every 8s (player.clueInterval); fast-
	// forward past 4 reveals so 5 clue cards are stacked — enough to overflow
	// a small viewport, same as a player who's been reading clues for a while
	// before answering.
	await page.clock.runFor(4 * 8_000 + 500);

	// Playwright has no way to open a real OS keyboard, and resizing the page
	// viewport (page.setViewportSize) doesn't reproduce one either: on both
	// iOS Safari and Chrome, an on-screen keyboard shrinks
	// `window.visualViewport` but leaves the CSS layout viewport — and `dvh`
	// units — untouched. So instead we shrink `visualViewport` directly and
	// fire the same "resize" event the app listens for, which is the actual
	// signal a real keyboard opening sends.
	const keyboardOpenHeight = 400;
	await page.evaluate((height) => {
		const vv = window.visualViewport as VisualViewport;
		Object.defineProperty(vv, "height", { value: height, configurable: true });
		vv.dispatchEvent(new Event("resize"));
	}, keyboardOpenHeight);

	// No scrolling performed, so this checks the layout reacted on its own:
	// the input must not be positioned below the visible (post-"keyboard")
	// area purely as a side effect of 5 clue cards being rendered above it.
	// Without a `visualViewport`-driven height (relying on `dvh` alone, which
	// never shrinks for the keyboard), the input ended up far below this
	// line — reachable only by scrolling past all the clues, which is the
	// "le clavier décale tout" symptom reported on mobile.
	const inputBottom = await guessInput.evaluate(
		(el) => el.getBoundingClientRect().bottom,
	);
	expect(inputBottom).toBeLessThanOrEqual(keyboardOpenHeight);
	await expect(firstClue).toBeInViewport();
});
