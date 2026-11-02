import { ManualsModel } from "./schema";
/**
 *
 * @param id
 * @returns manual
 */
export const getManualById = async (id: string) => {
  const data = await ManualsModel.findById(id).populate("pdfId");
  return data;
};
