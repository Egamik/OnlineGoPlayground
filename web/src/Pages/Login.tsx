
import { useContext, useState } from "react"
import { AuthContext } from "../util/UserCtx"
import axios from "axios"

export const LoginPage = () => {
    const authCtx = useContext(AuthContext)
    const [username, setUsername] = useState(authCtx?.username || "")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    if (!authCtx) {
        return <div>Error: AuthContext is not available</div>
    }

    const handleLogin = async () => {
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
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f5f5f5"
        }}>
            <div style={{
                background: "#fff",
                padding: "2rem",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                minWidth: "320px"
            }}>
                <h2 style={{ textAlign: "center" }}>Login</h2>
                <div style={{ marginBottom: "1rem" }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{ width: "100%", padding: "0.5rem" }}
                    />
                </div>
                {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
                <button
                    onClick={handleLogin}
                    style={{
                        width: "100%",
                        padding: "0.5rem",
                        marginBottom: "0.5rem",
                        background: "#1976d2",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    Login
                </button>
                <button
                    onClick={handleSignup}
                    style={{
                        width: "100%",
                        padding: "0.5rem",
                        background: "#e0e0e0",
                        color: "#333",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    Sign up
                </button>
            </div>
        </div>
    )
}