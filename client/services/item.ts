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
    const formData = new FormData();
    formData.append('name', dto.name);
    formData.append('price', dto.price.toString());
    formData.append('categoryId', dto.categoryId.toString());
    formData.append('isSoldOut', dto.isSoldOut.toString());
    if (dto.image) {
        formData.append('image', dto.image);
    }

    const response = await apiClient.post<TemplateApi<Item>>('/Items', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateItem = async (
    id: number,
    dto: ItemUploadDTO
): Promise<TemplateApi<Item>> => {
    const formData = new FormData();
    formData.append('name', dto.name);
    formData.append('price', dto.price.toString());
    formData.append('categoryId', dto.categoryId.toString());
    formData.append('isSoldOut', dto.isSoldOut.toString());
    if (dto.image) {
        formData.append('image', dto.image);
    }

    const response = await apiClient.put<TemplateApi<Item>>(`/Items/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteItem = async (id: number): Promise<TemplateApi<boolean>> => {
    const response = await apiClient.delete<TemplateApi<boolean>>(`/Items/${id}`);
    return response.data;
};

