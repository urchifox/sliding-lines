import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { App } from "./App.tsx"
import "./assets/styles/main.scss"
import { initUserInfo } from "./user.ts"

initUserInfo()

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
)
