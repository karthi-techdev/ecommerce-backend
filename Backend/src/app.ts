import express from "express";
import path from 'path';
import { errorHandler } from "./middleware/errorHandler";
import { setupMiddleware } from "./middleware/setup";
import registerRoutes from "./routes";


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