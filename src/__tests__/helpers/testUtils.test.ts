import { createMockUser, generateMockToken, mockRequest, mockResponse, expectSuccessResponse, expectErrorResponse } from './testUtils.helper';
import jwt from 'jsonwebtoken';
import { ENV } from '../../config/env';

describe('Test Utilities', () => {
  describe('createMockUser', () => {
    it('should create a mock user with default values', () => {
      const user = createMockUser();
      expect(user).toMatchObject({
        email: 'test@example.com',
        password: 'password123',
        role: 'user',
        status: 'active',
        isDeleted: false
      });
      expect(user._id).toBeDefined();
    });

    it('should override default values with provided values', () => {
      const user = createMockUser({
        email: 'custom@example.com',
        role: 'admin'
      });
      expect(user).toMatchObject({
        email: 'custom@example.com',
        role: 'admin',
        status: 'active',
        isDeleted: false
      });
    });
  });

  describe('generateMockToken', () => {
    it('should generate a valid JWT token', () => {
      const user = createMockUser();
      const token = generateMockToken(user);
      const decoded = jwt.verify(token, ENV.JWT_SECRET || 'test-secret') as any;
      
      expect(decoded.email).toBe(user.email);
      expect(decoded.role).toBe(user.role);
      expect(decoded.userId).toBe(user._id);
    });
  });

  describe('mockRequest', () => {
    it('should create a mock request with default values', () => {
      const req = mockRequest();
      expect(req).toEqual({
        body: {},
        query: {},
        params: {},
        headers: {}
      });
    });

    it('should override default values with provided values', () => {
      const req = mockRequest({
        body: { test: true },
        headers: { 'content-type': 'application/json' }
      });
      expect(req).toEqual({
        body: { test: true },
        query: {},
        params: {},
        headers: { 'content-type': 'application/json' }
      });
    });
  });

  describe('mockResponse', () => {
    it('should create a mock response with chained methods', () => {
      const res = mockResponse();
      expect(res.status).toBeDefined();
      expect(res.json).toBeDefined();
      expect(res.send).toBeDefined();

      if (res.status && res.json) {
        const chainedRes = res.status(200).json({ test: true });
        expect(chainedRes).toBe(res);
      }
    });
  });

  describe('expectSuccessResponse', () => {
    it('should verify success response format', () => {
      const res = mockResponse();
      if (res.status && res.json) {
        res.status(200).json({
          success: true,
          data: { test: true }
        });
      }

      expectSuccessResponse(res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.anything()
      }));
    });
  });

  describe('expectErrorResponse', () => {
    it('should verify error response format', () => {
      const res = mockResponse();
      if (res.status && res.json) {
        res.status(400).json({
          success: false,
          error: 'Test error'
        });
      }

      expectErrorResponse(res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: expect.any(String)
      }));
    });
  });
});