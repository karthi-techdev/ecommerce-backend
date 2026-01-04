import jwt from "jsonwebtoken";
import httpMocks from "node-mocks-http";

jest.mock("jsonwebtoken");

// Mock the User model at the top level
const mockUserModel = {
  findOne: jest.fn(),
};

jest.mock("../../models/userModel", () => ({
  __esModule: true,
  default: mockUserModel,
}));

const mockUser = {
  _id: "user1",
  role: "admin",
  status: "active",
  isDeleted: false,
};

describe("Authentication Middleware", () => {
  let req: any, res: any, next: jest.Mock;
  let consoleErrorSpy: jest.SpyInstance;
  let authenticate: any;

  beforeAll(() => {
    authenticate = require("../authentication").authenticate;
  });

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    process.env.JWT_SECRET = "secret";
    jest.clearAllMocks();
    mockUserModel.findOne.mockReset();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("Path Exclusions", () => {
    const excludedPaths = [
      "/api/v1/auth/login",
      "/api/v1/auth/register", 
      "/api/v1/auth/forgotpassword",
      "/api/v1/auth/resetpassword"
    ];

    excludedPaths.forEach(path => {
      it(`should call next for excluded path: ${path}`, async () => {
        req.path = path;
        await authenticate(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    });
  });

  describe("Authorization Header Validation", () => {
    beforeEach(() => {
      req.path = "/api/v1/protected";
    });

    it("should return 403 if no Authorization header", async () => {
      await authenticate(req, res, next);
      expect(res.statusCode).toBe(403);
      expect(res._getJSONData().message).toBe("Bearer token missing");
    });

    it("should return 403 if Authorization header is malformed", async () => {
      req.headers["authorization"] = "Token abc";
      await authenticate(req, res, next);
      expect(res.statusCode).toBe(403);
      expect(res._getJSONData().message).toBe("Bearer token missing");
    });

    it("should return 403 if token is empty after Bearer", async () => {
      req.headers["authorization"] = "Bearer ";
      await authenticate(req, res, next);
      expect(res.statusCode).toBe(403);
      expect(res._getJSONData().message).toBe("Bearer token missing");
    });
  });

  describe("JWT Verification", () => {
    beforeEach(() => {
      req.path = "/api/v1/protected";
      req.headers["authorization"] = "Bearer token";
    });

    it("should return 403 if JWT verification returns null", async () => {
      (jwt.verify as jest.Mock).mockReturnValue(null);
      await authenticate(req, res, next);
      expect(res.statusCode).toBe(403);
      expect(res._getJSONData().message).toBe("Invalid or expired token");
    });

    it("should return 403 if JWT verification returns undefined", async () => {
      (jwt.verify as jest.Mock).mockReturnValue(undefined);
      await authenticate(req, res, next);
      expect(res.statusCode).toBe(403);
      expect(res._getJSONData().message).toBe("Invalid or expired token");
    });

    it("should return 403 if JWT is expired", async () => {
      const error = new Error("jwt expired");
      (error as any).name = "TokenExpiredError";
      (jwt.verify as jest.Mock).mockImplementation(() => { throw error; });
      
      await authenticate(req, res, next);
      expect(res.statusCode).toBe(403);
      expect(res._getJSONData().message).toBe("Invalid or expired token");
    });

    it("should return 403 if JWT is malformed", async () => {
      const error = new Error("jwt malformed");
      (error as any).name = "JsonWebTokenError";
      (jwt.verify as jest.Mock).mockImplementation(() => { throw error; });
      
      await authenticate(req, res, next);
      expect(res.statusCode).toBe(403);
      expect(res._getJSONData().message).toBe("Invalid or expired token");
    });

    it("should log JWT verification errors", async () => {
      const error = new Error("jwt malformed");
      (error as any).name = "JsonWebTokenError";
      error.stack = "Error stack trace";
      (jwt.verify as jest.Mock).mockImplementation(() => { throw error; });

      await authenticate(req, res, next);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "JWT Verification Error:",
        "jwt malformed",
        "Error stack trace"
      );
    });
  });

  describe("User Lookup and Validation", () => {
    beforeEach(() => {
      req.path = "/api/v1/protected";
      req.headers["authorization"] = "Bearer token";
    });

    it("should return 403 if user not found", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({
        _id: "user1",
        email: "test@example.com",
        role: "admin",
      });

      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await authenticate(req, res, next);
      expect(res.statusCode).toBe(403);
      expect(res._getJSONData().message).toBe("User not found. Contact admin.");
    });

    it("should return 403 if user is deleted", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({
        _id: "user1",
        email: "test@example.com",
        role: "admin",
      });

      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({ ...mockUser, isDeleted: true }),
      });

      await authenticate(req, res, next);
      expect(res.statusCode).toBe(403);
      expect(res._getJSONData().message).toBe("Account has been deleted");
    });

    it("should return 403 if user is inactive", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({
        _id: "user1",
        email: "test@example.com",
        role: "admin",
      });

      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({ ...mockUser, status: "inactive" }),
      });

      await authenticate(req, res, next);
      expect(res.statusCode).toBe(403);
      expect(res._getJSONData().message).toBe("Account is blocked");
    });
  });

  describe("Role-based Access Control", () => {
    beforeEach(() => {
      req.path = "/api/v1/protected";
      req.headers["authorization"] = "Bearer token";
    });

    it("should return 403 if user role is 'user'", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({
        _id: "user1",
        email: "test@example.com",
        role: "user",
      });

      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({ ...mockUser, role: "user" }),
      });

      await authenticate(req, res, next);
      expect(res.statusCode).toBe(403);
      expect(res._getJSONData().message).toBe("User does not have sufficient permissions");
    });

    it("should return 403 if user has invalid role", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({
        _id: "user1",
        email: "test@example.com",
        role: "moderator",
      });

      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({ ...mockUser, role: "moderator" }),
      });

      await authenticate(req, res, next);
      expect(res.statusCode).toBe(403);
      expect(res._getJSONData().message).toBe("User does not have sufficient permissions");
    });
  });

  describe("Successful Authentication", () => {
    beforeEach(() => {
      req.path = "/api/v1/protected";
      req.headers["authorization"] = "Bearer token";
    });

    it("should authenticate admin user with _id", async () => {
      const decodedToken = {
        _id: "user1",
        email: "admin@example.com",
        role: "admin",
      };

      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await authenticate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.id).toBe(mockUser._id);
      expect(req.email).toBe(decodedToken.email);
      expect(req.accountdetails).toBe(decodedToken);
    });

    it("should authenticate super-admin user with id property", async () => {
      const decodedToken = {
        id: "user1",
        email: "superadmin@example.com",
        role: "super-admin",
      };

      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({ ...mockUser, role: "super-admin" }),
      });

      await authenticate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.id).toBe(mockUser._id);
      expect(req.email).toBe(decodedToken.email);
      expect(req.accountdetails).toBe(decodedToken);
    });

    it("should prioritize _id over id when both are present", async () => {
      const decodedToken = {
        _id: "user1",
        id: "user2",
        email: "test@example.com",
        role: "admin",
      };

      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await authenticate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ _id: "user1" });
    });
  });

  describe("Error Handling", () => {
    beforeEach(() => {
      req.path = "/api/v1/protected";
      req.headers["authorization"] = "Bearer token";
    });

    it("should return 500 on database connection error", async () => {
      // Mock JWT verification to succeed, but User model loading to fail
      (jwt.verify as jest.Mock).mockReturnValue({
        _id: "user1",
        email: "test@example.com",
        role: "admin",
      });

      // Mock User.findOne to throw synchronously (simulates require error)
      mockUserModel.findOne.mockImplementation(() => {
        throw new Error("Database connection failed");
      });

      await authenticate(req, res, next);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData().message).toBe("Database connection failed");
    });

    it("should return 500 on database query error", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({
        _id: "user1",
        email: "test@example.com",
        role: "admin",
      });

      // Mock findOne to return a select function that rejects
      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error("Database query failed")),
      });

      await authenticate(req, res, next);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData().message).toBe("Database query failed");
    });

    it("should log authentication errors for outer catch", async () => {
      // Simulate an error that bypasses the inner try-catch
      req.path = "/api/v1/protected";
      req.headers["authorization"] = "Bearer token";

      const error = new Error("Database connection failed");
      error.stack = "Database error stack trace";
      
      // Mock User model loading to fail (this hits outer catch)
      mockUserModel.findOne.mockImplementation(() => {
        throw error;
      });

      (jwt.verify as jest.Mock).mockReturnValue({
        _id: "user1",
        email: "test@example.com",
        role: "admin",
      });

      await authenticate(req, res, next);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Authentication Error:",
        "Database connection failed",
        "Database error stack trace"
      );
    });

    it("should return 500 for unexpected errors", async () => {
      // Simulate path processing error
      Object.defineProperty(req, 'path', {
        get: () => { throw new Error("Path processing failed"); }
      });

      await authenticate(req, res, next);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData().message).toBe("Path processing failed");
    });
  });
});