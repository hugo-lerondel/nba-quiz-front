import {
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	Timer,
	UserSearch,
} from "lucide-react";
import { useNavigate } from "react-router";
import type { WhoAmIPlayer } from "../../data/quizData";
import { whoAmIPlayers } from "../../data/quizData";
import { difficultyColors, formatTime } from "../../utils/quizHelpers";
import type { WhoAmIResult } from "../../utils/storage";
import { getAllResults } from "../../utils/storage";

function WhoAmIResultBadge({ result }: { result: WhoAmIResult }) {
	const color =
		result.cluesUsed <= 2
			? "#fbbf24"
			: result.cluesUsed <= 4
				? "#4ade80"
				: "#9ca3af";
	return (
		<div className="flex items-center gap-2">
			<div
				className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border"
				style={{
					color,
					backgroundColor: `${color}18`,
					borderColor: `${color}40`,
				}}
			>
				<Timer size={11} />
				<span style={{ fontWeight: 600 }}>{formatTime(result.timeMs)}</span>
			</div>
			<div
				className="flex items-center gap-1 px-2 py-1 rounded-full text-xs border"
				style={{
					color: "#9ca3af",
					backgroundColor: "rgba(156,163,175,0.08)",
					borderColor: "rgba(156,163,175,0.2)",
				}}
			>
				<CheckCircle size={10} />
				<span>
					{result.cluesUsed} indice{result.cluesUsed > 1 ? "s" : ""}
				</span>
			</div>
		</div>
	);
}

function PlayerCard({
	player,
	result,
	onClick,
}: {
	player: WhoAmIPlayer;
	result: WhoAmIResult | undefined;
	onClick: () => void;
}) {
	const diff = difficultyColors[player.difficulty];
	const isPerfect =
		result?.type === "whoami" && result.cluesUsed === 1 && result.errors === 0;
	const isDone = !!result;

	return (
		<button
			onClick={onClick}
			className="w-full text-left rounded-xl p-5 border transition-all duration-200 group focus:outline-none"
			style={{
				backgroundColor: isPerfect ? "rgba(74,222,128,0.06)" : "#14141f",
				borderColor: isPerfect
					? "rgba(74,222,128,0.4)"
					: isDone
						? "rgba(255,255,255,0.12)"
						: "rgba(255,255,255,0.06)",
			}}
			type={"button"}
		>
			<div className="flex items-center gap-4">
				<div
					className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors"
					style={{
						backgroundColor: isDone
							? "rgba(74,222,128,0.1)"
							: "rgba(251,191,36,0.08)",
					}}
				>
					<UserSearch
						size={20}
						style={{ color: isDone ? "#4ade80" : "#fbbf24" }}
					/>
				</div>

				<div className="flex-1 min-w-0">
					<p className="text-gray-500 text-xs mb-0.5">Joueur mystère</p>
					<p className="text-white italic truncate" style={{ fontWeight: 500 }}>
						{player.teaser ?? "??? ??? ???"}
					</p>
					<p className="text-gray-600 text-xs mt-1">
						{player.clues.length} indices · 1 toutes les {player.clueInterval}s
					</p>
				</div>

				<div className="flex flex-col items-end gap-2 shrink-0">
					<div className="flex items-center gap-2">
						<span
							className="px-2.5 py-1 rounded-full text-xs border"
							style={{
								color: diff.text,
								backgroundColor: diff.bg,
								borderColor: diff.border,
							}}
						>
							{player.difficulty}
						</span>
						<ChevronRight
							size={18}
							className="text-gray-600 group-hover:text-[#fbbf24] transition-colors"
						/>
					</div>
					{result && result.type === "whoami" && (
						<WhoAmIResultBadge result={result} />
					)}
				</div>
			</div>
		</button>
	);
}

export function WhoAmIListPage() {
	const navigate = useNavigate();
	const results = getAllResults();
	const completedCount = whoAmIPlayers.filter((p) => results[p.id]).length;

	return (
		<div className="min-h-screen" style={{ backgroundColor: "#08080f" }}>
			<header
				className="sticky top-0 z-10 border-b border-white/5"
				style={{ backgroundColor: "#08080f" }}
			>
				<div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
					<button
						onClick={() => navigate("/")}
						className="flex items-center gap-1.5 text-gray-400 hover:text-[#fbbf24] transition-colors text-sm"
						type={"button"}
					>
						<ChevronLeft size={18} /> Retour
					</button>
					<div className="flex-1">
						<h1 className="text-white" style={{ fontWeight: 600 }}>
							Qui suis-je ?
						</h1>
					</div>
					{completedCount > 0 && (
						<span className="text-xs text-gray-500">
							<span style={{ color: "#fbbf24", fontWeight: 600 }}>
								{completedCount}
							</span>
							/{whoAmIPlayers.length} devinés
						</span>
					)}
				</div>
			</header>

			<div className="max-w-3xl mx-auto px-4 pt-8 pb-4">
				<p className="text-gray-500 text-sm">
					Des indices se dévoilent un à un. Devine le joueur le plus vite
					possible !
				</p>
			</div>

			<main className="max-w-3xl mx-auto px-4 pb-16 space-y-3">
				{whoAmIPlayers.map((player) => (
					<PlayerCard
						key={player.id}
						player={player}
						result={results[player.id] as WhoAmIResult}
						onClick={() => navigate(`/whoami/${player.id}`)}
					/>
				))}
			</main>
		</div>
	);
}
