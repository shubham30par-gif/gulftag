import { Schema, model, Types } from "mongoose";
import { IContactUs } from "..";

const contactUs = new Schema<IContactUs>(
  {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      default: "UNREAD",
      enum: ["READ", "UNREAD", "REPLIED"],
    },
    message: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export const ContactUsModel = model<IContactUs>("contactus", contactUs);
