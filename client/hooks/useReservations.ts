import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getReservations,
    getReservationById,
    createReservation,
    updateReservation,
    deleteReservation,
} from '../services/reservation';
import { ReservationCreateDTO } from '../types/Reservation';

export const reservationKeys = {
    all: ['reservations'] as const,
    lists: () => [...reservationKeys.all, 'list'] as const,
    list: () => [...reservationKeys.lists()] as const,
    details: () => [...reservationKeys.all, 'detail'] as const,
    detail: (id: number) => [...reservationKeys.details(), id] as const,
};

export const useReservations = () => {
    return useQuery({
        queryKey: reservationKeys.list(),
        queryFn: () => getReservations(),
    });
};

export const useReservation = (id: number) => {
    return useQuery({
        queryKey: reservationKeys.detail(id),
        queryFn: () => getReservationById(id),
        enabled: id > 0,
    });
};

export const useCreateReservation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: ReservationCreateDTO) => createReservation(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
        },
    });
};

export const useUpdateReservation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: ReservationCreateDTO }) =>
            updateReservation(id, dto),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
            queryClient.invalidateQueries({ queryKey: reservationKeys.detail(variables.id) });
        },
    });
};

export const useDeleteReservation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteReservation(id),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
            queryClient.removeQueries({ queryKey: reservationKeys.detail(variables) });
        },
    });
};
