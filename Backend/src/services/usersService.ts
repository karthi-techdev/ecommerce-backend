import bcrypt from "bcryptjs";
import {
  findUserByEmail,
  createUser,
} from "../repositories/usersRepository";
import { IUser } from "../models/usersModel";

export const registerUser = async (
  email: string,
  password: string,
  username: string
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