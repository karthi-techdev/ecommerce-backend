import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import User from '../../models/userModel';
import { createMockUser, mockRequest, mockResponse, mockNext } from '../helpers';
import authenticationController from '../../controllers/authenticationController';
import { HTTP_STATUS_CODE } from '../../utils/httpResponse';

describe('Authentication', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'Password123!'
      };
      await createMockUser(userData);

      // Act
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(userData);

      // Assert
      expect(response.status).toBe(HTTP_STATUS_CODE.OK);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('data.email', userData.email);
    });

    it('should return error for invalid credentials', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'WrongPassword123!'
      };

      // Act
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(userData);

      // Assert
      expect(response.status).toBe(HTTP_STATUS_CODE.UNAUTHORIZED);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should validate required fields', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com'
        // missing password
      };

      // Act
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(userData);

      // Assert
      expect(response.status).toBe(HTTP_STATUS_CODE.BAD_REQUEST);
      expect(response.body.message).toContain('password');
    });
  });

  describe('POST /auth/forgot-password', () => {
    it('should send reset password email for valid user', async () => {
      // Arrange
      const user = await createMockUser();

      // Act
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: user.email });

      // Assert
      expect(response.status).toBe(HTTP_STATUS_CODE.OK);
      expect(response.body.message).toContain('reset email');
    });

    it('should not reveal user existence for invalid email', async () => {
      // Arrange
      const invalidEmail = 'nonexistent@example.com';

      // Act
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: invalidEmail });

      // Assert
      expect(response.status).toBe(HTTP_STATUS_CODE.OK);
      expect(response.body.message).toContain('If a matching account was found');
    });
  });

  describe('Controller Unit Tests', () => {
    it('should handle authLogin method', async () => {
      // Arrange
      const req = mockRequest({
        body: {
          email: 'test@example.com',
          password: 'Password123!'
        }
      });
      const res = mockResponse();
      const next = mockNext;

      // Act
      await authenticationController.authLogin(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success'
        })
      );
    });

    it('should handle errors in authLogin method', async () => {
      // Arrange
      const req = mockRequest({
        body: {
          email: 'test@example.com'
          // missing password
        }
      });
      const res = mockResponse();
      const next = mockNext;

      // Act
      await authenticationController.authLogin(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HTTP_STATUS_CODE.BAD_REQUEST
        })
      );
    });
  });
});