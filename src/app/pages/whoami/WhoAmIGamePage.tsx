import { Navigate, useNavigate, useParams } from "react-router";
import { WhoAmIGame } from "../../components/WhoAmIGame";
import { whoAmIPlayers } from "../../data/quizData";

export function WhoAmIGamePage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const player = whoAmIPlayers.find((p) => p.id === id);
	if (!player) return <Navigate to="/whoami" replace />;

	return (
		<WhoAmIGame
			key={player.id}
			player={player}
			onBack={() => navigate("/whoami")}
		/>
	);
}
