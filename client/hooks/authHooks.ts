import { useMutation } from '@tanstack/react-query';
import { login, signup } from '../services/auth';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../models/User';
import Cookies from 'js-cookie';

export const useAuthLogin = () => {
    const { setUser } = useAuthStore();

    const mutation = useMutation({
        mutationFn: async ({ phone, password }: { phone: string; password: string }) => {
            try {
                const response = await login(phone, password);
                return response;
            } catch (error: any) {
                const backendMessage = error.response?.data?.message;
                throw new Error(backendMessage || 'Failed to connect to the server.');
            }
        },
        onSuccess: (data: any) => {
            setUser(data.user);
            Cookies.set('pos_auth_token', data.token, { expires: 1, secure: true, sameSite: 'strict' });
        },
    });

    return {
        mutateLogin: mutation.mutateAsync,
        isLoading: mutation.isPending,
        error: mutation.error ? (mutation.error as Error).message || 'Invalid credentials. Please contact your manager.' : ''
    };
};

export const useAuthSignup = () => {
    const mutation = useMutation({
        mutationFn: async ({ phone, name, email, password, role }: { phone: string; name: string; email: string; password: string; role: UserRole }) => {
            try {
                const response = await signup(phone, name, email, password, role);
                return response;
            } catch (error: any) {
                const backendMessage = error.response?.data?.message;
                throw new Error(backendMessage || 'Failed to connect to the server.');
            }
        }
    });

    return {
        mutateSignup: async (phone: string, name: string, email: string, password: string, role: UserRole) => {
            return mutation.mutateAsync({ phone, name, email, password, role });
        },
        isLoading: mutation.isPending,
        error: mutation.error ? (mutation.error as Error).message || 'Failed to create employee system account.' : ''
    };
};