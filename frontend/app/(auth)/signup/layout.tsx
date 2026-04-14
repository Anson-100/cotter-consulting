"use client"

import { createContext, useState, useContext } from "react"
import NavShell from "./_components/nav/NavShell"
import { usePathname } from "next/navigation"

const NavActionsContext = createContext({
  actions: null as React.ReactNode,
  setActions: (a: React.ReactNode) => {},
})

export function useNavActions() {
  return useContext(NavActionsContext)
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [actions, setActions] = useState<React.ReactNode>(null)
  const pathname = usePathname()
  const isWelcome = pathname === "/signup/welcome"

  return (
    <NavActionsContext.Provider value={{ actions, setActions }}>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 pb-28">{children}</div>

        {!isWelcome && <NavShell>{actions}</NavShell>}
      </div>
    </NavActionsContext.Provider>
  )
}
