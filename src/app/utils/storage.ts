const STORAGE_KEY = "nba-quiz-results-v1";

export interface ScoredResult {
	type: "scored";
	id: string;
	score: number;
	total: number;
	completedAt: number;
}

export interface WhoAmIResult {
	type: "whoami";
	id: string;
	timeMs: number;
	cluesUsed: number;
	errors: number;
	completedAt: number;
}

export type QuizResult = ScoredResult | WhoAmIResult;

type ResultsMap = Record<string, QuizResult>;

function readAll(): ResultsMap {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
	} catch {
		return {};
	}
}

function writeAll(map: ResultsMap) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
	} catch {
		// storage quota exceeded or private mode — silently ignore
	}
}

export function getResult(id: string): QuizResult | null {
	return readAll()[id] ?? null;
}

export function getAllResults(): ResultsMap {
	return readAll();
}

/** Saves a result, keeping only the personal best per quiz. */
export function saveResult(result: QuizResult) {
	const all = readAll();
	const existing = all[result.id];

	if (existing) {
		if (existing.type === "scored" && result.type === "scored") {
			// Keep highest score; tie-break on most recent
			if (result.score < existing.score) return;
		}
		if (existing.type === "whoami" && result.type === "whoami") {
			// Keep fastest time with fewest clues
			const betterTime = result.timeMs < existing.timeMs;
			const sameTimeFewerClues =
				result.timeMs === existing.timeMs &&
				result.cluesUsed < existing.cluesUsed;
			if (!betterTime && !sameTimeFewerClues) return;
		}
	}

	all[result.id] = result;
	writeAll(all);
}
