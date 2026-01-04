# BookadzoneBackend

A high-performance, secure backend for the Bookadzone platform built with Node.js, Express, and TypeScript. Features optimized database operations, intelligent caching, automated image processing, and comprehensive security measures.

## Core Features & Optimizations

- 🔐 **Secure Authentication System**
  - JWT-based authentication
  - Refresh token rotation
  - Password reset functionality
  - Rate limiting protection
  - CSRF protection
  - Account locking after failed attempts

- 📊 **Database**
  - MongoDB with Mongoose
  - Optimized queries with indexing
  - Data validation
  - Soft delete support
  - Connection pooling

- 🛡️ **Security Features**
  - Helmet security headers
  - CORS protection
  - Request rate limiting
  - Password hashing with bcrypt
  - MongoDB query sanitization
  - XSS protection
  - Request size limits

- 🚀 **Performance Optimizations**
  - Response compression
  - Caching strategies
  - Lean queries
  - Query optimization
  - Efficient error handling

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/         # Database models
├── repositories/   # Data access layer
├── routes/         # API routes
├── services/      # Business logic
├── utils/         # Utility functions
├── validators/    # Request validation schemas
└── types/         # TypeScript type definitions
```

## Dependencies

### Core Dependencies
- `express` (^4.x) - Web framework for Node.js
- `typescript` (^4.x) - Type safety and enhanced development
- `mongoose` (^6.x) - MongoDB ODM with TypeScript support
- `node-cache` (^5.x) - In-memory caching system
- `sharp` (^0.32.x) - High-performance image processing

### Authentication & Security
- `jsonwebtoken` (^9.x) - JWT token management
- `bcryptjs` (^2.x) - Password hashing with salt
- `helmet` (^7.x) - Security headers and protections
- `cors` (^2.x) - Cross-Origin Resource Sharing
- `express-rate-limit` (^6.x) - API rate limiting
- `express-mongo-sanitize` (^2.x) - MongoDB injection prevention
- `crypto` (built-in) - Secure filename generation
- `multer` (^1.x) - File upload handling

### Performance & Optimization
- `compression` (^1.x) - Response payload compression
- `morgan` (^1.x) - HTTP request logging
- `express-validator` (^7.x) - Request validation
- `zod` (^3.x) - Runtime type checking and validation
- `joi` (^17.x) - Object schema validation

### API Documentation
- `swagger-ui-express` (^5.x) - API documentation UI
- `js-yaml` (^4.x) - YAML parsing for Swagger docs

### Development & Testing
- `jest` (^29.x) - Testing framework
- `ts-jest` (^29.x) - TypeScript support for Jest
- `supertest` (^6.x) - HTTP testing
- `mongodb-memory-server` (^8.x) - In-memory MongoDB for testing
- `nodemon` (^3.x) - Development server with hot reload
- `ts-node` (^10.x) - TypeScript execution
- `@types/*` - TypeScript definitions for packages

### Middleware Implementations
- Custom rate limiting with IP tracking
- Advanced caching middleware with TTL controls
- File upload processing with image optimization
- Error handling middleware with detailed logging
- Authentication middleware with token validation
- Request validation middleware
- Database connection management

## API Documentation

API documentation is available in the `/api-docs` directory using OpenAPI (Swagger) specification.

### Main Endpoints:

#### Authentication
- POST `/auth/login` - User authentication
- POST `/auth/refresh` - Refresh access token
- POST `/auth/forgot-password` - Request password reset
- POST `/auth/reset-password` - Reset password with token

#### User Management
- GET `/users` - List users
- POST `/users` - Create user
- PUT `/users/:id` - Update user
- DELETE `/users/:id` - Delete user

## Security Features

### JWT Configuration
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Token rotation for security
- CSRF token validation

### Rate Limiting
- Login: 5 attempts per 15 minutes
- API: 100 requests per minute per IP
- Password reset: 3 attempts per hour

### Password Security
- Bcrypt hashing with salt rounds of 12
- Minimum password length of 8 characters
- Password complexity requirements
- Account lockout after 5 failed attempts

## Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/bookadzone

# JWT Configuration
JWT_SECRET=your-secure-jwt-secret-min-32-chars
JWT_ACCESS_EXPIRATION=900
JWT_REFRESH_EXPIRATION=604800

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
EMAIL_FROM=noreply@bookadzone.com

# Security
ALLOWED_ORIGINS=http://localhost:3000
BCRYPT_ROUNDS=12
```

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/your-username/BookadzoneBackend.git
```

2. Install dependencies
```bash
cd BookadzoneBackend
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## Performance Optimizations

### 1. Database Optimization
- Connection pooling with configurable pool size (5-50 connections)
- Automatic reconnection with exponential backoff
- Query timeout settings (10s default)
- Lean queries for reduced memory usage
- Proper indexing on frequently queried fields
- Mongoose buffer commands disabled for performance
- Field selection to minimize data transfer

### 2. Caching System
- In-memory caching with node-cache
- Configurable TTL per route type:
  - Short-term (5 minutes): Frequently changing data
  - Medium-term (30 minutes): Semi-static data
  - Long-term (1 hour): Static content
- Cache invalidation on data updates
- Cache statistics tracking
- Automatic cache cleanup

### 3. File Upload & Image Processing
- Secure filename generation using crypto
- Image optimization with Sharp:
  - Automatic resizing (max width: 2000px)
  - Quality optimization (80% quality)
  - Format conversion support (JPEG, PNG, WebP)
- Thumbnail generation (200x200px)
- Memory-efficient streaming
- Mime-type validation
- File size limits (20MB default)

### 4. Security Implementation
- Rate limiting with express-rate-limit:
  - API endpoints: 100 requests per 15 minutes
  - Authentication: 5 attempts per 15 minutes
  - File uploads: 10 uploads per 15 minutes
- Helmet security headers:
  - Content Security Policy
  - XSS Protection
  - Frame Options
  - MIME Type Security
- CORS configuration with pre-flight caching
- Request size limits
- MongoDB query sanitization
- Input validation with express-validator & zod

### 5. API Optimization
- Response compression for all text-based responses
- Proper HTTP status codes and error formatting
- Request validation middleware
- Centralized error handling
- Standardized API response format
- OpenAPI/Swagger documentation
- Proper HTTP method usage

## Implementation Details

### Database Connection Management
```typescript
class DatabaseConnection extends EventEmitter {
  private static instance: DatabaseConnection;
  private readonly maxRetries: number = 5;
  private readonly retryDelay: number = 5000;

  public async connect(uri?: string): Promise<void> {
    await mongoose.connect(uri || process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 50,
      minPoolSize: 5
    });
  }
}
```

### Caching Middleware
```typescript
const cacheMiddleware = (config: CacheConfig = {}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = config.key || req.originalUrl;
    const cachedResponse = cache.get(key);
    
    if (cachedResponse) {
      return res.send(cachedResponse);
    }
    
    res.send = function(body): Response {
      cache.set(key, body, config.ttl || 300);
      return originalSend.call(this, body);
    };
    next();
  };
};
```

### Image Processing
```typescript
const optimizeImage = async (buffer: Buffer, mimetype: string): Promise<Buffer> => {
  return sharp(buffer)
    .resize(2000, null, {
      withoutEnlargement: true,
      fit: 'inside'
    })
    .jpeg({ quality: 80 })
    .toBuffer();
};
```

### Route Configuration
```typescript
const routes: RouteConfig[] = [
  { 
    path: "/api/v1/pages", 
    router: pagesRoutes,
    middleware: [authenticate, cacheMiddleware({ ttl: 3600 })]
  },
  // ... other routes
];
```

### Error Handling
```typescript
interface ApiError extends Error {
  statusCode: number;
  status: 'error' | 'fail';
  isOperational?: boolean;
}

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: err.status || 'error',
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

## License

This project is licensed under the MIT License - see the LICENSE file for details