// Canonical answer (as written in quiz/player data) -> list of shorter
// accepted aliases. Only add an alias when it identifies that answer
// unambiguously among ALL answers in the app (not just within one quiz) —
// e.g. "Malone" is deliberately absent because both "Karl Malone" and
// "Moses Malone" are MVP-by-year answers, and "Nikola" is absent for
// "Nikola Jokic" because several NBA players share that first name.
//
// No imports here on purpose: quizHelpers.ts imports ANSWER_ALIASES from
// this file and normalizes the keys itself. Importing `normalize` back
// from quizHelpers.ts here would create a circular module dependency.
export const ANSWER_ALIASES: Record<string, string[]> = {
	"LeBron James": ["Lebron"],
	"Nikola Jokic": ["Jokic"],
	"Shai Gilgeous-Alexander": ["Shai"],
	"Michael Jordan": ["Jordan"],
	"Kobe Bryant": ["Kobe"],
	"Stephen Curry": ["Curry"],
	"Giannis Antetokounmpo": ["Giannis"],
	"Kevin Durant": ["Durant"],
	"Shaquille O'Neal": ["Shaq"],
	"Magic Johnson": ["Magic"],
	"Larry Bird": ["Bird"],
	"Wilt Chamberlain": ["Wilt", "Chamberlain"],
	"Kareem Abdul-Jabbar": ["Kareem"],
	"Tim Duncan": ["Duncan"],
	"Hakeem Olajuwon": ["Hakeem", "Olajuwon"],
	"Dirk Nowitzki": ["Dirk", "Nowitzki"],
	"Luka Doncic": ["Luka", "Doncic"],
	"Joel Embiid": ["Embiid"],
	// data typo in six-rings-players (classicEnumerationQuizzes.ts) — this
	// alias key intentionally matches the typo verbatim, not the correct
	// spelling
	"Karem Abdul-Jabbar": ["Kareem Abdul-Jabbar", "Kareem"],
};
