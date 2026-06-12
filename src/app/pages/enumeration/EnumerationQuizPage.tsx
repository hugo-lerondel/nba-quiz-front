import { Navigate, useNavigate, useParams } from "react-router";
import { EnumerationQuiz } from "../../components/EnumerationQuiz";
import { quizzes } from "../../data/quizData";

export function EnumerationQuizPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const quiz = quizzes.find((q) => q.id === id && q.category === "enumeration");
	if (!quiz) return <Navigate to="/enumeration" replace />;

	return (
		<EnumerationQuiz quiz={quiz} onBack={() => navigate("/enumeration")} />
	);
}
