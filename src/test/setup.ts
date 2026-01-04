import dotenv from 'dotenv';

// Load environment variables from .env.test file
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Setup global test timeout
jest.setTimeout(30000);

// Mocking external services
jest.mock('../utils/emailConfig');
jest.mock('../utils/jwt');