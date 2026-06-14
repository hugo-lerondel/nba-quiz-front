import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
	base: "/nba-quiz-front/",
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: "autoUpdate",
			manifest: {
				name: "HoopQuiz",
				short_name: "HoopQuiz",
				description: "Application de quiz NBA",
				lang: "fr-FR",
				start_url: "/nba-quiz-front/",
				scope: "/nba-quiz-front/",
				display: "standalone",
				orientation: "portrait",
				theme_color: "#08080f",
				background_color: "#08080f",
				icons: [
					{
						src: "pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "pwa-512x512-maskable.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any maskable",
					},
				],
			},
		}),
	],
	resolve: {
		alias: {
			// Alias @ to the src directory
			"@": path.resolve(__dirname, "./src"),
		},
	},
	assetsInclude: ["**/*.svg", "**/*.csv"],
});
