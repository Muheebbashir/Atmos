import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useVerifyEmail } from "../hooks/useVerifyEmail";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { mutate: verify, isPending, isSuccess, isError, error } = useVerifyEmail();
    
    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            verify(token);
        }
    }, [searchParams, verify]);

    return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center text-white">
        {isPending && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4" />
            <p>Verifying your email...</p>
          </>
        )}

        {isSuccess && (
          <>
            <p className="text-2xl text-green-500 mb-4">✓ Email Verified!</p>
            <p className="mb-4">Your email has been verified successfully.</p>
            <button
              onClick={() => navigate("/login")}
              className="bg-green-500 text-black px-6 py-2 rounded-full font-bold hover:bg-green-400"
            >
                 Go to Login
            </button>
          </>
        )}

        {isError && (
          <>
            <p className="text-2xl text-red-500 mb-4">✗ Verification Failed</p>
            <p className="mb-4">{(error as unknown as { response?: { data?: { message?: string } } })?.response?.data?.message || "Invalid or expired token"}</p>
            <button
              onClick={() => navigate("/signup")}
              className="bg-green-500 text-black px-6 py-2 rounded-full font-bold hover:bg-green-400"
            >
              Sign Up Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}