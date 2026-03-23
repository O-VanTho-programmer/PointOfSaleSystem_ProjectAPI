import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getActivityLogs } from '../services/activityLog';

export const activityLogKeys = {
    all: ['activityLogs'] as const,
    lists: () => [...activityLogKeys.all, 'list'] as const,
    list: (pageNumber: number, pageSize: number, startDate?: string, endDate?: string) =>
        [...activityLogKeys.lists(), { pageNumber, pageSize, startDate, endDate }] as const,
};

export const useActivityLogs = (
    pageNumber: number = 1,
    pageSize: number = 100,
    startDate?: string,
    endDate?: string
) => {
    return useQuery({
        queryKey: activityLogKeys.list(pageNumber, pageSize, startDate ?? undefined, endDate ?? undefined),
        queryFn: () => getActivityLogs(pageNumber, pageSize, startDate ?? undefined, endDate ?? undefined),
        staleTime: 0,
        gcTime: 0,
        placeholderData: keepPreviousData,
    });
};
