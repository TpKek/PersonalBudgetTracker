/**
 * Login Component
 *
 * Provides user authentication form with email and password.
 * On successful login, stores access token and user info in parent state.
 *
 * @component
 * @example
 * <Login setAccessToken={setToken} setUser={setUser} />
 */

import React from "react"
import { useState } from "react"
import axios from "axios"

/**
 * Login form component
 *
 * @param {Object} props - Component props
 * @param {Function} props.setAccessToken - Callback to set access token in parent
 * @param {Function} props.setUser - Callback to set user info in parent
 * @returns {JSX.Element} Login form
 */
function Login({setAccessToken, setUser}) {
  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // UI state
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  /**
   * Handle form submission
   * Sends credentials to backend and stores tokens on success
   *
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Send login request to API
    axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
      email,
      password,
    })
    .then((res) => {
      // Store access token and user info in parent component
      setAccessToken(res.data.data.accessToken)
      setUser(res.data.data.user)
    })
    .catch((err) => {
      // Display error message from server or generic message
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
