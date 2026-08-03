import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: "html",
	use: {
		baseURL: "http://localhost:5173/nba-quiz-front/",
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "desktop",
			testDir: "./e2e/desktop",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "mobile",
			testDir: "./e2e/mobile",
			use: { ...devices["Pixel 7"] },
		},
	],
	webServer: {
		command: "bun run dev",
		url: "http://localhost:5173/nba-quiz-front/",
		reuseExistingServer: !process.env.CI,
	},
});
