export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  playlist: string[];
  createdAt?: string;
  updatedAt?: string;
  subscriptionType: "basic" | "premium";
  subscriptionStatus: "active" | "inactive" | "cancelled" | "expired";
  subscriptionEndDate?: string;
  razorpaySubscriptionId?: string;
  razorpayCustomerId?: string;
}

export interface AuthUser {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}
