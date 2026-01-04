import httpMocks from "node-mocks-http";
import authenticationController from "../authenticationController";
import authenticationService from "../../services/authenticationService";

jest.mock("../../services/authenticationService");

describe("AuthenticationController", () => {
  let req: any, res: any, next: jest.Mock;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("authLogin", () => {
    it("should return 200 and login data on successful login", async () => {
      const mockAuthData = {
        token: "jwt-token",
        data: { id: "123", email: "test@example.com" },
        expiresIn: "1d"
      };

      req.body = { email: "test@example.com", password: "password123" };
      (authenticationService.authLogin as jest.Mock).mockResolvedValue(mockAuthData);

      await authenticationController.authLogin(req, res, next);

      expect(authenticationService.authLogin).toHaveBeenCalledWith(req.body);
      expect(res.statusCode).toBe(200);
      
      const responseData = res._getJSONData();
  expect(responseData.status).toBe(true); // HTTP_RESPONSE.SUCCESS is true
  expect(responseData.message).toBe("Logged in successfully");
  expect(responseData.token).toBe(mockAuthData.token);
  expect(responseData.data).toStrictEqual(mockAuthData.data);
  expect(responseData.expiresIn).toBe(mockAuthData.expiresIn);
    });

    it("should call next with error when login fails", async () => {
      const error = new Error("Invalid credentials");
      req.body = { email: "test@example.com", password: "wrongpassword" };
      (authenticationService.authLogin as jest.Mock).mockRejectedValue(error);

      await authenticationController.authLogin(req, res, next);

      expect(authenticationService.authLogin).toHaveBeenCalledWith(req.body);
      expect(next).toHaveBeenCalledWith(error);
      // When next() is called with an error, the response isn't set
      expect(res._isEndCalled()).toBe(false);
    });
  });

  describe("refreshToken", () => {
    it("should return 200 and new token data on successful refresh", async () => {
      const mockAuthData = {
        token: "new-jwt-token",
        data: { id: "123", email: "test@example.com" },
        expiresIn: "1d"
      };

      req.headers = { authorization: "Bearer old-token" };
      (authenticationService.refreshToken as jest.Mock).mockResolvedValue(mockAuthData);

      await authenticationController.refreshToken(req, res, next);

      expect(authenticationService.refreshToken).toHaveBeenCalledWith("old-token");
      expect(res.statusCode).toBe(200);
      
      const responseData = res._getJSONData();
  expect(responseData.status).toBe(true); // HTTP_RESPONSE.SUCCESS is true
  expect(responseData.message).toBe("Token refreshed successfully");
  expect(responseData.token).toBe(mockAuthData.token);
  expect(responseData.data).toStrictEqual(mockAuthData.data);
  expect(responseData.expiresIn).toBe(mockAuthData.expiresIn);
    });

    it("should return 403 if no Authorization header", async () => {
      await authenticationController.refreshToken(req, res, next);

      expect(res.statusCode).toBe(403);
      const responseData = res._getJSONData();
      expect(responseData.status).toBe(false); // HTTP_RESPONSE.FAIL is false
      expect(responseData.message).toBe("No Bearer Token");
    });

    it("should return 403 if Authorization header doesn't start with Bearer", async () => {
      req.headers = { authorization: "Token some-token" };

      await authenticationController.refreshToken(req, res, next);

      expect(res.statusCode).toBe(403);
      const responseData = res._getJSONData();
      expect(responseData.status).toBe(false); // HTTP_RESPONSE.FAIL is false
      expect(responseData.message).toBe("No Bearer Token");
    });

    it("should return 403 if token is empty after Bearer", async () => {
      req.headers = { authorization: "Bearer " };

      await authenticationController.refreshToken(req, res, next);

      expect(res.statusCode).toBe(403);
      const responseData = res._getJSONData();
      expect(responseData.status).toBe(false); // HTTP_RESPONSE.FAIL is false
      expect(responseData.message).toBe("Token not found");
    });

    it("should return 403 if no token after Bearer", async () => {
      req.headers = { authorization: "Bearer" };

      await authenticationController.refreshToken(req, res, next);

      expect(res.statusCode).toBe(403);
      const responseData = res._getJSONData();
      expect(responseData.status).toBe(false); // HTTP_RESPONSE.FAIL is false
      expect(responseData.message).toBe("No Bearer Token"); // This actually gets caught by the first condition
    });

    it("should call next with error when refresh fails", async () => {
      const error = new Error("Token expired");
      req.headers = { authorization: "Bearer expired-token" };
      (authenticationService.refreshToken as jest.Mock).mockRejectedValue(error);

      await authenticationController.refreshToken(req, res, next);

      expect(authenticationService.refreshToken).toHaveBeenCalledWith("expired-token");
      expect(next).toHaveBeenCalledWith(error);
      // When next() is called with an error, the response isn't set
      expect(res._isEndCalled()).toBe(false);
    });

    it("should handle missing token correctly", async () => {
      req.headers = { authorization: "Bearer" };

      await authenticationController.refreshToken(req, res, next);

      expect(res.statusCode).toBe(403);
      const responseData = res._getJSONData();
      expect(responseData.status).toBe(false);
      expect(responseData.message).toBe("No Bearer Token");
      expect(authenticationService.refreshToken).not.toHaveBeenCalled();
    });

    it("should extract token correctly from authorization header", async () => {
      const mockAuthData = {
        token: "new-jwt-token",
        data: { id: "123", email: "test@example.com" },
        expiresIn: "1d"
      };

      req.headers = { authorization: "Bearer valid-token-123" };
      (authenticationService.refreshToken as jest.Mock).mockResolvedValue(mockAuthData);

      await authenticationController.refreshToken(req, res, next);

      expect(authenticationService.refreshToken).toHaveBeenCalledWith("valid-token-123");
      expect(res.statusCode).toBe(200);
    });
  });
});