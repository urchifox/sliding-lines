import react from "@vitejs/plugin-react"
import autoprefixer from "autoprefixer"
import { defineConfig } from "vite"
import dynamicImport from "vite-plugin-dynamic-import"

// https://vite.dev/config/
export default defineConfig({
	base: "/sliding-lines/",
	plugins: [react(), dynamicImport()],
	build: {
		assetsInlineLimit: 0,
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
