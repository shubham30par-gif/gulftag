import { ManualsModel } from "./schema";

export const getManuals = async () => {
  const data = await ManualsModel.find().sort({ createdAt: -1 }).lean();
  return data;
};
