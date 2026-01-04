import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { ImageHandler, ImageFile } from '../imageHandler';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  promises: {
    unlink: jest.fn()
  }
}));
jest.mock('path');

describe('ImageHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('deleteFileFromDisk', () => {
    it('should delete file when it exists', async () => {
      const filePath = 'test/file.jpg';
      const fullPath = '/absolute/test/file.jpg';

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (path.isAbsolute as jest.Mock).mockReturnValue(false);
      (path.join as jest.Mock).mockReturnValue(fullPath);
      (fs.promises.unlink as jest.Mock).mockResolvedValue(undefined);

      await ImageHandler.deleteFileFromDisk(filePath);

      expect(fs.existsSync).toHaveBeenCalledWith(fullPath);
      expect(fs.promises.unlink).toHaveBeenCalledWith(fullPath);
    });

    it('should handle non-existent file', async () => {
      const filePath = 'test/file.jpg';
      const fullPath = '/absolute/test/file.jpg';

      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (path.isAbsolute as jest.Mock).mockReturnValue(false);
      (path.join as jest.Mock).mockReturnValue(fullPath);

      await ImageHandler.deleteFileFromDisk(filePath);

      expect(fs.existsSync).toHaveBeenCalledWith(fullPath);
      expect(fs.promises.unlink).not.toHaveBeenCalled();
    });

    it('should handle absolute paths', async () => {
      const filePath = '/absolute/test/file.jpg';

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (path.isAbsolute as jest.Mock).mockReturnValue(true);
      (fs.promises.unlink as jest.Mock).mockResolvedValue(undefined);

      await ImageHandler.deleteFileFromDisk(filePath);

      expect(fs.existsSync).toHaveBeenCalledWith(filePath);
      expect(path.join).not.toHaveBeenCalled();
    });
  });

  describe('processImages', () => {
    const existingFiles: ImageFile[] = [
      { id: 1, url: 'path/to/image1.jpg', _id: '1' },
      { id: 2, url: 'path\\to\\image2.jpg', _id: '2' }
    ];

    it('should process images with no removed files', () => {
      const result = ImageHandler.processImages(existingFiles, []);

      expect(result).toEqual([
        { id: 1, url: 'path/to/image1.jpg', _id: '1' },
        { id: 2, url: 'path/to/image2.jpg', _id: '2' }
      ]);
    });

    it('should filter out removed files', () => {
      const removedFiles = ['path/to/image1.jpg'];
      const result = ImageHandler.processImages(existingFiles, removedFiles);

      expect(result).toEqual([
        { id: 2, url: 'path/to/image2.jpg', _id: '2' }
      ]);
    });

    it('should add new files', () => {
      const newFiles = [
        { path: 'path/to/new1.jpg' },
        { path: 'path\\to\\new2.jpg' }
      ] as Express.Multer.File[];

      const result = ImageHandler.processImages(existingFiles, [], newFiles);

      expect(result).toHaveLength(4);
      expect(result[2].url).toBe('path/to/new1.jpg');
      expect(result[3].url).toBe('path/to/new2.jpg');
    });

    it('should handle invalid existing files', () => {
      const invalidFiles = [
        null,
        undefined,
        {},
        { invalid: 'data' }
      ] as any[];

      const result = ImageHandler.processImages(invalidFiles, []);
      expect(result).toEqual([]);
    });
  });

  describe('safeParse', () => {
    it('should parse valid JSON string', () => {
      const jsonString = '{"key": "value"}';
      const defaultValue = {};
      
      const result = ImageHandler.safeParse(jsonString, defaultValue);
      expect(result).toEqual({ key: 'value' });
    });

    it('should return default value for invalid JSON', () => {
      const invalidJson = '{invalid json}';
      const defaultValue = { default: true };
      
      const result = ImageHandler.safeParse(invalidJson, defaultValue);
      expect(result).toEqual(defaultValue);
    });

    it('should return non-string value as is', () => {
      const value = { key: 'value' };
      const defaultValue = {};
      
      const result = ImageHandler.safeParse(value, defaultValue);
      expect(result).toBe(value);
    });
  });

  describe('processBackgroundImage', () => {
    const createMockFile = (fieldname: string): Express.Multer.File => ({
      fieldname,
      originalname: 'image.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 12345,
      destination: '/uploads',
      filename: 'image.jpg',
      path: 'path/to/image.jpg',
      buffer: Buffer.from('test'),
      stream: new Readable()
    });

    it('should set background image path in body', () => {
      const files = {
        'section.background': [createMockFile('section.background')]
      } as { [key: string]: Express.Multer.File[] };
      
      const body: { section: { background?: string } } = { section: {} };
      
      ImageHandler.processBackgroundImage(files, 'section.background', body);
      
      expect(body.section.background).toBe('path/to/image.jpg');
    });

    it('should handle deep nested paths', () => {
      const files = {
        'section.subsection.background': [createMockFile('section.subsection.background')]
      } as { [key: string]: Express.Multer.File[] };
      
      const body: Record<string, any> = {};
      
      ImageHandler.processBackgroundImage(files, 'section.subsection.background', body);
      
      expect(body).toEqual({
        section: {
          subsection: {
            background: 'path/to/image.jpg'
          }
        }
      });
    });

    it('should handle missing file', () => {
      const files = {} as { [key: string]: Express.Multer.File[] };
      const body: { section: { background?: string } } = { section: {} };
      
      ImageHandler.processBackgroundImage(files, 'section.background', body);
      
      expect(body.section.background).toBeUndefined();
    });
  });
});
