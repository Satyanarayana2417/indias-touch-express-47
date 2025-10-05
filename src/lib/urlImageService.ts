import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

export interface ImageFromUrlRequest {
  imageUrl: string;
  productId?: string;
  isMainImage?: boolean;
}

export interface ImageFromUrlResponse {
  success: boolean;
  cloudinaryUrl?: string;
  error?: string;
}

/**
 * Service for handling URL-based image uploads
 */
export class UrlImageService {
  private static readonly fetchImageFromUrlFunction = httpsCallable<ImageFromUrlRequest, ImageFromUrlResponse>(
    functions,
    'fetchImageFromUrl'
  );

  /**
   * Validates if a URL appears to be an image URL
   */
  static validateImageUrl(url: string): { isValid: boolean; error?: string } {
    try {
      // Basic string validation
      if (!url || typeof url !== 'string' || url.trim().length === 0) {
        return { isValid: false, error: 'Please enter a valid URL' };
      }

      const trimmedUrl = url.trim();
      const urlObj = new URL(trimmedUrl);
      
      // Check protocol
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { isValid: false, error: 'URL must use HTTP or HTTPS protocol' };
      }

      // Check for common image extensions - Enhanced with all requested formats
      const imageExtensions = [
        '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.tif', '.svg',
        '.heic', '.heif', '.raw', '.cr2', '.nef', '.arw', '.dng', '.orf', '.rw2',
        '.pef', '.srw', '.x3f', '.avif', '.jxl', '.jp2', '.j2k', '.jpf', '.jpx'
      ];
      const pathname = urlObj.pathname.toLowerCase();
      const hasImageExtension = imageExtensions.some(ext => pathname.endsWith(ext));
      
      // Check for common image hosting domains - Enhanced list
      const commonImageHosts = [
        'imgur.com', 'i.imgur.com', 'images.unsplash.com', 'unsplash.com',
        'pixabay.com', 'pexels.com', 'freepik.com', 'shutterstock.com',
        'istockphoto.com', 'getty.com', 'flickr.com', 'photobucket.com',
        'tinypic.com', 'postimg.cc', 'imgbb.com', 'imagekit.io', 'cloudinary.com',
        'amazonaws.com', 'googleusercontent.com', 'fbcdn.net', 'cdninstagram.com',
        'dropbox.com', 'dropboxusercontent.com', 'onedrive.live.com', 'sharepoint.com',
        'github.com', 'githubusercontent.com', 'gitlab.com', 'bitbucket.org',
        'wordpress.com', 'wp.com', 'medium.com', 'blogger.com', 'blogspot.com',
        'squarespace.com', 'wixstatic.com', 'weebly.com', 'shopify.com',
        'firebaseapp.com', 'storage.googleapis.com', 'azure.com', 'digitaloceanspaces.com'
      ];
      
      const hostname = urlObj.hostname.toLowerCase();
      const isFromImageHost = commonImageHosts.some(host => 
        hostname === host || hostname.endsWith(`.${host}`)
      );

      // Additional check for query parameters that might indicate an image
      const hasImageQuery = pathname.includes('image') || urlObj.search.includes('image') || 
                           urlObj.search.includes('photo') || urlObj.search.includes('pic');

      if (!hasImageExtension && !isFromImageHost && !hasImageQuery) {
        return { 
          isValid: false, 
          error: 'URL does not appear to be an image. Please ensure the URL points to a JPG, PNG, WebP, GIF, or other image file.' 
        };
      }

      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: 'Invalid URL format. Please enter a complete URL starting with http:// or https://' };
    }
  }

  /**
   * Fetches an image from URL and uploads it to Cloudinary
   */
  static async fetchAndUploadImage(
    imageUrl: string,
    productId?: string,
    isMainImage: boolean = false
  ): Promise<string> {
    try {
      // Trim whitespace
      const trimmedUrl = imageUrl.trim();
      if (!trimmedUrl) {
        throw new Error('Please provide a valid image URL');
      }

      // Validate URL on client side first
      const validation = this.validateImageUrl(trimmedUrl);
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid image URL');
      }

      console.log('Calling fetchImageFromUrl function with:', { imageUrl: trimmedUrl, productId, isMainImage });

      // Call the cloud function
      const result = await this.fetchImageFromUrlFunction({
        imageUrl: trimmedUrl,
        productId,
        isMainImage
      });

      console.log('Function result:', result);

      if (!result.data.success) {
        throw new Error(result.data.error || 'Failed to fetch image from URL');
      }

      if (!result.data.cloudinaryUrl) {
        throw new Error('No image URL returned from server');
      }

      return result.data.cloudinaryUrl;
    } catch (error: any) {
      console.error('Error in fetchAndUploadImage:', error);
      
      // Handle Firebase Function errors
      if (error.code) {
        switch (error.code) {
          case 'unauthenticated':
            throw new Error('You must be logged in to use this feature');
          case 'permission-denied':
            throw new Error('You do not have permission to use this feature. Admin access required.');
          case 'invalid-argument':
            throw new Error(error.message || 'Invalid image URL. Please check the URL and try again.');
          case 'deadline-exceeded':
            throw new Error('Request timeout. The image may be too large or the server is busy. Please try again.');
          case 'resource-exhausted':
            throw new Error('Server is currently overloaded. Please try again later.');
          case 'internal':
            throw new Error(error.message || 'Server error occurred while processing the image. Please try again.');
          case 'unavailable':
            throw new Error('Service is temporarily unavailable. Please try again later.');
          default:
            throw new Error(error.message || 'An error occurred while processing the image');
        }
      }
      
      // Handle network errors
      if (error.message?.includes('network') || error.message?.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  }

  /**
   * Checks if a URL is likely to be an image by making a HEAD request
   * This is a lighter check that doesn't download the full image
   */
  static async checkUrlIsImage(url: string): Promise<{ isImage: boolean; contentType?: string; size?: number }> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      
      if (!response.ok) {
        return { isImage: false };
      }

      const contentType = response.headers.get('content-type') || '';
      const contentLength = response.headers.get('content-length');
      
      const isImage = contentType.startsWith('image/');
      const size = contentLength ? parseInt(contentLength) : undefined;
      
      return {
        isImage,
        contentType,
        size
      };
    } catch (error) {
      // If HEAD request fails, we can't determine if it's an image
      return { isImage: false };
    }
  }
}
