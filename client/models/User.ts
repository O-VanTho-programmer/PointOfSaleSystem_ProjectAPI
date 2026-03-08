export interface User {
    id: number;
    name: string;
    phone: string;
    email: string;
    role: UserRole;
}

export type UserRole = 'Manager' | 'Cashier' | 'Chef' | 'Waiter';

/** Central mapping: each role's default landing page after login */
export const ROLE_REDIRECT_MAP: Record<UserRole, string> = {
    Manager: '/activity',
    Cashier: '/register',
    Waiter: '/register',
    Chef: '/kds',
};