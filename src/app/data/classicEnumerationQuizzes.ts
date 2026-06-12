import type { Quiz } from "./quizData.ts";

export const classicEnumerationQuizzes: Quiz[] = [
	{
		id: "consecutive-mvp-winners",
		title: "MVP consécutifs",
		category: "enumeration",
		difficulty: "Medium",
		data: {
			subType: "classic",
			prompt:
				"Nommez tous les joueurs qui ont remporté deux MVP NBA consécutifs.",
			hint: "Il y a 8 joueurs au total.",
			answers: [
				"Bill Russell",
				"Wilt Chamberlain",
				"Kareem Abdul-Jabbar",
				"Moses Malone",
				"Magic Johnson",
				"LeBron James",
				"Stephen Curry",
				"Giannis Antetokounmpo",
			],
		},
	},
	{
		id: "six-rings-players",
		title: "Joueurs avec 6+ titres",
		category: "enumeration",
		difficulty: "Easy",
		data: {
			subType: "classic",
			prompt: "Nommez tous les joueurs ayant remporté 6 titres NBA ou plus.",
			hint: "Pensez aux dynasties des Boston Celtics et à Michael Jordan.",
			answers: [
				"Bill Russell",
				"Sam Jones",
				"K.C. Jones",
				"Tom Heinsohn",
				"Tom Sanders",
				"John Havlicek",
				"Michael Jordan",
				"Scottie Pippen",
			],
		},
	},
	{
		id: "triple-double-season",
		title: "Moyennes en triple-double sur une saison",
		category: "enumeration",
		difficulty: "Hard",
		data: {
			subType: "classic",
			prompt:
				"Nommez tous les joueurs qui ont affiché une moyenne en triple-double sur une saison NBA entière.",
			hint: "Seuls quelques joueurs ont accompli cela dans l'histoire de la NBA.",
			answers: [
				"Oscar Robertson",
				"Russell Westbrook",
				"Nikola Jokic",
				"Luka Doncic",
			],
		},
	},
	{
		id: "all-star-game-mvp-repeat",
		title: "Multiples MVP du All-Star Game",
		category: "enumeration",
		difficulty: "Hard",
		data: {
			subType: "classic",
			prompt:
				"Nommez tous les joueurs qui ont remporté 3 MVP ou plus au All-Star Game.",
			hint: "LeBron James en a 4.",
			answers: ["LeBron James", "Bob Pettit", "Kobe Bryant"],
		},
	},
];
