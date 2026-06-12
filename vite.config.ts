import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
	base: process.env.NODE_ENV === "/nba-quiz-front/" ? "/cv/" : "/",
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: "autoUpdate",
			manifest: {
				name: "NBA Quiz",
				short_name: "NBA Quiz",
				description: "Application de quiz NBA",
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
	resolve: {
		alias: {
			// Alias @ to the src directory
			"@": path.resolve(__dirname, "./src"),
		},
	},
	assetsInclude: ["**/*.svg", "**/*.csv"],
});
