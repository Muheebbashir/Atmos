import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/users/login", {
    email,
    password,
  });
  return res.data;
};
export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  const res = await api.post("/users/register", {
    username,
    email,
    password,
  });
  return res.data;
};

export const fetchProfile = async (token: string) => {
  const res = await api.get("/users/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const addToPlaylist = async (token: string, songId: string) => {
  const res = await api.get(`/users/song/${songId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const fetchUserPlaylist = async (token: string) => {
  const res = await api.get("/users/playlist", {
    headers: {  
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const verifyOTP = async (userId: string, otp: string) => {
  const res = await api.post("/users/verify-otp", { userId, otp });
  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await api.post("/users/forgot-password", { email });
  return res.data;
};

export const verifyResetOtp = async (userId: string, otp: string) => {
  const res = await api.post("/users/verify-reset-otp", { userId, otp });
  return res.data;
};

export const resetPassword = async (userId: string, newPassword: string) => {
  const res = await api.post("/users/reset-password", { userId, newPassword });
  return res.data;
};