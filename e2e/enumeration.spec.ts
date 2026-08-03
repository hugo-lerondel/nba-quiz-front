import { expect, test } from "@playwright/test";

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

	await rowInput(2024).fill("Nikola Jokic");
	await rowInput(2024).press("Enter");

	await rowInput(2023).fill("Joel Embiid");
	await rowInput(2023).press("Enter");

	await page.getByRole("button", { name: "Tout valider" }).click();

	await expect(page.getByText("Score final")).toBeVisible();
	// Assert only the numerator (correct answers); the denominator (total
	// entries) grows over time as new years are added to the quiz data.
	await expect(page.getByText(/^2\/\d+$/)).toBeVisible();
});
