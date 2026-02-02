import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

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
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    // Fetch user without password
    const userWithoutPassword = await User.findById(user._id).select('-password');
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );
    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
      token,
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