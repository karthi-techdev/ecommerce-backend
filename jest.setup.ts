import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "./src/models/userModel";
import bcrypt from "bcryptjs";

// Test configuration
const TEST_CONFIG = {
  ADMIN_EMAIL: "test-admin@example.com",
  ADMIN_PASSWORD: "test-password",
  MONGO_TIMEOUT: 20000, // 20 seconds for better test stability
  BCRYPT_ROUNDS: 10,
  PROTECTED_COLLECTIONS: ['users'], // Collections that shouldn't be cleared between tests
  CONNECTION_RETRY_ATTEMPTS: 3,
  CONNECTION_RETRY_DELAY: 1000 // 1 second
};

let mongoServer: MongoMemoryServer;
let isConnected = false;

const setupMongoose = async (uri: string): Promise<void> => {
  for (let attempt = 1; attempt <= TEST_CONFIG.CONNECTION_RETRY_ATTEMPTS; attempt++) {
    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
      }

      await mongoose.connect(uri + '/test-db', {
        serverSelectionTimeoutMS: TEST_CONFIG.MONGO_TIMEOUT,
        socketTimeoutMS: TEST_CONFIG.MONGO_TIMEOUT,
      });

      // Test the connection by checking the readyState
      if (mongoose.connection.readyState !== 1) {
        throw new Error('Database connection is not ready');
      }

      isConnected = true;
      console.log('MongoDB connection successful');
      return;

    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt} failed:`, error);
      if (attempt === TEST_CONFIG.CONNECTION_RETRY_ATTEMPTS) {
        throw new Error(`MongoDB connection failed after ${TEST_CONFIG.CONNECTION_RETRY_ATTEMPTS} attempts`);
      }
      await new Promise(resolve => setTimeout(resolve, TEST_CONFIG.CONNECTION_RETRY_DELAY));
    }
  }
};

const createTestAdmin = async (): Promise<void> => {
  try {
    const existingAdmin = await User.findOne({ email: TEST_CONFIG.ADMIN_EMAIL });
    if (!existingAdmin) {
      await User.create({
        email: TEST_CONFIG.ADMIN_EMAIL,
        password: await bcrypt.hash(TEST_CONFIG.ADMIN_PASSWORD, TEST_CONFIG.BCRYPT_ROUNDS),
        role: "super-admin",
        status: "active",
        isDeleted: false,
      });
    }
  } catch (error) {
    console.error('Failed to create test admin:', error);
    throw new Error('Test admin creation failed');
  }
};

const clearCollections = async (): Promise<void> => {
  if (!isConnected) {
    console.warn('Skipping collection cleanup: database not connected');
    return;
  }

  try {
    const models = mongoose.models;

    for (const modelName of Object.keys(models)) {
      const model = models[modelName];

      // Skip protected collections
      if (TEST_CONFIG.PROTECTED_COLLECTIONS.includes(modelName.toLowerCase())) {
        continue;
      }

      try {
        await model.deleteMany({});
        console.log(`Cleared collection: ${modelName}`);
      } catch (error) {
        console.error(`Failed to clear collection ${modelName}:`, error);
        throw error;
      }
    }
  } catch (error) {
    console.error('Failed to clear collections:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Collection cleanup failed: ${errorMessage}`);
  }
};

// Global setup
beforeAll(async () => {
  jest.setTimeout(TEST_CONFIG.MONGO_TIMEOUT);
  
  try {
    // Ensure any existing connections are closed
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Create MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    console.log('MongoDB Memory Server started');

    // Setup mongoose connection
    await setupMongoose(mongoUri);

    // Create test admin user only if connection is successful
    if (isConnected) {
      await createTestAdmin();
      console.log('Test admin user created successfully');
    } else {
      throw new Error('Cannot create test admin: database connection not established');
    }

  } catch (error) {
    console.error('Test environment setup failed:', error);
    
    // Cleanup if setup fails
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      if (mongoServer) {
        await mongoServer.stop();
      }
    } catch (cleanupError) {
      console.error('Cleanup after setup failure also failed:', cleanupError);
    }
    
    throw error; // Re-throw to fail tests
  }
});

// Before each test
beforeEach(async () => {
  try {
    await clearCollections();
  } catch (error) {
    console.error('Pre-test cleanup failed:', error);
    throw error;
  }
});

// After all tests
afterAll(async () => {
  try {
    // Disconnect from MongoDB
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Stop MongoDB Memory Server
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error('Test environment teardown failed:', error);
    throw error;
  }
});
