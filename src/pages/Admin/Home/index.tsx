import { Button } from "@commitUI"
import { logout } from "api/auth"
import React from "react"
import { getToken } from "utils/auth"
import useAuth from "hooks/useAuth"

const Home = () => {
  const { logout: localLogout } = useAuth()

  return (
    <div>
      <h1>Admin Home Page</h1>
      <Button
        onClick={() => {
          const token = getToken()
          console.log(token)
          logout({ refresh_token: token!.refresh })
          localLogout()
        }}
      >
        Log out
      </Button>
    </div>
  )
}

export default Home
