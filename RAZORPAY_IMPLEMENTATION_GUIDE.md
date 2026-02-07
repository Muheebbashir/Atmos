# 🎵 Complete Razorpay Premium Feature Implementation Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [Payment Flow](#payment-flow)
6. [Security Implementation](#security-implementation)

---

## 🎯 Overview

This guide explains the complete implementation of Razorpay payment integration for a premium subscription feature (₹99/month) in a Spotify Clone application.

**What We Built:**
- Premium subscription system with Razorpay payment gateway
- Content access control (premium songs/albums)
- Automatic subscription expiry tracking
- Secure payment verification with HMAC signatures

---

## 💾 Database Schema

### User Model (MongoDB - User Service)

```typescript
// Location: user service/src/models/user.model.ts

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  role: string;
  playlist: string[];
  emailVerified: boolean;
  authProvider: "email" | "google";
  googleId?: string;
  
  // 🆕 PREMIUM SUBSCRIPTION FIELDS
  subscriptionType: "basic" | "premium";      // User's subscription tier
  subscriptionStatus: "active" | "inactive" | "cancelled" | "expired";  // Current status
  subscriptionEndDate?: Date;                 // When subscription expires
  razorpaySubscriptionId?: string;            // Razorpay payment reference
  razorpayCustomerId?: string;                // Customer ID from Razorpay
}
```

**Field Explanations:**

1. **subscriptionType**: 
   - `"basic"` = Free user (default)
   - `"premium"` = Paid subscriber
   
2. **subscriptionStatus**:
   - `"inactive"` = No active subscription (default)
   - `"active"` = Currently subscribed
   - `"cancelled"` = User cancelled (keeps access until end date)
   - `"expired"` = Subscription period ended
   
3. **subscriptionEndDate**: 
   - Exact date/time when premium expires
   - Used to check if user still has access
   
4. **razorpaySubscriptionId**: 
   - Stores payment order ID from Razorpay
   - Used for payment tracking and disputes
   
5. **razorpayCustomerId**: 
   - Payment ID from successful transaction
   - Links user to Razorpay transaction

### Songs & Albums (PostgreSQL - Song Service)

```sql
-- Songs table
ALTER TABLE songs 
ADD COLUMN isPremium BOOLEAN DEFAULT FALSE;

-- Albums table  
ALTER TABLE albums 
ADD COLUMN isPremium BOOLEAN DEFAULT FALSE;
```

**Why two tables?**
- Songs have individual premium status
- Albums have separate premium status
- Allows flexibility: premium songs in free albums, vice versa

---

## 🔧 Backend Implementation

### Step 1: Install Razorpay SDK

```bash
cd "user service"
npm install razorpay
```

### Step 2: Payment Controller

**Location:** `user service/src/controllers/payment.controller.ts`

#### 2.1 Razorpay Instance (Lazy Loading)

```typescript
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  
  // ✅ Validate credentials exist
  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials not found");
  }
  
  // ✅ Return new instance
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};
```

**Why lazy loading?**
- Environment variables load asynchronously
- Prevents "undefined" errors on server start
- Creates instance only when needed

#### 2.2 Create Subscription Order

```typescript
export const createSubscription = async (req: any, res: Response) => {
  try {
    // 1️⃣ Get authenticated user ID from JWT middleware
    const userId = req.user._id;
    
    // 2️⃣ Fetch complete user data from database
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // 3️⃣ Check if user already has active subscription
    if (
      user.subscriptionStatus === "active" &&
      user.subscriptionEndDate &&
      new Date(user.subscriptionEndDate) > new Date()
    ) {
      res.status(400).json({ message: "You already have an active subscription" });
      return;
    }

    // 4️⃣ Create Razorpay order
    const options = {
      amount: 9900,                    // Amount in PAISE (₹99 = 9900 paise)
      currency: "INR",                 // Indian Rupees
      receipt: `rcpt_${Date.now()}`,   // Unique receipt ID (max 40 chars!)
      notes: {
        userId: userId.toString(),     // Store user reference
        subscriptionType: "premium",
      },
    };

    // 5️⃣ Call Razorpay API
    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create(options);

    // 6️⃣ Send response to frontend
    res.status(200).json({
      success: true,
      order,                               // Full order object
      key_id: process.env.RAZORPAY_KEY_ID, // Public key (safe to expose)
    });
  } catch (error: any) {
    console.error("Create subscription error:", error);
    res.status(500).json({ message: "Failed to create subscription order" });
  }
};
```

**Line-by-line breakdown:**

- **Line 4**: `req.user._id` comes from JWT authentication middleware
- **Line 7**: Fetch user to check current subscription status
- **Line 13-19**: Prevent duplicate subscriptions (business logic)
- **Line 22**: `amount: 9900` = ₹99.00 (Razorpay uses smallest currency unit)
- **Line 24**: Receipt must be unique and ≤40 characters (Razorpay requirement)
- **Line 25-28**: Notes are metadata stored with order
- **Line 32**: Create order on Razorpay servers
- **Line 36**: `key_id` is PUBLIC, safe to send to frontend

#### 2.3 Verify Payment (CRITICAL for Security!)

```typescript
export const verifyPayment = async (req: any, res: Response) => {
  try {
    // 1️⃣ Extract payment data from Razorpay callback
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user._id;

    // 2️⃣ Generate signature to verify authenticity
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    // 3️⃣ Compare signatures
    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      res.status(400).json({ success: false, message: "Invalid payment signature" });
      return;
    }

    // 4️⃣ Payment verified! Calculate expiry date
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1); // +1 month

    // 5️⃣ Update user to premium
    const user = await User.findByIdAndUpdate(
      userId,
      {
        subscriptionType: "premium",
        subscriptionStatus: "active",
        subscriptionEndDate,
        razorpayCustomerId: razorpay_payment_id,
      },
      { new: true }  // Return updated document
    ).select('-password'); // Never send password

    // 6️⃣ Respond with success
    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      user,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};
```

**Critical Security Explanation:**

**Why signature verification?**
- Prevents fake payment confirmations
- Anyone could call this endpoint with fake payment IDs
- Signature proves request came from Razorpay

**How HMAC works:**
1. Combine `order_id + "|" + payment_id`
2. Hash it with your SECRET key using SHA256
3. Compare with signature Razorpay sent
4. If match = legitimate payment ✅
5. If different = fraud attempt ❌

**Why this is secure:**
- Only Razorpay and your server know the SECRET
- Cannot be forged without the secret key
- Standard cryptographic verification

#### 2.4 Get Subscription Status

```typescript
export const getSubscriptionStatus = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if subscription expired
    const isExpired = user.subscriptionEndDate && 
                      new Date(user.subscriptionEndDate) < new Date();
    
    if (isExpired && user.subscriptionStatus === "active") {
      // Auto-update to expired
      user.subscriptionStatus = "expired";
      user.subscriptionType = "basic";
      await user.save();
    }

    res.status(200).json({
      subscriptionType: user.subscriptionType,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionEndDate: user.subscriptionEndDate,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch subscription status" });
  }
};
```

**Purpose:**
- Check current subscription state
- Auto-expire old subscriptions
- Frontend uses this to show premium badge

#### 2.5 Cancel Subscription

```typescript
export const cancelSubscription = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user || user.subscriptionStatus !== "active") {
      res.status(400).json({ message: "No active subscription found" });
      return;
    }

    // Mark as cancelled but keep access until end date
    user.subscriptionStatus = "cancelled";
    await user.save();

    res.status(200).json({
      success: true,
      message: "Subscription cancelled. You'll have access until " + 
               user.subscriptionEndDate?.toLocaleDateString(),
      user: { ...user.toObject(), password: undefined },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to cancel subscription" });
  }
};
```

**Business Logic:**
- Sets status to "cancelled"
- User keeps access until end date (fair policy)
- Won't auto-renew

### Step 3: Payment Routes

**Location:** `user service/src/routes/payment.route.ts`

```typescript
import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createSubscription,
  verifyPayment,
  getSubscriptionStatus,
  cancelSubscription,
} from "../controllers/payment.controller.js";

const router = express.Router();

// All routes require authentication (JWT token)
router.post("/create-subscription", verifyJWT, createSubscription);
router.post("/verify-payment", verifyJWT, verifyPayment);
router.get("/subscription-status", verifyJWT, getSubscriptionStatus);
router.post("/cancel-subscription", verifyJWT, cancelSubscription);

export default router;
```

**Why verifyJWT?**
- Only logged-in users can subscribe
- Gets user ID from token (req.user._id)
- Prevents anonymous payments

### Step 4: Register Routes

**Location:** `user service/src/index.ts`

```typescript
import paymentRoutes from './routes/payment.route.js';

app.use('/api/payment', paymentRoutes);
```

---

## 🎨 Frontend Implementation

### Step 1: Pricing Page Component

**Location:** `frontend/src/pages/Pricing.tsx`

#### 1.1 Load Razorpay Script

```typescript
useEffect(() => {
  // Load Razorpay checkout script dynamically
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);

  // Cleanup: remove script when component unmounts
  return () => {
    document.body.removeChild(script);
  };
}, []);
```

**Why?**
- Razorpay requires their JavaScript library
- Loaded dynamically to avoid blocking page load
- Cleanup prevents memory leaks

#### 1.2 Handle Subscribe Click

```typescript
const handleSubscribe = async () => {
  // 1️⃣ Check if user is logged in
  if (!authUser) {
    navigate("/login");
    return;
  }

  setLoading(true);

  try {
    // 2️⃣ Call backend to create order
    const { data } = await axios.post(
      "http://localhost:3000/api/payment/create-subscription",
      {},  // Empty body
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // 3️⃣ Configure Razorpay checkout options
    const options = {
      key: data.key_id,                    // Your Razorpay public key
      amount: data.order.amount,           // Amount in paise
      currency: data.order.currency,       // INR
      name: "Spotify Clone Premium",
      description: "Monthly Premium Subscription",
      order_id: data.order.id,             // Order ID from backend
      
      // 4️⃣ Success handler (called after payment)
      handler: async function (response: unknown) {
        try {
          // Verify payment on backend
          const verifyResponse = await axios.post(
            "http://localhost:3000/api/payment/verify-payment",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (verifyResponse.data.success) {
            alert("Payment successful! You are now a premium user.");
            window.location.href = "/"; // Refresh to update user state
          }
        } catch (error: unknown) {
          console.error("Payment verification error:", error);
          alert("Payment verification failed. Please contact support.");
        }
      },
      
      // 5️⃣ Pre-fill customer details
      prefill: {
        name: authUser?.username || "",
        email: authUser?.email || "",
      },
      
      // 6️⃣ Styling
      theme: {
        color: "#1DB954", // Spotify green
      },
      
      // 7️⃣ Modal close handler
      modal: {
        ondismiss: function () {
          setLoading(false);
        },
      },
    };

    // 8️⃣ Open Razorpay checkout
    const rzp = new window.Razorpay(options);
    
    // 9️⃣ Handle payment failure
    rzp.on("payment.failed", function (response: unknown) {
      alert("Payment failed: " + response.error?.description);
      setLoading(false);
    });

    rzp.open();
    setLoading(false);
  } catch (error: unknown) {
    console.error("Subscription error:", error);
    alert(error.response?.data?.message || "Failed to create subscription");
    setLoading(false);
  }
};
```

**Flow Explanation:**

1. **Check Authentication**: Redirect to login if not logged in
2. **Create Order**: Backend creates Razorpay order
3. **Configure Checkout**: Set up payment modal options
4. **Success Handler**: Called AFTER successful payment
   - Sends payment details to backend for verification
   - Backend verifies signature and updates user
5. **Pre-fill**: Auto-fills user's name/email
6. **Styling**: Match your app's theme
7. **Dismiss Handler**: User closes modal without paying
8. **Open Modal**: Shows Razorpay payment interface
9. **Failure Handler**: Payment declined/failed

---

## 🔒 Security Implementation

### 1. CORS Protection

**Before (VULNERABLE):**
```typescript
app.use(cors({ origin: '*' })); // ❌ ANY website can access
```

**After (SECURE):**
```typescript
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
})); // ✅ Only your frontend can access
```

### 2. Environment Variables

**Never expose in code:**
```env
# .env (NEVER commit to git!)
RAZORPAY_KEY_ID=rzp_test_SCQLOoOmVvBChs      # Public - OK to expose
RAZORPAY_KEY_SECRET=6TJkb3mYEzSe7Ydj5oznxXao  # Private - NEVER expose!
```

### 3. Password Exclusion

**Always exclude password from responses:**
```typescript
const user = await User.findById(userId).select('-password');
```

---

## 🔄 Complete Payment Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. Click "Subscribe" button
       ▼
┌─────────────────────────────────┐
│  Frontend (Pricing.tsx)         │
│  - handleSubscribe() triggered  │
└──────┬──────────────────────────┘
       │ 2. POST /api/payment/create-subscription
       │    Headers: { Authorization: Bearer <token> }
       ▼
┌─────────────────────────────────────────┐
│  Backend (payment.controller.ts)        │
│  - verifyJWT middleware extracts user   │
│  - createSubscription() called          │
│  - Check if already premium             │
│  - Create Razorpay order                │
└──────┬──────────────────────────────────┘
       │ 3. Call Razorpay API
       ▼
┌─────────────────┐
│  Razorpay API   │
│  - Creates order│
└──────┬──────────┘
       │ 4. Return order object
       ▼
┌─────────────────────────────────────────┐
│  Backend Response                       │
│  { order: {...}, key_id: "rzp_test..." }│
└──────┬──────────────────────────────────┘
       │ 5. Send to frontend
       ▼
┌─────────────────────────────────────────┐
│  Frontend                               │
│  - Receive order data                   │
│  - new Razorpay(options)                │
│  - rzp.open() - Opens payment modal     │
└──────┬──────────────────────────────────┘
       │ 6. User enters card details
       ▼
┌──────────────────────┐
│  Razorpay Checkout   │ <-- Secure payment page
│  - User pays ₹99     │
└──────┬───────────────┘
       │ 7. Payment processed
       │    Returns: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
       ▼
┌─────────────────────────────────────────┐
│  Frontend handler() callback            │
│  - Receive payment response             │
│  - POST /api/payment/verify-payment     │
└──────┬──────────────────────────────────┘
       │ 8. Send payment details for verification
       ▼
┌─────────────────────────────────────────┐
│  Backend (verifyPayment)                │
│  - Generate HMAC signature              │
│  - Compare with Razorpay signature      │
│  - If match: Update user to premium     │
│  - subscriptionType = "premium"         │
│  - subscriptionStatus = "active"        │
│  - subscriptionEndDate = now + 1 month  │
└──────┬──────────────────────────────────┘
       │ 9. Return success response
       ▼
┌─────────────────────────────────────────┐
│  Frontend                               │
│  - Show success message                 │
│  - Redirect to home page                │
│  - User now has premium badge           │
└─────────────────────────────────────────┘
```

---

## 🎯 Content Access Control

### Check if User is Premium

```typescript
// Frontend: Check subscription status
const isPremiumUser = authUser?.subscriptionType === "premium" && 
                      authUser?.subscriptionStatus === "active" &&
                      authUser?.subscriptionEndDate &&
                      new Date(authUser.subscriptionEndDate) > new Date();
```

**Three conditions must be true:**
1. `subscriptionType === "premium"` - User paid
2. `subscriptionStatus === "active"` - Not cancelled/expired
3. `subscriptionEndDate > now` - Still within valid period

### Block Premium Content

```typescript
// In Songs.tsx, Albums.tsx, etc.
const handlePlay = (song: Song) => {
  if (song.isPremium && !isPremiumUser) {
    toast.error("This is a premium song. Please upgrade to listen.");
    navigate("/pricing");
    return;
  }
  
  // Play song...
};
```

### Backend Protection (Add to Playlist)

```typescript
// Backend: Check song is premium
const songResponse = await fetch(`http://localhost:8000/api/v1/song/${songId}`);
const song = await songResponse.json();

if (song.isPremium) {
  const isPremiumUser = user.subscriptionType === "premium" && 
                       user.subscriptionStatus === "active" &&
                       user.subscriptionEndDate &&
                       new Date(user.subscriptionEndDate) > new Date();
  
  if (!isPremiumUser) {
    return res.status(403).json({ 
      message: "Premium subscription required",
      requiresPremium: true
    });
  }
}
```

---

## 📊 Database Column Case Conversion

**Problem:** PostgreSQL returns lowercase (`ispremium`), but TypeScript expects camelCase (`isPremium`)

**Solution:** Transform in API response

```typescript
// In song.controller.ts
const songs = await sql`SELECT * FROM songs`;

// Convert to camelCase
const songsWithCamelCase = songs.map(song => ({
  ...song,
  isPremium: song.ispremium ?? false
}));

res.status(200).json(songsWithCamelCase);
```

---

## 🚀 Testing Guide

### 1. Test Card Details (Razorpay Test Mode)

```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
Name: Any name
```

### 2. Test Flow

1. ✅ Create admin account
2. ✅ Create premium song/album (check "Mark as Premium")
3. ✅ Logout, create basic user account
4. ✅ Try to play premium song → Should redirect to pricing
5. ✅ Click "Subscribe" → Razorpay modal opens
6. ✅ Enter test card details → Payment success
7. ✅ Premium badge appears on navbar
8. ✅ Can now play premium songs

### 3. Database Verification

```javascript
// MongoDB (User Service)
db.users.findOne({ email: "test@example.com" })

// Should show:
{
  subscriptionType: "premium",
  subscriptionStatus: "active",
  subscriptionEndDate: ISODate("2026-03-06T..."),
  razorpayCustomerId: "pay_..."
}
```

---

## ❗ Common Issues & Solutions

### Issue 1: "Cannot read properties of undefined (reading 'name')"
**Cause:** Backend doesn't send user data anymore  
**Fix:** Use `authUser` from frontend state instead of `data.user`

### Issue 2: "Receipt length must be ≤40 characters"
**Cause:** Receipt string too long  
**Fix:** Use `rcpt_${Date.now()}` instead of `receipt_${userId}_${Date.now()}`

### Issue 3: "CORS error"
**Cause:** Backend blocks frontend origin  
**Fix:** Set `FRONTEND_URL=http://localhost:5173` in .env

### Issue 4: "Environment variables undefined"
**Cause:** Loading Razorpay at module level  
**Fix:** Use lazy loading with `getRazorpayInstance()`

### Issue 5: Premium songs not showing badges
**Cause:** Redis cache has old data without isPremium  
**Fix:** Clear cache or wait for TTL expiry

---

## 🎓 Key Learnings

1. **Always verify payments server-side** - Never trust frontend
2. **Use HMAC signatures** - Prevents payment fraud
3. **Store subscription end dates** - Easy expiry checks
4. **Lazy load SDK instances** - Prevents initialization errors
5. **Cache with caution** - Clear when schema changes
6. **Secure CORS** - Only allow your frontend
7. **Never expose secrets** - Use environment variables
8. **Test with test cards** - Never use real cards in development

---

## 📝 Deployment Checklist

- [ ] Switch to Razorpay LIVE keys (not test keys)
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Enable HTTPS (required for payment gateways)
- [ ] Set up proper error logging
- [ ] Add webhook handlers for auto-renewal
- [ ] Test subscription expiry logic
- [ ] Set up monitoring alerts
- [ ] Create refund policy/UI
- [ ] Add invoice generation
- [ ] Implement email notifications

---

**Congratulations!** 🎉 You now have a fully functional premium subscription system with Razorpay integration!
