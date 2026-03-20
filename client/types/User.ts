export type UserRole = 'Manager' | 'Cashier' | 'Chef' | 'Waiter';

export interface User {
    userId: number;
    name: string;
    email: string;
    role: UserRole;
    phone: string;
    password?: string;
}

export interface UserUploadDTO {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    phone: string;
}

export const ROLE_REDIRECT_MAP: Record<UserRole, string> = {
    Manager: '/activity',
    Cashier: '/register',
    Waiter: '/register',
    Chef: '/kds',
};