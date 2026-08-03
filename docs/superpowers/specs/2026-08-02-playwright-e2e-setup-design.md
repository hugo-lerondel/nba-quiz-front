# Playwright E2E setup + premier test Énumération

Date: 2026-08-02

## Contexte

Le repo n'a aujourd'hui aucun framework de test (confirmé dans `CLAUDE.md`). Objectif : poser l'outillage e2e Playwright et écrire un premier test simple qui parcourt le flow catégorie Énumération → premier quiz → réponses → fin du quiz.

## Dépendances & scripts

- Ajouter `@playwright/test` en devDependency.
- `package.json` : nouveau script `"test:e2e": "playwright test"`.
- Après `bun install`, télécharger le binaire Chromium via `bunx playwright install chromium` (action manuelle, non versionnée, à documenter dans le README/CLAUDE.md).

## Config Playwright (`playwright.config.ts`, racine du repo)

- `testDir: "./e2e"`
- `webServer: { command: "bun run dev", url: "http://localhost:5173/nba-quiz-front/", reuseExistingServer: !process.env.CI }` — démarre automatiquement le serveur de dev Vite et le réutilise s'il tourne déjà en local.
- `use: { baseURL: "http://localhost:5173/nba-quiz-front/" }` (le `base` Vite est `/nba-quiz-front/`, cf. `vite.config.ts`).
- `projects: [{ name: "chromium", use: devices["Desktop Chrome"] }]` — Chromium uniquement pour ce premier test. D'autres navigateurs pourront être ajoutés plus tard si besoin.

## Test (`e2e/enumeration.spec.ts`)

Scénario, basé sur le code actuel (`HomePage.tsx`, `QuizListView.tsx`, `QuizCard.tsx`, `YearlyQuiz.tsx`) :

1. `page.goto("/")`.
2. Clic sur le bouton catégorie "Énumération" (texte visible sur la home).
3. Sur la liste, clic sur la première `QuizCard`. Le premier quiz de `quizzes` est `mvp-by-year` (subType `"yearly"`), un input texte par année.
4. Remplir 2-3 lignes avec des réponses connues issues de `yearlyEnumerationQuizzes.ts` (ex: année 2024 → "Nikola Jokic", année 2023 → "Joel Embiid"), valider chaque ligne au clavier (Entrée déclenche `checkRow`).
5. Cliquer sur le bouton "Tout valider" (`submitAll`) — termine le quiz même si toutes les lignes ne sont pas remplies, donc pas besoin de répondre aux ~331 entrées du quiz.
6. Vérifier que l'écran de score final s'affiche ("Score final", format `X/total`).

Sélecteurs : `getByRole`/`getByText` sur les libellés FR visibles dans l'UI (pas de `data-testid` — les composants n'en ont pas aujourd'hui et le texte est stable). Si les tests deviennent fragiles à l'usage, ajouter des `data-testid` ciblés sera une amélioration future, hors scope ici.

## Intégration lefthook

Nouveau hook `pre-push` dans `lefthook.yml`, distinct du `pre-commit` existant (biome) qui reste inchangé :

```yaml
pre-push:
  commands:
    e2e:
      run: bun run test:e2e
```

Raison : un test e2e (démarrage serveur + navigateur headless) prend nettement plus longtemps qu'un lint, donc il tourne au push plutôt qu'à chaque commit.

## Divers

- Ajouter à `.gitignore` : `test-results/`, `playwright-report/`, `playwright/.cache/`.

## Hors scope

- Multi-navigateurs (Firefox/WebKit).
- CI GitHub Actions pour l'e2e (le workflow de déploiement existant n'est pas touché).
- Ajout de `data-testid` dans les composants applicatifs.
- Couverture des autres modes de jeu (Quiz thématique, Qui suis-je, quiz "classic").
