import { Types } from "mongoose";
import { ManualsModel } from "./schema";
import { Manuals } from "./types";

export const updateManual = async (manual: Manuals) => {
  const updated = await ManualsModel.findByIdAndUpdate(
    new Types.ObjectId(manual._id),
    { $set: { ...(manual.toJSON?.() ?? manual) } }, // safely spread only plain data
    {
      new: true,
    }
  );
  return updated;
};
