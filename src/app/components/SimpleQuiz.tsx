import { ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Quiz, QuizThemeData } from "../data/quizData";
import { shuffle } from "../utils/quizHelpers";
import { saveResult } from "../utils/storage";
import { QuestionCard } from "./QuestionCard";
import { ScoreScreen } from "./ScoreScreen";

interface SimpleQuizProps {
	quiz: Quiz;
	onBack: () => void;
}

export function SimpleQuiz({ quiz, onBack }: SimpleQuizProps) {
	const data = quiz.data as QuizThemeData;

	const [key, setKey] = useState(0);
	const shuffled = useMemo(() => shuffle(data.questions), [data.questions]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [correctCount, setCorrectCount] = useState(0);
	const [done, setDone] = useState(false);

	const handleAnswer = (correct: boolean) => {
		const next = currentIndex + 1;
		if (correct) setCorrectCount((c) => c + 1);
		if (next >= shuffled.length) {
			setDone(true);
		} else {
			setCurrentIndex(next);
		}
	};

	useEffect(() => {
		if (done) {
			saveResult({
				type: "scored",
				id: quiz.id,
				score: correctCount,
				total: shuffled.length,
				completedAt: Date.now(),
			});
		}
	}, [done, correctCount, quiz.id, shuffled.length]);

	const handleRetry = () => {
		setKey((k) => k + 1);
		setCurrentIndex(0);
		setCorrectCount(0);
		setDone(false);
	};

	return (
		<div className="min-h-screen" style={{ backgroundColor: "#08080f" }}>
			<header
				className="sticky top-0 z-10 border-b border-white/5"
				style={{ backgroundColor: "#08080f" }}
			>
				<div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
					<button
						onClick={onBack}
						className="flex items-center gap-1.5 text-gray-400 hover:text-[#fbbf24] transition-colors text-sm"
						type={"button"}
					>
						<ChevronLeft size={18} /> Back
					</button>
					<div className="flex-1 min-w-0">
						<h1 className="text-white truncate" style={{ fontWeight: 600 }}>
							{quiz.title}
						</h1>
						<p className="text-gray-500 text-xs">
							{shuffled.length} questions · ordre aléatoire
						</p>
					</div>
					{!done && (
						<span
							className="text-sm tabular-nums"
							style={{ color: "#fbbf24", fontWeight: 600 }}
						>
							{correctCount}/{currentIndex}
						</span>
					)}
				</div>
			</header>

			<main className="max-w-2xl mx-auto px-4 py-8">
				{done ? (
					<ScoreScreen
						correct={correctCount}
						total={shuffled.length}
						onRetry={handleRetry}
						onBack={onBack}
					/>
				) : (
					<QuestionCard
						key={`${key}-${currentIndex}`}
						question={shuffled[currentIndex]}
						index={currentIndex}
						total={shuffled.length}
						onAnswer={handleAnswer}
					/>
				)}
			</main>
		</div>
	);
}
