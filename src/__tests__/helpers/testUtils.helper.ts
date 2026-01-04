import { Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { ENV } from '../../config/env';

describe('Test Utils Helper', () => {
  describe('createMockUser', () => {
    it('should create a mock user with default values', () => {
      const user = createMockUser();
      expect(user).toEqual(expect.objectContaining({
        email: 'test@example.com',
        password: 'password123',
        role: 'user',
        status: 'active',
        isDeleted: false
      }));
      expect(() => new mongoose.Types.ObjectId(user._id)).not.toThrow();
    });

    it('should override default values', () => {
      const user = createMockUser({
        email: 'custom@example.com',
        role: 'admin'
      });
      expect(user.email).toBe('custom@example.com');
      expect(user.role).toBe('admin');
    });
  });

  describe('generateMockToken', () => {
    it('should generate a valid JWT token', () => {
      const user = createMockUser();
      const token = generateMockToken(user);
      expect(typeof token).toBe('string');
      
      const decoded = jwt.verify(token, ENV.JWT_SECRET || 'test-secret') as any;
      expect(decoded).toEqual(expect.objectContaining({
        userId: user._id,
        email: user.email,
        role: user.role
      }));
    });
  });

  describe('mockRequest', () => {
    it('should create mock request with default values', () => {
      const req = mockRequest();
      expect(req).toEqual({
        body: {},
        query: {},
        params: {},
        headers: {}
      });
    });

    it('should override default values', () => {
      const req = mockRequest({
        body: { test: true },
        query: { page: '1' }
      });
      expect(req.body).toEqual({ test: true });
      expect(req.query).toEqual({ page: '1' });
    });
  });

  describe('mockResponse', () => {
    it("should create mock response with required methods", () => {
      const res = mockResponse();
      expect(typeof res.status).toBe('function');
      expect(typeof res.json).toBe('function');
      expect(typeof res.send).toBe('function');
    });

    it("should chain response methods", () => {
      const mockRes = mockResponse();
      const status = mockRes.status as jest.Mock;
      const json = mockRes.json as jest.Mock;
      
      expect(status(200)).toBe(mockRes);
      expect(json({ data: true })).toBe(mockRes);
    });
  });
});

export interface MockUser {
  _id?: string;
  email: string;
  password: string;
  role: string;
  status: string;
  isDeleted: boolean;
}

export const createMockUser = (overrides: Partial<MockUser> = {}): MockUser => ({
  _id: new mongoose.Types.ObjectId().toString(),
  email: 'test@example.com',
  password: 'password123',
  role: 'user',
  status: 'active',
  isDeleted: false,
  ...overrides
});

export const generateMockToken = (user: MockUser): string => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    ENV.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
};

export const mockRequest = (overrides: Partial<Request> = {}): Partial<Request> => ({
  body: {},
  query: {},
  params: {},
  headers: {},
  ...overrides
});

export const mockResponse = () => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis()
  };
  return res;
};

export const mockNext = jest.fn();

export const createTestDocument = async <T extends mongoose.Document>(
  Model: mongoose.Model<T>,
  data: Partial<T>
): Promise<T> => {
  const document = new Model(data);
  return (await document.save()) as T;
};

export const clearCollection = async (Model: mongoose.Model<any>): Promise<void> => {
  try {
    await Model.deleteMany({});
  } catch (error) {
    console.error(`Failed to clear collection ${Model.modelName}:`, error);
    throw error;
  }
};

export const countDocuments = async (Model: mongoose.Model<any>): Promise<number> => {
  try {
    return await Model.countDocuments();
  } catch (error) {
    console.error(`Failed to count documents in ${Model.modelName}:`, error);
    throw error;
  }
};

export const setupTestDatabase = async (): Promise<void> => {
  // Only proceed if we're in a test environment
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('setupTestDatabase should only be called in test environment');
  }

  // Wait for mongoose connection to be ready
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database connection is not ready');
  }
};

export const expectSuccessResponse = (res: Partial<Response>, statusCode: number = 200): void => {
  expect(res.status).toHaveBeenCalledWith(statusCode);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({
      success: true,
      data: expect.anything()
    })
  );
};

export const expectErrorResponse = (res: Partial<Response>, statusCode: number = 400): void => {
  expect(res.status).toHaveBeenCalledWith(statusCode);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({
      success: false,
      error: expect.any(String)
    })
  );
};