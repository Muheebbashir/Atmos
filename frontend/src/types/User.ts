export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  playlist: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthUser {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}
