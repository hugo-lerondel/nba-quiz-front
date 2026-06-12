import { createBrowserRouter, Outlet } from "react-router";
import { EnumerationListPage } from "./pages/enumeration/EnumerationListPage";
import { EnumerationQuizPage } from "./pages/enumeration/EnumerationQuizPage";
import { HomePage } from "./pages/home/HomePage";
import { QuizListPage } from "./pages/quiz/QuizListPage";
import { SimpleQuizPage } from "./pages/quiz/SimpleQuizPage";
import { WhoAmIGamePage } from "./pages/whoami/WhoAmIGamePage";
import { WhoAmIListPage } from "./pages/whoami/WhoAmIListPage";

export const router = createBrowserRouter([
	{
		path: "/",
		Component: () => <Outlet />,
		children: [
			{ index: true, Component: HomePage },
			{ path: "enumeration", Component: EnumerationListPage },
			{ path: "enumeration/:id", Component: EnumerationQuizPage },
			{ path: "quiz", Component: QuizListPage },
			{ path: "quiz/:id", Component: SimpleQuizPage },
			{ path: "whoami", Component: WhoAmIListPage },
			{ path: "whoami/:id", Component: WhoAmIGamePage },
		],
	},
]);
