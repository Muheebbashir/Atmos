import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";
import axios from "axios";

declare global {
  interface Window {
    Razorpay: unknown;
  }
}

const Pricing = () => {
  const navigate = useNavigate();
  const { user: authUser, isLoading } = useAuthUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubscribe = async () => {
    if (!authUser) {
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      // Create subscription order
      const { data } = await axios.post(
        "http://localhost:3000/api/payment/create-subscription",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const options = {
        key: data.key_id,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Spotify Clone Premium",
        description: "Monthly Premium Subscription",
        order_id: data.order.id,
        handler: async function (response: unknown) {
          try {
            // Verify payment on backend
            const verifyResponse = await axios.post(
              "http://localhost:3000/api/payment/verify-payment",
              {
                razorpay_order_id: (response as { razorpay_order_id: string }).razorpay_order_id,
                razorpay_payment_id: (response as { razorpay_payment_id: string }).razorpay_payment_id,
                razorpay_signature: (response as { razorpay_signature: string }).razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (verifyResponse.data.success) {
              alert("Payment successful! You are now a premium user.");
              window.location.href = "/"; // Refresh to update user data
            }
          } catch (error: unknown) {
            console.error("Payment verification error:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: data.user.name,
          email: data.user.email,
        },
        notes: {
          address: "Spotify Clone",
        },
        theme: {
          color: "#1DB954",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new (window.Razorpay as new (options: unknown) => {
        open(): void;
        on(event: string, callback: (response: unknown) => void): void;
      })(options);
      rzp.on("payment.failed", function (response: unknown) {
        alert("Payment failed: " + (response as { error?: { description?: string } }).error?.description);
        setLoading(false);
      });

      rzp.open();
      setLoading(false);
    } catch (error: unknown) {
      console.error("Subscription error:", error);
      alert((error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to create subscription");
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your premium subscription?")) {
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.delete(
        "http://localhost:3000/api/payment/cancel-subscription",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        alert(data.message);
        window.location.href = "/"; // Refresh to update user data
      }
    } catch (error: unknown) {
      console.error("Cancel subscription error:", error);
      alert((error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to cancel subscription");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const isActive =
    authUser?.subscriptionStatus === "active" &&
    authUser?.subscriptionEndDate &&
    new Date(authUser.subscriptionEndDate) > new Date();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Choose Your Music Plan
        </h1>
        <p className="text-gray-400 text-center mb-12">
          Unlock premium features and enjoy unlimited music
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Basic</h2>
              <div className="text-4xl font-bold mb-2">Free</div>
              <p className="text-gray-400">Forever</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Access to free songs and albums</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Create playlists</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Basic audio quality</span>
              </li>
              <li className="flex items-start opacity-50">
                <svg
                  className="w-6 h-6 text-red-500 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span>No access to premium content</span>
              </li>
            </ul>

            {authUser?.subscriptionType === "basic" && (
              <div className="text-center py-3 bg-gray-700 rounded-lg font-semibold">
                Current Plan
              </div>
            )}
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-8 border-2 border-green-500 relative transform md:scale-105 shadow-2xl">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold">
              POPULAR
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Premium</h2>
              <div className="text-4xl font-bold mb-2">₹99</div>
              <p className="text-green-100">per month</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-white mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="font-semibold">Everything in Basic</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-white mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="font-semibold">Access to ALL premium songs and albums</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-white mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="font-semibold">High quality audio</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-white mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="font-semibold">Unlimited listening</span>
              </li>
            </ul>

            {isActive ? (
              <div className="space-y-3">
                <div className="text-center py-3 bg-white text-green-800 rounded-lg font-bold">
                  Active Premium Member
                </div>
                {authUser?.subscriptionEndDate && (
                  <p className="text-center text-sm text-green-100">
                    Renews on {new Date(authUser.subscriptionEndDate).toLocaleDateString()}
                  </p>
                )}
                <button
                  onClick={handleCancelSubscription}
                  disabled={loading}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Cancel Subscription"}
                </button>
              </div>
            ) : (
              <button
                onClick={handleSubscribe}
                disabled={loading || !authUser}
                className="w-full py-3 bg-white text-green-800 rounded-lg font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : authUser ? "Get Premium" : "Login to Subscribe"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-6">Payment Methods Supported</h3>
          <div className="flex flex-wrap justify-center gap-6 text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
              </svg>
              <span>Credit/Debit Cards</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
              </svg>
              <span>UPI</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
              </svg>
              <span>Net Banking</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 7.28V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-2.28c.59-.35 1-.98 1-1.72V9c0-.74-.41-1.37-1-1.72zM20 9v6h-7V9h7zM5 19V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2H5z" />
                <circle cx="16" cy="12" r="1.5" />
              </svg>
              <span>Wallets</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
