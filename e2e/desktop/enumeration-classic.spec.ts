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
	await expect(page.getByRole("main").getByText(/^1\/\d+$/)).toBeVisible();
});
