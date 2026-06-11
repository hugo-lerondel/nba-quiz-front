import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
	base: "/nba-quizz-front/",
	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			manifest: {
				name: "NBA Quizz",
				short_name: "NBAQuizz",
				description: "Application de quizz NBA",
				theme_color: "#1d428a",
				background_color: "#ffffff",
				display: "standalone",
				icons: [
					{
						src: "pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
				],
			},
		}),
	],
});
