import { useContext } from "react"
import { Navigate } from "react-router"
import { AuthContext } from "../util/UserCtx"

interface RouteWrapperProps {
    component: React.ComponentType
}

const RouteWrapper: React.FC<RouteWrapperProps> = ({ component: Component }) => {
    
    const authContext = useContext(AuthContext)

    const isAuth = authContext?.auth
    const username = sessionStorage.getItem('username')
    console.log('RouteWrapper context: ', authContext)

    if (!isAuth) {
        console.log('Error: unauthenticated user')
        return <Navigate to="/login" />
    }
    
    if (!username) {
        console.log('Error: username not set')
        return <Navigate to="/login" />
    }

    return <Component />
}

export default RouteWrapper
