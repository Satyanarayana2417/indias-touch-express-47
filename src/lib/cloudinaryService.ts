import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';

const functions = getFunctions(app);

interface DeleteImagesRequest {
  imageUrls: string[];
  productId?: string;
}

interface DeleteImagesResponse {
  success: boolean;
  deletedCount: number;
  errors?: string[];
}

/**
 * Service for managing Cloudinary image deletions
 */
export class CloudinaryService {
  /**
   * Delete multiple images from Cloudinary via Cloud Function
   */
  static async deleteImages(imageUrls: string[]): Promise<DeleteImagesResponse> {
    try {
      if (!imageUrls || imageUrls.length === 0) {
        return {
          success: true,
          deletedCount: 0
        };
      }

      // Filter for Cloudinary URLs only
      const cloudinaryUrls = imageUrls.filter(url => 
        url && typeof url === 'string' && url.includes('cloudinary.com')
      );

      if (cloudinaryUrls.length === 0) {
        return {
          success: true,
          deletedCount: 0
        };
      }

      const deleteCloudinaryImages = httpsCallable<DeleteImagesRequest, DeleteImagesResponse>(
        functions, 
        'deleteCloudinaryImages'
      );

      const result = await deleteCloudinaryImages({
        imageUrls: cloudinaryUrls
      });

      return result.data;
    } catch (error) {
      console.error('Error deleting Cloudinary images:', error);
      throw new Error('Failed to delete images from Cloudinary');
    }
  }

  /**
   * Delete a single image from Cloudinary
   */
  static async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      const result = await this.deleteImages([imageUrl]);
      return result.success && result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting single Cloudinary image:', error);
      return false;
    }
  }

  /**
   * Extract public ID from Cloudinary URL (utility function)
   */
  static extractPublicId(cloudinaryUrl: string): string | null {
    try {
      const urlParts = cloudinaryUrl.split('/');
      const uploadIndex = urlParts.indexOf('upload');
      
      if (uploadIndex === -1 || uploadIndex >= urlParts.length - 1) {
        return null;
      }

      // Get the public_id (everything after version, without file extension)
      const publicIdParts = urlParts.slice(uploadIndex + 2); // Skip 'upload' and version
      const publicIdWithExtension = publicIdParts.join('/');
      const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, ''); // Remove extension

      return publicId;
    } catch (error) {
      console.error('Error extracting public ID from Cloudinary URL:', error);
      return null;
    }
  }

  /**
   * Check if URL is a Cloudinary URL
   */
  static isCloudinaryUrl(url: string): boolean {
    return url && typeof url === 'string' && url.includes('cloudinary.com');
  }
}

export default CloudinaryService;
