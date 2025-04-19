import { BrowserRouter, Routes, Route } from "react-router"
import { Header } from './Components/Header'
import { Home } from "./Pages/Home"
import { EditorPage } from "./Pages/EditorPage"
import { DomView } from "./Pages/DomView"
import { NavBar } from "./Components/NavBar"
import { Footer } from "./Components/Footer"

function App() {

	return (
		<BrowserRouter>
		<div className="app-container">
			{/* <Header /> */}
			<div className="main-wrapper">
				<NavBar />
				<main id="main">
					<Routes>
						<Route path="/" element={<Home/>} />
						<Route path="/editor" element={<EditorPage/>} />
						<Route path="/dom" element={<DomView/>}/>
					</Routes>
				</main>
			</div>
			<Footer/>
		</div>
		</BrowserRouter>
	)
}

export default App
