export type YearlyEntry = { year: number; answer: string };

export interface YearlyEnumerationQuiz {
	subType: "yearly";
	prompt: string;
	entries: YearlyEntry[];
}

export interface ClassicEnumerationQuiz {
	subType: "classic";
	prompt: string;
	answers: string[];
	hint?: string;
}

export interface QuizQuestion {
	question: string;
	answer: string;
	choices?: string[];
}

export interface WhoAmIPlayer {
	id: string;
	name: string;
	difficulty: "Easy" | "Medium" | "Hard";
	clueInterval: number; // secondes entre chaque dévoilement automatique
	teaser?: string; // phrase affichée dans la liste (vide = "??? ??? ???")
	clues: string[];
}

export interface QuizThemeData {
	subType: "theme";
	questions: QuizQuestion[];
}

export interface Quiz {
	id: string;
	title: string;
	category: "enumeration" | "quiz";
	difficulty: "Easy" | "Medium" | "Hard";
	data: YearlyEnumerationQuiz | ClassicEnumerationQuiz | QuizThemeData;
}

export const quizzes: Quiz[] = [
	// ─── ENUMERATION: YEARLY ────────────────────────────────────────────────────
	{
		id: "mvp-by-year",
		title: "NBA MVP by Year",
		category: "enumeration",
		difficulty: "Medium",
		data: {
			subType: "yearly",
			prompt: "Who won the NBA MVP award?",
			entries: [
				{ year: 2005, answer: "Steve Nash" },
				{ year: 2006, answer: "Steve Nash" },
				{ year: 2007, answer: "Dirk Nowitzki" },
				{ year: 2008, answer: "Kobe Bryant" },
				{ year: 2009, answer: "LeBron James" },
				{ year: 2010, answer: "LeBron James" },
				{ year: 2011, answer: "Derrick Rose" },
				{ year: 2012, answer: "LeBron James" },
				{ year: 2013, answer: "LeBron James" },
				{ year: 2014, answer: "Kevin Durant" },
				{ year: 2015, answer: "Stephen Curry" },
				{ year: 2016, answer: "Stephen Curry" },
				{ year: 2017, answer: "Russell Westbrook" },
				{ year: 2018, answer: "James Harden" },
				{ year: 2019, answer: "Giannis Antetokounmpo" },
				{ year: 2020, answer: "Giannis Antetokounmpo" },
			],
		},
	},
	{
		id: "nba-champions-by-year",
		title: "NBA Champions by Year",
		category: "enumeration",
		difficulty: "Medium",
		data: {
			subType: "yearly",
			prompt: "Which team won the NBA Championship?",
			entries: [
				{ year: 2010, answer: "Los Angeles Lakers" },
				{ year: 2011, answer: "Dallas Mavericks" },
				{ year: 2012, answer: "Miami Heat" },
				{ year: 2013, answer: "Miami Heat" },
				{ year: 2014, answer: "San Antonio Spurs" },
				{ year: 2015, answer: "Golden State Warriors" },
				{ year: 2016, answer: "Cleveland Cavaliers" },
				{ year: 2017, answer: "Golden State Warriors" },
				{ year: 2018, answer: "Golden State Warriors" },
				{ year: 2019, answer: "Toronto Raptors" },
				{ year: 2020, answer: "Los Angeles Lakers" },
				{ year: 2021, answer: "Milwaukee Bucks" },
				{ year: 2022, answer: "Golden State Warriors" },
				{ year: 2023, answer: "Denver Nuggets" },
			],
		},
	},
	{
		id: "finals-mvp-by-year",
		title: "NBA Finals MVP by Year",
		category: "enumeration",
		difficulty: "Hard",
		data: {
			subType: "yearly",
			prompt: "Who won the NBA Finals MVP?",
			entries: [
				{ year: 2010, answer: "Kobe Bryant" },
				{ year: 2011, answer: "Dirk Nowitzki" },
				{ year: 2012, answer: "LeBron James" },
				{ year: 2013, answer: "LeBron James" },
				{ year: 2014, answer: "Kawhi Leonard" },
				{ year: 2015, answer: "Andre Iguodala" },
				{ year: 2016, answer: "LeBron James" },
				{ year: 2017, answer: "Kevin Durant" },
				{ year: 2018, answer: "Kevin Durant" },
				{ year: 2019, answer: "Kawhi Leonard" },
				{ year: 2020, answer: "LeBron James" },
				{ year: 2021, answer: "Giannis Antetokounmpo" },
				{ year: 2022, answer: "Stephen Curry" },
				{ year: 2023, answer: "Nikola Jokic" },
			],
		},
	},
	{
		id: "scoring-title-by-year",
		title: "NBA Scoring Champion by Year",
		category: "enumeration",
		difficulty: "Hard",
		data: {
			subType: "yearly",
			prompt: "Who won the NBA scoring title?",
			entries: [
				{ year: 2015, answer: "Russell Westbrook" },
				{ year: 2016, answer: "Stephen Curry" },
				{ year: 2017, answer: "Russell Westbrook" },
				{ year: 2018, answer: "James Harden" },
				{ year: 2019, answer: "James Harden" },
				{ year: 2020, answer: "James Harden" },
				{ year: 2021, answer: "Stephen Curry" },
				{ year: 2022, answer: "Joel Embiid" },
				{ year: 2023, answer: "Joel Embiid" },
			],
		},
	},

	// ─── ENUMERATION: CLASSIC ───────────────────────────────────────────────────
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

	// ─── QUIZ: THEMED ───────────────────────────────────────────────────────────
	{
		id: "quiz-legends",
		title: "NBA Legends",
		category: "quiz",
		difficulty: "Medium",
		data: {
			subType: "theme",
			questions: [
				{
					question: "Who holds the NBA all-time regular season scoring record?",
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
						"Michael Jordan won how many NBA championships with the Chicago Bulls?",
					answer: "6",
					choices: ["4", "5", "6", "7"],
				},
				{
					question:
						'Which player was known as "The Logo" and served as the NBA\'s silhouette model?',
					answer: "Jerry West",
					choices: [
						"Oscar Robertson",
						"Jerry West",
						"Bob Cousy",
						"Elgin Baylor",
					],
				},
				{
					question: 'Who was nicknamed "The Answer"?',
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
						"Wilt Chamberlain scored 100 points in a single game. Against which team?",
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
						"Who was the first player in NBA history to average 30 points and 20 rebounds per game in a season?",
					answer: "Wilt Chamberlain",
					choices: [
						"Bill Russell",
						"Wilt Chamberlain",
						"Kareem Abdul-Jabbar",
						"Bob Pettit",
					],
				},
				{
					question: "Magic Johnson played his entire career with which team?",
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
		title: "Championship History",
		category: "quiz",
		difficulty: "Medium",
		data: {
			subType: "theme",
			questions: [
				{
					question: "Which NBA franchise has won the most championships?",
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
						"Which team ended a 52-year championship drought for the city of Cleveland in 2016?",
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
						"The Toronto Raptors won their first NBA Championship in which year?",
					answer: "2019",
					choices: ["2017", "2018", "2019", "2020"],
				},
				{
					question:
						"Who did the Dallas Mavericks defeat in the 2011 NBA Finals?",
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
						"The Golden State Warriors won 3 championships in a 4-year span (2015–2018). Which year did they NOT win?",
					answer: "2016",
					choices: ["2015", "2016", "2017", "2018"],
				},
				{
					question:
						"Who was the head coach of the San Antonio Spurs during all 5 of their championships?",
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
						"Phil Jackson holds the record for most NBA championships as a head coach. How many did he win?",
					answer: "11",
					choices: ["9", "10", "11", "12"],
				},
			],
		},
	},
	{
		id: "quiz-records",
		title: "Records & Milestones",
		category: "quiz",
		difficulty: "Hard",
		data: {
			subType: "theme",
			questions: [
				{
					question: "Who holds the NBA record for most career triple-doubles?",
					answer: "Russell Westbrook",
					choices: [
						"Oscar Robertson",
						"Magic Johnson",
						"LeBron James",
						"Russell Westbrook",
					],
				},
				{
					question: "Who is the tallest player in NBA history at 7'7\"?",
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
						"What is the most points ever scored by a team in a single NBA game?",
					answer: "186",
					choices: ["172", "180", "186", "193"],
				},
				{
					question:
						"Who holds the record for most assists in a single NBA game with 30?",
					answer: "Scott Skiles",
					choices: [
						"Magic Johnson",
						"John Stockton",
						"Scott Skiles",
						"Isiah Thomas",
					],
				},
				{
					question: "Which player has the most career blocks in NBA history?",
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
						"Stephen Curry set the record for most three-pointers in a season with how many in 2015–16?",
					answer: "402",
					choices: ["324", "366", "402", "431"],
				},
				{
					question:
						"Who holds the record for most rebounds in a single game with 55?",
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
		title: "Draft & Rookies",
		category: "quiz",
		difficulty: "Medium",
		data: {
			subType: "theme",
			questions: [
				{
					question:
						"Which player was selected first overall in the 2003 NBA Draft?",
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
						"Michael Jordan was drafted in which position in the 1984 NBA Draft?",
					answer: "3rd overall",
					choices: ["1st overall", "2nd overall", "3rd overall", "5th overall"],
				},
				{
					question: "Who won the NBA Rookie of the Year award in 2019–20?",
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
						"Kobe Bryant was drafted by which team before being traded to the Lakers?",
					answer: "Charlotte Hornets",
					choices: [
						"New Jersey Nets",
						"Minnesota Timberwolves",
						"Charlotte Hornets",
						"Seattle SuperSonics",
					],
				},
				{
					question: "Who was the #1 overall pick in the 1992 NBA Draft?",
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
						"Dirk Nowitzki was drafted in 1998. Which team selected him?",
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
		title: "Teams & Franchises",
		category: "quiz",
		difficulty: "Easy",
		data: {
			subType: "theme",
			questions: [
				{
					question: "The Oklahoma City Thunder were formerly known as the…?",
					answer: "Seattle SuperSonics",
					choices: [
						"Vancouver Grizzlies",
						"New Jersey Nets",
						"Seattle SuperSonics",
						"New Orleans Hornets",
					],
				},
				{
					question: "Which team plays its home games at Madison Square Garden?",
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
						'The "Bad Boys" nickname referred to which team from the late 1980s?',
					answer: "Detroit Pistons",
					choices: [
						"New York Knicks",
						"Chicago Bulls",
						"Detroit Pistons",
						"Los Angeles Clippers",
					],
				},
				{
					question: "Which team does Nikola Jokic play for?",
					answer: "Denver Nuggets",
					choices: [
						"Phoenix Suns",
						"Utah Jazz",
						"Denver Nuggets",
						"Minnesota Timberwolves",
					],
				},
				{
					question: "The Memphis Grizzlies originally played in which city?",
					answer: "Vancouver",
					choices: ["Seattle", "Vancouver", "San Diego", "Kansas City"],
				},
				{
					question:
						"Which team retired the number 23 in honor of both Michael Jordan and LeBron James?",
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
		title: "MVP Awards",
		category: "quiz",
		difficulty: "Hard",
		data: {
			subType: "theme",
			questions: [
				{
					question: "Who was the youngest player to win the NBA MVP award?",
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
						"Kareem Abdul-Jabbar holds the record for most MVP awards. How many did he win?",
					answer: "6",
					choices: ["4", "5", "6", "7"],
				},
				{
					question:
						"Who was the first European-born player to win the NBA MVP?",
					answer: "Dirk Nowitzki",
					choices: ["Steve Nash", "Dirk Nowitzki", "Pau Gasol", "Tony Parker"],
				},
				{
					question:
						"Stephen Curry became the first unanimous MVP in NBA history. In which season?",
					answer: "2015–16",
					choices: ["2014–15", "2015–16", "2016–17", "2017–18"],
				},
				{
					question: "Which player won back-to-back MVPs in 2019 and 2020?",
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
						"Russell Westbrook won the 2017 MVP after averaging a triple-double. His PPG average that season was?",
					answer: "31.6",
					choices: ["28.4", "30.2", "31.6", "33.1"],
				},
			],
		},
	},
	{
		id: "quiz-goat",
		title: "The GOAT Debate",
		category: "quiz",
		difficulty: "Easy",
		data: {
			subType: "theme",
			questions: [
				{
					question:
						"LeBron James was drafted from which high school directly into the NBA?",
					answer: "St. Vincent-St. Mary High School",
					choices: [
						"Oak Hill Academy",
						"St. Vincent-St. Mary High School",
						"Westchester High School",
						"Fairfax High School",
					],
				},
				{
					question: "How many NBA Finals did Michael Jordan appear in?",
					answer: "6",
					choices: ["5", "6", "7", "8"],
				},
				{
					question:
						"LeBron James has won NBA championships with how many different teams?",
					answer: "3",
					choices: ["1", "2", "3", "4"],
				},
				{
					question:
						"Michael Jordan's jersey number with the Chicago Bulls was?",
					answer: "23",
					choices: ["21", "23", "32", "45"],
				},
				{
					question:
						"In which year did LeBron James win his first NBA championship?",
					answer: "2012",
					choices: ["2011", "2012", "2013", "2016"],
				},
				{
					question:
						"Michael Jordan played briefly for which team after his first retirement?",
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

// ─── QUI SUIS-JE ? ───────────────────────────────────────────────────────────
export const whoAmIPlayers: WhoAmIPlayer[] = [
	{
		id: "whoami-jordan",
		name: "Michael Jordan",
		difficulty: "Easy",
		clueInterval: 12,
		teaser: "Six bagues, une mamba noire… non, pas celle-là.",
		clues: [
			"Je suis né le 17 février 1963 à Brooklyn, New York, et j'ai grandi en Caroline du Nord.",
			"Au lycée, j'ai d'abord été recalé de l'équipe varsity de basket avant de devenir l'un des meilleurs joueurs de mon état.",
			"J'ai joué à l'université de Caroline du Nord, où j'ai inscrit le panier décisif du titre NCAA en 1982 en tant que freshman.",
			"J'ai été drafté en 3ème position par une franchise de Chicago en 1984, derrière Hakeem Olajuwon et Sam Bowie.",
			"Je suis 6 fois champion NBA, 5 fois MVP de la saison régulière, et 6 fois MVP des Finales — toujours avec la même équipe.",
			"Mon surnom est « Air » suivi de mon prénom, et je suis co-créateur d'une ligne de chaussures qui porte mon nom.",
			"J'ai pris une première retraite en 1993 pour jouer au baseball, avant de revenir en NBA en 1995.",
		],
	},
	{
		id: "whoami-lebron",
		name: "LeBron James",
		difficulty: "Easy",
		clueInterval: 12,
		teaser: "Le Roi règne depuis plus de 20 ans.",
		clues: [
			"Je suis né le 30 décembre 1984 à Akron, Ohio, dans une famille modeste.",
			"À l'âge de 16 ans, ma photo apparaissait déjà en couverture de Sports Illustrated avec le titre « The Chosen One ».",
			"J'ai été sélectionné 1er choix de la draft NBA 2003 par la franchise de ma ville natale.",
			"J'ai remporté 4 titres NBA avec 3 franchises différentes : Cleveland, Miami et Los Angeles.",
			"En 2023, je suis devenu le meilleur marqueur de l'histoire de la NBA, dépassant Kareem Abdul-Jabbar.",
			"Mon surnom est « Le Roi » et mes initiales sont souvent associées au terme « Le Bron ».",
			"Mon fils joue également en NBA — il porte le même prénom que moi, suivi de « Bronny ».",
		],
	},
	{
		id: "whoami-kobe",
		name: "Kobe Bryant",
		difficulty: "Easy",
		clueInterval: 12,
		teaser: "Mamba Mentality — deux numéros, une légende.",
		clues: [
			"Je suis né le 23 août 1978 à Philadelphie, mais j'ai grandi en Italie où mon père jouait au basket professionnel.",
			"Je parle couramment l'italien et j'ai rejoint la NBA directement depuis le lycée à l'âge de 17 ans.",
			"J'ai été drafté par Charlotte en 1996 mais immédiatement échangé contre Vlade Divac aux Los Angeles Lakers.",
			"J'ai porté les numéros 8 et 24 au cours de ma carrière, et les deux ont été retirés par la même franchise.",
			"J'ai remporté 5 championnats NBA — 3 consécutifs avec Shaquille O'Neal, puis 2 autres en tant que leader incontesté.",
			"Mon surnom est « La Mamba Noire », un pseudonyme que je me suis moi-même attribué.",
			"Je suis tragiquement décédé le 26 janvier 2020 dans un accident d'hélicoptère avec ma fille Gianna.",
		],
	},
	{
		id: "whoami-shaq",
		name: "Shaquille O'Neal",
		difficulty: "Easy",
		clueInterval: 10,
		teaser: "Une force de la nature, redoutable sauf aux lancers francs.",
		clues: [
			"Je mesure 2m16 et pèse plus de 140 kg à mon apogée — l'un des joueurs les plus imposants de l'histoire de la NBA.",
			"Je suis né le 6 mars 1972 à Newark, dans le New Jersey, et j'ai grandi dans une famille militaire.",
			"J'ai joué au basket à l'université d'État de la Louisiane avant d'être drafté 1er choix par Orlando en 1992.",
			"J'ai remporté 4 titres NBA avec deux franchises différentes : Los Angeles (3) et Miami (1).",
			"J'ai sorti plusieurs albums de rap et joué dans des films comme « Blue Chips » et « Kazaam ».",
			"Mon surnom est « The Diesel », « The Big Aristotle » ou encore « Shaq ».",
			"Malgré ma domination physique, j'étais connu pour mes lacunes aux lancers francs — les équipes adverses utilisaient la stratégie du « Hack-a-Shaq ».",
		],
	},
	{
		id: "whoami-curry",
		name: "Stephen Curry",
		difficulty: "Medium",
		clueInterval: 15,
		teaser: "Il a révolutionné le jeu depuis la ligne à trois points.",
		clues: [
			"Je suis né le 14 mars 1988 à Charlotte, en Caroline du Nord. Mon père jouait également en NBA.",
			"À cause de ma petite taille et de ma morphologie jugée trop fine, la plupart des grandes universités ne voulaient pas de moi. J'ai choisi Davidson College.",
			"J'ai mené Davidson jusqu'en quart de finale du tournoi NCAA 2008 avec des performances époustouflantes.",
			"J'ai été drafté en 7ème position par les Golden State Warriors en 2009.",
			"En 2015-16, je suis devenu le premier MVP unanime de l'histoire de la NBA, avec plus de 400 tirs à 3 points dans la saison.",
			"Je détiens le record du monde du nombre de paniers à trois points marqués en carrière régulière.",
			"J'ai remporté 4 titres NBA, tous avec la même franchise de la baie de San Francisco.",
		],
	},
	{
		id: "whoami-magic",
		name: "Magic Johnson",
		difficulty: "Medium",
		clueInterval: 14,
		teaser: "Un meneur de 2m06 qui voyait le jeu avant tout le monde.",
		clues: [
			"Je suis né le 14 août 1959 à Lansing, dans le Michigan.",
			"Mon surnom m'a été donné par un journaliste sportif local après une performance extraordinaire au lycée avec 36 points, 18 rebonds et 16 passes.",
			"J'ai mené l'université du Michigan State au titre NCAA en 1979, en finale contre Larry Bird.",
			"J'ai été drafté 1er choix de la draft 1979 par Los Angeles.",
			"Je mesure 2m06 et jouais meneur de jeu — une combinaison unique à mon époque.",
			"J'ai annoncé ma séropositivité au VIH en 1991, devenant un symbole mondial dans la lutte contre le SIDA.",
			"J'ai remporté 5 titres NBA et 3 trophées de MVP de la saison régulière avec les Lakers des années 1980.",
		],
	},
	{
		id: "whoami-bird",
		name: "Larry Bird",
		difficulty: "Medium",
		clueInterval: 14,
		teaser: "Le gamin de l'Indiana qui a mis fin à la disette de Boston.",
		clues: [
			"Je suis né le 7 décembre 1956 à West Baden Springs, une toute petite ville de l'Indiana.",
			"J'ai grandi dans une famille pauvre et difficile. Mon père s'est suicidé quand j'avais 18 ans.",
			"J'ai quitté l'université Indiana puis rejoint Indiana State, où j'ai mené l'équipe jusqu'en finale NCAA 1979 contre Magic Johnson.",
			"Malgré mon manque de vitesse et d'athlétisme, j'étais considéré comme l'un des meilleurs shooteurs et passeurs de l'histoire.",
			"J'ai remporté 3 titres NBA, 3 MVP consécutifs de la saison régulière, et 2 MVP des Finales — tous avec Boston.",
			"Ma rivalité avec Magic Johnson tout au long des années 1980 est considérée comme l'une des plus grandes rivalités sportives de l'histoire.",
			"Après ma carrière de joueur, j'ai entraîné les Indiana Pacers jusqu'en Finales NBA en 2000, remportant le titre d'Entraîneur de l'Année.",
		],
	},
	{
		id: "whoami-kareem",
		name: "Kareem Abdul-Jabbar",
		difficulty: "Medium",
		clueInterval: 16,
		teaser: "Six MVP, un sky hook inimitable et 20 saisons de domination.",
		clues: [
			"Je suis né Lew Alcindor le 16 avril 1947 à New York. J'ai ensuite changé de nom après ma conversion à l'islam.",
			"À UCLA, j'ai remporté 3 titres NCAA consécutifs et n'ai pratiquement jamais perdu de match universitaire.",
			"Je suis le seul joueur à avoir remporté le titre de MVP de la NCAA, puis de la NBA en debut de carrière.",
			"Ma signature offensive est le « sky hook », un tir en crochet quasi-imparable que personne n'a jamais réussi à défendre efficacement.",
			"J'ai remporté 6 titres NBA — 1 à Milwaukee, 5 à Los Angeles — et 6 trophées de MVP de la saison régulière, un record absolu.",
			"J'ai été le meilleur marqueur de l'histoire de la NBA pendant 38 ans, jusqu'à ce que LeBron James batte mon record en 2023.",
			"Je mesure 2m18 et j'ai joué 20 saisons en NBA, prenant ma retraite à 42 ans.",
		],
	},
	{
		id: "whoami-dirk",
		name: "Dirk Nowitzki",
		difficulty: "Medium",
		clueInterval: 16,
		teaser: "L'Européen qui a changé le poste d'ailier fort pour toujours.",
		clues: [
			"Je suis né le 19 juin 1978 à Würzburg, en Allemagne, où j'ai grandi en jouant au tennis et au handball avant de découvrir le basket.",
			"À 18 ans, j'ai été repéré par Holger Geschwindner, un ancien joueur allemand qui est devenu mon mentor et entraîneur personnel.",
			"J'ai été drafté en 9ème position par Milwaukee en 1998, puis immédiatement échangé contre Robert Traylor aux Dallas Mavericks.",
			"Je suis le premier joueur international à avoir remporté le titre de MVP de la saison régulière NBA, en 2007.",
			"En 2011, j'ai mené Dallas à son premier et unique titre NBA, dominant le Heat de LeBron James. J'ai été élu MVP des Finales.",
			"Je mesure 2m13 et j'étais ailier fort — ma capacité à shooter à longue distance depuis cette position a révolutionné le jeu moderne.",
			"J'ai passé l'intégralité de mes 21 saisons en NBA dans la même franchise, Dallas, refusant des offres plus lucratives par loyauté.",
		],
	},
	{
		id: "whoami-giannis",
		name: "Giannis Antetokounmpo",
		difficulty: "Hard",
		clueInterval: 18,
		teaser: "Des rues d'Athènes aux sommets de la NBA.",
		clues: [
			"Je suis né le 6 décembre 1994 à Athènes, en Grèce, de parents immigrants nigérians. Ma famille vivait dans la pauvreté.",
			"Enfant, je vendais des montres et des lunettes de soleil dans les rues d'Athènes pour aider ma famille à survivre.",
			"J'avais très peu d'expérience en basket lorsque j'ai été repéré. J'ai joué en deuxième division grecque avant d'entrer à la draft.",
			"J'ai été sélectionné en 15ème position par Milwaukee en 2013, à l'âge de 18 ans.",
			"Ma progression est l'une des plus impressionnantes de l'histoire : en quelques années, je suis passé de quasi inconnu à double MVP de la saison régulière (2019, 2020).",
			"Mon surnom est « The Greek Freak » en raison de mon athlétisme hors-norme et de ma progression fulgurante.",
			"En 2021, j'ai mené Milwaukee à son premier titre NBA en 50 ans, remportant le MVP des Finales avec 50 points lors du match 6.",
		],
	},
	{
		id: "whoami-westbrook",
		name: "Russell Westbrook",
		difficulty: "Hard",
		clueInterval: 18,
		teaser: undefined,
		clues: [
			"Je suis né le 12 novembre 1988 à Long Beach, en Californie.",
			"Au lycée, j'étais si peu coté que je n'ai obtenu qu'une seule bourse universitaire — pour UCLA, où j'ai explosé en deux saisons.",
			"J'ai été drafté en 4ème position par Seattle SuperSonics en 2008, une franchise qui est devenue Oklahoma City Thunder dès ma première saison.",
			"Ma carrière est marquée par une intensité extrême : je joue chaque possession comme si c'était la dernière.",
			"En 2016-17, j'ai été le premier joueur depuis Oscar Robertson à moyenner un triple-double sur une saison entière — et je l'ai répété plusieurs fois ensuite.",
			"Je détiens le record absolu du nombre de triple-doubles en carrière régulière NBA.",
			"Malgré mes statistiques extraordinaires, je n'ai jamais remporté le titre NBA.",
		],
	},
	{
		id: "whoami-hakeem",
		name: "Hakeem Olajuwon",
		difficulty: "Hard",
		clueInterval: 20,
		teaser: "Du Nigeria à Houston, via le « Dream Shake ».",
		clues: [
			"Je suis né le 21 janvier 1963 à Lagos, au Nigeria. J'ai grandi en jouant au football et au handball — je n'ai commencé le basket qu'à 15 ans.",
			"Je suis venu aux États-Unis pour jouer à l'université de Houston, où mes coéquipiers et moi étions surnommés « Phi Slama Jama ».",
			"J'ai été le premier choix de la draft NBA 1984, devant Michael Jordan et Charles Barkley.",
			"Je suis le seul joueur à avoir remporté le MVP de la saison régulière, le MVP des Finales et le titre de Défenseur de l'Année la même saison (1994).",
			"Mes pivotements au poste bas sont si légendaires qu'ils sont appelés « The Dream Shake » — une série de feintes pratiquement indéfendables.",
			"J'ai mené Houston à deux titres NBA consécutifs (1994, 1995), les deux fois que Jordan était à la retraite.",
			"Je suis le meilleur contreur de l'histoire de la NBA en carrière régulière, et je suis musulman pratiquant — j'ai parfois joué des matchs de playoff pendant le Ramadan.",
		],
	},
];
