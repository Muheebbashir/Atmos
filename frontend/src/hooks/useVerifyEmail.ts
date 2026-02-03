import {useMutation} from "@tanstack/react-query";
import {verifyEmail} from "../api/userApi";

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => verifyEmail(token),
  });
}