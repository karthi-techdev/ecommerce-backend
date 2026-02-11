import express from "express";
import path from 'path';
import registerRoutes from "./routes";
import { setupMiddleware } from "./middleware/setup";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Initialize basic middleware first
setupMiddleware(app);

app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.resolve(__dirname, "../uploads"))
);



// Register routes
registerRoutes(app);






// Centralized error handler
app.use(errorHandler);

export default app;