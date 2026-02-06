import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  role: string;
  playlist: string[];
  emailVerified: boolean;
  authProvider: "email" | "google";
  googleId?: string;
  subscriptionType: "basic" | "premium";
  subscriptionStatus: "active" | "inactive" | "cancelled" | "expired";
  subscriptionEndDate?: Date;
  razorpaySubscriptionId?: string;
  razorpayCustomerId?: string;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: {
      type: String,
      required: function(this: IUser) {
        return this.authProvider === "email";
      },
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: { type: String, default: "user" },
    playlist: [{ type: String, required: true }],
    emailVerified: { type: Boolean, default: false },
    authProvider: { 
      type: String, 
      enum: ["email", "google"], 
      default: "email",
      required: true 
    },
    googleId: { 
      type: String, 
      unique: true, 
      sparse: true // allows null values and ensures uniqueness for non-null values
    },
    subscriptionType: {
      type: String,
      enum: ["basic", "premium"],
      default: "basic",
      required: true
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "inactive", "cancelled", "expired"],
      default: "inactive",
      required: true
    },
    subscriptionEndDate: {
      type: Date,
      default: null
    },
    razorpaySubscriptionId: {
      type: String,
      default: null
    },
    razorpayCustomerId: {
      type: String,
      default: null
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model<IUser>("User", UserSchema);
