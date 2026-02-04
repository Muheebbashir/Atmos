import { useMutation, useQueryClient } from "@tanstack/react-query";
import { googleLogin } from "../api/userApi";
import { useNavigate } from "react-router-dom";

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (credential: string) => googleLogin(credential),

    onSuccess: (data) => {
      // Save token
      localStorage.setItem("token", data.token);

      // Refresh auth user
      queryClient.invalidateQueries({ queryKey: ["authUser"] });

      // Redirect to home
      navigate("/");
    },
  });

  return {
    googleLogin: mutate,
    isLoading: isPending,
    error,
  };
};
