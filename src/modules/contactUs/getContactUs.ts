import { ContactUsModel } from "./schema";
import { ContactUs } from "./types";

/**
 *
 * @returns contact record | null
 */
export const getContactUs = async () => {
  const contacts = await ContactUsModel.find().sort({ createdAt: -1 }).lean();
  return contacts;
};
