# Tests e2e additionnels (Classic, Quiz, Qui suis-je) + doc + mode UI

Date: 2026-08-03

## Contexte

Le repo a déjà l'outillage Playwright et un premier test (`e2e/enumeration.spec.ts`, quiz "yearly") posés par un travail précédent (spec/plan du 2026-08-02). Ce travail ajoute trois tests e2e supplémentaires couvrant les flows restants de l'app (énumération "classic", catégorie "Quiz" thématique, "Qui suis-je"), documente la structure des tests e2e dans `CLAUDE.md`, et ajoute un script pour lancer Playwright en mode UI.

## Fichiers de test (un par flow)

Convention conservée du premier test : un fichier par flow, sélecteurs role/text sur le texte FR visible, pas de `data-testid`, pas de sleeps arbitraires (auto-wait Playwright).

### `e2e/enumeration-classic.spec.ts`

Cible le quiz `triple-double-season` ("Moyennes en triple-double sur une saison"), premier quiz `subType: "classic"` (3 réponses connues : Oscar Robertson, Russell Westbrook, Nikola Jokic).

Flow :
1. `page.goto("/")` → clic "Énumération" → clic sur la carte "Moyennes en triple-double sur une saison".
2. Remplir le champ avec "Nikola Jokic" + Entrée (une réponse connue et correcte).
3. Cliquer "Révéler les réponses manquantes" (`ClassicQuiz.tsx` — termine le quiz immédiatement, comme "Tout valider" côté yearly, sans dépendre du nombre total de réponses).
4. Vérifier "Score final" visible et un score au format `1/N` via une regex (`/^1\/\d+$/`) — le numérateur (1 bonne réponse) est déterministe, le dénominateur ne l'est pas si la liste de réponses s'allonge un jour.

### `e2e/quiz.spec.ts`

Cible le quiz `quiz-legends` ("Légendes de la NBA"), premier quiz `subType: "theme"`, catégorie "Quiz", 7 questions à choix multiples.

Particularité découverte dans `SimpleQuiz.tsx` : les questions sont mélangées aléatoirement à chaque run (`shuffle(data.questions)`) — impossible de cibler une question par position/index.

Flow :
1. `page.goto("/")` → clic "Quiz" → clic sur la carte "Légendes de la NBA".
2. Le test embarque une table statique `question → bonne réponse` reproduisant les 7 couples de `quiz-legends` dans `themeQuizzes.ts`.
3. Boucle jusqu'à l'apparition de l'écran de score : lire le texte de la question actuellement affichée (`QuestionCard`), retrouver la bonne réponse dans la table, cliquer le bouton de choix correspondant, cliquer "Valider", cliquer le bouton suivant ("Question suivante" ou "Voir les résultats").
4. Vérifier l'écran de score (`ScoreScreen.tsx`) : toutes les réponses étant correctes, assertion sur "Score parfait !" et "100% de bonnes réponses" plutôt que sur un total codé en dur — robuste si des questions sont ajoutées/retirées.

### `e2e/whoami.spec.ts`

Cible le premier joueur de `whoAmIPlayers` (`whoami-jordan` / "Michael Jordan").

Particularité : `WhoAmIListPage`/`PlayerCard` n'affiche jamais le nom du joueur avant résolution (`player.teaser ?? "??? ??? ???"`) — impossible de cibler une carte par nom depuis la liste, contrairement aux quiz classiques/thématiques qui affichent leur titre. Le test cible donc la première carte par position. C'est un compromis assumé et différent du choix fait pour les autres tests (qui ciblent par titre, un identifiant stable) : le roster `whoAmIPlayers` est un contenu statique, pas un flux qui s'allonge en tête de liste comme les entrées MVP annuelles — le risque de casse est jugé faible, et documenté par un commentaire dans le test.

Flow :
1. `page.goto("/")` → clic "Qui suis-je ?" → clic sur la première carte de la liste (`getByRole("button").first()` dans la zone `main`, ou équivalent).
2. `WhoAmIGame.tsx` n'a pas de mécanisme "abandonner/révéler" — il faut connaître la réponse pour terminer. Saisir directement "Michael Jordan" dans le champ de réponse + Entrée.
3. Vérifier l'écran de victoire : nom du joueur ("Michael Jordan") visible, "Bravo !" visible, et le badge "Légendaire 🐐" visible (confirme un indice utilisé = on a deviné dès le premier indice, donc un résultat déterministe indépendant du timer/de l'auto-reveal des indices).

## Script mode UI

`package.json` : ajouter `"test:e2e:ui": "playwright test --ui"`, juste après `"test:e2e"`.

## Documentation CLAUDE.md

Ajouter une sous-section "### E2E tests (`e2e/`)" sous "## Architecture", après la section PWA existante :

```markdown
### E2E tests (`e2e/`)

One spec file per game flow:
- `enumeration.spec.ts` — yearly enumeration
- `enumeration-classic.spec.ts` — classic enumeration
- `quiz.spec.ts` — theme quiz (multiple choice)
- `whoami.spec.ts` — Qui suis-je

Conventions:
- Locators: role/text on visible French UI text, no `data-testid`
- Prefer stable identifiers (quiz title) over list position;
  exception: WhoAmI list hides player names until solved, so the
  first player card is targeted by position
- Avoid hardcoding counts that grow over time (e.g. total
  yearly entries) — anchor on what's actually being tested
```

Le contenu exact peut être affiné en implémentation (par ex. mentionner `bun run test:e2e:ui`), tant que les points ci-dessus sont couverts.

## Hors scope

- Tests pour les autres quiz de chaque catégorie (le premier de chaque catégorie/sous-type suffit pour cette itération).
- CI GitHub Actions pour l'e2e.
- Ajout de `data-testid` dans les composants applicatifs.
- Refactor de la structure existante des tests (`playwright.config.ts`, `e2e/enumeration.spec.ts`, hook lefthook `pre-push`) — déjà en place et hors périmètre ici.
