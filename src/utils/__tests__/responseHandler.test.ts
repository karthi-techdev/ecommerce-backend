import { Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../responseHandler';

describe('Response Handler', () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('sendSuccessResponse', () => {
    it('should send a success response with default status code', () => {
      sendSuccessResponse(mockResponse as Response, 'Success message', { test: true });

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Success message',
        data: { test: true }
      });
    });

    it('should send a success response with custom status code', () => {
      sendSuccessResponse(mockResponse as Response, 'Created successfully', { id: 1 }, 201);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Created successfully',
        data: { id: 1 }
      });
    });

    it('should handle response without data', () => {
      sendSuccessResponse(mockResponse as Response, 'Deleted successfully');

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Deleted successfully'
      });
    });
  });

  describe('sendErrorResponse', () => {
    it('should send an error response with default status code', () => {
      sendErrorResponse(mockResponse as Response, 'Error message');

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error message'
      });
    });

    it('should send an error response with custom status code', () => {
      sendErrorResponse(mockResponse as Response, 'Not Found', 404);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Not Found'
      });
    });

    it('should handle error response with details', () => {
      const error = {
        message: 'Validation failed',
        errors: [
          { field: 'email', message: 'Email is required' },
          { field: 'password', message: 'Password is too short' }
        ]
      };

      sendErrorResponse(mockResponse as Response, error.message, 400, error.errors);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: error.message,
        errors: error.errors
      });
    });

    it('should handle response with object error', () => {
      const error = new Error('Internal server error');
      sendErrorResponse(mockResponse as Response, error, 500);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error'
      });
    });
  });
});
