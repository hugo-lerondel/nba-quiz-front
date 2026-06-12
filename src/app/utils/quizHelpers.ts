export function normalize(s: string) {
	return s.toLowerCase().trim().replace(/\s+/g, " ");
}

export function normalizeAccents(s: string) {
	return s
		.toLowerCase()
		.trim()
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.replace(/\s+/g, " ");
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
