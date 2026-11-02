import { ContactUs } from ".";
import { ContactUsModel } from "./schema";

/**
 *
 * @param contact contact class
 * @returns created contactUs
 */
export const saveContactUs = async (contact: ContactUs) => {
  const savedContact = await new ContactUsModel(contact.toJSON()).save();
  return savedContact;
};
