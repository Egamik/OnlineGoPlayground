import { useContext, useRef, useState } from "react"
import { AuthContext } from "../util/UserCtx"
import axios from "axios"

export const LoginPage = () => {
    const authCtx = useContext(AuthContext)
    const [error, setError] = useState("")
    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    if (!authCtx) {
        return <div>Error: AuthContext is not available</div>
    }

    const handleLogin = async () => {
        const username = usernameRef.current?.value || ""
        
        if (!username || username.length < 3) {
            setError('Username must be at least 3 characters long.')
            return
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setError('Username can only contain letters, numbers, and underscores.')
            return
        }

        const password = passwordRef.current?.value || ""
        if (!password || password.length < 5) {
            setError('Password must be at least 5 characters long.')
            return
        }

        try {
            const response = await axios.post('/api/user/login', { username, password })
            if (response.status === 200) {
                authCtx.setAuth(true)
                authCtx.setUsername(username)
                console.log('Login successful:', response.data)
                // Redirect or perform any other action after successful login
            } else {
                console.error('Login failed:', response.data)
                authCtx.setAuth(false)
                setError('Login failed. Please check your credentials.')
            }
        } catch (error) {
            console.log('Login error:', error)
            if (axios.isAxiosError(error) && error.response) {
                // Handle error response from the server
                console.error('Login failed:', error.response.data)
            }
            authCtx.setAuth(false)
            setError('Login failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
        }
    }

    const handleSignup = async () => {
        const username = usernameRef.current?.value || ""
        
        if (!username || username.length < 3) {
            setError('Username must be at least 3 characters long.')
            return
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setError('Username can only contain letters, numbers, and underscores.')
            return
        }

        const password = passwordRef.current?.value || ""
        if (!password || password.length < 5) {
            setError('Password must be at least 5 characters long.')
            return
        }

        try {
            const response = await axios.post('/api/user/signup', { username, password })
            if (response.status === 200) {
                console.log('Signup successful:', response.data)
                // Optionally redirect to login or perform any other action after successful signup
            } else {
                console.error('Signup failed:', response.data)
                setError('Signup failed. Please try again.')
            }
        } catch (error) {
            console.log('Signup error:', error)
            if (axios.isAxiosError(error) && error.response) {
                // Handle error response from the server
                console.error('Signup failed:', error.response.data)
            }
            setError('Signup failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
        }
    }

    return (
        <div className="login-bg">
            <div className="login-form">
                <h2 style={{ textAlign: "center" }}>Login</h2>
                <div style={{ marginBottom: "1rem" }}>
                    <input
                        type="text"
                        placeholder="Username"
                        ref={usernameRef}
                        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        ref={passwordRef}
                        style={{ width: "100%", padding: "0.5rem" }}
                    />
                </div>
                {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
                <button
                    onClick={handleLogin}
                    className="login-btn"
                >
                    Login
                </button>
                <button
                    onClick={handleSignup}
                    className="signup-btn"
                >
                    Sign up
                </button>
            </div>
        </div>
    )
}