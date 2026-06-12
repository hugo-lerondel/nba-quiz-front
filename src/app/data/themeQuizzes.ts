import type { Quiz } from "./quizData";

export const themeQuizzes: Quiz[] = [
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
