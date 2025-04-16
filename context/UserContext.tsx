import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { jwtDecode } from 'jwt-decode'

interface User {
  userId: string
  name: string
  email: string
  role: string
}

interface UserContextType {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  setUser: () => {}
})

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      try {
        const decoded = jwtDecode<User>(token)
        setUser(decoded)
      } catch (err) {
        setUser(null)
      }
    }

    setLoading(false)
  }, [])

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
