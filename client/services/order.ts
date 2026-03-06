import apiClient from "../lib/apiClient";
import { OrderDTO } from "../types/OrderDTO";

export const createOrder = async (order: OrderDTO) => {
    const response = await apiClient.post('/order', order);
    return response.data;
};

export const getOrderById = async (id: number) => {
    const response = await apiClient.get(`/order/${id}`);
    return response.data;
};

export const getOrders = async () => {
    const response = await apiClient.get('/order');
    return response.data;
};

export const updateOrder = async (id: number, order: OrderDTO) => {
    const response = await apiClient.put(`/order/${id}`, order);
    return response.data;
};

export const deleteOrder = async (id: number) => {
    const response = await apiClient.delete(`/order/${id}`);
    return response.data;
};