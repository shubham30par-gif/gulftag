import { Schema, model, Types } from "mongoose";
import { IBlog } from "..";

const blog = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: false,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    blogImage: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export const BlogModel = model<IBlog>("blog", blog);
