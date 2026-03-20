import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/User';
import Cookies from 'js-cookie';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            setUser: (user) => set({ user, isAuthenticated: !!user }),
            logout: () => {
                Cookies.remove('pos_auth_token');
                set({ user: null, isAuthenticated: false });
            },
        }),
        {
            name: 'pos-auth-storage', // localStorage key
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
