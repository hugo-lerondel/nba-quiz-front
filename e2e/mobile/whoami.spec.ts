import { expect, test } from "@playwright/test";

test("parcourt le flow Qui suis-je jusqu'à la victoire sur le premier joueur", async ({
	page,
}) => {
	await page.goto("/");

	await page.getByRole("button", { name: "Qui suis-je ?" }).click();
	await expect(page).toHaveURL(/\/whoami$/);

	// The list never shows player names before the game is solved (each card
	// shows a teaser or "??? ??? ???"), so there's no name/title to target —
	// unlike the other quiz lists, this test targets the first card by
	// position. whoAmIPlayers[0] is "Michael Jordan" (id "whoami-jordan"), a
	// static roster entry, not a value expected to change routinely.
	await page
		.getByRole("button", { name: /Joueur mystère/ })
		.first()
		.click();
	await expect(page).toHaveURL(/\/whoami\/whoami-jordan$/);

	const guessInput = page.getByPlaceholder(
		"Qui suis-je ? (Entrée pour valider)",
	);
	// "Jordan" is a curated alias for "Michael Jordan" (src/app/data/answerAliases.ts) —
	// proves the unified matching (Task 2) accepts it here too.
	await guessInput.fill("Jordan");
	await guessInput.press("Enter");

	await expect(page.getByText("Bravo !")).toBeVisible();
	await expect(page.getByText("Michael Jordan")).toBeVisible();
	// Guessed right on the first (always-visible) clue, so exactly 1 clue was
	// used — the game labels that "Légendaire 🐐".
	await expect(page.getByText("Légendaire 🐐")).toBeVisible();
});

test("le champ de réponse reste visible quand plusieurs indices se sont accumulés sur un petit viewport", async ({
	page,
}) => {
	// Installed before navigating so every timer the page schedules on mount
	// (WhoAmIGame's clue auto-reveal interval) runs on virtual time — lets the
	// test fast-forward through several real clue reveals instead of waiting
	// on wall-clock seconds.
	await page.clock.install();

	await page.goto("/");
	await page.getByRole("button", { name: "Qui suis-je ?" }).click();
	await page
		.getByRole("button", { name: /Joueur mystère/ })
		.first()
		.click();
	await expect(page).toHaveURL(/\/whoami\/whoami-jordan$/);

	const guessInput = page.getByPlaceholder(
		"Qui suis-je ? (Entrée pour valider)",
	);
	// First clue for "whoami-jordan", copied verbatim from
	// src/app/data/whoAmIPlayersData.ts, always visible on load.
	const firstClue = page.getByText(
		"Je suis né le 17 février 1963 à Brooklyn, New York, et j'ai grandi en Caroline du Nord.",
	);
	await expect(firstClue).toBeVisible();

	// whoami-jordan reveals a new clue every 8s (player.clueInterval); fast-
	// forward past 4 reveals so 5 clue cards are stacked — enough to overflow
	// a small viewport, same as a player who's been reading clues for a while
	// before answering.
	await page.clock.runFor(4 * 8_000 + 500);

	// Playwright has no way to open a real OS keyboard, and resizing the page
	// viewport (page.setViewportSize) doesn't reproduce one either: on both
	// iOS Safari and Chrome, an on-screen keyboard shrinks
	// `window.visualViewport` but leaves the CSS layout viewport — and `dvh`
	// units — untouched. So instead we shrink `visualViewport` directly and
	// fire the same "resize" event the app listens for, which is the actual
	// signal a real keyboard opening sends.
	const keyboardOpenHeight = 400;
	await page.evaluate((height) => {
		const vv = window.visualViewport as VisualViewport;
		Object.defineProperty(vv, "height", { value: height, configurable: true });
		vv.dispatchEvent(new Event("resize"));
	}, keyboardOpenHeight);

	// No scrolling performed, so this checks the layout reacted on its own:
	// the input must not be positioned below the visible (post-"keyboard")
	// area purely as a side effect of 5 clue cards being rendered above it.
	// Without a `visualViewport`-driven height (relying on `dvh` alone, which
	// never shrinks for the keyboard), the input ended up far below this
	// line — reachable only by scrolling past all the clues, which is the
	// "le clavier décale tout" symptom reported on mobile.
	const inputBottom = await guessInput.evaluate(
		(el) => el.getBoundingClientRect().bottom,
	);
	expect(inputBottom).toBeLessThanOrEqual(keyboardOpenHeight);
	await expect(firstClue).toBeInViewport();
});

test("suit le pan du visualViewport (iOS Safari) quand le clavier virtuel s'ouvre", async ({
	page,
}) => {
	await page.goto("/");
	await page.getByRole("button", { name: "Qui suis-je ?" }).click();
	await page
		.getByRole("button", { name: /Joueur mystère/ })
		.first()
		.click();
	await expect(page).toHaveURL(/\/whoami\/whoami-jordan$/);

	const guessInput = page.getByPlaceholder(
		"Qui suis-je ? (Entrée pour valider)",
	);

	// On iOS Safari, an open keyboard doesn't just shrink `visualViewport`
	// (already covered above) — it also pans it down over the layout
	// viewport, which never shrinks, exposed as a non-zero
	// `visualViewport.offsetTop`. A `position: fixed` element pinned to the
	// layout viewport (top: 0, as WhoAmIGame's root is) would slide out from
	// under that pan and off-screen; the fix listens for this and applies a
	// matching `translate` so the container stays aligned with whatever
	// portion of the page is actually visible.
	const height = 400;
	const offsetTop = 400;
	await page.evaluate(
		({ height, offsetTop }) => {
			const vv = window.visualViewport as VisualViewport;
			Object.defineProperty(vv, "height", {
				value: height,
				configurable: true,
			});
			Object.defineProperty(vv, "offsetTop", {
				value: offsetTop,
				configurable: true,
			});
			vv.dispatchEvent(new Event("resize"));
			vv.dispatchEvent(new Event("scroll"));
		},
		{ height, offsetTop },
	);

	await expect
		.poll(() => guessInput.evaluate((el) => el.getBoundingClientRect().top))
		.toBeGreaterThanOrEqual(offsetTop);
	await expect
		.poll(() => guessInput.evaluate((el) => el.getBoundingClientRect().bottom))
		.toBeLessThanOrEqual(offsetTop + height);
});

test("scrolle automatiquement vers le dernier indice révélé sur un petit viewport", async ({
	page,
}) => {
	// Installed before navigating, and stepped one clue-reveal interval at a
	// time below. An earlier version of this test waited on real wall-clock
	// timers (whoami-livingston's 5s clueInterval) instead, which turned out
	// to be genuinely flaky — not slow, but a ~1-in-3 failure rate — when run
	// as part of the full parallel suite (12 tests across up to 10 workers):
	// enough CPU contention from the other concurrent browsers could delay
	// this page's real setInterval firing past the assertion timeout, no
	// matter how generous. page.clock removes that race entirely, since
	// advancing virtual time doesn't depend on the host's actual scheduling.
	await page.clock.install();

	await page.goto("/");
	await page.getByRole("button", { name: "Qui suis-je ?" }).click();
	// whoAmIPlayers[1] is "Shaun Livingston" (id "whoami-livingston").
	await page
		.getByRole("button", { name: /Joueur mystère/ })
		.nth(1)
		.click();
	await expect(page).toHaveURL(/\/whoami\/whoami-livingston$/);

	// Small viewport so 3 revealed clues overflow the clue list and require
	// scrolling to reach the latest one. Using page.setViewportSize() here
	// (a real CDP-level resize) turned out to have the same problem real
	// wall-clock waiting did above: the app only reacts once the browser's
	// own, separate `resize` event on `window.visualViewport` is dispatched
	// and handled, and under heavy parallel-suite CPU contention that could
	// take several real seconds — with nothing in this otherwise-instant,
	// clock-driven test left to absorb the wait. Mocking `visualViewport`
	// directly and firing the event ourselves (same technique as the other
	// two tests above) makes this deterministic instead: our own dispatched
	// event is handled synchronously within this call, no async browser
	// pipeline involved.
	await page.evaluate(() => {
		const vv = window.visualViewport as VisualViewport;
		Object.defineProperty(vv, "height", { value: 300, configurable: true });
		vv.dispatchEvent(new Event("resize"));
	});

	// Second and third clues for "whoami-livingston", copied verbatim from
	// src/app/data/whoAmIPlayersData.ts. Stepping the clock one clueInterval
	// (5s) at a time and syncing on each clue's visibility in between —
	// rather than jumping both intervals in a single runFor() call — avoids
	// a separate flakiness page.clock has with firing several setInterval
	// ticks at once without an intermediate sync point (see CLAUDE.md's e2e
	// section for more on this).
	const secondClue = page.getByText(
		"J'étais un meneur de grande taille, réputé pour mon jeu fluide et ma vision du terrain.",
	);
	await page.clock.runFor(5_000);
	await expect(secondClue).toBeVisible();

	const thirdClue = page.getByText(
		"J'ai été sélectionné en 4e position de la draft NBA 2004.",
	);
	await page.clock.runFor(5_000);
	await expect(thirdClue).toBeVisible();

	// No manual scroll performed: the clue list must have scrolled itself as
	// each new clue appeared, so the latest one is already on screen. Before
	// the fix, the scroll-to-bottom effect only ran once on mount (empty
	// dependency array), so later clues stayed out of view until the user
	// scrolled manually — easy to miss on a phone screen.
	await expect(thirdClue).toBeInViewport();
});

test("bloque le scroll de la page pendant la partie, et le restaure en la quittant", async ({
	page,
}) => {
	await page.goto("/");

	await page.getByRole("button", { name: "Qui suis-je ?" }).click();
	await page
		.getByRole("button", { name: /Joueur mystère/ })
		.first()
		.click();
	await expect(page).toHaveURL(/\/whoami\/whoami-jordan$/);

	// A real on-screen keyboard pans/scrolls the whole document to keep the
	// focused input visible — a browser-level behavior that operates on the
	// layout viewport, independent of our own overflow handling on the game's
	// own container (see the keyboard-safe-layout test above). WhoAmIGame
	// locks body/html scroll for as long as it's mounted so there's nothing
	// left for the browser to pan. The effect that applies the lock trails
	// the URL change slightly (same as the restore-on-unmount check below),
	// so poll instead of asserting immediately.
	await expect
		.poll(() => page.evaluate(() => getComputedStyle(document.body).overflow))
		.toBe("hidden");

	await page.getByRole("button", { name: "Retour" }).click();
	await expect(page).toHaveURL(/\/whoami$/);

	// Leaving the game must restore normal scrolling on the rest of the app.
	// The cleanup runs on unmount, which trails the URL change slightly, so
	// poll instead of asserting immediately.
	await expect
		.poll(() => page.evaluate(() => getComputedStyle(document.body).overflow))
		.toBe("visible");
});
