import { Request, Response, NextFunction } from "express";

export const setTestimonialUpload = (req: Request, res: Response, next: NextFunction) => {
  res.locals.managementName = "Testimonial";
  next();
};