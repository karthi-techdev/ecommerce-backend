import { Response } from 'express';

interface ErrorDetails {
  field?: string;
  message: string;
  [key: string]: any;
}

export const sendSuccessResponse = (res: Response, message: string, data?: any, statusCode = 200) => {
  const response: { success: boolean; message: string; data?: any } = {
    success: true,
    message
  };

  if (data !== undefined) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

export const sendErrorResponse = (
  res: Response, 
  error: string | Error, 
  statusCode = 400,
  errors?: ErrorDetails[]
) => {
  const errorMessage = error instanceof Error ? error.message : error;
  
  const response: { success: false; error: string; errors?: ErrorDetails[] } = {
    success: false,
    error: errorMessage
  };

  if (errors) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
};
