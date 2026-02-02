import { Link } from "react-router-dom";
import { Music, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLogin } from "../hooks/useLogin";
import type { AxiosError } from "../types/AxiosError";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }
    if (!rememberMe) {
      toast.error("You must check 'Remember me' to continue");
      return;
    }

    // Call login mutation
    login(
      { email, password },
      {
        onError: (error: AxiosError) => {
          toast.error(error?.response?.data?.message || "Login failed");
        },
        onSuccess: () => {
          toast.success("Login successful!");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Music className="text-white" size={40} />
            <h1 className="text-3xl font-bold text-white">Atmos</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <h2 className="text-5xl font-black text-white mb-8 text-center">
            Log in to
            <br />
            Atmos
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Email address
              </label>
              <input
                type="text"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-3 rounded border border-gray-600 bg-black text-white placeholder-gray-500 outline-none hover:border-white focus:border-white transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-3 rounded border border-gray-600 bg-black text-white placeholder-gray-500 outline-none hover:border-white focus:border-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-green-500 cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-sm text-white cursor-pointer"
              >
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-400 hover:scale-105 text-black font-bold py-3 px-8 rounded-full transition mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>

            {/* Forgot Password */}
            <div className="text-center pt-4">
              <a
                href="#"
                className="text-white hover:text-green-500 underline text-sm font-medium"
              >
                Forgot your password?
              </a>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          {/* Sign Up Link */}
          <p className="text-base text-gray-400 text-center">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-white hover:text-green-500 underline font-medium"
            >
              Sign up for Atmos
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;