import usersModel, { IUser } from "../models/usersModel";

export const findUserByEmail = async (
  email: string
): Promise<IUser | null> => {
  return await usersModel.findOne({ email });
};

export const createUser = async (
  data: Partial<IUser>
): Promise<IUser> => {
  return await usersModel.create(data);

};

export const updateUserById = async (
  userId: string,
  data: Partial<IUser>
): Promise<IUser | null> => {
  return await usersModel.findByIdAndUpdate(userId, data, { new: true });
};