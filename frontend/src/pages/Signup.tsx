import { Link } from "react-router-dom";
import { Music, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSignup } from "../hooks/useSignup";
import { useVerifyOTP } from "../hooks/useVerifyOTP";
import { OTPModal } from "../components/OTPModal";
import { getPasswordStrength } from "../utils/passwordStrength";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { signup, isPending, userId, userEmail } = useSignup();
  const { mutate: verifyOTP, isPending: isVerifying } = useVerifyOTP();
  const strength = getPasswordStrength(password);
  // Show modal when we have userId (which means signup was successful)
  const showOTPModal = !!userId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !username) {
      toast.error("All fields are required");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    signup({ username, email, password });
  };

  const handleOTPVerify = (otp: string) => {
    if (!userId) return;
    
    verifyOTP(
      { userId, otp },
      {
        onSuccess: (data: unknown) => {
          const response = data as { data: { token: string; user: unknown } };
          // Save token
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          toast.success("Email verified! Welcome to Atmos 🎧");
          // Redirect to home after a short delay
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        },
        onError: (error: unknown) => {
          const axiosError = error as { response?: { data?: { message?: string } } };
          toast.error(axiosError.response?.data?.message || "Invalid OTP");
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
            Sign up to start
            <br />
            listening
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Email address
              </label>
              <input
                type="email"
                placeholder="name@domain.com"
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
                  className="w-full px-3 py-3 pr-10 rounded border border-gray-600 bg-black text-white placeholder-gray-500 outline-none hover:border-white focus:border-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {/* Strength Meter */}
              {password && (
                <div className="mt-2">
                  <div className="w-full h-1 bg-gray-700 rounded">
                    <div
                      className={`h-1 rounded transition-all ${strength.color}`}
                      style={{ width: `${strength.value}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-300 mt-1">
                    Strength:{" "}
                    <span className="font-semibold">{strength.label}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                What should we call you?
              </label>
              <input
                type="text"
                placeholder="Enter a profile name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-3 rounded border border-gray-600 bg-black text-white placeholder-gray-500 outline-none hover:border-white focus:border-white transition"
              />
              <p className="text-xs text-white mt-2">
                This appears on your profile.
              </p>
            </div>

            {/* Terms */}
            <div className="pt-4">
              <p className="text-xs text-white text-center leading-relaxed">
                By clicking on sign-up, you agree to Atmos{" "}
                <a href="#" className="text-green-500 hover:underline">
                  Terms and Conditions of Use
                </a>
                .
              </p>
              <p className="text-xs text-white text-center mt-4 leading-relaxed">
                To learn more about how Atmos collects, uses, shares and
                protects your personal data, please see{" "}
                <a href="#" className="text-green-500 hover:underline">
                  Atmos's Privacy Policy
                </a>
                .
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-green-500 hover:bg-green-400 hover:scale-105 text-black font-bold py-3 px-8 rounded-full transition mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          {/* Verification Message */}
          <p className="text-green-400 text-center mt-4 text-sm font-medium">
            Please check your email to verify your account
          </p>

          {/* Login Link */}
          <p className="text-base text-gray-400 text-center mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-white hover:text-green-500 underline font-medium"
            >
              Log in here
            </Link>
            .
          </p>
        </div>
      </div>

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTPModal}
        email={userEmail || email}
        onVerify={handleOTPVerify}
        isLoading={isVerifying}
        onClose={() => {
          // Reset form
          setEmail("");
          setPassword("");
          setUsername("");
        }}
      />
    </div>
  );
}

export default Signup;