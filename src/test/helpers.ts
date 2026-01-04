import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Request } from 'express';
import User, { IUser } from '../models/userModel';
import config from '../config/validator';

export const createMockUser = async (userData: Partial<IUser> = {}): Promise<IUser> => {
  const user = new User({
    email: `test-${Math.random()}@example.com`,
    password: 'Password123!',
    name: 'Test User',
    roleId: new mongoose.Types.ObjectId(),
    status: 'active',
    isDeleted: false,
    ...userData
  });
  return await user.save();
};

export const generateMockToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id, email: user.email, roleId: user.roleId },
    config.jwt.secret as jwt.Secret,
    { expiresIn: '15m' }
  );
};

export const setupTestDatabase = () => {
  beforeAll(async () => {
    // Ensure mongoose is connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || '');
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });
};

export const mockRequest = (overrides = {}): Request => {
  // Create a minimal mock implementation
  const req = {
    app: {} as any,
    body: {},
    cookies: {},
    fresh: false,
    hostname: 'localhost',
    ip: '127.0.0.1',
    ips: [],
    method: 'GET',
    originalUrl: '/',
    params: {},
    path: '/',
    protocol: 'http',
    query: {},
    route: {} as any,
    secure: false,
    signedCookies: {},
    stale: true,
    subdomains: [],
    xhr: false,
    get: (name: string) => undefined,
    header: (name: string) => undefined,
    accepts: () => ['*/*'],
    acceptsCharsets: () => ['utf-8'],
    acceptsEncodings: () => ['gzip'],
    acceptsLanguages: () => ['en'],
    is: () => false,
    range: () => undefined,
    ...overrides
  };

  return req as unknown as Request;
};

export const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

export const mockNext = jest.fn();

export const expectError = async (promise: Promise<any>, status: number, message?: string) => {
  try {
    await promise;
    throw new Error('Expected error was not thrown');
  } catch (error: any) {
    expect(error.statusCode).toBe(status);
    if (message) {
      expect(error.message).toBe(message);
    }
  }
};