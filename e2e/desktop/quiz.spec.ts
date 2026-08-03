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
