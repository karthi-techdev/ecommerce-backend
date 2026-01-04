import fs from 'fs';
import path from 'path';

export interface ImageFile {
  id: number;
  url: string;
  _id?: string;
}

export interface ProcessedImage {
  id: number;
  url: string;
  _id?: string;
}

export class ImageHandler {
  /**
   * Delete a file from the disk
   * @param filePath Path of the file to delete
   */
  static async deleteFileFromDisk(filePath: string): Promise<void> {
    try {
      const fullPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
      
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
        console.log(`[FILE DELETION] Successfully deleted: ${fullPath}`);
      } else {
        console.log(`[FILE DELETION] File not found: ${fullPath}`);
      }
    } catch (error) {
      console.error(`[FILE DELETION] Error deleting file ${filePath}:`, error);
      // Don't throw - just log the error to prevent transaction rollback
    }
  }

  /**
   * Delete multiple files from disk
   * @param filePaths Array of file paths to delete
   */
  static async deleteMultipleFiles(filePaths: string[]): Promise<void> {
    const deletePromises = filePaths
      .filter(path => path && typeof path === 'string')
      .map(path => this.deleteFileFromDisk(this.normalizeImagePath(path)));
    
    await Promise.allSettled(deletePromises); // Continue even if some deletions fail
  }

  /**
   * Process multiple images including existing, removed and new files
   * IMPORTANT: This does NOT delete files - deletion should happen AFTER database save
   */
  static processImages(
    existingFiles: ImageFile[],
    removedFiles: string[],
    newFiles?: Express.Multer.File[]
  ): ProcessedImage[] {
    console.log('[IMAGE PROCESSING] Starting processImages');
    console.log('Existing files count:', existingFiles?.length || 0);
    console.log('Removed files count:', removedFiles?.length || 0);
    console.log('New files count:', newFiles?.length || 0);

    // Normalize and filter existing files
    let filteredExisting: ProcessedImage[] = [];
    if (Array.isArray(existingFiles)) {
      // First normalize all URLs for comparison
      const normalizedRemovedUrls = (removedFiles || [])
        .map(url => typeof url === 'string' ? url.replace(/\\/g, '/') : '')
        .filter(url => url !== '');

      filteredExisting = existingFiles
        .filter(img => img && typeof img === 'object' && 'url' in img && img.url)
        .filter(img => {
          const normalizedUrl = img.url.replace(/\\/g, '/');
          const shouldKeep = !normalizedRemovedUrls.includes(normalizedUrl);
          if (!shouldKeep) {
            console.log(`[IMAGE PROCESSING] Filtering out image: ${normalizedUrl}`);
          }
          return shouldKeep;
        })
        .map(img => {
          const processed: ProcessedImage = {
            id: img.id || Date.now() + Math.floor(Math.random() * 1000), // Generate ID if missing
            url: img.url.replace(/\\/g, '/')
          };
          if (img._id) {
            processed._id = img._id;
          }
          return processed;
        });
    }

    console.log('[IMAGE PROCESSING] Filtered existing images:', filteredExisting.length);

    // Process new files if any
    const newImages: ProcessedImage[] = newFiles?.map((file, idx) => {
      const newImage: ProcessedImage = {
        id: Date.now() + idx, // Generate unique ID based on timestamp
        url: file.path.replace(/\\/g, '/') // Normalize path separators
      };
      console.log(`[IMAGE PROCESSING] New image added: ${newImage.url} with ID: ${newImage.id}`);
      return newImage;
    }) || [];

    console.log('[IMAGE PROCESSING] New images count:', newImages.length);

    // Combine existing and new images
    const combined = [...filteredExisting, ...newImages];
    console.log('[IMAGE PROCESSING] Total combined images:', combined.length);

    return combined;
  }

  /**
   * Validate that image array is not empty
   */
  static validateImageArray(images: ProcessedImage[], minCount: number = 1): boolean {
    return Array.isArray(images) && images.length >= minCount;
  }

  /**
   * Parse JSON string safely
   */
  static safeParse<T>(value: string | T, defaultValue: T): T {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error('[IMAGE HANDLER] JSON parse error:', e);
        return defaultValue;
      }
    }
    return value;
  }

  /**
   * Process background image URL
   */
  static normalizeImagePath(imagePath: string): string {
    if (!imagePath || typeof imagePath !== 'string') return '';
    return imagePath.replace(/\\/g, '/');
  }

  /**
   * Handle background images in the request
   */
  static processBackgroundImage(
    files: { [fieldname: string]: Express.Multer.File[] },
    field: string,
    body: any
  ): void {
    if (files[field]?.[0]) {
      const pathParts = field.split('.');
      let current = body;
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) current[pathParts[i]] = {};
        current = current[pathParts[i]];
      }
      current[pathParts[pathParts.length - 1]] = this.normalizeImagePath(files[field][0].path);
    }
  }

  /**
   * Rollback newly uploaded files in case of error
   */
  static async rollbackNewFiles(newFiles?: Express.Multer.File[]): Promise<void> {
    if (!newFiles || newFiles.length === 0) return;

    console.log('[IMAGE HANDLER] Rolling back newly uploaded files');
    const filePaths = newFiles.map(file => file.path);
    await this.deleteMultipleFiles(filePaths);
  }
}