import { ChevronLeft } from "lucide-react";
import type { Quiz } from "../data/quizData";
import { quizzes } from "../data/quizData";
import { getAllResults } from "../utils/storage";
import { QuizCard } from "./QuizCard";

interface QuizListPageProps {
	category: "enumeration" | "quiz";
	onBack: () => void;
	onSelectQuiz: (quiz: Quiz) => void;
}

export function QuizListView({
	category,
	onBack,
	onSelectQuiz,
}: QuizListPageProps) {
	const filtered = quizzes.filter((q) => q.category === category);
	const results = getAllResults();
	const title = category === "enumeration" ? "Énumération" : "Quiz";
	const subtitle =
		category === "enumeration"
			? "Remplis les réponses par année ou nomme toutes les entrées d'une liste."
			: "Des quiz à thème avec des questions qui se suivent aléatoirement.";

	const completedCount = filtered.filter((q) => results[q.id]).length;

	return (
		<div className="min-h-screen" style={{ backgroundColor: "#08080f" }}>
			<header
				className="sticky top-0 z-10 border-b border-white/5"
				style={{ backgroundColor: "#08080f" }}
			>
				<div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
					<button
						onClick={onBack}
						className="flex items-center gap-1.5 text-gray-400 hover:text-[#fbbf24] transition-colors text-sm"
						type={"button"}
					>
						<ChevronLeft size={18} /> Retour
					</button>
					<div className="flex-1">
						<h1 className="text-white" style={{ fontWeight: 600 }}>
							{title}
						</h1>
					</div>
					<span className="text-xs text-gray-500">
						<span style={{ color: "#fbbf24", fontWeight: 600 }}>
							{completedCount}
						</span>
						/{filtered.length} complétés
					</span>
				</div>
			</header>

			<div className="max-w-3xl mx-auto px-4 pt-8 pb-4">
				<p className="text-gray-500 text-sm">{subtitle}</p>
			</div>

			<main className="max-w-3xl mx-auto px-4 pb-16 space-y-3">
				{filtered.map((quiz) => (
					<QuizCard
						key={quiz.id}
						quiz={quiz}
						result={results[quiz.id]}
						onClick={() => onSelectQuiz(quiz)}
					/>
				))}
			</main>
		</div>
	);
}
