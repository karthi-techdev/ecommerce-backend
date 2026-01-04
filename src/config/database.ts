import mongoose from 'mongoose';
import { EventEmitter } from 'events';
import { ENV } from './env';

class DatabaseConnection extends EventEmitter {
  private static instance: DatabaseConnection;
  private retryAttempts: number = 0;
  private readonly maxRetries: number = 5;
  private readonly retryDelay: number = 5000;
  private isConnecting: boolean = false;

  private constructor() {
    super();
    this.setupMongooseOptions();
    this.setupEventListeners();
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  private setupMongooseOptions(): void {
    // These options are now set in the connection options
  }

  private setupEventListeners(): void {
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
      this.retryAttempts = 0;
      this.emit('connected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      this.emit('error', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      this.emit('disconnected');
      if (this.retryAttempts < this.maxRetries) {
        this.reconnect();
      }
    });

    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  private async reconnect(): Promise<void> {
    if (this.isConnecting) return;

    this.isConnecting = true;
    this.retryAttempts++;

    console.log(`Attempting to reconnect to MongoDB (Attempt ${this.retryAttempts}/${this.maxRetries})`);

    setTimeout(async () => {
      try {
        await this.connect();
      } catch (error) {
        console.error('Reconnection attempt failed:', error);
      } finally {
        this.isConnecting = false;
      }
    }, this.retryDelay);
  }

  public async connect(uri?: string): Promise<void> {
    try {
      if (mongoose.connection.readyState === 1) {
        console.log('Already connected to MongoDB');
        return;
      }

      const mongoUri = uri || ENV.MONGO_URI;
      if (!mongoUri) {
        throw new Error('MongoDB URI is not provided');
      }

      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 2,
        maxIdleTimeMS: 30000,
        connectTimeoutMS: 10000,
        family: 4, // Force IPv4
        bufferCommands: false
      });
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  public getConnection(): typeof mongoose {
    return mongoose;
  }

  public async clearDatabase(): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      const db = mongoose.connection.db;
      if (db) {
        const collections = await db.collections();
        for (const collection of collections) {
          await collection.deleteMany({});
        }
      }
    }
  }
}

export const dbConnection = DatabaseConnection.getInstance();
export default dbConnection;
