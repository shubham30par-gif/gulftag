import { model, Schema } from "mongoose";
import { IImage } from "..";
const image = new Schema<IImage>(
  {
    imageURL: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const ImageModel = model<IImage>("image", image);
