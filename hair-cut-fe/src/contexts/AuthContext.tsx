import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import authService from '@/services/auth.service'

type User = {
  id: number
  fullName: string
  phone: string
  email: string
  role?: string
}

type AuthContextType = {
  user: User | null
  isAuth: boolean
  setUser: (user: User | null) => void
  setIsAuth: (auth: boolean) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)

  const getCurrentUser = async () => {
    try {
      setLoading(true)
      const res = await authService.getCurrentUser()
      setUser(res)
      setIsAuth(true)
    } catch (err) {
      setUser(null)
      setIsAuth(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCurrentUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isAuth, setUser, setIsAuth, refreshUser: getCurrentUser }}
    >
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
