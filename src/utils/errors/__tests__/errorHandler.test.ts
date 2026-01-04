import errorHandler from '../errorHandler';
import { Request, Response } from 'express';
import AppError from '../AppError';

describe('errorHandler', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
    process.env.NODE_ENV = 'development';
  });

  it('should handle development errors with full details', () => {
    const error = new AppError('Test Error', 400);
    process.env.NODE_ENV = 'development';

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'fail',
      error,
      message: 'Test Error',
      stack: expect.any(String)
    });
  });

  it('should handle production errors with limited details', () => {
    const error = new AppError('Test Error', 400);
    process.env.NODE_ENV = 'production';

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Test Error'
    });
  });

  it('should handle mongoose cast errors', () => {
    const error = {
      name: 'CastError',
      path: 'id',
      value: 'invalid-id',
      statusCode: 400,
      status: 'fail'
    };
    process.env.NODE_ENV = 'production';

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Invalid id: invalid-id'
    });
  });

  it('should handle duplicate field errors', () => {
    const error = {
      code: 11000,
      keyValue: { email: 'test@test.com' },
      statusCode: 400,
      status: 'fail'
    };
    process.env.NODE_ENV = 'production';

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Duplicate field value: test@test.com. Please use another value!'
    });
  });

  it('should handle validation errors', () => {
    const error = {
      name: 'ValidationError',
      errors: {
        name: { message: 'Name is required' },
        email: { message: 'Email is invalid' }
      },
      statusCode: 400,
      status: 'fail'
    };
    process.env.NODE_ENV = 'production';

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Invalid input data. Name is required. Email is invalid'
    });
  });

  it('should handle JWT errors', () => {
    const error = {
      name: 'JsonWebTokenError',
      statusCode: 401,
      status: 'fail'
    };
    process.env.NODE_ENV = 'production';

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Invalid token. Please log in again!'
    });
  });

  it('should handle JWT expired errors', () => {
    const error = {
      name: 'TokenExpiredError',
      statusCode: 401,
      status: 'fail'
    };
    process.env.NODE_ENV = 'production';

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Your token has expired! Please log in again.'
    });
  });

  it('should handle unknown errors in production', () => {
    const error = new Error('Some unknown error');
    process.env.NODE_ENV = 'production';

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Something went very wrong!'
    });
  });
});
