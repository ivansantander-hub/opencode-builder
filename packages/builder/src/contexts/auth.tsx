import { createContext, useContext, createSignal, type ParentComponent } from "solid-js"

interface User {
  id: string
  email: string
}

interface AuthContextValue {
  user: () => User | null
  isAuthenticated: () => boolean
  login: (token: string) => void
  logout: () => void
  token: () => string | null
}

const AuthContext = createContext<AuthContextValue>()

export const AuthProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal<User | null>(null)
  const [token, setToken] = createSignal<string | null>(localStorage.getItem("token"))

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken)
    setToken(newToken)
    setUser({ id: "user-1", email: "user@example.com" })
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  const isAuthenticated = () => !!token()

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        token,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
