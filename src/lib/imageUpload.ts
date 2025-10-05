import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

// Image upload service for Firebase Storage
export class ImageUploadService {
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly ALLOWED_TYPES = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
    'image/bmp', 'image/tiff', 'image/svg+xml', 'image/heic', 'image/heif',
    'image/avif', 'image/jxl', 'image/jp2'
  ];
  private static readonly PRODUCTS_FOLDER = 'products';

  /**
   * Validate image file before upload
   */
  static validateFile(file: File): { isValid: boolean; error?: string } {
    if (!file) {
      return { isValid: false, error: 'No file selected' };
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { 
        isValid: false, 
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' 
      };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { 
        isValid: false, 
        error: `File size too large. Maximum size is ${this.MAX_FILE_SIZE / (1024 * 1024)}MB.` 
      };
    }

    return { isValid: true };
  }

  /**
   * Generate unique filename for the image
   */
  static generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    return `${timestamp}_${randomString}${extension}`;
  }

  /**
   * Upload image to Firebase Storage
   */
  static async uploadProductImage(
    file: File,
    productId?: string,
    isMainImage: boolean = false
  ): Promise<string> {
    // Validate file
    const validation = this.validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    try {
      // Generate unique filename
      const fileName = this.generateFileName(file.name);
      
      // Create storage path
      const folderPath = productId 
        ? `${this.PRODUCTS_FOLDER}/${productId}/${isMainImage ? 'main' : 'gallery'}`
        : `${this.PRODUCTS_FOLDER}/temp`;
      
      const storageRef = ref(storage, `${folderPath}/${fileName}`);

      // Add metadata
      const metadata = {
        contentType: file.type,
        customMetadata: {
          productId: productId || 'temp',
          isMainImage: isMainImage.toString(),
          uploadedAt: new Date().toISOString(),
          originalName: file.name
        }
      };

      // Upload file
      const snapshot = await uploadBytes(storageRef, file, metadata);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image. Please try again.');
    }
  }

  /**
   * Upload multiple images for a product
   */
  static async uploadMultipleImages(
    files: File[],
    productId?: string
  ): Promise<string[]> {
    if (files.length === 0) {
      return [];
    }

    try {
      const uploadPromises = files.map((file, index) => 
        this.uploadProductImage(file, productId, index === 0)
      );

      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw new Error('Failed to upload some images. Please try again.');
    }
  }

  /**
   * Delete image from Firebase Storage
   */
  static async deleteImage(imageUrl: string): Promise<void> {
    if (!imageUrl || !imageUrl.includes('firebase')) {
      // Skip deletion for non-Firebase URLs (like external URLs)
      return;
    }

    try {
      // Extract storage path from URL
      const url = new URL(imageUrl);
      const pathStart = url.pathname.indexOf('/o/') + 3;
      const pathEnd = url.pathname.indexOf('?');
      const storagePath = decodeURIComponent(
        url.pathname.substring(pathStart, pathEnd !== -1 ? pathEnd : undefined)
      );

      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      // Don't throw error to avoid breaking the flow
      // Image deletion failure shouldn't stop product operations
    }
  }

  /**
   * Delete all images for a product
   */
  static async deleteProductImages(imageUrls: string[]): Promise<void> {
    if (!imageUrls || imageUrls.length === 0) {
      return;
    }

    try {
      const deletePromises = imageUrls.map(url => this.deleteImage(url));
      await Promise.allSettled(deletePromises);
    } catch (error) {
      console.error('Error deleting product images:', error);
      // Don't throw to avoid breaking product deletion
    }
  }

  /**
   * Move images from temp folder to product folder
   */
  static async moveImagesToProduct(
    tempUrls: string[], 
    productId: string
  ): Promise<string[]> {
    // In a real implementation, you might want to copy images to the product folder
    // For now, we'll return the same URLs as Firebase Storage paths include the product ID
    return tempUrls;
  }

  /**
   * Get image optimization URL (for future CDN integration)
   */
  static getOptimizedImageUrl(
    originalUrl: string, 
    width?: number, 
    height?: number, 
    quality?: number
  ): string {
    // For now, return original URL
    // In the future, you can integrate with Cloudinary or other image CDNs
    return originalUrl;
  }

  /**
   * Compress image before upload (client-side)
   */
  static async compressImage(file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

// Helper function for backward compatibility
export const uploadProductImage = (file: File, productId?: string) => 
  ImageUploadService.uploadProductImage(file, productId);

export const deleteProductImage = (imageUrl: string) => 
  ImageUploadService.deleteImage(imageUrl);
