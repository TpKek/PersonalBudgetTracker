import React from "react"
import { useState } from "react"
import axios from "axios"

function Login({setAccessToken, setUser}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    axios.post("http://localhost:3000/auth/login", {
      email,
      password,
    })
    .then((res) => {
      setAccessToken(res.data.data.accessToken)
      setUser(res.data.data.user)
    })
    .catch((err) => {
      setError(err.response?.data?.error || "Login failed");
    })
    .finally(() => {
      setLoading(false);
    })
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
