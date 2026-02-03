import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  isLoading: boolean;
  email: string;
}

export function OTPModal({ isOpen, onClose, onVerify, isLoading, email }: OTPModalProps) {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    onVerify(otp);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] rounded-lg p-8 max-w-md w-full mx-4 border border-gray-700">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition disabled:opacity-50"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
        <p className="text-gray-400 text-sm mb-6">
          We've sent a 6-digit code to<br />
          <span className="text-green-500 font-semibold">{email}</span>
        </p>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Verification Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOtp(value);
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-black text-white placeholder-gray-500 text-center text-2xl tracking-widest outline-none hover:border-white focus:border-green-500 transition"
              disabled={isLoading}
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-2">
              Enter the 6-digit code from your email
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        {/* Info Text */}
        <p className="text-xs text-gray-400 text-center mt-6">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={() => {
              setOtp("");
              toast.success("Code resent to your email");
            }}
            disabled={isLoading}
            className="text-green-500 hover:underline disabled:opacity-50"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}
