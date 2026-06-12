import type { Quiz } from "./quizData.ts";

export const classicEnumerationQuizzes: Quiz[] = [
	{
		id: "consecutive-mvp-winners",
		title: "Consecutive MVP Winners",
		category: "enumeration",
		difficulty: "Medium",
		data: {
			subType: "classic",
			prompt:
				"Name all players who won two or more consecutive NBA MVP awards.",
			hint: "There are 8 players total.",
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
		title: "Players with 6+ Championships",
		category: "enumeration",
		difficulty: "Easy",
		data: {
			subType: "classic",
			prompt: "Name all players who won 6 or more NBA Championships.",
			hint: "Think of the Boston Celtics dynasty and Michael Jordan.",
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
		title: "Triple-Double Season Averages",
		category: "enumeration",
		difficulty: "Hard",
		data: {
			subType: "classic",
			prompt:
				"Name all players who averaged a triple-double for an entire NBA season.",
			hint: "Only a handful of players in NBA history have accomplished this.",
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
		title: "Multiple All-Star Game MVPs",
		category: "enumeration",
		difficulty: "Hard",
		data: {
			subType: "classic",
			prompt:
				"Name all players who have won 3 or more NBA All-Star Game MVP awards.",
			hint: "LeBron James leads with 4.",
			answers: ["LeBron James", "Bob Pettit", "Kobe Bryant"],
		},
	},
];
