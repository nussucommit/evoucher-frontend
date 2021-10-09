import create from "zustand";
import { Routes } from "constants/routes";
import { useCallback } from "react";
import { saveToken, deleteToken } from "utils/auth";
import session, { SessionStorageKey } from "utils/sessionStorage";

type AuthState = {
  isAuth: "USER" | "ADMIN" | undefined;
  userLogin: (token: Token, next?: Routes) => void;
  adminLogin: (token: Token, next?: Routes) => void;
  logout: () => void;
};

/**
 * React hook to handle user client-side authentication
 *
 * @returns a react context
 */
const useAuth = create<AuthState>((set) => ({
  isAuth: undefined,
  userLogin: (token) => {
    saveToken(token, "USER");
    session.removeItem(SessionStorageKey.sessionTimedOut);
    set({ isAuth: "USER" });
  },
  adminLogin: (token) => {
    saveToken(token, "ADMIN");
    session.removeItem(SessionStorageKey.sessionTimedOut);
    set({ isAuth: "ADMIN" });
  },
  logout: () => {
    deleteToken();
    set({ isAuth: undefined });
  },
}));

export default useAuth;
