import apiClient from '../lib/apiClient';
import { TemplateApi } from '../types/Item';
import { ActivityLog } from '../types/ActivityLog';

export const getActivityLogs = async (
    pageNumber: number = 1,
    pageSize: number = 100,
    startDate?: string,
    endDate?: string
): Promise<TemplateApi<ActivityLog>> => {
    const response = await apiClient.get<TemplateApi<ActivityLog>>('/ActivityLogs', {
        params: { pageNumber, pageSize, startDate, endDate }
    });
    return response.data;
};
