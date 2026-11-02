import { PDF } from ".";
import { PdfModel } from "./schema";

/**
 *
 * @param _id
 * @returns relevant pdf
 */

export const getPdfById = async (id: string) => {
  const pdf = await PdfModel.findById(id);
  return pdf ? new PDF(pdf) : null;
};
