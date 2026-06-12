import { useNavigate } from "react-router";
import { QuizListView } from "../../components/QuizListView";

export function QuizListPage() {
	const navigate = useNavigate();

	return (
		<QuizListView
			category="quiz"
			onBack={() => navigate("/")}
			onSelectQuiz={(quiz) => navigate(`/quiz/${quiz.id}`)}
		/>
	);
}
