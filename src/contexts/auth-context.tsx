import { createContext, useContext, useState } from 'react'
import { getUserFn } from '@/server/auth'
import { User } from '@/types/user'

const AuthContext = createContext<{
  user: User | null
  isLoading: boolean
  refreshUser: () => Promise<void>
} | undefined>(undefined)

export function AuthProvider({ children, initialUser }: { children: React.ReactNode; initialUser: User | null }) {
  const [user, setUser] = useState<User | null>(initialUser)
  const [isLoading, setIsLoading] = useState(false)

  const refreshUser = async () => {
    setIsLoading(true)
    try {
      const userData = await getUserFn()
      // Handle the new API response format with results array
      if (userData?.results?.[0]) {
        setUser(userData.results[0])
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}