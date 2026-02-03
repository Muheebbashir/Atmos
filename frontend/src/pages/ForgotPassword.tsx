import { useState } from "react";
import { Link } from "react-router-dom";
import { Music, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useForgotPassword } from "../hooks/useForgotPassword";
import ResetPasswordModal from "../components/ResetPasswordModal";
import type { AxiosError } from "../types/AxiosError";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const { forgotPassword, isLoading } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    forgotPassword(email, {
      onError: (error: unknown) => {
        const axiosError = error as AxiosError;
        toast.error(
          axiosError?.response?.data?.message || "Failed to send OTP"
        );
      },
      onSuccess: (data) => {
        setUserId(data.userId);
        toast.success("OTP sent to your email!");
      },
    });
  };

  if (userId) {
    return <ResetPasswordModal userId={userId} onBack={() => setUserId(null)} />;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="py-8 px-4 sm:px-6 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/login"
            className="flex items-center gap-2 text-green-500 hover:text-green-400 mb-0 transition w-fit"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to Login</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-100px)] flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Music className="text-green-500" size={32} />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Atmos</h1>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Reset Password</h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Enter your email to receive a verification code
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-linear-to-br from-gray-900 to-black rounded-xl p-6 sm:p-8 border border-gray-800 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                {isLoading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-black text-gray-500">Don't have an account?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Link
              to="/signup"
              className="block w-full text-center py-3 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black font-bold rounded-lg transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;
