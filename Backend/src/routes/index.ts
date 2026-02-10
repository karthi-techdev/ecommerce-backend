import { Express } from "express";

// Routes >
import authenticationRoutes from "./authenticationRoutes";
import faqRoutes from "./faqRoutes";
import { authenticate } from "../middleware/authentication";
import subCategoryRoutes from "./subCategoryRoutes";

export default function registerRoutes(app: Express) {
  app.use("/api/v1/auth", authenticationRoutes);
  app.use("/api/v1/faqs", faqRoutes);
  app.use("/api/v1/subcategory", subCategoryRoutes);
}

