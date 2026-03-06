export interface User {
    id?: string;
    phone: string;
    name?: string;
    email?: string;
    role: UserRole;
    token?: string;
}

export type UserRole = 'Manager' | 'Cashier' | 'Chef';