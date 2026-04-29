
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createAccount,
  getAccountByEmail,
  getAccountById
} from "../repositories/accountRepository";

const SECRET = "SECRET_KEY";

export const registerUser = async (data: any) => {
  const existing = await getAccountByEmail(data.email);

  if (existing) throw new Error("Email already exists");

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return createAccount({
    ...data,
    password: hashedPassword
  });
};

export const loginUser = async (email: string, password: string) => {
  const user = await getAccountByEmail(email);

  if (!user) throw new Error("User not found");

  const match = await bcrypt.compare(password, user.password);

  if (!match) throw new Error("Invalid password");

  const token = jwt.sign({ id: user._id }, SECRET);

  return {
    token,
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await getAccountById(userId);

  if (!user) throw new Error("User not found");

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  };
};