import { create } from 'zustand';
import { User } from '../models/User';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null, // Initial state, in a real app might hydrate from localStorage
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    logout: () => {
        // Clear any auth tokens from localStorage here in real app
        set({ user: null, isAuthenticated: false });
    }
}));
