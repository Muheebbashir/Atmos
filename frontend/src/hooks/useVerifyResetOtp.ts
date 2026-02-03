import { useMutation } from '@tanstack/react-query';
import { verifyResetOtp as verifyResetOtpApi } from '../api/userApi';

export const useVerifyResetOtp = () => {
    const { mutate: verifyResetOtp, isPending: isLoading } = useMutation({
        mutationFn: async ({ userId, otp }: { userId: string; otp: string }) => {
            return verifyResetOtpApi(userId, otp);
        },
    });

    return { verifyResetOtp, isLoading };
};
