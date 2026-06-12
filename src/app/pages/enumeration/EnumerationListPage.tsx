import { useNavigate } from "react-router";
import { QuizListView } from "../../components/QuizListView";

export function EnumerationListPage() {
	const navigate = useNavigate();

	return (
		<QuizListView
			category="enumeration"
			onBack={() => navigate("/")}
			onSelectQuiz={(quiz) => navigate(`/enumeration/${quiz.id}`)}
		/>
	);
}
