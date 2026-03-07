"use client";

import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '../models/User';

interface RoleGuardProps {
    /** Roles that are allowed to see the children */
    allowedRoles: UserRole[];
    children: React.ReactNode;
    /** Optional fallback UI when user's role is not authorized */
    fallback?: React.ReactNode;
}

/**
 * Component-level RBAC wrapper.
 * Only renders children if the current user's role is in allowedRoles.
 *
 * Usage:
 *   <RoleGuard allowedRoles={['Manager', 'Cashier']}>
 *     <PayButton />
 *   </RoleGuard>
 *
 * Note: Waiter is intentionally excluded from Payment actions.
 */
export function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
    const role = useAuthStore((state) => state.user?.role);

    if (!role || !allowedRoles.includes(role)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
