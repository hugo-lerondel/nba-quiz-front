import {
	BookOpen,
	Calendar,
	CheckCircle,
	ChevronRight,
	Layers,
} from "lucide-react";
import type { Quiz, QuizThemeData } from "../data/quizData";
import { difficultyColors } from "../utils/quizHelpers";
import type { QuizResult } from "../utils/storage";

interface QuizCardProps {
	quiz: Quiz;
	result: QuizResult | undefined;
	onClick: () => void;
}

function QuizTypeIcon({ quiz }: { quiz: Quiz }) {
	if (quiz.category === "enumeration") {
		const subType = (quiz.data as { subType: string }).subType;
		return subType === "yearly" ? (
			<Calendar size={18} style={{ color: "#fbbf24" }} />
		) : (
			<BookOpen size={18} style={{ color: "#fbbf24" }} />
		);
	}
	return <Layers size={18} style={{ color: "#fbbf24" }} />;
}

function QuizTypeLabel({ quiz }: { quiz: Quiz }) {
	if (quiz.category === "enumeration") {
		const subType = (quiz.data as { subType: string }).subType;
		return (
			<span>
				{subType === "yearly" ? "Yearly Enumeration" : "Classic Enumeration"}
			</span>
		);
	}
	return <span>Quiz thématique</span>;
}

function QuizMeta({ quiz }: { quiz: Quiz }) {
	if (quiz.category === "enumeration") {
		const subType = (quiz.data as { subType: string }).subType;
		if (subType === "yearly") {
			return (
				<p className="text-gray-500 text-xs">
					{(quiz.data as { entries: unknown[] }).entries.length} années
				</p>
			);
		}
		return (
			<p className="text-gray-500 text-xs">
				{(quiz.data as { answers: unknown[] }).answers.length} réponses à
				trouver
			</p>
		);
	}
	const questions = (quiz.data as QuizThemeData).questions;
	return (
		<p className="text-gray-500 text-xs">
			{questions.length} questions · ordre aléatoire
		</p>
	);
}

function ResultBadge({ result }: { result: QuizResult }) {
	if (result.type !== "scored") return null;
	const { score, total } = result;
	const pct = Math.round((score / total) * 100);
	const color = pct === 100 ? "#4ade80" : pct >= 70 ? "#fbbf24" : "#f87171";
	return (
		<div
			className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border shrink-0"
			style={{
				color,
				backgroundColor: `${color}18`,
				borderColor: `${color}40`,
			}}
		>
			<CheckCircle size={11} />
			<span style={{ fontWeight: 600 }}>
				{score}/{total}
			</span>
			<span className="text-[10px] opacity-70">({pct}%)</span>
		</div>
	);
}

export function QuizCard({ quiz, result, onClick }: QuizCardProps) {
	const diff = difficultyColors[quiz.difficulty];
	const isPerfect = result?.type === "scored" && result.score === result.total;

	return (
		<button
			onClick={onClick}
			className="w-full text-left rounded-xl p-5 border transition-all duration-200 hover:shadow-[0_0_20px_rgba(74,222,128,0.1)] group focus:outline-none"
			style={{
				backgroundColor: isPerfect ? "rgba(74,222,128,0.06)" : "#14141f",
				borderColor: isPerfect
					? "rgba(74,222,128,0.4)"
					: result
						? "rgba(255,255,255,0.12)"
						: "rgba(255,255,255,0.06)",
			}}
		>
			<div className="flex items-start justify-between gap-4">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-2">
						<QuizTypeIcon quiz={quiz} />
						<span className="text-gray-500 text-xs">
							<QuizTypeLabel quiz={quiz} />
						</span>
					</div>
					<h3 className="text-white mb-1 truncate" style={{ fontWeight: 600 }}>
						{quiz.title}
					</h3>
					<QuizMeta quiz={quiz} />
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
							{quiz.difficulty}
						</span>
						<ChevronRight
							size={18}
							className="text-gray-600 group-hover:text-[#fbbf24] transition-colors"
						/>
					</div>
					{result && result.type === "scored" && (
						<ResultBadge result={result} />
					)}
				</div>
			</div>
		</button>
	);
}
