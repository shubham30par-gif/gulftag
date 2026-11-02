import { PDF } from ".";
import { PdfModel } from "./schema";

/**
 *
 * @param _id
 * @returns relevant pdf
 */
export const getPdfByUrl = async (url: string) => {
  const pdf = await PdfModel.findOne({ pdfURL: url });
  return pdf ? new PDF(pdf) : null;
};
