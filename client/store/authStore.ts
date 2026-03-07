import { create } from 'zustand';
import { User } from '../models/User';
import Cookies from 'js-cookie';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    logout: () => {
        Cookies.remove('pos_auth_token');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false });
    }
}));
