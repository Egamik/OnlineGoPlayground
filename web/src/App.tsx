import { BrowserRouter, Routes, Route } from "react-router"
import { Home } from "./Pages/Home"
import { EditorPage } from "./Pages/EditorPage"
import { DomView } from "./Pages/DomView"
import { NavBar } from "./Components/NavBar"
import { Footer } from "./Components/Footer"
import RouteWrapper from "./Components/RouteWrapper"
import { LoginPage } from "./Pages/Login"

function App() {

	return (
		<BrowserRouter>
		<div className="app-container">
			{/* <Header /> */}
			<div className="main-wrapper">
				<NavBar />
				<main id="main">
					<Routes>
						<Route path="/login" element={<LoginPage/>} />
						<Route path="/" element={<RouteWrapper component={Home} />} />
						<Route path="/editor" element={<RouteWrapper component={EditorPage} />} />
						<Route path="/dom" element={<RouteWrapper component={DomView} />} />
					</Routes>
				</main>
			</div>
			<Footer/>
		</div>
		</BrowserRouter>
	)
}

export default App
