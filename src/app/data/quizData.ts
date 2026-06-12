import { classicEnumerationQuizzes } from "./classicEnumerationQuizzes";
import { themeQuizzes } from "./themeQuizzes";
import { whoAmIPlayers } from "./whoAmIPlayersData";
import { yearlyEnumerationQuizzes } from "./yearlyEnumerationQuizzes";

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

// Combiner tous les quiz
export const quizzes: Quiz[] = [
	...yearlyEnumerationQuizzes,
	...classicEnumerationQuizzes,
	...themeQuizzes,
];

// Réexporter les joueurs "Qui suis-je"
export { whoAmIPlayers };
