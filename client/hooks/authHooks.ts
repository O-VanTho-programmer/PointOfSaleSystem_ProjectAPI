import { useMutation } from '@tanstack/react-query';
import { login, signup } from '../services/auth';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../models/User';

export const useAuthLogin = () => {
    const { setUser } = useAuthStore();

    const mutation = useMutation({
        mutationFn: async ({ phone, password }: { phone: string; password: string }) => {
            const response = await login(phone, password);
            return response.user;
        },
        onSuccess: (data: any) => {
            setUser(data);
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
            // Uncomment when backend is ready
            // const response = await signup(phone, name, email, password, role);
            // return response;

            // Mocking successful signup
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ success: true });
                }, 1200);
            });
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