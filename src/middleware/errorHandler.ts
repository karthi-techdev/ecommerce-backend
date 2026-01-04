import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/customError';
import { HTTP_STATUS_CODE } from '../utils/httpResponse';

interface ErrorResponse {
    status: string;
    message: string;
    stack?: string;
    errors?: any[];
}

export const errorHandler = (
    err: Error | CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const response: ErrorResponse = {
        status: 'error',
        message: err.message || 'Internal server error'
    };

    // Add stack trace in development environment
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    // Handle custom errors
    if (err instanceof CustomError) {
        res.status(err.statusCode).json(response);
        return;
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
        response.status = 'fail';
        response.message = 'Validation failed';
        response.errors = Object.values(err).map((val: any) => ({
            field: val.path,
            message: val.message
        }));
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(response);
        return;
    }

    // Handle duplicate key errors
    if (err.name === 'MongoServerError' && (err as any).code === 11000) {
        response.status = 'fail';
        response.message = 'Duplicate field value entered';
        res.status(HTTP_STATUS_CODE.CONFLICT).json(response);
        return;
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        response.message = 'Invalid token';
        res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(response);
        return;
    }

    if (err.name === 'TokenExpiredError') {
        response.message = 'Token has expired';
        res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(response);
        return;
    }

    // Log unknown errors
    console.error('Unhandled error:', err);

    // Send generic error response
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(response);
};