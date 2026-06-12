import { List, RotateCcw } from "lucide-react";

interface ScoreScreenProps {
	correct: number;
	total: number;
	onRetry: () => void;
	onBack: () => void;
}

export function ScoreScreen({
	correct,
	total,
	onRetry,
	onBack,
}: ScoreScreenProps) {
	const pct = Math.round((correct / total) * 100);
	const emoji = pct === 100 ? "🏆" : pct >= 70 ? "🔥" : pct >= 40 ? "👍" : "📚";
	const label =
		pct === 100
			? "Score parfait !"
			: pct >= 70
				? "Bien joué !"
				: pct >= 40
					? "Pas mal !"
					: "Continue à t'entraîner !";

	return (
		<div className="flex flex-col gap-4">
			<div
				className="rounded-2xl p-8 text-center border border-white/8"
				style={{ backgroundColor: "#14141f" }}
			>
				<p className="text-5xl mb-4">{emoji}</p>
				<p className="text-gray-400 text-sm mb-1">Score final</p>
				<p
					className="text-5xl mb-1"
					style={{ color: "#fbbf24", fontWeight: 700 }}
				>
					{correct}
					<span className="text-gray-500 text-3xl">/{total}</span>
				</p>
				<p className="text-gray-400 text-sm mt-1">{label}</p>

				<div className="mt-5 h-2 rounded-full bg-white/8 overflow-hidden">
					<div
						className="h-full rounded-full transition-all duration-700"
						style={{
							width: `${pct}%`,
							backgroundColor:
								pct >= 70 ? "#4ade80" : pct >= 40 ? "#fbbf24" : "#f87171",
						}}
					/>
				</div>
				<p className="text-gray-600 text-xs mt-1.5">
					{pct}% de bonnes réponses
				</p>
			</div>

			<button
				onClick={onRetry}
				className="w-full py-3 rounded-xl text-sm border border-white/10 text-gray-300 hover:border-[#fbbf24]/50 hover:text-[#fbbf24] transition-colors flex items-center justify-center gap-2 focus:outline-none"
				style={{ backgroundColor: "#14141f" }}
				type={"button"}
			>
				<RotateCcw size={16} /> Recommencer
			</button>
			<button
				onClick={onBack}
				className="w-full py-3 rounded-xl text-sm border border-white/10 text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 focus:outline-none"
				style={{ backgroundColor: "#14141f" }}
				type={"button"}
			>
				<List size={16} /> Retour à la liste
			</button>
		</div>
	);
}
