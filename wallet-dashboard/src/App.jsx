/**
 * Main Application Component
 *
 * Root component that manages authentication state and renders
 * either the Login or Dashboard component based on authentication status.
 *
 * @component
 * @example
 * // App automatically handles auth state
 * <App />
 */

import React from "react"
import { useState } from "react"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"

/**
 * Main App component
 *
 * Manages application state:
 * - accessToken: JWT token for API authentication
 * - user: Authenticated user data
 *
 * Renders Login form if not authenticated,
 * Dashboard if authenticated
 *
 * @returns {JSX.Element} Main application view
 */
function App() {
  // Authentication state
  const [accessToken, setAccessToken] = useState(null)
  const [user, setUser] = useState(null)

  return (
    <div>
      {accessToken ? (
        <Dashboard accessToken={accessToken} user={user}/>
      ) : (
        <Login setAccessToken={setAccessToken} setUser={setUser} />
      )}
    </div>
  )
}

export default App
