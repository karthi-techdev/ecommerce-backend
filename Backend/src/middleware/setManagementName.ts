import { Request, Response, NextFunction } from "express";

export const setTestimonialUpload = (req: Request, res: Response, next: NextFunction) => {
  res.locals.managementName = "Testimonial";
  next();
};
export const setCategoryUpload = ( req: Request, res: Response, next: NextFunction) => {
  res.locals.managementName = "categories";
  next();
};
export const setSubCategoryUpload = ( req: Request, res: Response, next: NextFunction) => {
  res.locals.managementName = "subcategories";
  next();
};

export const setBrandUpload = (req: Request, res: Response, next: NextFunction) => {
  res.locals.managementName = "brands";
  next();
};
