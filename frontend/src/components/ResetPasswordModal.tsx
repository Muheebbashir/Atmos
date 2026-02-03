import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, X } from "lucide-react";
import { useVerifyResetOtp } from "../hooks/useVerifyResetOtp";
import { useResetPassword } from "../hooks/useResetPassword";
import type { AxiosError } from "../types/AxiosError";

interface ResetPasswordModalProps {
  userId: string;
  onBack?: () => void;
}

function ResetPasswordModal({ userId, onBack }: ResetPasswordModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<"otp" | "password">("otp");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { verifyResetOtp, isLoading: isVerifyingOtp } = useVerifyResetOtp();
  const { resetPassword, isLoading: isResettingPassword } = useResetPassword();

  // Step 1: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    verifyResetOtp(
      { userId, otp },
      {
        onError: (error: unknown) => {
          const axiosError = error as AxiosError;
          const message = axiosError?.response?.data?.message || "Invalid OTP";
          const attemptsLeft = (axiosError?.response?.data as Record<string, unknown>)?.attemptsLeft;
          
          if (attemptsLeft !== undefined) {
            toast.error(`${message} (${attemptsLeft} attempts left)`);
          } else {
            toast.error(message);
          }
        },
        onSuccess: () => {
          toast.success("OTP verified! Now set your new password.");
          setStep("password");
          setOtp("");
        },
      }
    );
  };

  // Step 2: Reset Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    resetPassword(
      { userId, newPassword },
      {
        onError: (error: unknown) => {
          const axiosError = error as AxiosError;
          toast.error(
            axiosError?.response?.data?.message || "Failed to reset password"
          );
        },
        onSuccess: () => {
          toast.success("Password reset successfully!");
          navigate("/login");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Close Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-4 text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        )}

        <div className="bg-linear-to-br from-gray-900 to-black rounded-xl p-6 sm:p-8 border border-gray-800 shadow-2xl">
          {step === "otp" ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Verify Code</h2>
              <p className="text-gray-400 text-sm sm:text-base mb-8">
                Enter the 6-digit code sent to your email
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-center text-2xl tracking-widest placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                    placeholder="000000"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingOtp || otp.length !== 6}
                  className="w-full py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                >
                  {isVerifyingOtp ? "Verifying..." : "Verify Code"}
                </button>
              </form>

              <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
                Code expires in 10 minutes
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Set New Password</h2>
              <p className="text-gray-400 text-sm sm:text-base mb-8">
                Create a strong password for your account
              </p>

              <form onSubmit={handleResetPassword} className="space-y-4 sm:space-y-6">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition pr-12"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition pr-12"
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isResettingPassword}
                  className="w-full py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                >
                  {isResettingPassword ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
                Password must be at least 6 characters
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordModal;
