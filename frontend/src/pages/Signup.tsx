import { Link } from "react-router-dom";
import { Music } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSignup } from "../hooks/useSignup";
import { getPasswordStrength } from "../utils/passwordStrength";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const { signup, isPending } = useSignup();
  const strength = getPasswordStrength(password);

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
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-3 rounded border border-gray-600 bg-black text-white placeholder-gray-500 outline-none hover:border-white focus:border-white transition"
              />

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

          {/* Login Link */}
          <p className="text-base text-gray-400 text-center">
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
    </div>
  );
}

export default Signup;