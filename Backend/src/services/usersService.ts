import bcrypt from "bcryptjs";
import {
  findUserByEmail,
  createUser,
  updateUserById,
  
} from "../repositories/usersRepository";
import { IUser } from "../models/usersModel";
import usersModel from "../models/usersModel";


export const registerUser = async (
  email: string,
  password: string,
  username: string,
  loginType: string = "manual"
): Promise<IUser> => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await createUser({
    email,
    password: hashedPassword,
    username, 
    loginType,

  });
};

export const loginUser = async (
  email: string,
  password: string
): Promise<IUser> => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Email not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Incorrect password");
  }

  return user;
};
//for update
export const updateUserProfile = async (
  userId: string,
  firstName: string,
  lastName: string,
  username: string
): Promise<IUser | null> => {
  return await updateUserById(userId, {
    firstName,
    lastName,
    username,
  });
};

//for pasword chnage
export const changeUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await usersModel.findById(userId);

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();

  return user;
};