import {
	CheckCircle,
	ChevronLeft,
	List,
	RotateCcw,
	XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Quiz, YearlyEnumerationQuiz } from "../data/quizData";
import { normalize } from "../utils/quizHelpers";
import { saveResult } from "../utils/storage";

interface YearlyQuizProps {
	quiz: Quiz;
	data: YearlyEnumerationQuiz;
	onBack: () => void;
}

type RowFeedback = "correct" | "wrong" | null;
type RowResult = { userAnswer: string; correct: boolean };

export function YearlyQuiz({ quiz, data, onBack }: YearlyQuizProps) {
	const total = data.entries.length;
	const [inputs, setInputs] = useState<Record<number, string>>({});
	const [feedbacks, setFeedbacks] = useState<Record<number, RowFeedback>>({});
	const [results, setResults] = useState<Record<number, RowResult> | null>(
		null,
	);
	const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});

	useEffect(() => {
		inputRefs.current[data.entries[0]?.year]?.focus();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const checkRow = (year: number) => {
		if (results) return;
		const userAnswer = (inputs[year] ?? "").trim();
		if (!userAnswer) return;
		const entry = data.entries.find((e) => e.year === year)!;
		const correct = normalize(userAnswer) === normalize(entry.answer);
		setFeedbacks((prev) => ({
			...prev,
			[year]: correct ? "correct" : "wrong",
		}));
		if (correct) {
			const currentIdx = data.entries.findIndex((e) => e.year === year);
			const next = data.entries.slice(currentIdx + 1).find((e) => {
				const fb = feedbacks[e.year];
				return fb !== "correct";
			});
			if (next) setTimeout(() => inputRefs.current[next.year]?.focus(), 0);
		}
	};

	const submitAll = () => {
		const final: Record<number, RowResult> = {};
		data.entries.forEach((entry) => {
			const userAnswer = (inputs[entry.year] ?? "").trim();
			const correct = normalize(userAnswer) === normalize(entry.answer);
			final[entry.year] = { userAnswer, correct };
		});
		setResults(final);
		const correctCount = Object.values(final).filter((r) => r.correct).length;
		saveResult({
			type: "scored",
			id: quiz.id,
			score: correctCount,
			total,
			completedAt: Date.now(),
		});
	};

	const handleReset = () => {
		setInputs({});
		setFeedbacks({});
		setResults(null);
		setTimeout(() => inputRefs.current[data.entries[0]?.year]?.focus(), 0);
	};

	const correctCount = results
		? Object.values(results).filter((r) => r.correct).length
		: 0;

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
					>
						<ChevronLeft size={18} /> Retour
					</button>
					<div className="flex-1 min-w-0">
						<h1 className="text-white truncate" style={{ fontWeight: 600 }}>
							{quiz.title}
						</h1>
						<p className="text-gray-500 text-xs">Énumération annuelle</p>
					</div>
				</div>
			</header>

			<main className="max-w-2xl mx-auto px-4 py-6">
				<div
					className="rounded-xl p-4 mb-4 border border-white/8"
					style={{ backgroundColor: "#14141f" }}
				>
					<p className="text-gray-300 text-sm">{data.prompt}</p>
					{!results && (
						<p className="text-gray-600 text-xs mt-1.5">
							Entrée pour tester une réponse · "Tout valider" pour soumettre
							définitivement
						</p>
					)}
				</div>

				<div className="space-y-1.5 mb-5">
					{data.entries.map((entry) => {
						const result = results?.[entry.year];
						const feedback = feedbacks[entry.year];

						let borderColor = "rgba(255,255,255,0.06)";
						if (result) {
							borderColor = result.correct
								? "rgba(74,222,128,0.4)"
								: "rgba(248,113,113,0.4)";
						} else if (feedback === "correct") {
							borderColor = "rgba(74,222,128,0.3)";
						} else if (feedback === "wrong") {
							borderColor = "rgba(248,113,113,0.3)";
						}

						return (
							<div
								key={entry.year}
								className="flex items-center gap-3 rounded-lg px-3 py-2 border transition-colors"
								style={{ backgroundColor: "#14141f", borderColor }}
							>
								<span
									className="text-sm w-10 shrink-0 tabular-nums"
									style={{ color: "#fbbf24", fontWeight: 600 }}
								>
									{entry.year}
								</span>

								<div className="flex-1 min-w-0">
									{result ? (
										<div className="flex items-center gap-2">
											{result.correct ? (
												<CheckCircle size={14} style={{ color: "#4ade80" }} />
											) : (
												<XCircle
													size={14}
													style={{
														color: result.userAnswer ? "#f87171" : "#6b7280",
													}}
												/>
											)}
											<span
												className="text-sm"
												style={{
													color: result.correct ? "#4ade80" : "#9ca3af",
												}}
											>
												{entry.answer}
											</span>
											{!result.correct && result.userAnswer && (
												<span className="text-xs text-gray-600 line-through ml-1">
													{result.userAnswer}
												</span>
											)}
										</div>
									) : (
										<input
											ref={(el) => {
												inputRefs.current[entry.year] = el;
											}}
											type="text"
											value={inputs[entry.year] ?? ""}
											onChange={(e) => {
												setInputs((prev) => ({
													...prev,
													[entry.year]: e.target.value,
												}));
												if (feedbacks[entry.year]) {
													setFeedbacks((prev) => ({
														...prev,
														[entry.year]: null,
													}));
												}
											}}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													checkRow(entry.year);
												}
											}}
											placeholder="Votre réponse…"
											className="w-full bg-transparent text-white text-sm placeholder-gray-700 outline-none py-1"
										/>
									)}
								</div>

								{!result && feedback && (
									<span className="shrink-0">
										{feedback === "correct" ? (
											<CheckCircle size={14} style={{ color: "#4ade80" }} />
										) : (
											<XCircle size={14} style={{ color: "#f87171" }} />
										)}
									</span>
								)}
							</div>
						);
					})}
				</div>

				{!results ? (
					<button
						onClick={submitAll}
						className="w-full py-3 rounded-xl text-sm transition-opacity hover:opacity-90 focus:outline-none"
						style={{
							backgroundColor: "#fbbf24",
							color: "#08080f",
							fontWeight: 700,
						}}
					>
						Tout valider
					</button>
				) : (
					<div className="space-y-3">
						<div
							className="rounded-xl p-5 text-center border border-white/8"
							style={{ backgroundColor: "#14141f" }}
						>
							<p className="text-gray-400 text-sm mb-1">Score final</p>
							<p
								className="text-4xl"
								style={{ color: "#fbbf24", fontWeight: 700 }}
							>
								{correctCount}
								<span className="text-gray-500 text-2xl">/{total}</span>
							</p>
							<p className="text-gray-400 text-sm mt-1">
								{correctCount === total
									? "🏆 Score parfait !"
									: correctCount >= total * 0.7
										? "Bien joué !"
										: "Continue à t'entraîner !"}
							</p>
						</div>
						<button
							onClick={handleReset}
							className="w-full py-3 rounded-xl text-sm border border-white/10 text-gray-300 hover:border-[#fbbf24]/50 hover:text-[#fbbf24] transition-colors flex items-center justify-center gap-2 focus:outline-none"
							style={{ backgroundColor: "#14141f" }}
						>
							<RotateCcw size={16} /> Recommencer
						</button>
						<button
							onClick={onBack}
							className="w-full py-3 rounded-xl text-sm border border-white/10 text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 focus:outline-none"
							style={{ backgroundColor: "#14141f" }}
						>
							<List size={16} /> Retour à la liste
						</button>
					</div>
				)}
			</main>
		</div>
	);
}
