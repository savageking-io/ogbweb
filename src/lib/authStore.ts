import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/api';

interface AuthState {
    token: string | null;
    user: User | null;
    setAuth: (token: string, user: User) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            setAuth: (token: string, user: User) => set({ token, user }),
            clearAuth: () => set({ token: null, user: null }),
        }),
        {
            name: 'auth-storage', // name of the item in the storage (must be unique)
        }
    )
);