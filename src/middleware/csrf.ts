import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// Interface for requests with CSRF token
interface CSRFRequest extends Request {
    csrfToken?: () => string;
}

// Secret key for signing tokens
const SECRET_KEY = process.env.CSRF_SECRET || crypto.randomBytes(32).toString('hex');

export const generateCSRFToken = (req: CSRFRequest, res: Response, next: NextFunction) => {
    // Generate new token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Add token generator to request object
    req.csrfToken = () => token;

    next();
};

export const validateCSRFToken = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET') {
        return next();
    }

    const token = req.headers['x-csrf-token'];
    
    if (!token) {
        return res.status(403).json({
            status: 'error',
            message: 'CSRF token is missing'
        });
    }

    next();
};