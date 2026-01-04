const multer = require('multer');
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { promisify } from 'util';
import crypto from 'crypto';
import type { FileFilterCallback } from 'multer';

const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const exists = promisify(fs.exists);

const CONFIG = {
  MAX_FILE_SIZE: 20 * 1024 * 1024, // 20MB
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  IMAGE_QUALITY: 80,
  MAX_WIDTH: 2000,
  THUMBNAIL_SIZE: 200
};

interface MulterRequest extends Request {
  managementName?: string;
  [key: string]: any;
}

interface MulterFile {
  originalname: string;
  fieldname: string;
  mimetype: string;
  buffer?: Buffer;
  [key: string]: any;
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req: MulterRequest, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    try {
      const managementName = req.managementName || 'default';
      const sanitizedManagementName = managementName.replace(/[^a-zA-Z0-9-_]/g, '');
      const uploadPath = path.join('uploads', sanitizedManagementName);
      
      // Create base upload directory and thumbnails directory at root level
      fs.mkdirSync(uploadPath, { recursive: true });
      fs.mkdirSync(path.join('uploads', 'thumbnails'), { recursive: true });
      
      console.log(`Saving file to: ${uploadPath}`);
      cb(null, uploadPath);
    } catch (err) {
      cb(err as Error, '');
    }
  },
  filename: (req: MulterRequest, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const timestamp = Date.now();
    const hash = crypto.createHash('sha256')
      .update(file.originalname + timestamp)
      .digest('hex')
      .substring(0, 8);
    const ext = path.extname(file.originalname);
    const filename = `${timestamp}_${hash}${ext}`;
    console.log(`Generated filename: ${filename}`);
    cb(null, filename);
  }
});

// File filter function
const fileFilter = (req: MulterRequest, file: MulterFile, cb: FileFilterCallback): void => {
  if (!CONFIG.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    const error = new Error(`Invalid file type. Allowed types: ${CONFIG.ALLOWED_MIME_TYPES.join(', ')}`);
    console.error(`File upload rejected:`, { filename: file.originalname, type: file.mimetype });
    cb(error);
    return;
  }
  cb(null, true);
};

// Generate secure filename
const generateSecureFilename = (originalname: string): string => {
  const timestamp = Date.now();
  const hash = crypto.createHash('sha256')
    .update(originalname + timestamp)
    .digest('hex')
    .substring(0, 8);
  const ext = path.extname(originalname);
  return `${timestamp}_${hash}${ext}`;
};

// Image optimization
const optimizeImage = async (filePath: string, mimetype: string): Promise<void> => {
  if (!mimetype.startsWith('image/')) return;

  try {
    let image = sharp(filePath).resize(CONFIG.MAX_WIDTH, null, { withoutEnlargement: true, fit: 'inside' });
    
    switch (mimetype) {
      case 'image/jpeg':
        await image.jpeg({ quality: CONFIG.IMAGE_QUALITY }).toFile(filePath + '_opt');
        break;
      case 'image/png':
        await image.png({ quality: CONFIG.IMAGE_QUALITY }).toFile(filePath + '_opt');
        break;
      case 'image/webp':
        await image.webp({ quality: CONFIG.IMAGE_QUALITY }).toFile(filePath + '_opt');
        break;
    }
    
    // Replace original with optimized version
    await fs.promises.rename(filePath + '_opt', filePath);
    console.log(`Optimized image: ${filePath}`);
  } catch (err) {
    console.error(`Error optimizing image: ${filePath}`, err);
  }
};

// Create thumbnail
const createThumbnail = async (filePath: string, mimetype: string): Promise<string> => {
  if (!mimetype.startsWith('image/')) return '';
  
  try {
    const filename = path.basename(filePath);
    const thumbnailFilename = `thumb_${filename}`;
    const managementName = path.dirname(filePath).split(path.sep).pop() || 'default';
    const thumbnailPath = path.join('uploads', managementName, 'thumbnails', thumbnailFilename);
    
    // Ensure thumbnail directory exists
    await mkdir(path.dirname(thumbnailPath), { recursive: true });
    
    await sharp(filePath)
      .resize(CONFIG.THUMBNAIL_SIZE, CONFIG.THUMBNAIL_SIZE, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toFile(thumbnailPath);
    
    console.log(`Created thumbnail: ${thumbnailPath}`);
    return thumbnailFilename; // Return only the filename, not the full path
  } catch (err) {
    console.error(`Error creating thumbnail:`, err);
    return '';
  }
};

// Create upload instance
export const upload = multer({
  storage,
  limits: {
    fileSize: CONFIG.MAX_FILE_SIZE
  },
  fileFilter
});

// File processor middleware
export const processUpload = async (req: MulterRequest, file: Express.Multer.File): Promise<{ filename: string, thumbnail?: string }> => {
  try {
    // Files are already saved by multer, we just need to process them
    const filePath = file.path;
    const filename = path.basename(filePath);

    // Ensure upload directories exist
    const managementName = req.managementName || 'default';
    const uploadPath = path.join('uploads', managementName);
    const thumbnailPath = path.join(uploadPath, 'thumbnails');

    await fs.promises.mkdir(uploadPath, { recursive: true });
    await fs.promises.mkdir(thumbnailPath, { recursive: true });

    // For images, optimize and create thumbnail
    if (file.mimetype.startsWith('image/')) {
      // Optimize the image
      await optimizeImage(filePath, file.mimetype);

      // Create thumbnail
      const thumb = await createThumbnail(filePath, file.mimetype);
      return { filename, thumbnail: thumb };
    }

    return { filename };
  } catch (error) {
    console.error('Error processing upload:', error);
    throw error;
  }
};

// Delete file helper
export const deleteFile = async (managementName: string, filename: string): Promise<boolean> => {
  try {
    const sanitizedManagementName = managementName.replace(/[^a-zA-Z0-9-_]/g, '');
    const filePath = path.join('uploads', sanitizedManagementName, filename);
    const thumbnailPath = path.join('uploads', sanitizedManagementName, 'thumbnails', `thumb_${filename}`);

    if (await exists(filePath)) {
      await unlink(filePath);
      if (await exists(thumbnailPath)) {
        await unlink(thumbnailPath);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};