import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser } from '../services/user';
import { UserUploadDTO } from '../types/User';

export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
};

export const useUsers = () => {
    return useQuery({
        queryKey: userKeys.lists(),
        queryFn: () => getUsers(),
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: UserUploadDTO) => createUser(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        },
    });
};
