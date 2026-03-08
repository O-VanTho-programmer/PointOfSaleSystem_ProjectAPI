import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTables, getTableById, createTable, updateTable, deleteTable } from '../services/table';
import { TableCreateDTO } from '../types/Table';

export const tableKeys = {
    all: ['tables'] as const,
    lists: () => [...tableKeys.all, 'list'] as const,
    details: () => [...tableKeys.all, 'detail'] as const,
    detail: (id: number) => [...tableKeys.details(), id] as const,
};

export const useTables = () => {
    return useQuery({
        queryKey: tableKeys.lists(),
        queryFn: getTables,
    });
};

export const useTable = (id: number) => {
    return useQuery({
        queryKey: tableKeys.detail(id),
        queryFn: () => getTableById(id),
        enabled: id > 0,
    });
};

export const useCreateTable = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: TableCreateDTO) => createTable(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tableKeys.lists() });
        },
    });
};

export const useUpdateTable = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: TableCreateDTO }) =>
            updateTable(id, dto),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: tableKeys.lists() });
            queryClient.invalidateQueries({ queryKey: tableKeys.detail(variables.id) });
        },
    });
};

export const useDeleteTable = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteTable(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tableKeys.lists() });
        },
    });
};
