import react from "@vitejs/plugin-react"
import autoprefixer from "autoprefixer"
import { defineConfig } from "vite"
import dynamicImport from "vite-plugin-dynamic-import"

// https://vite.dev/config/
export default defineConfig({
	base: "/sliding-lines/",
	plugins: [react(), dynamicImport()],
	css: {
		postcss: {
			plugins: [
				autoprefixer({}), // add options if needed
			],
		},
	},
})
