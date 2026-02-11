import { Request, Response, NextFunction } from "express";

export const setSubCategoryUpload = ( req: Request, res: Response, next: NextFunction) => {
  res.locals.managementName = "subcategories";
  next();
};

export const setBrandUpload = (req: Request, res: Response, next: NextFunction) => {
  res.locals.managementName = "brands";
  next();
};
