import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"

import { App } from "./App.tsx"
import "./assets/styles/main.scss"
import { initUserInfo } from "./progress/user.ts"
import { persistor, store } from "./store/index.ts"

initUserInfo()

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<App />
			</PersistGate>
		</Provider>
	</StrictMode>
)
