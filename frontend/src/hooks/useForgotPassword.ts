import {useMutation} from '@tanstack/react-query';
import { forgotPassword as forgotPasswordApi } from '../api/userApi';

export const useForgotPassword = () => {
    const { mutate: forgotPassword, isPending } = useMutation({
        mutationFn: (email: string) => forgotPasswordApi(email),
    });

    return { forgotPassword, isLoading: isPending };
}