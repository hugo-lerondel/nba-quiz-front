import { CheckCircle, ChevronLeft, List, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ClassicEnumerationQuiz, Quiz } from "../data/quizData";
import { normalize } from "../utils/quizHelpers";
import { saveResult } from "../utils/storage";

interface ClassicQuizProps {
	quiz: Quiz;
	data: ClassicEnumerationQuiz;
	onBack: () => void;
}

export function ClassicQuiz({ quiz, data, onBack }: ClassicQuizProps) {
	const [input, setInput] = useState("");
	const [found, setFound] = useState<string[]>([]);
	const [wrong, setWrong] = useState<string[]>([]);
	const [lastResult, setLastResult] = useState<
		"correct" | "wrong" | "duplicate" | null
	>(null);
	const [gaveUp, setGaveUp] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const total = data.answers.length;
	const finished = found.length === total || gaveUp;

	useEffect(() => {
		if (!finished) inputRef.current?.focus();
	}, [found, finished]);

	useEffect(() => {
		if (finished) {
			saveResult({
				type: "scored",
				id: quiz.id,
				score: found.length,
				total,
				completedAt: Date.now(),
			});
		}
	}, [finished]); // eslint-disable-line react-hooks/exhaustive-deps

	const submitAnswer = () => {
		const trimmed = input.trim();
		if (!trimmed) return;
		const normInput = normalize(trimmed);
		const normAnswers = data.answers.map(normalize);
		const matchIndex = normAnswers.findIndex((a) => a === normInput);
		if (matchIndex !== -1) {
			const canonical = data.answers[matchIndex];
			if (found.includes(canonical)) {
				setLastResult("duplicate");
			} else {
				setFound((prev) => [...prev, canonical]);
				setLastResult("correct");
			}
		} else {
			if (!wrong.includes(trimmed)) setWrong((prev) => [...prev, trimmed]);
			setLastResult("wrong");
		}
		setInput("");
	};

	const handleReset = () => {
		setInput("");
		setFound([]);
		setWrong([]);
		setLastResult(null);
		setGaveUp(false);
	};

	const missed = data.answers.filter((a) => !found.includes(a));

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
						<p className="text-gray-500 text-xs">Énumération classique</p>
					</div>
					<span
						className="text-sm tabular-nums"
						style={{ color: "#fbbf24", fontWeight: 600 }}
					>
						{found.length}/{total}
					</span>
				</div>
			</header>

			<main className="max-w-2xl mx-auto px-4 py-6">
				<div
					className="rounded-xl p-5 mb-5 border border-white/8"
					style={{ backgroundColor: "#14141f" }}
				>
					<p className="text-gray-200 text-base mb-1">{data.prompt}</p>
					{data.hint && (
						<p className="text-gray-500 text-sm mt-2">💡 {data.hint}</p>
					)}
				</div>

				<div className="mb-5">
					<div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
						<div
							className="h-full rounded-full transition-all duration-500"
							style={{
								width: `${(found.length / total) * 100}%`,
								backgroundColor: "#fbbf24",
							}}
						/>
					</div>
					<p className="text-gray-600 text-xs mt-1.5 text-right">
						{found.length} / {total} trouvés
					</p>
				</div>

				{!finished && (
					<div className="mb-5">
						<div
							className="flex gap-2 rounded-xl px-4 py-3 border transition-colors"
							style={{
								backgroundColor: "#14141f",
								borderColor:
									lastResult === "correct"
										? "rgba(74,222,128,0.5)"
										: lastResult === "wrong"
											? "rgba(248,113,113,0.5)"
											: "rgba(255,255,255,0.1)",
							}}
						>
							<input
								ref={inputRef}
								type="text"
								value={input}
								onChange={(e) => {
									setInput(e.target.value);
									setLastResult(null);
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										submitAnswer();
									}
								}}
								placeholder="Entrez une réponse… (Entrée pour valider)"
								className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 outline-none"
							/>
							<button
								onClick={submitAnswer}
								className="px-3 py-1 rounded-lg text-xs transition-opacity hover:opacity-80 shrink-0"
								style={{
									backgroundColor: "#fbbf24",
									color: "#08080f",
									fontWeight: 700,
								}}
							>
								OK
							</button>
						</div>
						{lastResult === "wrong" && (
							<p className="text-xs mt-1.5 ml-1" style={{ color: "#f87171" }}>
								Pas dans la liste.
							</p>
						)}
						{lastResult === "duplicate" && (
							<p className="text-xs mt-1.5 ml-1 text-gray-500">Déjà trouvé !</p>
						)}
					</div>
				)}

				{found.length > 0 && (
					<div className="mb-4">
						<p
							className="text-xs mb-2"
							style={{ color: "#4ade80", fontWeight: 600 }}
						>
							✓ Trouvés
						</p>
						<div className="flex flex-wrap gap-2">
							{found.map((a) => (
								<span
									key={a}
									className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
									style={{
										color: "#4ade80",
										backgroundColor: "rgba(74,222,128,0.1)",
										border: "1px solid rgba(74,222,128,0.3)",
									}}
								>
									<CheckCircle size={11} />
									{a}
								</span>
							))}
						</div>
					</div>
				)}

				{!finished ? (
					<button
						onClick={() => setGaveUp(true)}
						className="w-full py-2.5 rounded-xl text-sm border border-white/10 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
						style={{ backgroundColor: "#14141f" }}
					>
						Révéler les réponses manquantes
					</button>
				) : (
					<div className="space-y-3">
						{missed.length > 0 && (
							<div
								className="rounded-xl p-4 border border-[rgba(248,113,113,0.3)]"
								style={{ backgroundColor: "rgba(248,113,113,0.05)" }}
							>
								<p
									className="text-xs mb-2"
									style={{ color: "#f87171", fontWeight: 600 }}
								>
									✗ Manqués
								</p>
								<div className="flex flex-wrap gap-2">
									{missed.map((a) => (
										<span
											key={a}
											className="px-3 py-1.5 rounded-full text-xs"
											style={{
												color: "#f87171",
												backgroundColor: "rgba(248,113,113,0.1)",
												border: "1px solid rgba(248,113,113,0.3)",
											}}
										>
											{a}
										</span>
									))}
								</div>
							</div>
						)}
						<div
							className="rounded-xl p-5 text-center border border-white/8"
							style={{ backgroundColor: "#14141f" }}
						>
							<p className="text-gray-400 text-sm mb-1">Score final</p>
							<p
								className="text-4xl"
								style={{ color: "#fbbf24", fontWeight: 700 }}
							>
								{found.length}
								<span className="text-gray-500 text-2xl">/{total}</span>
							</p>
							<p className="text-gray-400 text-sm mt-1">
								{found.length === total
									? "🏆 Score parfait !"
									: found.length >= total * 0.7
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
