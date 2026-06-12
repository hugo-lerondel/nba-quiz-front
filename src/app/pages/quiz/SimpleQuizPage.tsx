import { Navigate, useNavigate, useParams } from "react-router";
import { SimpleQuiz } from "../../components/SimpleQuiz";
import { quizzes } from "../../data/quizData";

export function SimpleQuizPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const quiz = quizzes.find((q) => q.id === id && q.category === "quiz");
	if (!quiz) return <Navigate to="/quiz" replace />;

	return <SimpleQuiz quiz={quiz} onBack={() => navigate("/quiz")} />;
}
