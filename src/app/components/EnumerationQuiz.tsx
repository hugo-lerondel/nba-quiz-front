import type {
	ClassicEnumerationQuiz,
	Quiz,
	YearlyEnumerationQuiz,
} from "../data/quizData";
import { ClassicQuiz } from "./ClassicQuiz";
import { YearlyQuiz } from "./YearlyQuiz";

interface EnumerationQuizProps {
	quiz: Quiz;
	onBack: () => void;
}

export function EnumerationQuiz({ quiz, onBack }: EnumerationQuizProps) {
	const data = quiz.data as YearlyEnumerationQuiz | ClassicEnumerationQuiz;
	if (data.subType === "yearly") {
		return (
			<YearlyQuiz
				quiz={quiz}
				data={data as YearlyEnumerationQuiz}
				onBack={onBack}
			/>
		);
	}
	return (
		<ClassicQuiz
			quiz={quiz}
			data={data as ClassicEnumerationQuiz}
			onBack={onBack}
		/>
	);
}
