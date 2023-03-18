import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type State = {
	userId: string | null
	setUserId: (user: string | null) => void
}

export const useUserStore = create<State>()(
	persist(
		(set) => ({
			userId: null,
			setUserId: (userId: string | null) => set({ userId })
		}),
		{
			name: 'user-store',
			storage: createJSONStorage(() => localStorage)
		}
	)
)
