import { useState, useEffect } from "react";
import { createSubscription, verifyPayment } from "../api/paymentApi";
import { toast } from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: new (options: unknown) => {
      open(): void;
      on(event: string, callback: (response: unknown) => void): void;
    };
  }
}

export const useSubscribe = () => {
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

  const subscribe = async (token: string, userName: string, userEmail: string) => {
    setLoading(true);

    try {
      // Create subscription order
      const data = await createSubscription(token);

      const options = {
        key: data.key_id,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Atmos Premium",
        description: "Monthly Premium Subscription",
        order_id: data.order.id,
        handler: async function (response: unknown) {
          try {
            // Verify payment on backend
            const verifyResponse = await verifyPayment(
              token,
              (response as { razorpay_order_id: string }).razorpay_order_id,
              (response as { razorpay_payment_id: string }).razorpay_payment_id,
              (response as { razorpay_signature: string }).razorpay_signature
            );

            if (verifyResponse.success) {
              toast.success("🎉 Payment successful! You are now a premium user.");
              setTimeout(() => {
                window.location.href = "/";
              }, 1500);
            }
          } catch (error: unknown) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
        },
        notes: {
          address: "Atmos",
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

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: unknown) {
        toast.error(
          "Payment failed: " +
            (response as { error?: { description?: string } }).error?.description
        );
        setLoading(false);
      });

      rzp.open();
      setLoading(false);
    } catch (error: unknown) {
      console.error("Subscription error:", error);
      toast.error(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to create subscription"
      );
      setLoading(false);
    }
  };

  return {
    subscribe,
    isLoading: loading,
  };
};
