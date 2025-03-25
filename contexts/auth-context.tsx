"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  type User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth"
import { auth, googleProvider, ADMIN_EMAIL } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  devModeSignIn: () => void // For development/preview only
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [devModeAdmin, setDevModeAdmin] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Check if user is admin (either real Firebase user or dev mode)
  const isAdmin = user?.email === ADMIN_EMAIL || devModeAdmin

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      if (result.user.email !== ADMIN_EMAIL) {
        toast({
          title: "Access Restricted",
          description: "Only administrators can sign in.",
          variant: "destructive",
        })
        await firebaseSignOut(auth)
      } else {
        toast({
          title: "Welcome Admin",
          description: "You are now signed in as an administrator.",
        })
      }
    } catch (error: any) {
      console.error("Error signing in with Google:", error)

      // Handle unauthorized domain error specifically
      if (error.code === "auth/unauthorized-domain") {
        toast({
          title: "Authentication Error",
          description:
            "This domain is not authorized for authentication. Try using email/password or dev mode instead.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Sign In Failed",
          description: "An error occurred during sign in.",
          variant: "destructive",
        })
      }
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    try {
      if (email !== ADMIN_EMAIL) {
        toast({
          title: "Access Restricted",
          description: "Only administrators can sign in.",
          variant: "destructive",
        })
        return
      }

      // Try to sign in first
      try {
        await signInWithEmailAndPassword(auth, email, password)
      } catch (signInError: any) {
        // If user doesn't exist, create account
        if (signInError.code === "auth/user-not-found") {
          await createUserWithEmailAndPassword(auth, email, password)
        } else {
          throw signInError
        }
      }

      toast({
        title: "Welcome Admin",
        description: "You are now signed in as an administrator.",
      })
    } catch (error) {
      console.error("Error signing in with email:", error)
      toast({
        title: "Sign In Failed",
        description: "Please check your email and password.",
        variant: "destructive",
      })
    }
  }

  // Development mode sign in (for preview environments)
  const devModeSignIn = () => {
    setDevModeAdmin(true)
    toast({
      title: "Dev Mode Activated",
      description: "You now have admin access in development mode.",
    })
  }

  const signOut = async () => {
    try {
      // If in dev mode, just reset the state
      if (devModeAdmin) {
        setDevModeAdmin(false)
        toast({
          title: "Dev Mode Deactivated",
          description: "Admin access removed.",
        })
        return
      }

      // Otherwise sign out from Firebase
      await firebaseSignOut(auth)
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Sign Out Failed",
        description: "An error occurred during sign out.",
        variant: "destructive",
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signOut,
        devModeSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

