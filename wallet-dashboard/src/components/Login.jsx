// Login

//email and password

import React from "react"
import { useState } from "react"
import axios from "axios"

function Login({setAccessToken, setUser}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    //POST to auth/login
    axios.post("http://localhost:3000/auth/login", {
      email,
      password,
    })
    .then((res) => {
      setAccessToken(res.data.data.accessToken)
      setUser(res.data.data.user)
      console.log(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login
