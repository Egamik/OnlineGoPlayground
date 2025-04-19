import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Header } from './Components/Header'
import { Home } from "./Pages/Home"
import { EditorPage } from "./Pages/EditorPage"
import { DomView } from "./Pages/DomView"

function App() {

	return (
		<BrowserRouter>
			<Header />
			<div className="main-wrapper">
				<main id="main">
					<Routes>
						<Route path="/" element={<Home/>} />
						<Route path="/editor" element={<EditorPage/>} />
						<Route path="/dom" element={<DomView/>}/>
					</Routes>
				</main>
			</div>
		</BrowserRouter>
	)
}

export default App
