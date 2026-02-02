import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "../api/userApi";

export const useAuthUser = () => {
  const token = localStorage.getItem("token");

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: () => fetchProfile(token as string),
    enabled: !!token,          // 🔥 only run if token exists
    retry: false,              // 🔥 don't spam backend
  });

  // If token exists but is invalid → force logout
  if (isError) {
    localStorage.removeItem("token");
  }

  return {
    user: data?.user || null,
    isAuthenticated: !!data?.user,
    isLoading,
    token,
  };
};
