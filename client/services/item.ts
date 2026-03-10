import apiClient from '../lib/apiClient';
import { Item, ItemUploadDTO, TemplateApi } from '../types/Item';

export const getItems = async (
    pageNumber?: number,
    pageSize?: number
): Promise<TemplateApi<Item>> => {
    const response = await apiClient.get<TemplateApi<Item>>('/Items', {
        params: { pageNumber, pageSize },
    });
    return response.data;
};

export const getItemById = async (id: number): Promise<Item | null> => {
    const response = await apiClient.get<TemplateApi<Item>>(`/Items/${id}`);
    return response.data.payload || null;
};

export const createItem = async (dto: ItemUploadDTO): Promise<TemplateApi<Item>> => {
    const response = await apiClient.post<TemplateApi<Item>>('/Items', dto);
    return response.data;
};

export const updateItem = async (
    id: number,
    dto: ItemUploadDTO
): Promise<TemplateApi<Item>> => {
    const response = await apiClient.put<TemplateApi<Item>>(`/Items/${id}`, dto);
    return response.data;
};

