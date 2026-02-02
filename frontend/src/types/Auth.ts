export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: {
    _id: string;
    username: string;
    email: string;
    role: string;
    playlist: string[];
  };
  token: string;
}
