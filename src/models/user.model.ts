import { IUser } from "@/types";
import mongoose, { Schema } from "mongoose";

const UserSchema: Schema<IUser> = new mongoose.Schema<IUser>(
  {
    firstname: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
    },
    lastname: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      maxLength: 255,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    accountDisabled: {
      type: Boolean,
      default: false,
    },

    isStaff: {
      type: Boolean,
      default: false,
    },

    isSuperAdmin: {
      type: Boolean,
      default: false,
    },

    lastActive: {
      type: Date,
      default: () => Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
