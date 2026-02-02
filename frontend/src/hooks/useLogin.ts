import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import type { LoginPayload } from "../types";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ email, password }: LoginPayload) =>
      loginUser(email, password),

    onSuccess: (data) => {
      // 1️⃣ save token
      localStorage.setItem("token", data.token);

      // 2️⃣ refresh auth user
      queryClient.invalidateQueries({ queryKey: ["authUser"] });

      // 3️⃣ redirect to home
      navigate("/");
    },
  });

  return {
    login: mutate,
    isLoading: isPending,
    error,
  };
};
