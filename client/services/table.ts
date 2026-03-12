import { TemplateApi } from '@/types/Item';
import apiClient from '../lib/apiClient';
import { Table, TableCreateDTO } from '../types/Table';

export const getTables = async (): Promise<TemplateApi<Table>> => {
    const response = await apiClient.get<TemplateApi<Table>>(`/Table`);
    return response.data;
};

export const getTableById = async (id: number): Promise<TemplateApi<Table>> => {
    const response = await apiClient.get<TemplateApi<Table>>(`/Table/${id}`);
    return response.data;
};

export const createTable = async (dto: TableCreateDTO): Promise<TemplateApi<Table>> => {
    const response = await apiClient.post<TemplateApi<Table>>('/Table', dto);
    return response.data;
};

export const updateTable = async (id: number, dto: TableCreateDTO): Promise<TemplateApi<Table>> => {
    const response = await apiClient.put<TemplateApi<Table>>(`/Table/${id}`, dto);
    return response.data;
};

export const deleteTable = async (id: number): Promise<TemplateApi<void>> => {
    const response = await apiClient.delete<TemplateApi<void>>(`/Table/${id}`);
    return response.data;
};
