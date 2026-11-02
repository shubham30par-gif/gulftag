import { ContactUs } from ".";
import { ContactUsModel } from "./schema";

/**
 *
 * @param id contact id
 * @returns updated contactUs
 */
export const updateContactUs = async (contact: ContactUs) => {
  const updatedContact = await ContactUsModel.findByIdAndUpdate(
    contact._id,
    {
      $set: contact,
    },
    { new: true, upsert: true }
  );
  return updatedContact;
};
