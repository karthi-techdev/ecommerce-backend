import AppError from '../AppError';

describe('AppError', () => {
  it('should create an operational error with status "fail" for 4xx codes', () => {
    const error = new AppError('Bad Request', 400);
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(400);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
    expect(error.message).toBe('Bad Request');
  });

  it('should create an operational error with status "error" for 5xx codes', () => {
    const error = new AppError('Internal Server Error', 500);
    expect(error.statusCode).toBe(500);
    expect(error.status).toBe('error');
    expect(error.isOperational).toBe(true);
    expect(error.message).toBe('Internal Server Error');
  });

  it('should capture stack trace', () => {
    const error = new AppError('Test Error', 400);
    expect(error.stack).toBeDefined();
  });
});
