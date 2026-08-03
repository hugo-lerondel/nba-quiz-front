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

	// Playwright can't trigger a real OS virtual keyboard, but this
	// approximates what one leaves behind: a viewport shrunk down to roughly
	// the space visible above a phone's software keyboard.
	const original = page.viewportSize();
	if (!original) throw new Error("viewport size unavailable in this project");
	await page.setViewportSize({ width: original.width, height: 400 });

	// No scrolling performed yet, so this asserts the layout itself keeps the
	// input on screen — it must not be positioned below the fold purely as a
	// side effect of 5 clue cards being rendered above it. On the old
	// min-h-screen/whole-page-scroll layout the input ended up far below the
	// fold here (reachable only after scrolling past all the clues), which is
	// the "le clavier décale tout" symptom reported on mobile.
	await expect(guessInput).toBeInViewport();
	await expect(firstClue).toBeInViewport();

	await page.setViewportSize(original);
});
