import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/userApi";
import toast from "react-hot-toast";
import { useState } from "react";
import type { AxiosError } from "../types/AxiosError";

export const useSignup = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const { mutate: signup, isPending } = useMutation({
    mutationFn: ({
      username,
      email,
      password,
    }: {
      username: string;
      email: string;
      password: string;
    }) => registerUser(username, email, password),

    onSuccess: (response: unknown) => {
      const data = response as { userId?: string; user?: { email?: string } };
      // Backend returns: { message, user, userId }
      const userId = data?.userId;
      const userEmail = data?.user?.email;
      
      if (userId && userEmail) {
        setUserId(userId);
        setUserEmail(userEmail);
        toast.success("OTP sent to your email!");
      }
    },

    onError: (err: AxiosError) => {
      const message = (err.response?.data as unknown as { message?: string })?.message || "Signup failed";
      toast.error(message);
    },
  });

  return { signup, isPending, userId, userEmail };
};
