import type { Quiz } from "./quizData";

export const themeQuizzes: Quiz[] = [
	{
		id: "quiz-legends",
		title: "Légendes de la NBA",
		category: "quiz",
		difficulty: "Medium",
		data: {
			subType: "theme",
			questions: [
				{
					question:
						"Qui détient le record de points en saison régulière en NBA ?",
					answer: "LeBron James",
					choices: [
						"Kareem Abdul-Jabbar",
						"LeBron James",
						"Karl Malone",
						"Kobe Bryant",
					],
				},
				{
					question:
						"Combien de titres NBA Michael Jordan a-t-il remportés avec les Chicago Bulls ?",
					answer: "6",
					choices: ["4", "5", "6", "7"],
				},
				{
					question:
						'Quel joueur était surnommé "The Logo" et a servi de silhouette pour le logo de la NBA ?',
					answer: "Jerry West",
					choices: [
						"Oscar Robertson",
						"Jerry West",
						"Bob Cousy",
						"Elgin Baylor",
					],
				},
				{
					question: 'Quel joueur était surnommé "The Answer" ?',
					answer: "Allen Iverson",
					choices: [
						"Kobe Bryant",
						"Allen Iverson",
						"Tracy McGrady",
						"Vince Carter",
					],
				},
				{
					question:
						"Contre quelle équipe Wilt Chamberlain a-t-il marqué 100 points dans un seul match ?",
					answer: "New York Knicks",
					choices: [
						"Boston Celtics",
						"New York Knicks",
						"Los Angeles Lakers",
						"Philadelphia Warriors",
					],
				},
				{
					question:
						"Quel joueur a été le premier à afficher en moyenne 30 points et 20 rebonds par match sur une saison ?",
					answer: "Wilt Chamberlain",
					choices: [
						"Bill Russell",
						"Wilt Chamberlain",
						"Kareem Abdul-Jabbar",
						"Bob Pettit",
					],
				},
				{
					question:
						"Magic Johnson a joué toute sa carrière avec quelle équipe ?",
					answer: "Los Angeles Lakers",
					choices: [
						"Boston Celtics",
						"Chicago Bulls",
						"Los Angeles Lakers",
						"Detroit Pistons",
					],
				},
			],
		},
	},
	{
		id: "quiz-championships",
		title: "Historique des championnats",
		category: "quiz",
		difficulty: "Medium",
		data: {
			subType: "theme",
			questions: [
				{
					question: "Quelle franchise NBA a remporté le plus de championnats ?",
					answer: "Boston Celtics",
					choices: [
						"Los Angeles Lakers",
						"Boston Celtics",
						"Golden State Warriors",
						"Chicago Bulls",
					],
				},
				{
					question:
						"Quelle équipe a mis fin à une disette de 52 ans sans titre pour la ville de Cleveland en 2016 ?",
					answer: "Cleveland Cavaliers",
					choices: [
						"Cleveland Cavaliers",
						"Golden State Warriors",
						"Oklahoma City Thunder",
						"Miami Heat",
					],
				},
				{
					question:
						"En quelle année les Toronto Raptors ont-ils remporté leur premier titre NBA ?",
					answer: "2019",
					choices: ["2017", "2018", "2019", "2020"],
				},
				{
					question:
						"Qui les Dallas Mavericks ont-ils battu lors des Finales NBA 2011 ?",
					answer: "Miami Heat",
					choices: [
						"Los Angeles Lakers",
						"Oklahoma City Thunder",
						"Miami Heat",
						"Boston Celtics",
					],
				},
				{
					question:
						"Les Golden State Warriors ont remporté 3 championnats en 4 ans (2015–2018). Quelle année n'ont-ils pas gagné ?",
					answer: "2016",
					choices: ["2015", "2016", "2017", "2018"],
				},
				{
					question:
						"Qui était l'entraîneur des San Antonio Spurs pendant leurs 5 championnats ?",
					answer: "Gregg Popovich",
					choices: [
						"Larry Brown",
						"Doc Rivers",
						"Gregg Popovich",
						"Phil Jackson",
					],
				},
				{
					question:
						"Phil Jackson détient le record du plus grand nombre de championnats remportés en tant qu'entraîneur principal. Combien en a-t-il remporté ?",
					answer: "11",
					choices: ["9", "10", "11", "12"],
				},
			],
		},
	},
	{
		id: "quiz-records",
		title: "Records et jalons",
		category: "quiz",
		difficulty: "Hard",
		data: {
			subType: "theme",
			questions: [
				{
					question:
						"Qui détient le record du plus grand nombre de triple-doubles en carrière en NBA ?",
					answer: "Russell Westbrook",
					choices: [
						"Oscar Robertson",
						"Magic Johnson",
						"LeBron James",
						"Russell Westbrook",
					],
				},
				{
					question:
						"Quel est le joueur le plus grand de l'histoire de la NBA (2,31 m / 7'7\") ?",
					answer: "Gheorghe Muresan",
					choices: [
						"Yao Ming",
						"Gheorghe Muresan",
						"Manute Bol",
						"Chuck Nevitt",
					],
				},
				{
					question:
						"Quel est le plus grand nombre de points jamais marqués par une équipe dans un seul match NBA ?",
					answer: "186",
					choices: ["172", "180", "186", "193"],
				},
				{
					question:
						"Qui détient le record du plus grand nombre de passes décisives dans un seul match NBA (30) ?",
					answer: "Scott Skiles",
					choices: [
						"Magic Johnson",
						"John Stockton",
						"Scott Skiles",
						"Isiah Thomas",
					],
				},
				{
					question:
						"Quel joueur détient le plus grand nombre de contres en carrière en NBA ?",
					answer: "Hakeem Olajuwon",
					choices: [
						"Dikembe Mutombo",
						"Kareem Abdul-Jabbar",
						"Hakeem Olajuwon",
						"David Robinson",
					],
				},
				{
					question:
						"Combien de paniers à trois points Stephen Curry a-t-il réussi lors de la saison 2015–16, record pour une saison ?",
					answer: "402",
					choices: ["324", "366", "402", "431"],
				},
				{
					question:
						"Qui détient le record du plus grand nombre de rebonds dans un seul match (55) ?",
					answer: "Wilt Chamberlain",
					choices: [
						"Bill Russell",
						"Wilt Chamberlain",
						"Dennis Rodman",
						"Nate Thurmond",
					],
				},
			],
		},
	},
	{
		id: "quiz-draft",
		title: "Drafts & Recrues",
		category: "quiz",
		difficulty: "Medium",
		data: {
			subType: "theme",
			questions: [
				{
					question:
						"Quel joueur a été choisi en première position lors de la Draft NBA 2003 ?",
					answer: "LeBron James",
					choices: [
						"Carmelo Anthony",
						"Dwyane Wade",
						"LeBron James",
						"Chris Bosh",
					],
				},
				{
					question:
						"À quelle position Michael Jordan a-t-il été drafté lors de la Draft NBA 1984 ?",
					answer: "3rd overall",
					choices: ["1st overall", "2nd overall", "3rd overall", "5th overall"],
				},
				{
					question:
						"Qui a remporté le trophée de Rookie of the Year en 2019–20 ?",
					answer: "Ja Morant",
					choices: [
						"Zion Williamson",
						"Ja Morant",
						"Tyler Herro",
						"Kendrick Nunn",
					],
				},
				{
					question:
						"Kobe Bryant a été drafté par quelle équipe avant d'être échangé aux Lakers ?",
					answer: "Charlotte Hornets",
					choices: [
						"New Jersey Nets",
						"Minnesota Timberwolves",
						"Charlotte Hornets",
						"Seattle SuperSonics",
					],
				},
				{
					question: "Qui a été le choix #1 à la Draft NBA 1992 ?",
					answer: "Shaquille O'Neal",
					choices: [
						"Alonzo Mourning",
						"Christian Laettner",
						"Shaquille O'Neal",
						"Jim Jackson",
					],
				},
				{
					question:
						"Dirk Nowitzki a été drafté en 1998. Quelle équipe l'a sélectionné ?",
					answer: "Milwaukee Bucks",
					choices: [
						"Dallas Mavericks",
						"Milwaukee Bucks",
						"Denver Nuggets",
						"Atlanta Hawks",
					],
				},
			],
		},
	},
	{
		id: "quiz-teams",
		title: "Équipes et franchises",
		category: "quiz",
		difficulty: "Easy",
		data: {
			subType: "theme",
			questions: [
				{
					question:
						"Les Oklahoma City Thunder étaient auparavant connus sous le nom de… ?",
					answer: "Seattle SuperSonics",
					choices: [
						"Vancouver Grizzlies",
						"New Jersey Nets",
						"Seattle SuperSonics",
						"New Orleans Hornets",
					],
				},
				{
					question:
						"Quelle équipe joue ses matchs à domicile au Madison Square Garden ?",
					answer: "New York Knicks",
					choices: [
						"Brooklyn Nets",
						"New York Knicks",
						"Boston Celtics",
						"Philadelphia 76ers",
					],
				},
				{
					question:
						'Le surnom "Bad Boys" faisait référence à quelle équipe à la fin des années 80 ?',
					answer: "Detroit Pistons",
					choices: [
						"New York Knicks",
						"Chicago Bulls",
						"Detroit Pistons",
						"Los Angeles Clippers",
					],
				},
				{
					question: "Pour quelle équipe joue Nikola Jokic ?",
					answer: "Denver Nuggets",
					choices: [
						"Phoenix Suns",
						"Utah Jazz",
						"Denver Nuggets",
						"Minnesota Timberwolves",
					],
				},
				{
					question:
						"Les Memphis Grizzlies ont joué à l'origine dans quelle ville ?",
					answer: "Vancouver",
					choices: ["Seattle", "Vancouver", "San Diego", "Kansas City"],
				},
				{
					question:
						"Quelle équipe a retiré le numéro 23 en l'honneur à la fois de Michael Jordan et de LeBron James ?",
					answer: "No team has retired it for both",
					choices: [
						"Cleveland Cavaliers",
						"Chicago Bulls",
						"Miami Heat",
						"No team has retired it for both",
					],
				},
			],
		},
	},
	{
		id: "quiz-mvp",
		title: "Prix MVP",
		category: "quiz",
		difficulty: "Hard",
		data: {
			subType: "theme",
			questions: [
				{
					question:
						"Qui a été le plus jeune joueur à remporter le prix MVP en NBA ?",
					answer: "Derrick Rose",
					choices: [
						"LeBron James",
						"Kevin Durant",
						"Derrick Rose",
						"Giannis Antetokounmpo",
					],
				},
				{
					question:
						"Combien de trophées MVP Kareem Abdul-Jabbar a-t-il remportés ?",
					answer: "6",
					choices: ["4", "5", "6", "7"],
				},
				{
					question:
						"Qui a été le premier joueur né en Europe à remporter le prix MVP en NBA ?",
					answer: "Dirk Nowitzki",
					choices: ["Steve Nash", "Dirk Nowitzki", "Pau Gasol", "Tony Parker"],
				},
				{
					question:
						"Stephen Curry est devenu le premier MVP unanime de l'histoire de la NBA lors de quelle saison ?",
					answer: "2015–16",
					choices: ["2014–15", "2015–16", "2016–17", "2017–18"],
				},
				{
					question:
						"Quel joueur a remporté les MVP consécutifs en 2019 et 2020 ?",
					answer: "Giannis Antetokounmpo",
					choices: [
						"LeBron James",
						"James Harden",
						"Giannis Antetokounmpo",
						"Nikola Jokic",
					],
				},
				{
					question:
						"Russell Westbrook a remporté le MVP 2017 après avoir réalisé une moyenne en triple-double. Quelle était sa moyenne de points par match cette saison ?",
					answer: "31.6",
					choices: ["28.4", "30.2", "31.6", "33.1"],
				},
			],
		},
	},
	{
		id: "quiz-goat",
		title: "Le débat du GOAT",
		category: "quiz",
		difficulty: "Easy",
		data: {
			subType: "theme",
			questions: [
				{
					question:
						"LeBron James a été drafté depuis quel lycée directement en NBA ?",
					answer: "St. Vincent-St. Mary High School",
					choices: [
						"Oak Hill Academy",
						"St. Vincent-St. Mary High School",
						"Westchester High School",
						"Fairfax High School",
					],
				},
				{
					question: "Combien de Finales NBA Michael Jordan a-t-il disputées ?",
					answer: "6",
					choices: ["5", "6", "7", "8"],
				},
				{
					question:
						"Avec combien d'équipes différentes LeBron James a-t-il remporté des titres NBA ?",
					answer: "3",
					choices: ["1", "2", "3", "4"],
				},
				{
					question:
						"Quel était le numéro de maillot de Michael Jordan chez les Chicago Bulls ?",
					answer: "23",
					choices: ["21", "23", "32", "45"],
				},
				{
					question:
						"En quelle année LeBron James a-t-il remporté son premier championnat NBA ?",
					answer: "2012",
					choices: ["2011", "2012", "2013", "2016"],
				},
				{
					question:
						"Pour quelle équipe Michael Jordan a-t-il joué brièvement après sa première retraite ?",
					answer: "Washington Wizards",
					choices: [
						"Miami Heat",
						"New York Knicks",
						"Washington Wizards",
						"Boston Celtics",
					],
				},
			],
		},
	},
];
