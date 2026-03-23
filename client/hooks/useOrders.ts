import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getOrders,
    getOrderById,
    getOrdersByDateRange,
    createOrder,
    updateOrderStatus,
    updatePaymentStatus,
    updateKitchenStatus,
    completeOrder,
} from '../services/order';
import {
    OrdersUploadDTO,
    UpdateStatusOrderDTO,
    UpdatePaymentStatusDTO,
    UpdateKitchenStatusDTO,
} from '../types/OrderDTO';
import toast from 'react-hot-toast';

export const orderKeys = {
    all: ['orders'] as const,
    lists: () => [...orderKeys.all, 'list'] as const,
    list: (pageNumber: number, pageSize: number, startDate?: string, endDate?: string, status?: number) =>
        [...orderKeys.lists(), { pageNumber, pageSize, startDate, endDate, status }] as const,
    details: () => [...orderKeys.all, 'detail'] as const,
    detail: (id: number) => [...orderKeys.details(), id] as const,
    dateRange: (startDate?: string, endDate?: string) =>
        [...orderKeys.all, 'dateRange', { startDate, endDate }] as const,
};

export const useOrders = (pageNumber: number = 1, pageSize: number = 100, startDate?: string, endDate?: string, status?: number) => {
    
    return useQuery({
        queryKey: orderKeys.list(pageNumber, pageSize, startDate ?? undefined, endDate ?? undefined, status ?? undefined),
        queryFn: () => getOrders(pageNumber, pageSize, startDate ?? undefined, endDate ?? undefined, status ?? undefined),
    });
};

export const useOrder = (id: number) => {
    return useQuery({
        queryKey: orderKeys.detail(id),
        queryFn: () => getOrderById(id),
        enabled: id > 0,
    });
};

export const useOrdersByDateRange = (startDate?: string, endDate?: string) => {
    return useQuery({
        queryKey: orderKeys.dateRange(startDate, endDate),
        queryFn: () => getOrdersByDateRange(startDate, endDate),
        enabled: !!startDate || !!endDate,
    });
};

export const useCreateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: OrdersUploadDTO) => createOrder(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
        }, onError: (error) => {
            console.log(error);
        }
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: UpdateStatusOrderDTO }) =>
            updateOrderStatus(id, dto),
        onSuccess: (_data, variables) => {
            toast.success("Order status updated");
            
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
        }, onError: (error) => {
            toast.error("Failed to update order status");
        },
    });
};

export const useUpdatePaymentStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: UpdatePaymentStatusDTO }) =>
            updatePaymentStatus(id, dto),
        onSuccess: (_data, variables) => {
            toast.success("Payment status updated");

            queryClient.invalidateQueries({ queryKey: orderKeys.all });
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
        },
        onError: () => {
            toast.error("Failed to update payment status");
        },
    });
};

export const useUpdateKitchenStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: UpdateKitchenStatusDTO }) =>
            updateKitchenStatus(id, dto),
        onSuccess: (_data, variables) => {
            toast.success("Kitchen status updated");

            queryClient.invalidateQueries({ queryKey: orderKeys.all });
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
        },
        onError: () => {
            toast.error("Failed to update kitchen status");
        },
    });
};

export const useCompleteOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => completeOrder(id),
        onSuccess: (_data, id) => {
            toast.success("Order completed");

            queryClient.invalidateQueries({ queryKey: orderKeys.all });
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
        },
        onError: () => {
            toast.error("Failed to complete order");
        },
    });
};
