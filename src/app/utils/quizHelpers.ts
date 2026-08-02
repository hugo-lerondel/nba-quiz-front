export function normalize(s: string) {
	return normalizeAccents(s.toLowerCase().trim().replace(/\s+/g, " "));
}

export function normalizeAccents(s: string) {
	return s
		.toLowerCase()
		.trim()
		.normalize("NFD")
		.replaceAll(/[̀-ͯ]/g, "")
		.replaceAll(/\s+/g, " ");
}

function levenshtein(a: string, b: string): number {
	const m = a.length;
	const n = b.length;
	const dp: number[] = Array.from({ length: n + 1 }, (_, j) => j);
	for (let i = 1; i <= m; i++) {
		let prev = dp[0];
		dp[0] = i;
		for (let j = 1; j <= n; j++) {
			const tmp = dp[j];
			dp[j] =
				a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1]);
			prev = tmp;
		}
	}
	return dp[n];
}

function fuzzy(a: string, b: string): boolean {
	if (a === b) return true;
	const maxLen = Math.max(a.length, b.length);
	if (maxLen === 0) return true;
	if (maxLen < 4) return a === b;
	return 1 - levenshtein(a, b) / maxLen >= 0.9;
}

export function isMatch(
	input: string,
	answer: string,
	normalizeFn = normalize,
): boolean {
	return fuzzy(normalizeFn(input), normalizeFn(answer));
}

/**
 * Like isMatch, but also accepts a single first or last word of the answer.
 * e.g. "Curry" matches "Stephen Curry", "Giannis" matches "Giannis Antetokoumpo".
 * Only applies when the input is a single word of at least 3 chars and the answer has multiple words.
 */
export function isAnswerMatch(input: string, answer: string): boolean {
	const normInput = normalize(input);
	const normAnswer = normalize(answer);

	if (fuzzy(normInput, normAnswer)) return true;

	// Partial match only for single-word inputs (no spaces)
	if (normInput.includes(" ") || normInput.length < 3) return false;

	const words = normAnswer.split(" ");
	if (words.length < 2) return false;

	const first = words[0];
	const last = words[words.length - 1];

	if (first.length >= 3 && fuzzy(normInput, first)) return true;
	if (last.length >= 3 && fuzzy(normInput, last)) return true;

	return false;
}

export function shuffle<T>(arr: T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

export function formatTime(ms: number) {
	const totalSecs = Math.floor(ms / 1000);
	const mins = Math.floor(totalSecs / 60);
	const secs = totalSecs % 60;
	if (mins > 0) return `${mins}m ${secs.toString().padStart(2, "0")}s`;
	return `${secs}s`;
}

export const difficultyColors = {
	Easy: {
		text: "#4ade80",
		bg: "rgba(74,222,128,0.1)",
		border: "rgba(74,222,128,0.3)",
	},
	Medium: {
		text: "#fbbf24",
		bg: "rgba(251,191,36,0.1)",
		border: "rgba(251,191,36,0.3)",
	},
	Hard: {
		text: "#f87171",
		bg: "rgba(248,113,113,0.1)",
		border: "rgba(248,113,113,0.3)",
	},
};
