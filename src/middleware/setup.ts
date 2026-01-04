import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { generateCSRFToken } from './csrf';
import { authenticate } from './authentication';

export const setupMiddleware = (app: Express) => {
  // Security middleware
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));
  
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  }));

  // CSRF Protection
  app.use(generateCSRFToken);

  // Performance middleware
  app.use(compression());
  app.disable('x-powered-by');
  
  // Parse request bodies
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Development logging
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Rate limiting
  // const limiter = rateLimit({
  //   windowMs: 15 * 60 * 1000, // 15 minutes
  //   max: 100, // limit each IP to 100 requests per windowMs
  //   standardHeaders: true,
  //   legacyHeaders: false
  // });

  // app.use('/api/', limiter);
  // app.use('/api/');
};