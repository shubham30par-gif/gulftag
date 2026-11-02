import { Schema, model, Types } from "mongoose";
import { IUser } from "../types/user";

const user = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    profileImage: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    password: {
      type: String,
      default: "",
    },

    userType: {
      type: String,
      required: false,
    },

    blogIds: [
      {
        type: Schema.Types.ObjectId,
        required: false,
      },
    ],
    email: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("users", user);
