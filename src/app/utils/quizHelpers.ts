export function normalize(s: string) {
	return s.toLowerCase().trim().replace(/\s+/g, " ");
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

export function isMatch(input: string, answer: string): boolean {
	const a = normalizeAccents(input);
	const b = normalizeAccents(answer);
	if (a === b) return true;
	const maxLen = Math.max(a.length, b.length);
	if (maxLen === 0) return true;
	// Minimum length threshold: very short answers require exact match
	if (maxLen < 4) return a === b;
	return 1 - levenshtein(a, b) / maxLen >= 0.9;
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
