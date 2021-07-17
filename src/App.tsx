import React, { useState, useCallback } from "react"
import { ChakraProvider } from "@chakra-ui/react"

import { AuthContext } from "hooks/useAuth"
import { deleteToken, getToken, saveToken } from "utils/auth"
import { Routes } from "constants/routes"
import session, { SessionStorageKey } from "utils/sessionStorage"

import "./@commitUI/assets/css/index.css"
import "./App.css"
import Pages from "pages"

function App() {
  const [isAuth, setIsAuth] = useState<"ADMIN" | "USER" | undefined>(
    (Boolean(getToken()) && getToken()?.authType) || undefined
  )

  const userLogin = useCallback((token: Token, next?: Routes) => {
    saveToken(token, "USER")
    session.removeItem(SessionStorageKey.sessionTimedOut)
    setIsAuth("USER")
  }, [])

  const adminLogin = useCallback((token: Token, next?: Routes) => {
    saveToken(token, "ADMIN")
    session.removeItem(SessionStorageKey.sessionTimedOut)
    setIsAuth("ADMIN")
  }, [])

  const logout = useCallback(() => {
    deleteToken()
    setIsAuth(undefined)
  }, [])

  return (
    <ChakraProvider>
      <AuthContext.Provider
        value={{
          isAuth,
          userLogin,
          adminLogin,
          logout,
        }}
      >
        <Pages />
      </AuthContext.Provider>
    </ChakraProvider>
  )
}

export default App
