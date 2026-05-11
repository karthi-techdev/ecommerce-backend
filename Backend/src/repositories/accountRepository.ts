
import AccountModel from "../models/accountModel";

export const createAccount = (data: any) => {
  return AccountModel.create(data);
};

export const getAccountByEmail = (email: string) => {
  return AccountModel.findOne({ email });
};

export const getAccountById = (id: string) => {
  return AccountModel.findById(id);
};