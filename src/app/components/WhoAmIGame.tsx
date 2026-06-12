import { ChevronLeft, List, RotateCcw, Timer, Trophy, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { WhoAmIPlayer } from "../data/quizData";
import { formatTime } from "../utils/quizHelpers";
import { saveResult } from "../utils/storage";

interface WhoAmIGameProps {
	player: WhoAmIPlayer;
	onBack: () => void;
}

function normalize(s: string) {
	return s
		.toLowerCase()
		.trim()
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.replace(/\s+/g, " ");
}

export function WhoAmIGame({ player, onBack }: WhoAmIGameProps) {
	const CLUE_REVEAL_INTERVAL = player.clueInterval * 1000;
	const [visibleClues, setVisibleClues] = useState(1);
	const [guess, setGuess] = useState("");
	const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
	const [solved, setSolved] = useState(false);
	const [elapsed, setElapsed] = useState(0);
	const [finalTime, setFinalTime] = useState(0);
	const [finalClues, setFinalClues] = useState(0);

	const startRef = useRef(Date.now());
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const autoRevealRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const clueEndRef = useRef<HTMLDivElement>(null);

	const totalClues = player.clues.length;

	// Tick timer
	useEffect(() => {
		if (solved) return;
		timerRef.current = setInterval(() => {
			setElapsed(Date.now() - startRef.current);
		}, 100);
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [solved]);

	// Auto-reveal clues
	useEffect(() => {
		if (solved) return;
		autoRevealRef.current = setInterval(() => {
			setVisibleClues((v) => {
				if (v < totalClues) return v + 1;
				return v;
			});
		}, CLUE_REVEAL_INTERVAL);
		return () => {
			if (autoRevealRef.current) clearInterval(autoRevealRef.current);
		};
	}, [solved, totalClues]);

	// Scroll to bottom when a new clue appears
	useEffect(() => {
		clueEndRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
		});
	}, [visibleClues]);

	const handleGuess = useCallback(() => {
		const trimmed = guess.trim();
		if (!trimmed) return;

		const normGuess = normalize(trimmed);
		const normAnswer = normalize(player.name);

		// Accept last name alone or full name
		const lastNames = normAnswer.split(" ");
		const isCorrect =
			normGuess === normAnswer ||
			lastNames.some((part) => part.length > 3 && normGuess === part);

		if (isCorrect) {
			const t = Date.now() - startRef.current;
			setFinalTime(t);
			setFinalClues(visibleClues);
			setSolved(true);
			if (timerRef.current) clearInterval(timerRef.current);
			if (autoRevealRef.current) clearInterval(autoRevealRef.current);
			saveResult({
				type: "whoami",
				id: player.id,
				timeMs: t,
				cluesUsed: visibleClues,
				errors: wrongGuesses.length,
				completedAt: Date.now(),
			});
		} else {
			if (!wrongGuesses.map(normalize).includes(normGuess)) {
				setWrongGuesses((prev) => [...prev, trimmed]);
			}
			setGuess("");
			inputRef.current?.focus();
		}
	}, [guess, player.name, visibleClues, wrongGuesses]);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleGuess();
		}
	};

	const handleReset = () => {
		setVisibleClues(1);
		setGuess("");
		setWrongGuesses([]);
		setSolved(false);
		setElapsed(0);
		startRef.current = Date.now();
		setTimeout(() => inputRef.current?.focus(), 0);
	};

	// Score label based on clues used and time
	const scoreLabel = () => {
		if (finalClues <= 1) return { label: "Légendaire 🐐", color: "#fbbf24" };
		if (finalClues <= 2) return { label: "Incroyable ! 🔥", color: "#fbbf24" };
		if (finalClues <= 3) return { label: "Excellent ! ⭐", color: "#4ade80" };
		if (finalClues <= 5) return { label: "Bien joué !", color: "#4ade80" };
		return { label: "Trouvé !", color: "#9ca3af" };
	};

	return (
		<div
			className="min-h-screen flex flex-col"
			style={{ backgroundColor: "#08080f" }}
		>
			{/* Header */}
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
						<h1 className="text-white" style={{ fontWeight: 600 }}>
							Qui suis-je ?
						</h1>
						<p className="text-gray-500 text-xs">
							{player.difficulty} · {visibleClues}/{totalClues} indices · 1
							indice/{player.clueInterval}s
						</p>
					</div>
					{/* Timer */}
					<div
						className="flex items-center gap-1.5 tabular-nums"
						style={{ color: solved ? "#4ade80" : "#fbbf24" }}
					>
						<Timer size={15} />
						<span className="text-sm" style={{ fontWeight: 700 }}>
							{formatTime(solved ? finalTime : elapsed)}
						</span>
					</div>
				</div>

				{/* Clue progress bar */}
				<div className="max-w-2xl mx-auto px-4 pb-3">
					<div className="flex gap-1">
						{Array.from({ length: totalClues }).map((_, i) => (
							<div
								key={i}
								className="flex-1 h-1 rounded-full transition-all duration-500"
								style={{
									backgroundColor:
										i < visibleClues
											? solved
												? "#4ade80"
												: "#fbbf24"
											: "rgba(255,255,255,0.08)",
								}}
							/>
						))}
					</div>
				</div>
			</header>

			<main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-4">
				{/* Clue cards */}
				<div className="flex-1 space-y-3">
					{player.clues.slice(0, visibleClues).map((clue, i) => (
						<div
							key={i}
							className="rounded-xl px-5 py-4 border border-white/8"
							style={{
								backgroundColor: "#14141f",
								animation: "fadeSlideIn 0.4s ease",
							}}
						>
							<div className="flex items-start gap-3">
								<span
									className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs mt-0.5"
									style={{
										backgroundColor: "rgba(251,191,36,0.12)",
										color: "#fbbf24",
										fontWeight: 700,
									}}
								>
									{i + 1}
								</span>
								<p className="text-gray-200 text-sm leading-relaxed">{clue}</p>
							</div>
						</div>
					))}
					<div ref={clueEndRef} />
				</div>

				{/* Next clue countdown */}
				{!solved && visibleClues < totalClues && (
					<p className="text-center text-gray-600 text-xs">
						Prochain indice dans quelques secondes… ({totalClues - visibleClues}{" "}
						restant{totalClues - visibleClues > 1 ? "s" : ""})
					</p>
				)}

				{/* Wrong guesses */}
				{wrongGuesses.length > 0 && !solved && (
					<div className="flex flex-wrap gap-2">
						{wrongGuesses.map((w) => (
							<span
								key={w}
								className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs"
								style={{
									color: "#f87171",
									backgroundColor: "rgba(248,113,113,0.08)",
									border: "1px solid rgba(248,113,113,0.25)",
								}}
							>
								<X size={11} />
								{w}
							</span>
						))}
					</div>
				)}

				{/* Input */}
				{!solved ? (
					<div className="space-y-2">
						<div
							className="flex gap-2 rounded-xl px-4 py-3 border transition-colors"
							style={{
								backgroundColor: "#14141f",
								borderColor: "rgba(255,255,255,0.1)",
							}}
						>
							<input
								ref={inputRef}
								autoFocus
								type="text"
								value={guess}
								onChange={(e) => setGuess(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder="Qui suis-je ? (Entrée pour valider)"
								className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 outline-none"
							/>
							<button
								onClick={handleGuess}
								disabled={!guess.trim()}
								className="px-3 py-1 rounded-lg text-xs transition-opacity hover:opacity-80 disabled:opacity-40 shrink-0"
								style={{
									backgroundColor: "#fbbf24",
									color: "#08080f",
									fontWeight: 700,
								}}
							>
								Deviner
							</button>
						</div>
						{wrongGuesses.length > 0 && (
							<p className="text-xs text-gray-600 text-center">
								{wrongGuesses.length} essai{wrongGuesses.length > 1 ? "s" : ""}{" "}
								incorrect{wrongGuesses.length > 1 ? "s" : ""}
							</p>
						)}
					</div>
				) : (
					/* Victory screen */
					<div className="space-y-3">
						<div
							className="rounded-2xl p-6 text-center border"
							style={{
								backgroundColor: "#14141f",
								borderColor: "rgba(74,222,128,0.3)",
							}}
						>
							<Trophy
								size={32}
								style={{ color: "#fbbf24", margin: "0 auto 12px" }}
							/>
							<p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">
								Bravo !
							</p>
							<p
								className="text-white text-2xl mb-3"
								style={{ fontWeight: 700 }}
							>
								{player.name}
							</p>

							<div className="flex items-center justify-center gap-6 mb-4">
								<div className="text-center">
									<p
										className="text-2xl"
										style={{ color: "#fbbf24", fontWeight: 700 }}
									>
										{formatTime(finalTime)}
									</p>
									<p className="text-gray-500 text-xs mt-0.5">Temps</p>
								</div>
								<div className="w-px h-8 bg-white/10" />
								<div className="text-center">
									<p
										className="text-2xl"
										style={{ color: "#fbbf24", fontWeight: 700 }}
									>
										{finalClues}
									</p>
									<p className="text-gray-500 text-xs mt-0.5">
										Indices utilisés
									</p>
								</div>
								<div className="w-px h-8 bg-white/10" />
								<div className="text-center">
									<p
										className="text-2xl"
										style={{ color: "#fbbf24", fontWeight: 700 }}
									>
										{wrongGuesses.length}
									</p>
									<p className="text-gray-500 text-xs mt-0.5">Erreurs</p>
								</div>
							</div>

							<span
								className="inline-block px-4 py-1.5 rounded-full text-sm"
								style={{
									backgroundColor: "rgba(74,222,128,0.12)",
									color: scoreLabel().color,
									fontWeight: 600,
								}}
							>
								{scoreLabel().label}
							</span>
						</div>

						<button
							onClick={handleReset}
							className="w-full py-3 rounded-xl text-sm border border-white/10 text-gray-300 hover:border-[#fbbf24]/50 hover:text-[#fbbf24] transition-colors flex items-center justify-center gap-2 focus:outline-none"
							style={{ backgroundColor: "#14141f" }}
						>
							<RotateCcw size={16} /> Rejouer
						</button>
						<button
							onClick={onBack}
							className="w-full py-3 rounded-xl text-sm border border-white/10 text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 focus:outline-none"
							style={{ backgroundColor: "#14141f" }}
						>
							<List size={16} /> Choisir un autre joueur
						</button>
					</div>
				)}
			</main>

			<style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
		</div>
	);
}
