import { ManualsModel } from "./schema";

export const getAllManuals = async () => {
  const data = await ManualsModel.find({ isActive: true })
    .sort({ createdAt: -1 })
    .lean();
  return data;
};
