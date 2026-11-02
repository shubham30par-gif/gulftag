import { IManuals, Manuals } from ".";
import { ManualsModel } from "./schema";

/**
 *
 * @param manuals manuals class
 * @returns created manuals
 */
export const saveManuals = async (manuals: Manuals) => {
  const savedManuals = await new ManualsModel(manuals.toJSON()).save();
  return savedManuals;
};
