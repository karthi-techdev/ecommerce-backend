import express from "express";
import path from 'path';
import registerRoutes from "./routes";
import { setupMiddleware } from "./middleware/setup";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Initialize basic middleware first
setupMiddleware(app);


// Register routes
registerRoutes(app);


app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "../uploads"))
);


// Centralized error handler
app.use(errorHandler);

export default app;