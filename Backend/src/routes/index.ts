import { Express } from "express";

import authenticationRoutes from "./authenticationRoutes";
import faqRoutes from "./faqRoutes";
import { authenticate } from "../middleware/authentication";
import categoryRoutes from './categoryRoutes'
import mainCategoryRoutes from './mainCategoryRoutes'
import brandRoutes from './brandRoutes'
import subCategoryRoutes from './subCategoryRoutes'
import adminAuthRoutes from './adminAuthRoutes'
import pageRoutes from "./pageRoutes"
import orderRoutes from "./orderRoutes";
import couponRoutes from "./couponRoutes";
import configRoutes from "./configRoutes";
import productRoutes from "./productRoutes";
import shipmentMethodRoutes from "./shipmentMethodsRouter";
import testimonialRoutes from "./testimonialRoutes";
import blogCategoryRoutes from './blogCategoryRoutes';

import newsLetterRoutes from "./newsLetterRoutes";

export default function registerRoutes(app: Express) {
  app.use("/api/v1/auth", authenticationRoutes);
  app.use("/api/v1/admin/faqs", faqRoutes);
  app.use("/api/v1/admin/categories", categoryRoutes);
  app.use("/api/v1/admin/main-categories", mainCategoryRoutes);
  app.use("/api/v1/admin/brands", brandRoutes);
  app.use("/api/v1/admin/subcategory", subCategoryRoutes);
  app.use("/api/v1/admin/auth", adminAuthRoutes);
  app.use("/api/v1/admin/shipment-methods", shipmentMethodRoutes);
  app.use("/api/v1/admin/coupon", couponRoutes);
  app.use("/api/v1/admin/config", configRoutes);
  app.use("/api/v1/admin/products", productRoutes);
  app.use("/api/v1/admin/page", pageRoutes);
  app.use("/api/v1/admin/orders", orderRoutes);

  app.use('/api/v1/admin/testimonials', testimonialRoutes)
  app.use('/api/v1/admin/blog-category', blogCategoryRoutes);
  
  app.use("/api/v1/newsletters", newsLetterRoutes);
}
