import {
  User,
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth"
import { createContext, ReactNode, useState, useEffect } from "react"

// Create a separate type for the user context
export type UserContextType = {
  user: User | null
  loading: boolean
}

// Create a new context for the user with the separate type
export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
})
// Create a provider component

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        setLoading(false)
      } else {
        signInAnonymously(auth)
          .then((userCredential) => {
            setUser(userCredential.user)
            setLoading(false)
          })
          .catch((error) => {
            console.error("Error signing in anonymously:", error)
            setLoading(false)
          })
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  )
}
