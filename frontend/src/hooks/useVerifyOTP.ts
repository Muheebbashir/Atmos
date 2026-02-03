import { useMutation } from "@tanstack/react-query";
import { api } from "../api/userApi";

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: ({ userId, otp }: { userId: string; otp: string }) => {
      return api.post("/users/verify-otp", { userId, otp });
    },
  });
};
