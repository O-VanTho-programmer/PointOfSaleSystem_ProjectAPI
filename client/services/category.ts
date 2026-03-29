import apiClient from '../lib/apiClient';
import { TemplateApi } from '../types/Item';
import { Category, CategoryUploadDTO } from '../types/Category';

export const getCategories = async (
    pageNumber?: number,
    pageSize?: number
): Promise<TemplateApi<Category>> => {
    const response = await apiClient.get<TemplateApi<Category>>('/Categories', {
        params: { pageNumber, pageSize },
    });
    return response.data;
};

export const getCategoryById = async (id: number): Promise<TemplateApi<Category>> => {
    const response = await apiClient.get<TemplateApi<Category>>(`/Categories/${id}`);
    return response.data;
};

export const createCategory = async (dto: CategoryUploadDTO): Promise<Category> => {
    const response = await apiClient.post<Category>('/Categories', dto);
    return response.data;
};

export const assignItemToCategory = async (
    itemId: number,
    categoryId: number
): Promise<unknown> => {
    const response = await apiClient.post('/Categories/assign-item', null, {
        params: { ItemId: itemId, CategoryId: categoryId },
    });
    return response.data;
};

export const updateCategory = async (id: number, dto: CategoryUploadDTO): Promise<TemplateApi<Category>> => {
    const response = await apiClient.put<TemplateApi<Category>>(`/Categories/${id}`, dto);
    return response.data;
};

export const deleteCategory = async (id: number): Promise<TemplateApi<Category>> => {
    const response = await apiClient.delete<TemplateApi<Category>>(`/Categories/${id}`);
    return response.data;
};
