/* eslint-disable react-hooks/set-state-in-effect */
// contexts/AuthModalContext.tsx
"use client"
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import { usePathname } from "next/navigation"

type AuthMode = "signup" | "signin" | "forgot"

type AuthModalContextType = {
  isOpen: boolean
  mode: AuthMode
  openAuthModal: (mode?: AuthMode) => void
  closeAuthModal: () => void
}

const AuthModalContext = createContext<AuthModalContextType | null>(null)

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<AuthMode>("signin")
  const pathname = usePathname()

  // Close modal on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const openAuthModal = (newMode: AuthMode = "signin") => {
    setMode(newMode)
    setIsOpen(true)
  }

  const closeAuthModal = () => setIsOpen(false)

  return (
    <AuthModalContext.Provider
      value={{ isOpen, mode, openAuthModal, closeAuthModal }}
    >
      {children}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const context = useContext(AuthModalContext)
  if (!context)
    throw new Error("useAuthModal must be used within AuthModalProvider")
  return context
}
