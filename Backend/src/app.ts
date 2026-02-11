import express from "express";
import path from "path";
import registerRoutes from "./routes";
import { setupMiddleware } from "./middleware/setup";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Initialize middleware
setupMiddleware(app);

// ✅ Static files FIRST
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);







// ✅ Then routes
registerRoutes(app);

// Error handler last
app.use(errorHandler);

export default app;
