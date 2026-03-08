import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getItems, getItemById, createItem, updateItem } from '../services/item';
import { ItemUploadDTO } from '../types/Item';

// ─── Query Keys ──────────────────────────────────
export const itemKeys = {
    all: ['items'] as const,
    lists: () => [...itemKeys.all, 'list'] as const,
    list: (pageNumber: number, pageSize: number) =>
        [...itemKeys.lists(), { pageNumber, pageSize }] as const,
    details: () => [...itemKeys.all, 'detail'] as const,
    detail: (id: number) => [...itemKeys.details(), id] as const,
};

export const useItems = (pageNumber: number = 1, pageSize: number = 10) => {
    return useQuery({
        queryKey: itemKeys.list(pageNumber, pageSize),
        queryFn: () => getItems(pageNumber, pageSize),
    });
};

export const useItem = (id: number) => {
    return useQuery({
        queryKey: itemKeys.detail(id),
        queryFn: () => getItemById(id),
        enabled: id > 0,
    });
};

export const useCreateItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: ItemUploadDTO) => createItem(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
        },
    });
};

export const useUpdateItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: ItemUploadDTO }) =>
            updateItem(id, dto),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
            queryClient.invalidateQueries({ queryKey: itemKeys.detail(variables.id) });
        },
    });
};
