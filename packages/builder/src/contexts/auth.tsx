import { createContext, useContext, createSignal, type ParentComponent } from "solid-js"

interface User {
  id: string
  email: string
}

interface AuthContextValue {
  user: () => User | null
  isAuthenticated: () => boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  token: () => string | null
}

const AuthContext = createContext<AuthContextValue>()

export const AuthProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal<User | null>(null)
  const [token, setToken] = createSignal<string | null>(localStorage.getItem("token"))

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/builder/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) return false

      const data = await response.json()
      localStorage.setItem("token", data.token)
      setToken(data.token)
      setUser(data.user)
      return true
    } catch {
      return false
    }
  }

  const register = async (
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/builder/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword }),
      })

      if (!response.ok) {
        const data = await response.json()
        return { success: false, error: data.error }
      }

      const data = await response.json()
      localStorage.setItem("token", data.token)
      setToken(data.token)
      setUser(data.user)
      return { success: true }
    } catch {
      return { success: false, error: "Network error" }
    }
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
        register,
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
