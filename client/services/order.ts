import apiClient from '../lib/apiClient';
import { TemplateApi } from '../types/Item';
import { OrderDTO, OrdersUploadDTO, UpdateStatusOrderDTO } from '../types/OrderDTO';

export const getOrders = async (
    pageNumber: number = 1,
    pageSize: number = 100,
    startDate?: string,
    endDate?: string,
    status?: number
): Promise<TemplateApi<OrderDTO>> => {
    const response = await apiClient.get<TemplateApi<OrderDTO>>('/Orders', {
        params: { startDate, endDate, pageNumber, pageSize, status }
    });
    return response.data;
};

export const getOrderById = async (id: number): Promise<TemplateApi<OrderDTO>> => {
    const response = await apiClient.get<TemplateApi<OrderDTO>>(`/Orders/${id}`);
    return response.data;
};

export const getOrdersByDateRange = async (
    startDate?: string,
    endDate?: string
): Promise<TemplateApi<OrderDTO>> => {
    const response = await apiClient.get<TemplateApi<OrderDTO>>('/Orders/filter_by_date_range', {
        params: { startDate, endDate }
    });
    return response.data;
};

export const createOrder = async (dto: OrdersUploadDTO): Promise<TemplateApi<OrderDTO>> => {
    const response = await apiClient.post<TemplateApi<OrderDTO>>('/Orders', dto);
    return response.data;
};

export const updateOrderStatus = async (
    id: number,
    dto: UpdateStatusOrderDTO
): Promise<TemplateApi<OrderDTO>> => {
    const response = await apiClient.patch<TemplateApi<OrderDTO>>(`/Orders/${id}/status`, dto);
    return response.data;
};