import apiClient from "../lib/apiClient";
import { UserRole } from "@/types/User";

export const login = async (phone: string, password: string) => {
    const response = await apiClient.post('/Auths/login', { phone, password });
    return response.data;
};

// Updated signup with role explicitly for Admin access
export const signup = async (phone: string, name: string, email: string, password: string, role: UserRole) => {
    const response = await apiClient.post('/Auths/employee/register', { phone, name, email, password, role });
    return response.data;
};