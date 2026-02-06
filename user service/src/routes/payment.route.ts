import { Router } from "express";
import {
  createSubscription,
  verifyPayment,
  getSubscriptionStatus,
  cancelSubscription,
} from "../controllers/payment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// All payment routes require authentication
router.post("/create-subscription", verifyJWT, createSubscription);
router.post("/verify-payment", verifyJWT, verifyPayment);
router.get("/subscription-status", verifyJWT, getSubscriptionStatus);
router.delete("/cancel-subscription", verifyJWT, cancelSubscription);

export default router;
