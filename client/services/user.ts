import apiClient from '../lib/apiClient';
import { TemplateApi } from '../types/Item';
import { User, UserUploadDTO } from '../types/User';

export const getUsers = async (): Promise<TemplateApi<User>> => {
    const response = await apiClient.get<TemplateApi<User>>('/User');
    return response.data;
};

export const createUser = async (dto: UserUploadDTO): Promise<TemplateApi<User>> => {
    const response = await apiClient.post<TemplateApi<User>>('/User', dto);
    return response.data;
};
