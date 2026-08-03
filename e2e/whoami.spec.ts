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
	await guessInput.fill("Michael Jordan");
	await guessInput.press("Enter");

	await expect(page.getByText("Bravo !")).toBeVisible();
	await expect(page.getByText("Michael Jordan")).toBeVisible();
	// Guessed right on the first (always-visible) clue, so exactly 1 clue was
	// used — the game labels that "Légendaire 🐐".
	await expect(page.getByText("Légendaire 🐐")).toBeVisible();
});
