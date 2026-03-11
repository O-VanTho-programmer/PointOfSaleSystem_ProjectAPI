import apiClient from '../lib/apiClient';
import { TemplateApi } from '../types/Item';
import { Reservation, ReservationCreateDTO } from '../types/Reservation';

export const getReservations = async (): Promise<TemplateApi<Reservation>> => {
    const response = await apiClient.get<TemplateApi<Reservation>>('/Reservation');
    return response.data;
};

export const getReservationById = async (id: number): Promise<TemplateApi<Reservation>> => {
    const response = await apiClient.get<TemplateApi<Reservation>>(`/Reservation/${id}`);
    return response.data;
};

export const createReservation = async (dto: ReservationCreateDTO): Promise<TemplateApi<Reservation>> => {
    const response = await apiClient.post<TemplateApi<Reservation>>('/Reservation', dto);
    return response.data;
};

export const updateReservation = async (
    id: number,
    dto: ReservationCreateDTO
): Promise<TemplateApi<Reservation>> => {
    const response = await apiClient.put<TemplateApi<Reservation>>(`/Reservation/${id}`, dto);
    return response.data;
};

export const deleteReservation = async (id: number): Promise<TemplateApi<boolean>> => {
    const response = await apiClient.delete<TemplateApi<boolean>>(`/Reservation/${id}`);
    return response.data;
};
