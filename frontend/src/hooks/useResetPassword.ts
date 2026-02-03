import { useMutation } from '@tanstack/react-query';
import { resetPassword as resetPasswordApi } from '../api/userApi';

export const useResetPassword = () => {
    const { mutate: resetPassword, isPending: isLoading } = useMutation({
        mutationFn: async ({ userId, newPassword }: { userId: string; newPassword: string }) => {
            return resetPasswordApi(userId, newPassword);
        },
    });

    return { resetPassword, isLoading };
};
