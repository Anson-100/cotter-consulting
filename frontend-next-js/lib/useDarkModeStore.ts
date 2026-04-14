// stores/useDarkModeStore.ts
import { create } from "zustand"

interface DarkModeStore {
  isDark: boolean
  mounted: boolean
  setIsDark: (isDark: boolean) => void
  toggleDarkMode: () => void
  initialize: () => void
}

export const useDarkModeStore = create<DarkModeStore>((set, get) => ({
  isDark: false,
  mounted: false,

  setIsDark: (isDark) => {
    set({ isDark })
    document.documentElement.classList.toggle("dark", isDark)
    localStorage.setItem("theme", isDark ? "dark" : "light")
  },

  toggleDarkMode: () => {
    const { isDark, setIsDark } = get()
    setIsDark(!isDark)
  },

  initialize: () => {
    if (typeof window === "undefined") return

    const userPref = localStorage.getItem("theme")
    const systemPref = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = userPref === "dark" || (!userPref && systemPref)

    document.documentElement.classList.toggle("dark", shouldBeDark)
    set({ isDark: shouldBeDark, mounted: true })
  },
}))
