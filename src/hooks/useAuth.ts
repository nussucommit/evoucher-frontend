import { createContext, useContext } from "react"
import { Routes } from "constants/routes"

const defaultValue: {
  isAuth: "USER" | "ADMIN" | undefined
  userLogin: (token: Token, next?: Routes) => void
  adminLogin: (token: Token, next?: Routes) => void
  logout: () => void
} = {
  isAuth: undefined,
  userLogin: () => undefined,
  adminLogin: () => undefined,
  logout: () => undefined,
}

export const AuthContext = createContext(defaultValue)

/**
 * React hook to handle user client-side authentication
 *
 * @returns a react context
 */
const useAuth = () => useContext(AuthContext)

export default useAuth
