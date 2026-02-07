import axios from "axios";

const USER_API_URL = import.meta.env.VITE_USER_API_URL || "http://localhost:3000";

const paymentApi = axios.create({
  baseURL: `${USER_API_URL}/api/payment`,
});

export const createSubscription = async (token: string) => {
  const res = await paymentApi.post(
    "/create-subscription",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const verifyPayment = async (
  token: string,
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
) => {
  const res = await paymentApi.post(
    "/verify-payment",
    {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getSubscriptionStatus = async (token: string) => {
  const res = await paymentApi.get("/subscription-status", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
