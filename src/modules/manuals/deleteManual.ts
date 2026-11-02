import { ManualsModel } from "./schema";

export const deleteManual = async (id: string) => {
  const deletedManuls = await ManualsModel.findByIdAndDelete(id);
  return deletedManuls;
};
