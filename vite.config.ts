import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	base: "/portainer-angular-migration-tracker/",
	build: {
		outDir: "dist",
		emptyOutDir: true,
		// Copy results.json to dist folder if it exists
		rollupOptions: {
			output: {
				manualChunks: undefined,
			},
		},
	},
	publicDir: "public",
});
