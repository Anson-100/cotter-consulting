import { create } from "zustand"
import { SelectedPage } from "@/types"

interface SelectedPageStore {
  selectedPage: SelectedPage
  setSelectedPage: (page: SelectedPage) => void
}

export const useSelectedPageStore = create<SelectedPageStore>((set) => ({
  selectedPage: SelectedPage.Home,
  setSelectedPage: (page) => set({ selectedPage: page }),
}))
