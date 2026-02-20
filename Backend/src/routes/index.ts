import { Express } from "express";

import authenticationRoutes from "./authenticationRoutes";
import faqRoutes from "./faqRoutes";
import { authenticate } from "../middleware/authentication";
import categoryRoutes from './categoryRoutes'
import mainCategoryRoutes from './mainCategoryRoutes'
import brandRoutes from './brandRoutes'
import subCategoryRoutes from './subCategoryRoutes'
import adminAuthRoutes from './adminAuthRoutes'
import couponRoutes from './couponRoutes'
import configRoutes from './configRoutes';
import productRoutes from './productRoutes'
import pageRoutes from "./pageRoutes"
import testimonialRoutes from "./testimonialRoutes";

export default function registerRoutes(app: Express) {
  app.use("/api/v1/auth", authenticationRoutes);
  app.use("/api/v1/faqs", faqRoutes);
  app.use("/api/v1/admin/categories", categoryRoutes);
  app.use("/api/v1/admin/main-categories", mainCategoryRoutes);
  app.use("/api/v1/brands", brandRoutes);
  app.use("/api/v1/admin/subcategory", subCategoryRoutes);
  app.use("/api/v1/admin/auth", adminAuthRoutes);
  app.use("/api/v1/admin/coupon", couponRoutes);
  app.use("/api/v1/admin/config",configRoutes);
  app.use('/api/v1/admin/products', productRoutes);
  app.use("/api/v1/admin/page", pageRoutes);
  app.use('/api/v1/admin/testimonials', testimonialRoutes)

}

