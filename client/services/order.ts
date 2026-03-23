import apiClient from '../lib/apiClient';
import { TemplateApi } from '../types/Item';
import {
    OrderResponseDTO,
    OrdersUploadDTO,
    UpdateStatusOrderDTO,
    UpdatePaymentStatusDTO,
    UpdateKitchenStatusDTO,
} from '../types/OrderDTO';

export const getOrders = async (
    pageNumber: number = 1,
    pageSize: number = 100,
    startDate?: string,
    endDate?: string,
    status?: number
): Promise<TemplateApi<OrderResponseDTO>> => {
    const response = await apiClient.get<TemplateApi<OrderResponseDTO>>('/Orders', {
        params: { startDate, endDate, pageNumber, pageSize, status }
    });
    return response.data;
};

export const getOrderById = async (id: number): Promise<TemplateApi<OrderResponseDTO>> => {
    const response = await apiClient.get<TemplateApi<OrderResponseDTO>>(`/Orders/${id}`);
    return response.data;
};

export const getOrdersByDateRange = async (
    startDate?: string,
    endDate?: string
): Promise<TemplateApi<OrderResponseDTO>> => {
    const response = await apiClient.get<TemplateApi<OrderResponseDTO>>('/Orders/filter_by_date_range', {
        params: { startDate, endDate }
    });
    return response.data;
};

export const createOrder = async (dto: OrdersUploadDTO): Promise<TemplateApi<OrderResponseDTO>> => {
    const response = await apiClient.post<TemplateApi<OrderResponseDTO>>('/Orders', dto);
    return response.data;
};

export const updateOrderStatus = async (
    id: number,
    dto: UpdateStatusOrderDTO
): Promise<TemplateApi<OrderResponseDTO>> => {
    const response = await apiClient.patch<TemplateApi<OrderResponseDTO>>(`/Orders/${id}/status`, dto);
    return response.data;
};

export const updatePaymentStatus = async (
    id: number,
    dto: UpdatePaymentStatusDTO
): Promise<TemplateApi<OrderResponseDTO>> => {
    const response = await apiClient.patch<TemplateApi<OrderResponseDTO>>(`/Orders/${id}/payment-status`, dto);
    return response.data;
};

export const updateKitchenStatus = async (
    id: number,
    dto: UpdateKitchenStatusDTO
): Promise<TemplateApi<OrderResponseDTO>> => {
    const response = await apiClient.patch<TemplateApi<OrderResponseDTO>>(`/Orders/${id}/kitchen-status`, dto);
    return response.data;
};

export const completeOrder = async (id: number): Promise<TemplateApi<OrderResponseDTO>> => {
    const response = await apiClient.patch<TemplateApi<OrderResponseDTO>>(`/Orders/${id}/complete`);
    return response.data;
};