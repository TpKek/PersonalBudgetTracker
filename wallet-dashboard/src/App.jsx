import React from "react"
import { useState } from "react"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"

function App() {
  const [accessToken, setAccessToken] = useState(null)
  const [user, setUser] = useState(null)

  return (
    <div>
      {accessToken ? <Dashboard setAccessToken={setAccessToken} user={user}/> : <Login setAccessToken={setAccessToken} setUser={setUser} />}
    </div>
  )
}

export default App
