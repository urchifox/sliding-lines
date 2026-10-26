import react from "@vitejs/plugin-react"
import autoprefixer from "autoprefixer"
import dynamicImport from "vite-plugin-dynamic-import"
import { defineConfig } from "vitest/config"

// https://vite.dev/config/
export default defineConfig({
	base: "/sliding-lines/",
	plugins: [react(), dynamicImport()],
	build: {
		assetsInlineLimit: 0,
	},
	test: {
		globals: true,
		environment: "node",
		setupFiles: ["./src/test/setup.ts"],
		restoreMocks: true,
		passWithNoTests: true,
		coverage: {
			provider: "v8",
			include: ["src/**/*.{ts,tsx}"],
			exclude: ["src/main.tsx", "src/vite-env.d.ts", "src/test/**"],
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `
					@use "src/assets/styles/mixins.scss" as *;
					@use "src/assets/styles/functions.scss" as *;
					@use "src/assets/styles/variables.scss" as *;
				`,
			},
		},
		postcss: {
			plugins: [
				autoprefixer({}), // add options if needed
			],
		},
	},
})
