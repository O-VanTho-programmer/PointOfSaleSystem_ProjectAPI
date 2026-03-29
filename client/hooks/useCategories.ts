import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    assignItemToCategory,
} from '../services/category';
import { CategoryUploadDTO } from '../types/Category';

export const categoryKeys = {
    all: ['categories'] as const,
    lists: () => [...categoryKeys.all, 'list'] as const,
    list: (pageNumber?: number, pageSize?: number) =>
        [...categoryKeys.lists(), { pageNumber, pageSize }] as const,
    details: () => [...categoryKeys.all, 'detail'] as const,
    detail: (id: number) => [...categoryKeys.details(), id] as const,
};

export const useCategories = (pageNumber?: number, pageSize?: number) => {
    return useQuery({
        queryKey: categoryKeys.list(pageNumber, pageSize),
        queryFn: () => getCategories(pageNumber, pageSize),
    });
};

export const useCategory = (id: number) => {
    return useQuery({
        queryKey: categoryKeys.detail(id),
        queryFn: () => getCategoryById(id),
        enabled: id > 0,
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: CategoryUploadDTO) => createCategory(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
        },
    });
};

export const useAssignItemToCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ itemId, categoryId }: { itemId: number; categoryId: number }) =>
            assignItemToCategory(itemId, categoryId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: CategoryUploadDTO }) => updateCategory(id, dto),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteCategory(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
        },
    });
};
