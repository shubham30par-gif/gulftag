import { User } from ".";
import { UserModel } from "./schema";

/**
 *
 * @param _id user id
 * @returns relevant user record | null
 */
export const getPopulatedUser = async (_id: string) => {
  const user = await UserModel.findById(_id, { password: 0 })
    .populate({ path: "blogIds" })
    .populate({ path: "profileImage" });
  return user ? new User(user) : null;
};
