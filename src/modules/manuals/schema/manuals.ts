import { Schema, model, Types } from "mongoose";
import { IManuals } from "..";

const manuals = new Schema<IManuals>(
  {
    title: {
      type: String,
      required: false,
    },
    language: {
      type: String,
      required: false,
    },
    pdfId: {
      type: Schema.Types.ObjectId,
      ref: "pdf",
      required: false,
    },
    arabianTitle: {
      type: String,
      required: false,
    },
    arabianSubCategory: {
      type: String,
      required: false,
    },
    arabianType: {
      type: String,
      required: false,
    },
    subCategory: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },
    pdfURL: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      default: "",
      enum: ["indoor", "outdoor", "airbunkers", "vionvr"],
    },
  },
  { timestamps: true }
);

export const ManualsModel = model<IManuals>("manuals", manuals);
