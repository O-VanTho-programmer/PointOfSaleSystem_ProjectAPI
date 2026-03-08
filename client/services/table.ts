import apiClient from '../lib/apiClient';
import { Table, TableCreateDTO } from '../types/Table';

export const getTables = async (): Promise<Table[]> => {
    const response = await apiClient.get<Table[]>('/Table');
    return response.data;
};

export const getTableById = async (id: number): Promise<Table> => {
    const response = await apiClient.get<Table>(`/Table/${id}`);
    return response.data;
};

export const createTable = async (dto: TableCreateDTO): Promise<Table> => {
    const response = await apiClient.post<Table>('/Table', dto);
    return response.data;
};

export const updateTable = async (id: number, dto: TableCreateDTO): Promise<void> => {
    await apiClient.put(`/Table/${id}`, dto);
};

export const deleteTable = async (id: number): Promise<void> => {
    await apiClient.delete(`/Table/${id}`);
};
