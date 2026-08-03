# Table d'alias pour la validation des réponses (Yearly, Classic, Qui suis-je)

Date: 2026-08-03

## Contexte

Aujourd'hui, `isAnswerMatch` (`src/app/utils/quizHelpers.ts`) accepte génériquement n'importe quel segment (prénom OU nom de famille, ≥3 caractères) d'une réponse à plusieurs mots, avec tolérance aux fautes de frappe (Levenshtein ≥90%). Ex: "Nikola" matche "Nikola Jokic" au même titre que "Jokic". C'est trop permissif dans certains cas : "Nikola" ne prouve pas qu'on connaît la réponse précise, puisque plusieurs joueurs NBA s'appellent Nikola.

`WhoAmIGame.tsx` a par ailleurs sa propre logique de correspondance dupliquée (normalize local + n'importe quel segment de nom >3 caractères), sans tolérance aux fautes de frappe, indépendante de `quizHelpers.ts`.

Ce travail remplace ce système par une règle stricte par défaut (orthographe exacte, accents/casse ignorés, aucune tolérance aux fautes de frappe, aucune correspondance partielle automatique) plus une table d'alias explicite, curée manuellement réponse par réponse, pour les cas où une réponse plus courte doit être acceptée. Portée : quiz d'énumération "yearly" et "classic", et le jeu "Qui suis-je". Le quiz thématique ("Quiz", QCM) n'est pas concerné en pratique — ses 45 questions sont toutes à choix multiples aujourd'hui, donc `isAnswerMatch` n'y est jamais exercé (le composant `QuestionCard` appelle `isMatch`, pas `isAnswerMatch`, pour les QCM).

## Mécanisme

### Table centralisée (`src/app/data/answerAliases.ts`, nouveau fichier)

```ts
import { normalize } from "../utils/quizHelpers";

// Réponse canonique (telle qu'elle apparaît dans les données de quiz) ->
// liste d'alias courts acceptés en plus de la réponse complète.
// Les clés sont écrites lisiblement puis normalisées au chargement, donc
// deux orthographes différentes de la même réponse (ex: variante accentuée)
// convergent automatiquement vers la même entrée.
const rawAliases: Record<string, string[]> = {
	"LeBron James": ["Lebron"],
	"Nikola Jokic": ["Jokic"],
	// ... voir la liste complète dans la section "Table d'alias curée"
};

export const ANSWER_ALIASES: Record<string, string[]> = Object.fromEntries(
	Object.entries(rawAliases).map(([answer, aliases]) => [
		normalize(answer),
		aliases,
	]),
);
```

### Nouvelle règle de matching (`isAnswerMatch`, `src/app/utils/quizHelpers.ts`)

Remplace intégralement l'ancienne heuristique générique first/last-name + fuzzy :

```ts
/**
 * Strict match: the input must equal the answer (case/accents ignored), or
 * equal one of the answer's curated aliases in ANSWER_ALIASES
 * (src/app/data/answerAliases.ts). No typo tolerance, no automatic partial
 * (first/last name) matching — aliases must be explicitly curated per
 * answer, since a generic rule can't tell a safe short answer (e.g. "Shai")
 * from an ambiguous one (e.g. "Nikola", shared by several NBA players).
 */
export function isAnswerMatch(input: string, answer: string): boolean {
	const normInput = normalize(input);
	if (normInput === normalize(answer)) return true;
	const aliases = ANSWER_ALIASES[normalize(answer)] ?? [];
	return aliases.some((alias) => normInput === normalize(alias));
}
```

`isMatch` (utilisé pour valider les choix de QCM dans `QuestionCard.tsx`) n'est **pas** modifié — une sélection de QCM est toujours comparée à un choix proposé exact, ce changement ne le concerne pas.

### Unification du "Qui suis-je" (`WhoAmIGame.tsx`)

`WhoAmIGame.tsx` a aujourd'hui sa propre fonction `normalize` locale et sa propre logique de correspondance dans `handleGuess` (accepte tout segment de nom >3 caractères, sans tolérance typo, indépendamment de `quizHelpers.ts`). Cette logique est supprimée ; `handleGuess` utilise désormais `isAnswerMatch(trimmed, player.name)` importé de `quizHelpers.ts`. Résultat : même règle stricte + même table d'alias partout dans l'app, y compris pour deviner un joueur.

## Table d'alias curée (contenu initial)

Portée volontairement limitée à "quelques exemples emblématiques" (pas un audit exhaustif des ~379 réponses existantes) :

```
LeBron James            -> Lebron
Nikola Jokic            -> Jokic          (pas "Nikola" — plusieurs Nikola en NBA)
Shai Gilgeous-Alexander -> Shai
Michael Jordan          -> Jordan
Kobe Bryant             -> Kobe
Stephen Curry           -> Curry
Giannis Antetokounmpo   -> Giannis
Kevin Durant            -> Durant
Shaquille O'Neal        -> Shaq
Magic Johnson           -> Magic
Larry Bird              -> Bird
Wilt Chamberlain        -> Wilt, Chamberlain
Kareem Abdul-Jabbar     -> Kareem
Tim Duncan              -> Duncan
Hakeem Olajuwon         -> Hakeem, Olajuwon
Dirk Nowitzki           -> Dirk, Nowitzki
Luka Doncic             -> Luka, Doncic
Joel Embiid             -> Embiid
```

Volontairement exclus de cette première passe car ambigus dans le jeu de données actuel (même logique que Nikola/Jokic — plusieurs joueurs partagent le même prénom ou nom dans les réponses existantes) :
- "Malone" : `Karl Malone` et `Moses Malone` sont tous deux des réponses MVP par année.
- "George" : `George Mikan`, `George Gervin`, `George Yardley` sont trois réponses distinctes.
- "Bob" : `Bob Cousy`, `Bob McAdoo`, `Bob Pettit` sont trois réponses distinctes.

Ces réponses restent en saisie complète pour l'instant ; la table pourra être étendue au fil de l'eau (voir section Documentation).

Toutes les entrées ci-dessus proviennent de réponses réellement présentes dans `yearlyEnumerationQuizzes.ts` et/ou `classicEnumerationQuizzes.ts` ; `Michael Jordan -> Jordan` s'applique aussi automatiquement au mode "Qui suis-je" (même table partagée, le premier joueur du jeu est `whoami-jordan` / "Michael Jordan").

## Tests e2e

Pour prouver le nouveau comportement de bout en bout (pas de framework de test unitaire dans ce repo, cf. `CLAUDE.md`) :
- `e2e/enumeration.spec.ts` : la réponse tapée pour l'année 2024 passe de `"Nikola Jokic"` à `"Jokic"` (alias).
- `e2e/whoami.spec.ts` : la réponse tapée passe de `"Michael Jordan"` à `"Jordan"` (alias).
- `e2e/enumeration-classic.spec.ts` reste inchangé (répond déjà "Nikola Jokic" en toutes lettres, ce qui continue de fonctionner — la réponse canonique complète matche toujours).
- `bun run test:e2e` (suite complète, 4 fichiers) comme garde-fou de non-régression.

## Documentation (`CLAUDE.md`)

Réécriture de la sous-section existante "### Answer matching (`src/app/utils/quizHelpers.ts`)" sous `## Architecture` pour refléter : la règle stricte par défaut (accents/casse ignorés, sinon exact), la table d'alias (`src/app/data/answerAliases.ts`) et comment l'étendre, que `isMatch` reste inchangé pour les QCM, et le principe de curation (n'ajouter un alias que si le raccourci identifie sans ambiguïté LA réponse parmi toutes les réponses existantes de l'app — pas seulement au sein d'un même quiz).

## Hors scope

- Audit exhaustif des ~379 réponses existantes (yearly + classic + whoami) — seule la liste curée ci-dessus est ajoutée.
- Alias pour les réponses "équipe" (ex: "Celtics" pour "Boston Celtics") — la portée demandée concerne les noms de joueurs.
- Correction de la coquille préexistante `"Karem Abdul-Jabbar"` (sans le 2e "e") dans `classicEnumerationQuizzes.ts` (quiz `six-rings-players`) — bug de données préexistant, signalé mais non corrigé ici.
- Le quiz thématique ("Quiz", QCM) — `isMatch` n'est pas modifié, et aucune question à réponse libre n'existe aujourd'hui dans `themeQuizzes.ts`.
