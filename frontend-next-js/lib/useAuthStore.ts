// lib/useAuthStore.ts
import { create } from "zustand"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

type AuthState = {
  user: User | null
  hasProfile: boolean | null
  loading: boolean
  initialized: boolean

  // Actions
  initialize: () => Promise<void>
  checkProfile: () => Promise<void>
  logout: () => Promise<void>
  setHasProfile: (value: boolean) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  hasProfile: null,
  loading: true,
  initialized: false,

  initialize: async () => {
    // Only initialize once
    if (get().initialized) return

    const supabase = createClient()

    // Get initial session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const user = session?.user ?? null

    set({ user, initialized: true })

    // If we have a user, check profile
    if (user) {
      await get().checkProfile()
    }

    set({ loading: false })

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      const newUser = session?.user ?? null
      const prevUser = get().user

      set({ user: newUser })

      // User just logged in - check profile
      if (newUser && !prevUser) {
        await get().checkProfile()
      }

      // User logged out - clear profile status
      if (!newUser && prevUser) {
        set({ hasProfile: null })
      }
    })
  },

  checkProfile: async () => {
    const { user, hasProfile } = get()

    // Skip if no user or already checked
    if (!user) {
      set({ hasProfile: null })
      return
    }

    // Only fetch if we haven't checked yet
    if (hasProfile !== null) return

    const supabase = createClient()
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle()

    set({ hasProfile: !!profile })
  },

  logout: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    set({ user: null, hasProfile: null })
  },

  // Call this after successful onboarding finalization
  setHasProfile: (value: boolean) => {
    set({ hasProfile: value })
  },
}))
