import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { sendOTPEmail } from "../lib/email.js";
import { saveOTP, getOTP, deleteOTP, incrementAttempts, deleteAttempts, blockUser, isUserBlocked } from "../lib/redis.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    let { username, email, password } = req.body;
    if(!username || !email || !password) {
      return  res.status(400).json({
        message: "Username, email, and password are required",
      });
    }
    
    // Convert email to lowercase
    email = email && typeof email === "string" ? email.toLowerCase() : "";

    // Email regex validation
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/i;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      // If user exists but email not verified, delete old account and allow fresh registration
      if (!user.emailVerified) {
        await User.deleteOne({ _id: user._id });
      } else {
        // User exists and is verified
        return res.status(400).json({
          message: "Email already registered. Please log in.",
        });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    user = new User({
      username: username.toLowerCase(),
      email,
      password: hashedPassword,
    });
    await user.save();

    // Save OTP to Redis (10 minutes expiry)
    await saveOTP(`otp:${user._id}`, otp, 10);

    try {
      // Send OTP email
      await sendOTPEmail(email, otp);
    } catch (error) {
      console.error("Failed to send OTP email:", error);
      return res.status(500).json({
        message: "Failed to send verification code",
      });
    }

    // Return user without password (not verified yet)
    const userWithoutPassword = await User.findById(user._id).select('-password');
    res.status(201).json({
      message: "User registered successfully. Please verify with OTP sent to your email.",
      user: userWithoutPassword,
      userId: user._id,
    });
  },
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if(!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    const user = await User.findOne({ email }).select('+password');
    if(!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(400).json({
        message: "Please verify your email first. Check your inbox for the verification code.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
        { expiresIn: "1d" },
    );
    // Fetch user without password for response
    const userWithoutPassword = await User.findById(user._id).select('-password');
    res.status(200).json({
      message: "User logged in successfully",
      user: userWithoutPassword,
      token,
    });
}); 

export const getUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
        message: "User profile fetched successfully",
        user,
    });
});

export const addToPlaylist = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId= req.user?._id;
  const user= await User.findById(userId);
  if(!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if(user?.playlist.includes(req.params.id as string)) {
    const index= user.playlist.indexOf(req.params.id as string);
    user.playlist.splice(index,1);
    await user.save();
    return res.status(200).json({
      message: "Song removed from playlist",
      playlist: user.playlist,
    });
  }
  user.playlist.push(req.params.id as string);
  await user.save();
  res.status(200).json({
    message: "Song added to playlist",
    playlist: user.playlist,
  });
});

export const getUserPlaylist = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId= req.user?._id;
  const user= await User.findById(userId);
  if(!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({
    message: "User playlist fetched successfully",
    playlist: user.playlist,
  });
});

export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  const { userId, otp } = req.body;
  
  if (!userId || !otp) {
    return res.status(400).json({ message: "User ID and OTP are required" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if user is blocked
  const isBlocked = await isUserBlocked(`otpBlock:${userId}`);
  if (isBlocked) {
    return res.status(429).json({ message: "Too many failed attempts. Try again later." });
  }

  // Get OTP from Redis
  const storedOtp = await getOTP(`otp:${userId}`);
  if (!storedOtp) {
    return res.status(400).json({ message: "OTP has expired or not requested" });
  }

  // Verify OTP
  if (storedOtp !== otp) {
    // Increment failed attempts
    const attempts = await incrementAttempts(`otpAttempt:${userId}`);
    
    if (attempts >= 3) {
      // Block user for 15 minutes
      await blockUser(`otpBlock:${userId}`, 15);
      await deleteAttempts(`otpAttempt:${userId}`);
      return res.status(429).json({ 
        message: "Too many failed attempts. Try again in 15 minutes.",
        attemptsLeft: 0
      });
    }
    
    return res.status(400).json({ 
      message: "Invalid OTP",
      attemptsLeft: 3 - attempts
    });
  }

  // Mark email as verified and clear OTP from Redis
  user.emailVerified = true;
  await user.save();
  await deleteOTP(`otp:${userId}`);
  await deleteAttempts(`otpAttempt:${userId}`);

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );

  const userWithoutPassword = await User.findById(user._id).select('-password');
  res.status(200).json({
    message: "Email verified successfully",
    user: userWithoutPassword,
    token,
  });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  
  // Prevent password reset for Google OAuth users
  if (user.authProvider === "google") {
    return res.status(400).json({ 
      message: "This account uses Google Sign-In. Please login with Google.",
      authProvider: "google"
    });
  }
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Save OTP to Redis (10 minutes expiry)
  await saveOTP(`resetOtp:${user._id}`, otp, 10);

  try {
    // Send OTP email
    await sendOTPEmail(email, otp);
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    return res.status(500).json({
      message: "Failed to send password reset code",
    });
  }
  res.status(200).json({
    message: "Password reset code sent to your email",
    userId: user._id,
  });
});

export const verifyResetOtp= asyncHandler(async (req: Request, res: Response) => {
  const { userId, otp } = req.body;
  if (!userId || !otp) {
    return res.status(400).json({ message: "User ID and OTP are required" });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if user is blocked
  const isBlocked = await isUserBlocked(`resetOtpBlock:${userId}`);
  if (isBlocked) {
    return res.status(429).json({ message: "Too many failed attempts. Try again later." });
  }

  // Get OTP from Redis
  const storedOtp = await getOTP(`resetOtp:${userId}`);
  if (!storedOtp) {
    return res.status(400).json({ message: "OTP has expired or not requested" });
  }

  // Verify OTP
  if (storedOtp !== otp) {
    // Increment failed attempts
    const attempts = await incrementAttempts(`resetOtpAttempt:${userId}`);
    
    if (attempts >= 3) {
      // Block user for 15 minutes
      await blockUser(`resetOtpBlock:${userId}`, 15);
      await deleteAttempts(`resetOtpAttempt:${userId}`);
      return res.status(429).json({ message: "Too many failed attempts. Try again in 15 minutes." });
    }
    
    return res.status(400).json({ 
      message: "Invalid OTP",
      attemptsLeft: 3 - attempts
    });
  }

  // Clear OTP from Redis (user can now reset password)
  await deleteOTP(`resetOtp:${userId}`);
  await deleteAttempts(`resetOtpAttempt:${userId}`);

  res.status(200).json({
    message: "OTP verified successfully",
  });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { userId, newPassword } = req.body;
  if (!userId || !newPassword) {
    return res.status(400).json({ message: "User ID and new password are required" });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  
  // Prevent password reset for Google OAuth users
  if (user.authProvider === "google") {
    return res.status(400).json({ 
      message: "This account uses Google Sign-In. Password reset is not available.",
      authProvider: "google"
    });
  }
  
  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  res.status(200).json({
    message: "Password reset successfully",
  });
});

export const googleAuth = asyncHandler(async (req: Request, res: Response) => {
  const { credential } = req.body;
  
  if (!credential) {
    return res.status(400).json({ message: "Google credential is required" });
  }

  try {
    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    const { email, sub: googleId, name, email_verified } = payload;
    const normalizedEmail = email.toLowerCase();

    // Check if user exists
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      // User exists - check auth provider
      if (user.authProvider === "email") {
        // Email user trying to login with Google - reject
        return res.status(400).json({
          message: "Email already registered with email/password. Please login with your email and password.",
          authProvider: "email"
        });
      } else if (user.authProvider === "google") {
        // Existing Google user - normal login
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET as string,
          { expiresIn: "1d" }
        );
        
        const userWithoutPassword = await User.findById(user._id).select('-password');
        return res.status(200).json({
          message: "Logged in successfully with Google",
          user: userWithoutPassword,
          token,
        });
      }
    }

    // New user - create account
    const username = name?.toLowerCase().replace(/\s+/g, '') || email.split('@')[0];
    
    user = new User({
      username,
      email: normalizedEmail,
      authProvider: "google",
      googleId,
      emailVerified: true, // Google already verified
    });
    
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    const userWithoutPassword = await User.findById(user._id).select('-password');
    return res.status(201).json({
      message: "Account created successfully with Google",
      user: userWithoutPassword,
      token,
    });
    
  } catch (error: any) {
    console.error("Google auth error:", error);
    return res.status(500).json({ 
      message: "Failed to authenticate with Google",
      error: error.message 
    });
  }
});