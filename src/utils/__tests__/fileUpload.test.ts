
import { upload, processUpload, deleteFile } from '../fileUpload';
import type { Request } from 'express';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import multer from 'multer';
import sharp from 'sharp';

interface MulterInstance {
  single: jest.Mock;
  array: jest.Mock;
  fields: jest.Mock;
}

interface MulterStatic {
  (options?: any): MulterInstance;
  diskStorage: jest.Mock;
}

jest.mock('multer', () => {
  const mockStorage = {
    destination: jest.fn((req: any, file: any, cb: Function) => cb(null, 'uploads')),
    filename: jest.fn((req: any, file: any, cb: Function) => cb(null, 'test.png'))
  };

  const multerInstance = {
    single: jest.fn(),
    array: jest.fn(),
    fields: jest.fn()
  };

  const multerMock = jest.fn().mockReturnValue(multerInstance);
  (multerMock as any).diskStorage = jest.fn().mockReturnValue(mockStorage);

  return multerMock;
});

// Mock sharp is configured in jest.mock above

// Mock sharp properly with method chaining
jest.mock('sharp', () => {
  const mockSharp = jest.fn().mockImplementation((_input: string | Buffer) => {
    const instance = {
      resize: jest.fn().mockReturnThis(),
      jpeg: jest.fn().mockReturnThis(),
      png: jest.fn().mockReturnThis(),
      webp: jest.fn().mockReturnThis(),
      toFile: jest.fn().mockResolvedValue(undefined)
    };
    
    // Create instance with proper return values for chaining
    instance.resize.mockImplementation((width, height, options) => instance);
    instance.jpeg.mockImplementation((options) => instance);
    instance.png.mockImplementation((options) => instance);
    instance.webp.mockImplementation((options) => instance);
    
    return instance;
  });

  return mockSharp;
});

jest.mock('fs', () => {
  const original = jest.requireActual('fs');
  return {
    ...original,
    promises: {
      mkdir: jest.fn().mockResolvedValue(undefined),
      access: jest.fn().mockResolvedValue(undefined),
      rename: jest.fn().mockResolvedValue(undefined),
    },
    mkdirSync: jest.fn().mockReturnValue(undefined),
    existsSync: jest.fn().mockReturnValue(true),
    mkdtemp: jest.fn().mockImplementation((prefix, cb) => cb(null, 'test-uploads-')),
    writeFile: jest.fn().mockImplementation((path, content, cb) => cb(null)),
    exists: jest.fn().mockImplementation((path, cb) => cb(null, true)),
    unlink: jest.fn().mockImplementation((path, cb) => cb(null)),
    rmdir: jest.fn().mockImplementation((path, cb) => cb(null)),
    mkdir: jest.fn().mockImplementation((path, cb) => cb(null))
  };
});

const mkdtemp = promisify(fs.mkdtemp);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);

// Increase Jest timeout for all tests
jest.setTimeout(60000);

describe('fileUpload utility', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Set up fs.promises mock behaviors
    const promises = {
      mkdir: jest.fn().mockResolvedValue(undefined),
      access: jest.fn().mockResolvedValue(undefined),
      rename: jest.fn().mockResolvedValue(undefined)
    };

    // Set up fs mock behaviors
    const fsUtils = {
      mkdirSync: jest.fn().mockReturnValue(undefined),
      existsSync: jest.fn().mockReturnValue(true),
      mkdtemp: jest.fn().mockImplementation((path: string, callback: Function) => callback(null, 'test-uploads-')),
      writeFile: jest.fn().mockImplementation((path: string, content: any, callback: Function) => callback(null)),
      unlink: jest.fn().mockImplementation((path: string, callback: Function) => callback(null)),
      rmdir: jest.fn().mockImplementation((path: string, callback: Function) => callback(null)),
      promises
    };

    // Apply our mocks
    Object.assign(fs, fsUtils);
    Object.assign(fs.promises, promises);
  });

  describe('upload middleware', () => {
    it('should have proper configuration', () => {
      jest.resetModules();
      const multer = require('multer');
      const fileUpload = require('../fileUpload');
      expect(fileUpload.upload).toBeDefined();
      expect(multer).toHaveBeenCalledWith({
        storage: expect.any(Object),
        limits: expect.any(Object),
        fileFilter: expect.any(Function)
      });
    });
  });

  describe('processUpload', () => {
    beforeAll(() => {
      // Mock filesystem operations
      jest.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined);
      jest.spyOn(fs.promises, 'rename').mockResolvedValue(undefined);
      jest.spyOn(fs.promises, 'mkdir').mockResolvedValue(undefined);
      jest.spyOn(fs.promises, 'access').mockResolvedValue(undefined);
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should process and store a valid image file', async () => {
      // Mock filesystem state
      const files = new Set<string>(['/uploads/test-management/test.png']);
      const dirs = new Set<string>(['/uploads/test-management', '/uploads/test-management/thumbnails']);

      // Reset mocks and setup filesystem mocks
      jest.clearAllMocks();
      
      // Mock fs module methods with simpler implementations
      fs.promises.mkdir = jest.fn().mockResolvedValue(undefined);
      fs.promises.rename = jest.fn().mockResolvedValue(undefined);
      fs.promises.access = jest.fn(async (filePath: fs.PathLike) => {
        const pathStr = filePath.toString();
        if (!files.has(pathStr) && !dirs.has(pathStr)) {
          throw new Error('ENOENT');
        }
      });
      
      const req = {
        managementName: 'test-management'
      };

      const file = {
        fieldname: 'file',
        originalname: 'test.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: '/uploads/test-management',
        filename: 'test.png',
        path: '/uploads/test-management/test.png',
        size: 12345
      };
      
      const result = await processUpload(req as any, file as any);
      
      expect(result).toHaveProperty('filename');
      expect(result).toHaveProperty('thumbnail');
      expect(result.filename).toBe('test.png');
      expect(result.thumbnail).toBe('thumb_test.png');

      // Verify mocked function calls
      expect(sharp).toHaveBeenCalledWith(file.path);
      expect(fs.promises.mkdir).toHaveBeenCalled();
      expect(fs.promises.rename).toHaveBeenCalled();
    });

    it('should create upload directories if they don\'t exist', async () => {
      // Reset mocks and set up filesystem behavior for non-existent directories
      jest.clearAllMocks();
      
      fs.promises.mkdir = jest.fn().mockResolvedValue(undefined);
      fs.promises.access = jest.fn().mockRejectedValue(new Error('ENOENT'));
      fs.existsSync = jest.fn().mockReturnValue(false);
      
      const req = { managementName: 'test-new-dir' };
      const file = {
        fieldname: 'file',
        originalname: 'test.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: '/uploads',
        filename: 'test.png',
        path: '/uploads/test.png',
        size: 12345
      };
      
      await processUpload(req as any, file as any);
      
      expect(fs.promises.mkdir).toHaveBeenCalled();
      const mkdirCalls = (fs.promises.mkdir as jest.Mock).mock.calls;
      expect(mkdirCalls.some(call => 
        call[0].toString().includes('thumbnails')
      )).toBe(true);
    });
  });

  describe('deleteFile', () => {
    it('should delete a file and its thumbnail', async () => {
      // Reset mocks
      jest.clearAllMocks();
      
      // Setup filesystem mocks
      fs.existsSync = jest.fn().mockReturnValue(true);
      fs.promises.unlink = jest.fn().mockResolvedValue(undefined);

      const managementName = 'test-delete';
      const filename = 'test-file.png';
      
      const result = await deleteFile(managementName, filename);
      
      expect(result).toBe(true);
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.promises.unlink).toHaveBeenCalledTimes(2); // File and thumbnail
    });

    it('should return false for non-existent file', async () => {
      // Reset mocks and set up for non-existent file
      jest.clearAllMocks();
      fs.existsSync = jest.fn().mockReturnValue(false);
      
      const result = await deleteFile('non-existent', 'non-existent.png');
      
      expect(result).toBe(false);
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.promises.unlink).not.toHaveBeenCalled();
    });
  });
});
