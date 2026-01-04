import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { CustomError } from '../utils/customError';
import { HTTP_STATUS_CODE } from '../utils/httpResponse';

export const validateRequest = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errorMessage = error.details
                .map((detail) => detail.message)
                .join(', ');
            throw new CustomError(errorMessage, HTTP_STATUS_CODE.BAD_REQUEST);
        }

        next();
    };
};
