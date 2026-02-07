import type { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { User } from "../models/user.model.js";

const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials not found in environment variables");
  }
  
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

// Create Subscription Order
export const createSubscription = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if user already has an active subscription
    if (
      user.subscriptionStatus === "active" &&
      user.subscriptionEndDate &&
      new Date(user.subscriptionEndDate) > new Date()
    ) {
      res.status(400).json({ message: "You already have an active subscription" });
      return;
    }

    // Create Razorpay Order
    const options = {
      amount: 9900, // ₹99 in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`, // Shortened receipt format to fit 40 char limit
      notes: {
        userId: userId.toString(),
        subscriptionType: "premium",
      },
    };

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID, // Public key, safe to expose
    });
  } catch (error: any) {
    console.error("Create subscription error:", error);
    res.status(500).json({ message: "Failed to create subscription order" });
  }
};

// Verify Payment and Update User
export const verifyPayment = async (req: any, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user._id;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      res.status(400).json({ success: false, message: "Invalid payment signature" });
      return;
    }

    // Payment is verified, update user subscription
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        subscriptionType: "premium",
        subscriptionStatus: "active",
        subscriptionEndDate,
        razorpayCustomerId: razorpay_payment_id, // Store payment ID for reference
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Payment verified successfully! You are now a premium user.",
      user,
    });
  } catch (error: any) {
    console.error("Verify payment error:", error);
    res.status(500).json({ message: "Failed to verify payment", error: error.message });
  }
};

// Get Subscription Status
export const getSubscriptionStatus = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select(
      "subscriptionType subscriptionStatus subscriptionEndDate"
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if subscription has expired
    if (
      user.subscriptionStatus === "active" &&
      user.subscriptionEndDate &&
      new Date(user.subscriptionEndDate) < new Date()
    ) {
      // Update status to expired
      user.subscriptionStatus = "expired";
      user.subscriptionType = "basic";
      await user.save();
    }

    res.status(200).json({
      success: true,
      subscription: {
        type: user.subscriptionType,
        status: user.subscriptionStatus,
        endDate: user.subscriptionEndDate,
      },
    });
  } catch (error: any) {
    console.error("Get subscription status error:", error);
    res.status(500).json({ message: "Failed to get subscription status", error: error.message });
  }
};


