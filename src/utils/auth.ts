import session, { SessionStorageKey } from "./sessionStorage"

export const getToken = () => {
  const access = session.getItem(SessionStorageKey.access)
  const refresh = session.getItem(SessionStorageKey.refresh)
  const authType = session.getItem(SessionStorageKey.authType) as
    | "USER"
    | "ADMIN"
  if (access && refresh) return { access, refresh, authType }
}

export const saveToken = (token: Token, authType: "USER" | "ADMIN") => {
  session.setItem(SessionStorageKey.access, token.access)
  session.setItem(SessionStorageKey.refresh, token.refresh)
  session.setItem(SessionStorageKey.authType, authType)
}

export const deleteToken = () => {
  session.removeItem(SessionStorageKey.access)
  session.removeItem(SessionStorageKey.refresh)
  session.removeItem(SessionStorageKey.authType)
}
