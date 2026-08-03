import { expect, test } from "@playwright/test";

// Same flow as e2e/desktop/enumeration.spec.ts, run under the "mobile"
// Playwright project (Pixel 7 viewport/touch emulation) to catch responsive
// layout regressions on phone-sized screens.
test("parcourt le flow Énumération jusqu'à la fin du premier quiz", async ({
	page,
}) => {
	await page.goto("/");

	await page.getByRole("button", { name: "Énumération" }).click();
	await expect(page).toHaveURL(/\/enumeration$/);

	await page.getByRole("button", { name: "MVP de saison régulière" }).click();
	await expect(page).toHaveURL(/\/enumeration\/mvp-by-year$/);

	// Locate a row by its year label rather than positional index, since the
	// entries list is expected to grow (newest year prepended) over time.
	const rowInput = (year: number) =>
		page
			.locator("div")
			.filter({ has: page.getByText(String(year), { exact: true }) })
			.last()
			.getByPlaceholder("Votre réponse…");

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
});
