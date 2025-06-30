import { FC, ReactNode, createContext, useState, useEffect } from "react"

interface AuthContextValue {
    auth:       boolean,
    setAuth:    React.Dispatch<React.SetStateAction<boolean>>,
    username:   string,
    setUsername: React.Dispatch<React.SetStateAction<string>>,
    token:      string,
    setToken:   React.Dispatch<React.SetStateAction<string>>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Context to handle user authentication
/**
 * Context is a react module and as such it gets reset on page reload
 * @param children: Child component
 * @returns 
 */
const AuthProvider: FC<{ children: ReactNode}> = ({ children }) => {
    const [auth, setAuth] = useState<boolean>(() => {
        const savedAuth = sessionStorage.getItem('savedAuth')
        return savedAuth === "true"
    })

    const [username, setUsername] = useState<string>(() => {
        return sessionStorage.getItem('username') || ""
    })

    const [token, setToken] = useState<string>(() => {
        return sessionStorage.getItem('token') || ""
    })

    useEffect(() => {
        sessionStorage.setItem('savedAuth', auth.toString())
    }, [auth])

    useEffect(() => {
        sessionStorage.setItem('username', username)
    }, [username])

    useEffect(() => {
        sessionStorage.setItem('token', token)
    }, [token])

    return (
        <AuthContext.Provider value={{ auth, setAuth, username, setUsername, token, setToken }}>
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider,
    AuthContext
}
