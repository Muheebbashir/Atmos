import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerUser } from "../api/userApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import  type { AxiosError } from "../types/AxiosError";

export const useSignup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

    onSuccess: (data) => {
      // 🔐 Auto-login
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      queryClient.setQueryData(["authUser"], data.user);

      toast.success("Welcome to Atmos 🎧");
      navigate("/");
    },

    onError: (err: AxiosError) => {
      toast.error(err.response?.data?.message || "Signup failed");
    },
  });

  return { signup, isPending };
};
