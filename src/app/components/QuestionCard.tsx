import { CheckCircle, ChevronRight, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { QuizQuestion } from "../data/quizData";
import { normalize } from "../utils/quizHelpers";

interface QuestionCardProps {
	question: QuizQuestion;
	index: number;
	total: number;
	onAnswer: (correct: boolean) => void;
}

export function QuestionCard({
	question,
	index,
	total,
	onAnswer,
}: QuestionCardProps) {
	const hasChoices = !!question.choices && question.choices.length > 0;
	const [selected, setSelected] = useState<string | null>(null);
	const [textInput, setTextInput] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!hasChoices) inputRef.current?.focus();
	}, [hasChoices]);

	const isCorrect = submitted
		? hasChoices
			? normalize(selected ?? "") === normalize(question.answer)
			: normalize(textInput) === normalize(question.answer)
		: false;

	const handleSubmit = () => {
		if (hasChoices && !selected) return;
		if (!hasChoices && !textInput.trim()) return;
		setSubmitted(true);
	};

	const handleNext = () => onAnswer(isCorrect);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (!submitted) handleSubmit();
			else handleNext();
		}
	};

	return (
		<div className="flex flex-col gap-5">
			<div>
				<div className="flex items-center justify-between mb-2">
					<span className="text-gray-500 text-xs">
						Question {index + 1} / {total}
					</span>
					<span className="text-gray-500 text-xs tabular-nums">
						{Math.round((index / total) * 100)}%
					</span>
				</div>
				<div className="h-1 rounded-full bg-white/8 overflow-hidden">
					<div
						className="h-full rounded-full transition-all duration-500"
						style={{
							width: `${(index / total) * 100}%`,
							backgroundColor: "#fbbf24",
						}}
					/>
				</div>
			</div>

			<div
				className="rounded-xl p-5 border border-white/8"
				style={{ backgroundColor: "#14141f" }}
			>
				<p className="text-white text-base leading-relaxed">
					{question.question}
				</p>
			</div>

			{hasChoices ? (
				<div className="space-y-2">
					{question.choices!.map((choice, i) => {
						const letter = String.fromCharCode(65 + i);
						const isThisAnswer =
							normalize(choice) === normalize(question.answer);
						const isThisSelected = selected === choice;
						const isThisWrong = submitted && isThisSelected && !isThisAnswer;

						let borderColor = "rgba(255,255,255,0.08)";
						let bgColor = "#14141f";
						let textColor: string = "white";

						if (submitted) {
							if (isThisAnswer) {
								borderColor = "rgba(74,222,128,0.5)";
								bgColor = "rgba(74,222,128,0.08)";
								textColor = "#4ade80";
							} else if (isThisWrong) {
								borderColor = "rgba(248,113,113,0.5)";
								bgColor = "rgba(248,113,113,0.08)";
								textColor = "#f87171";
							} else {
								textColor = "#4b5563";
							}
						} else if (isThisSelected) {
							borderColor = "rgba(251,191,36,0.6)";
							bgColor = "rgba(251,191,36,0.06)";
							textColor = "white";
						}

						return (
							<button
								type={"button"}
								key={choice}
								onClick={() => !submitted && setSelected(choice)}
								disabled={submitted}
								className="w-full text-left flex items-center gap-3 rounded-xl px-4 py-3.5 border transition-all duration-200 focus:outline-none"
								style={{
									backgroundColor: bgColor,
									borderColor,
									color: textColor,
								}}
							>
								<span
									className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"
									style={{
										backgroundColor: submitted
											? isThisAnswer
												? "rgba(74,222,128,0.2)"
												: isThisWrong
													? "rgba(248,113,113,0.2)"
													: "rgba(255,255,255,0.04)"
											: isThisSelected
												? "rgba(251,191,36,0.2)"
												: "rgba(255,255,255,0.05)",
										color: submitted
											? isThisAnswer
												? "#4ade80"
												: isThisWrong
													? "#f87171"
													: "#374151"
											: isThisSelected
												? "#fbbf24"
												: "#9ca3af",
										fontWeight: 600,
									}}
								>
									{submitted && isThisAnswer ? (
										<CheckCircle size={14} />
									) : submitted && isThisWrong ? (
										<XCircle size={14} />
									) : (
										letter
									)}
								</span>
								<span className="text-sm">{choice}</span>
							</button>
						);
					})}
				</div>
			) : (
				<div>
					<input
						ref={inputRef}
						type="text"
						value={textInput}
						onChange={(e) => !submitted && setTextInput(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Votre réponse… (Entrée pour valider)"
						disabled={submitted}
						className="w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 border outline-none transition-colors"
						style={{
							backgroundColor: "#14141f",
							borderColor: submitted
								? isCorrect
									? "rgba(74,222,128,0.5)"
									: "rgba(248,113,113,0.5)"
								: "rgba(255,255,255,0.1)",
						}}
					/>
					{submitted && (
						<div
							className="mt-3 flex items-start gap-2 rounded-xl px-4 py-3 border"
							style={{
								borderColor: isCorrect
									? "rgba(74,222,128,0.3)"
									: "rgba(248,113,113,0.3)",
								backgroundColor: isCorrect
									? "rgba(74,222,128,0.06)"
									: "rgba(248,113,113,0.06)",
							}}
						>
							{isCorrect ? (
								<CheckCircle
									size={15}
									style={{ color: "#4ade80", marginTop: 1 }}
								/>
							) : (
								<XCircle size={15} style={{ color: "#f87171", marginTop: 1 }} />
							)}
							<div>
								<p
									className="text-xs"
									style={{
										color: isCorrect ? "#4ade80" : "#f87171",
										fontWeight: 600,
									}}
								>
									{isCorrect ? "Correct !" : "Incorrect"}
								</p>
								{!isCorrect && (
									<p className="text-xs text-gray-400 mt-0.5">
										Réponse :{" "}
										<span style={{ color: "#fbbf24", fontWeight: 600 }}>
											{question.answer}
										</span>
									</p>
								)}
							</div>
						</div>
					)}
				</div>
			)}

			{hasChoices && submitted && (
				<div
					className="flex items-start gap-2 rounded-xl px-4 py-3 border"
					style={{
						borderColor: isCorrect
							? "rgba(74,222,128,0.3)"
							: "rgba(248,113,113,0.3)",
						backgroundColor: isCorrect
							? "rgba(74,222,128,0.06)"
							: "rgba(248,113,113,0.06)",
					}}
				>
					{isCorrect ? (
						<CheckCircle size={15} style={{ color: "#4ade80", marginTop: 1 }} />
					) : (
						<XCircle size={15} style={{ color: "#f87171", marginTop: 1 }} />
					)}
					<div>
						<p
							className="text-xs"
							style={{
								color: isCorrect ? "#4ade80" : "#f87171",
								fontWeight: 600,
							}}
						>
							{isCorrect ? "Correct !" : "Incorrect"}
						</p>
						{!isCorrect && (
							<p className="text-xs text-gray-400 mt-0.5">
								Réponse :{" "}
								<span style={{ color: "#fbbf24", fontWeight: 600 }}>
									{question.answer}
								</span>
							</p>
						)}
					</div>
				</div>
			)}

			{!submitted ? (
				<button
					type={"button"}
					onClick={handleSubmit}
					disabled={hasChoices ? !selected : !textInput.trim()}
					className="w-full py-3 rounded-xl text-sm transition-opacity hover:opacity-90 focus:outline-none disabled:opacity-40"
					style={{
						backgroundColor: "#fbbf24",
						color: "#08080f",
						fontWeight: 700,
					}}
				>
					Valider
				</button>
			) : (
				<button
					onClick={handleNext}
					className="w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90 focus:outline-none"
					style={{
						backgroundColor: "#fbbf24",
						color: "#08080f",
						fontWeight: 700,
					}}
					type={"button"}
				>
					{index + 1 < total ? (
						<>
							<ChevronRight size={16} /> Question suivante
						</>
					) : (
						<>
							<CheckCircle size={16} /> Voir les résultats
						</>
					)}
				</button>
			)}
		</div>
	);
}
