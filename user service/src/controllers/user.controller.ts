import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import crypto from "crypto";
import { sendOTPEmail } from "../lib/email.js";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    let { username, email, password } = req.body;
    if(!username || !email || !password) {
      return  res.status(400).json({
        message: "Username, email, and password are required",
      });
    }
    // Convert username to lowercase
    
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
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    
    user = new User({
      username: username.toLowerCase(),
      email,
      password: hashedPassword,
      otp,
      otpExpires,
    });
    await user.save();
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

  // Check if OTP exists and hasn't expired
  if (!user.otp || !user.otpExpires) {
    return res.status(400).json({ message: "No OTP requested" });
  }

  if (user.otpExpires < new Date()) {
    return res.status(400).json({ message: "OTP has expired" });
  }

  // Verify OTP
  if (user.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // Mark email as verified and clear OTP
  user.emailVerified = true;
  user.otp = null as any;
  user.otpExpires = null as any;
  await user.save();

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