import express from "express";
import path from 'path';
import { errorHandler } from "./middleware/errorHandler";
import { setupMiddleware } from "./middleware/setup";
import registerRoutes from "./routes";
import testimonialRoutes from "./routes/testimonialRoutes";

const app = express();

// Initialize basic middleware first
setupMiddleware(app);

// Register routes
registerRoutes(app);

app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(path.join(__dirname, '..', 'uploads'))
);

app.use('/api/v1/admin/testimonials', testimonialRoutes)

// Centralized error handler
app.use(errorHandler);

export default app;