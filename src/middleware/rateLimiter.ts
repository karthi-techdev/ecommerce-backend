import rateLimit from 'express-rate-limit';
import { NextFunction, Request, Response } from 'express';

// Login rate limiter: 5 attempts per 15 minutes
export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: { 
        status: 'error',
        message: 'Too many login attempts. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// General API rate limiter: 100 requests per minute
export const apiRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: {
        status: 'error',
        message: 'Too many requests. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Track failed login attempts
const loginAttempts = new Map<string, { count: number, lastAttempt: number }>();

export const trackFailedLogins = (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    const currentTime = Date.now();
    const attempt = ip ? loginAttempts.get(ip) : undefined;

    // Reset attempts if more than 15 minutes have passed
    if (attempt && (currentTime - attempt.lastAttempt) > 15 * 60 * 1000) {
        if (ip) {
            loginAttempts.delete(ip);
        }
    }

    next();
};

export const recordFailedLogin = (ip: string) => {
    const attempt = loginAttempts.get(ip) || { count: 0, lastAttempt: Date.now() };
    attempt.count += 1;
    attempt.lastAttempt = Date.now();
    loginAttempts.set(ip, attempt);
};