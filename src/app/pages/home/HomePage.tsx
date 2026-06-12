import { Layers, List, Trophy, UserSearch, Zap } from "lucide-react";
import { useNavigate } from "react-router";

export function HomePage() {
	const navigate = useNavigate();

	return (
		<div
			className="min-h-screen flex flex-col"
			style={{ backgroundColor: "#08080f" }}
		>
			<header className="pt-14 pb-8 text-center px-4">
				<div className="flex items-center justify-center gap-3 mb-3">
					<Trophy size={34} style={{ color: "#fbbf24" }} />
					<h1
						className="text-4xl text-white tracking-tight"
						style={{ fontWeight: 700 }}
					>
						NBA <span style={{ color: "#fbbf24" }}>Quiz</span>
					</h1>
				</div>
				<p className="text-gray-400 text-base max-w-md mx-auto">
					Teste tes connaissances basketball. Choisis une catégorie pour
					commencer.
				</p>
			</header>

			<main className="flex-1 flex items-start justify-center px-4 pb-16">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl">
					<button
						onClick={() => navigate("/enumeration")}
						className="group text-left rounded-2xl p-7 border border-white/10 transition-all duration-300 hover:border-[#fbbf24] hover:shadow-[0_0_30px_rgba(251,191,36,0.12)] focus:outline-none focus:border-[#fbbf24]"
						style={{ backgroundColor: "#14141f" }}
						type={"button"}
					>
						<div
							className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-[#fbbf24]/20"
							style={{ backgroundColor: "rgba(251,191,36,0.1)" }}
						>
							<List size={24} style={{ color: "#fbbf24" }} />
						</div>
						<h2 className="text-white text-xl mb-2" style={{ fontWeight: 600 }}>
							Énumération
						</h2>
						<p className="text-gray-400 text-sm leading-relaxed mb-5">
							Cite des joueurs ou des équipes année par année, ou complète des
							listes historiques.
						</p>
						<div className="flex flex-wrap gap-2">
							<span
								className="px-2.5 py-1 rounded-full text-xs text-[#fbbf24] border border-[#fbbf24]/30"
								style={{ backgroundColor: "rgba(251,191,36,0.08)" }}
							>
								Annuelle
							</span>
							<span
								className="px-2.5 py-1 rounded-full text-xs text-[#fbbf24] border border-[#fbbf24]/30"
								style={{ backgroundColor: "rgba(251,191,36,0.08)" }}
							>
								Classique
							</span>
						</div>
					</button>

					<button
						onClick={() => navigate("/quiz")}
						className="group text-left rounded-2xl p-7 border border-white/10 transition-all duration-300 hover:border-[#fbbf24] hover:shadow-[0_0_30px_rgba(251,191,36,0.12)] focus:outline-none focus:border-[#fbbf24]"
						style={{ backgroundColor: "#14141f" }}
						type={"button"}
					>
						<div
							className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-[#fbbf24]/20"
							style={{ backgroundColor: "rgba(251,191,36,0.1)" }}
						>
							<Layers size={24} style={{ color: "#fbbf24" }} />
						</div>
						<h2 className="text-white text-xl mb-2" style={{ fontWeight: 600 }}>
							Quiz
						</h2>
						<p className="text-gray-400 text-sm leading-relaxed mb-5">
							Des quiz à thème avec plusieurs questions qui se succèdent
							aléatoirement — choix multiple ou réponse libre.
						</p>
						<div className="flex flex-wrap gap-2">
							<span
								className="px-2.5 py-1 rounded-full text-xs text-[#fbbf24] border border-[#fbbf24]/30"
								style={{ backgroundColor: "rgba(251,191,36,0.08)" }}
							>
								Thématique
							</span>
							<span
								className="px-2.5 py-1 rounded-full text-xs text-[#fbbf24] border border-[#fbbf24]/30"
								style={{ backgroundColor: "rgba(251,191,36,0.08)" }}
							>
								Aléatoire
							</span>
						</div>
					</button>

					<button
						onClick={() => navigate("/whoami")}
						className="group text-left rounded-2xl p-7 border border-white/10 transition-all duration-300 hover:border-[#fbbf24] hover:shadow-[0_0_30px_rgba(251,191,36,0.12)] focus:outline-none focus:border-[#fbbf24]"
						style={{ backgroundColor: "#14141f" }}
						type={"button"}
					>
						<div
							className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-[#fbbf24]/20"
							style={{ backgroundColor: "rgba(251,191,36,0.1)" }}
						>
							<UserSearch size={24} style={{ color: "#fbbf24" }} />
						</div>
						<h2 className="text-white text-xl mb-2" style={{ fontWeight: 600 }}>
							Qui suis-je ?
						</h2>
						<p className="text-gray-400 text-sm leading-relaxed mb-5">
							Des indices se dévoilent un à un sur la vie d'un joueur. Devine-le
							le plus vite possible !
						</p>
						<div className="flex flex-wrap gap-2">
							<span
								className="px-2.5 py-1 rounded-full text-xs text-[#fbbf24] border border-[#fbbf24]/30"
								style={{ backgroundColor: "rgba(251,191,36,0.08)" }}
							>
								Chronomètre
							</span>
							<span
								className="px-2.5 py-1 rounded-full text-xs text-[#fbbf24] border border-[#fbbf24]/30"
								style={{ backgroundColor: "rgba(251,191,36,0.08)" }}
							>
								Indices progressifs
							</span>
						</div>
					</button>
				</div>
			</main>

			<footer className="text-center pb-8">
				<div className="flex items-center justify-center gap-2 text-gray-600 text-xs">
					<Zap size={12} style={{ color: "#fbbf24" }} />
					<span>
						NBA Quiz — {new Date().getFullYear()} · À des fins éducatives
					</span>
				</div>
			</footer>
		</div>
	);
}
