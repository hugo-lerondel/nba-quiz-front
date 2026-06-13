import type { WhoAmIPlayer } from "./quizData";

export const whoAmIPlayers: WhoAmIPlayer[] = [
	{
		id: "whoami-jordan",
		name: "Michael Jordan",
		difficulty: "Easy",
		clueInterval: 8,
		teaser: undefined,
		clues: [
			"Je suis né le 17 février 1963 à Brooklyn, New York, et j'ai grandi en Caroline du Nord.",
			"Au lycée, j'ai d'abord été recalé de l'équipe varsity de basket avant de devenir l'un des meilleurs joueurs de mon état.",
			"J'ai joué à l'université de Caroline du Nord, où j'ai inscrit le panier décisif du titre NCAA en 1982 en tant que freshman.",
			"J'ai été drafté en 3ème position par une franchise de Chicago en 1984, derrière Hakeem Olajuwon et Sam Bowie.",
			"Je suis 6 fois champion NBA, 5 fois MVP de la saison régulière, et 6 fois MVP des Finales — toujours avec la même équipe.",
			"Mon surnom est « Air » suivi de mon prénom, et je suis co-créateur d'une ligne de chaussures qui porte mon nom.",
			"J'ai pris une première retraite en 1993 pour jouer au baseball, avant de revenir en NBA en 1995.",
		],
	},
	{
		id: "whoami-livingston",
		name: "Shaun Livingston",
		difficulty: "Medium",
		clueInterval: 5,
		teaser: "Il est revenu de loin...",
		clues: [
			"Je suis né le 11 septembre 1985 à Peoria, dans l'Illinois.",
			"J'étais un meneur de grande taille, réputé pour mon jeu fluide et ma vision du terrain.",
			"J'ai été sélectionné en 4e position de la draft NBA 2004.",
			"Ma carrière a failli s'arrêter à cause d'une terrible blessure au genou en 2007.",
			"Après plusieurs équipes, j'ai surtout été connu comme un rôle player précieux d'une dynastie en Californie.",
			"J'ai remporté 3 titres NBA avec les Golden State Warriors.",
			"Je suis souvent cité comme l'un des meilleurs exemples de retour réussi après une blessure majeure.",
		],
	},
	{
		id: "whoami-mccaw",
		name: "Patrick McCaw",
		difficulty: "Medium",
		clueInterval: 12,
		teaser: "Au bon endroit, au bon moment...",
		clues: [
			"Je suis né le 25 octobre 1995 à St. Louis, dans le Missouri.",
			"J'ai joué au basket universitaire à UNLV, après une formation au lycée Trinity.",
			"J'ai été non drafté en 2016 avant de signer en NBA.",
			"J'ai rapidement gagné du temps de jeu dans une équipe de Golden State très dominante.",
			"J'ai remporté 2 titres NBA avec les Warriors, puis 1 avec Toronto l'année suivante.",
			"Je suis l'un des rares joueurs à avoir gagné 3 championnats NBA lors de mes 3 premières saisons.",
			"On me connaît surtout comme un arrière/ailier polyvalent, utile des deux côtés du terrain.",
		],
	},
];
