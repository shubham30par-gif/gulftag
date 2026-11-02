import { ManualsModel } from "./schema";
/**
 *
 * @param url
 * @returns manual
 */
export const getManualByUrl = async (url: string) => {
  const data = await ManualsModel.findOne({ pdfURL: url });
  return data;
};
