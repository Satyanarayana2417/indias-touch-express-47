"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchImageFromUrl = exports.deleteCloudinaryImages = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const axios_1 = __importDefault(require("axios"));
const validator = __importStar(require("validator"));
const sharp = require('sharp');
// Initialize Firebase Admin
admin.initializeApp();
// Cloudinary configuration
const CLOUDINARY_CONFIG = {
    cloud_name: 'doxwyrp8n',
    upload_preset: 'venkat express'
};
/**
 * Validates if the provided URL is a valid image URL
 */
function validateImageUrl(url) {
    // Basic string validation
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
        return { isValid: false, error: 'Please provide a valid URL' };
    }
    const trimmedUrl = url.trim();
    // Basic URL validation
    if (!validator.isURL(trimmedUrl, { protocols: ['http', 'https'], require_protocol: true })) {
        return { isValid: false, error: 'Invalid URL format. Please provide a complete URL starting with http:// or https://' };
    }
    try {
        // Check if URL has image file extension
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.svg'];
        const urlPath = new URL(trimmedUrl).pathname.toLowerCase();
        const hasImageExtension = imageExtensions.some(ext => urlPath.endsWith(ext));
        // Also check common image hosting domains
        const commonImageHosts = [
            'imgur.com',
            'i.imgur.com',
            'images.unsplash.com',
            'unsplash.com',
            'pixabay.com',
            'pexels.com',
            'freepik.com',
            'shutterstock.com',
            'istockphoto.com',
            'getty.com',
            'flickr.com',
            'photobucket.com',
            'tinypic.com',
            'postimg.cc',
            'imgbb.com',
            'imagekit.io',
            'cloudinary.com',
            'amazonaws.com',
            'googleusercontent.com',
            'fbcdn.net',
            'cdninstagram.com'
        ];
        const urlObj = new URL(trimmedUrl);
        const hostname = urlObj.hostname.toLowerCase();
        const isFromImageHost = commonImageHosts.some(host => hostname === host || hostname.endsWith(`.${host}`));
        // Additional check for query parameters that might indicate an image
        const hasImageQuery = urlPath.includes('image') || urlObj.search.includes('image') ||
            urlObj.search.includes('photo') || urlObj.search.includes('pic');
        if (!hasImageExtension && !isFromImageHost && !hasImageQuery) {
            return {
                isValid: false,
                error: 'URL does not appear to be an image. Please ensure the URL points to a JPG, PNG, WebP, GIF, or other image file.'
            };
        }
        return { isValid: true };
    }
    catch (error) {
        return { isValid: false, error: 'Invalid URL format' };
    }
}
/**
 * Downloads image from URL and validates it
 */
async function downloadAndValidateImage(url) {
    try {
        const response = await axios_1.default.get(url, {
            responseType: 'arraybuffer',
            timeout: 30000,
            maxContentLength: 10 * 1024 * 1024,
            headers: {
                'User-Agent': 'VenkatExpress-ImageFetcher/1.0'
            }
        });
        const buffer = Buffer.from(response.data);
        const contentType = response.headers['content-type'] || '';
        // Validate content type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.some(type => contentType.includes(type.split('/')[1]))) {
            throw new Error('Downloaded content is not a supported image format');
        }
        // Validate image using sharp (this will throw if not a valid image)
        const metadata = await sharp(buffer).metadata();
        if (!metadata.width || !metadata.height) {
            throw new Error('Invalid image: could not determine dimensions');
        }
        // Check reasonable size limits
        if (metadata.width > 5000 || metadata.height > 5000) {
            throw new Error('Image too large: maximum dimensions are 5000x5000 pixels');
        }
        return {
            buffer,
            contentType: contentType.includes('jpeg') ? 'image/jpeg' :
                contentType.includes('png') ? 'image/png' :
                    contentType.includes('webp') ? 'image/webp' :
                        contentType.includes('gif') ? 'image/gif' : 'image/jpeg',
            size: buffer.length
        };
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            if (typeof error === 'object' &&
                error !== null &&
                'code' in error &&
                error.code === 'ENOTFOUND') {
                throw new Error('Could not reach the image URL. Please check the URL and try again.');
            }
            else if (typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                error.response &&
                error.response.status === 404) {
                throw new Error('Image not found at the provided URL (404 error).');
            }
            else if (typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                error.response &&
                error.response.status === 403) {
                throw new Error('Access denied to the image URL (403 error).');
            }
            else if (typeof error === 'object' &&
                error !== null &&
                'code' in error &&
                error.code === 'ECONNABORTED') {
                throw new Error('Request timeout. The image took too long to download.');
            }
        }
        throw new Error(`Failed to download image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
/**
 * Optimizes image for web usage
 */
async function optimizeImage(buffer, contentType) {
    try {
        let optimized = sharp(buffer);
        // Resize if too large (max 1920px width, maintain aspect ratio)
        const metadata = await optimized.metadata();
        if (metadata.width && metadata.width > 1920) {
            optimized = optimized.resize(1920, null, {
                withoutEnlargement: true
            });
        }
        // Convert to appropriate format and optimize
        if (contentType === 'image/png') {
            optimized = optimized.png({ quality: 90, compressionLevel: 9 });
        }
        else if (contentType === 'image/webp') {
            optimized = optimized.webp({ quality: 85 });
        }
        else {
            // Convert everything else to JPEG for better compression
            optimized = optimized.jpeg({ quality: 85, progressive: true });
            contentType = 'image/jpeg';
        }
        const optimizedBuffer = await optimized.toBuffer();
        return {
            buffer: optimizedBuffer,
            contentType
        };
    }
    catch (error) {
        throw new Error(`Failed to optimize image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
/**
 * Uploads image to Cloudinary
 */
async function uploadToCloudinary(buffer, contentType, productId) {
    try {
        // Use 'form-data' package for Node.js environment
        const FormData = require('form-data');
        const formData = new FormData();
        // Append buffer directly as file
        formData.append('file', buffer, {
            filename: 'image',
            contentType: contentType
        });
        formData.append('upload_preset', CLOUDINARY_CONFIG.upload_preset);
        // Add folder organization
        if (productId) {
            formData.append('folder', `venkat-express/products/${productId}`);
        }
        else {
            formData.append('folder', 'venkat-express/products/temp');
        }
        // Add transformation for optimization
        formData.append('transformation', 'q_auto,f_auto');
        const response = await axios_1.default.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/image/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 60000, // 1 minute timeout for upload
        });
        if (response.data && response.data.secure_url) {
            return response.data.secure_url;
        }
        else {
            throw new Error('Invalid response from Cloudinary');
        }
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            let message;
            if (typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                error.response &&
                error.response.data &&
                error.response.data.error &&
                error.response.data.error.message) {
                message = error.response.data.error.message;
            }
            else {
                message = error.message;
            }
            throw new Error(`Cloudinary upload failed: ${message}`);
        }
        throw new Error(`Failed to upload to Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
/**
 * Deletes image from Cloudinary
 */
async function deleteFromCloudinary(imageUrl) {
    try {
        // Extract public_id from Cloudinary URL
        const urlParts = imageUrl.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        if (uploadIndex === -1 || uploadIndex >= urlParts.length - 1) {
            throw new Error('Invalid Cloudinary URL format');
        }
        // Get the public_id (everything after version, without file extension)
        const publicIdParts = urlParts.slice(uploadIndex + 2); // Skip 'upload' and version
        const publicIdWithExtension = publicIdParts.join('/');
        const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, ''); // Remove extension
        // Make API call to delete image
        const timestamp = Math.round(Date.now() / 1000);
        // Note: In production, you should store CLOUDINARY_API_SECRET as an environment variable
        // For now, we'll attempt deletion without signature (requires unsigned preset permissions)
        const response = await axios_1.default.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/image/destroy`, {
            public_id: publicId,
            timestamp: timestamp,
            // signature: signature, // Add this when you have API secret configured
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 30000,
        });
        return response.data.result === 'ok';
    }
    catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        return false; // Don't throw error to avoid breaking product deletion
    }
}
/**
 * Cloud Function to delete multiple images from Cloudinary
 */
exports.deleteCloudinaryImages = functions.https.onCall(async (data, context) => {
    var _a;
    try {
        // Verify the user is authenticated and is an admin
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'The function must be called by an authenticated user.');
        }
        // Get user document to verify admin role
        const userDoc = await admin.firestore()
            .collection('users')
            .doc(context.auth.uid)
            .get();
        if (!userDoc.exists || ((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
            throw new functions.https.HttpsError('permission-denied', 'Only administrators can use this function.');
        }
        const { imageUrls } = data;
        // Validate input
        if (!imageUrls || !Array.isArray(imageUrls)) {
            throw new functions.https.HttpsError('invalid-argument', 'Image URLs array is required.');
        }
        // Filter for Cloudinary URLs only
        const cloudinaryUrls = imageUrls.filter(url => url && typeof url === 'string' && url.includes('cloudinary.com'));
        if (cloudinaryUrls.length === 0) {
            return {
                success: true,
                deletedCount: 0
            };
        }
        // Delete images from Cloudinary
        const deletePromises = cloudinaryUrls.map(url => deleteFromCloudinary(url));
        const results = await Promise.allSettled(deletePromises);
        let deletedCount = 0;
        const errors = [];
        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value) {
                deletedCount++;
            }
            else {
                errors.push(`Failed to delete image: ${cloudinaryUrls[index]}`);
            }
        });
        console.log(`Successfully deleted ${deletedCount}/${cloudinaryUrls.length} images from Cloudinary`);
        return {
            success: true,
            deletedCount,
            errors: errors.length > 0 ? errors : undefined
        };
    }
    catch (error) {
        console.error('Error in deleteCloudinaryImages:', error);
        // Handle Firebase Function errors
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        // Handle other errors
        throw new functions.https.HttpsError('internal', error instanceof Error ? error.message : 'An unexpected error occurred');
    }
});
/**
 * Cloud Function to fetch image from URL and upload to Cloudinary
 */
exports.fetchImageFromUrl = functions.https.onCall(async (data, context) => {
    var _a;
    try {
        // Verify the user is authenticated and is an admin
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to use this feature.');
        }
        // Get user document to verify admin role
        const userDoc = await admin.firestore()
            .collection('users')
            .doc(context.auth.uid)
            .get();
        if (!userDoc.exists || ((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
            throw new functions.https.HttpsError('permission-denied', 'You do not have permission to use this feature. Admin access required.');
        }
        const { imageUrl, productId } = data;
        // Validate input
        if (!imageUrl || typeof imageUrl !== 'string') {
            throw new functions.https.HttpsError('invalid-argument', 'Please provide a valid image URL.');
        }
        // Trim the URL to remove any whitespace
        const trimmedUrl = imageUrl.trim();
        if (!trimmedUrl) {
            throw new functions.https.HttpsError('invalid-argument', 'Please provide a valid image URL.');
        }
        // Validate URL format and content
        const urlValidation = validateImageUrl(trimmedUrl);
        if (!urlValidation.isValid) {
            throw new functions.https.HttpsError('invalid-argument', urlValidation.error || 'Invalid image URL. Please ensure the URL points to a valid image file.');
        }
        console.log(`Processing image from URL: ${trimmedUrl}`);
        // Download and validate image
        const { buffer, contentType } = await downloadAndValidateImage(trimmedUrl);
        console.log(`Successfully downloaded image: ${contentType}, size: ${buffer.length} bytes`);
        // Optimize image
        const { buffer: optimizedBuffer, contentType: finalContentType } = await optimizeImage(buffer, contentType);
        console.log(`Image optimized: ${finalContentType}, new size: ${optimizedBuffer.length} bytes`);
        // Upload to Cloudinary
        const cloudinaryUrl = await uploadToCloudinary(optimizedBuffer, finalContentType, productId);
        console.log(`Successfully uploaded to Cloudinary: ${cloudinaryUrl}`);
        return {
            success: true,
            cloudinaryUrl
        };
    }
    catch (error) {
        console.error('Error in fetchImageFromUrl:', error);
        // Handle Firebase Function errors
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        // Handle specific error types with better messages
        if (error instanceof Error) {
            const errorMessage = error.message;
            // Network/URL related errors
            if (errorMessage.includes('ENOTFOUND') || errorMessage.includes('Could not reach')) {
                throw new functions.https.HttpsError('invalid-argument', 'Unable to reach the image URL. Please check the URL and try again.');
            }
            if (errorMessage.includes('404') || errorMessage.includes('not found')) {
                throw new functions.https.HttpsError('invalid-argument', 'Image not found at the provided URL. Please check the URL and try again.');
            }
            if (errorMessage.includes('403') || errorMessage.includes('Access denied')) {
                throw new functions.https.HttpsError('invalid-argument', 'Access denied to the image URL. The image may be protected or require authentication.');
            }
            if (errorMessage.includes('timeout') || errorMessage.includes('ECONNABORTED')) {
                throw new functions.https.HttpsError('deadline-exceeded', 'Request timeout. The image took too long to download. Please try with a smaller image or different URL.');
            }
            if (errorMessage.includes('too large') || errorMessage.includes('maxContentLength')) {
                throw new functions.https.HttpsError('invalid-argument', 'Image is too large. Please use an image smaller than 10MB.');
            }
            if (errorMessage.includes('not a supported image format') || errorMessage.includes('Invalid image')) {
                throw new functions.https.HttpsError('invalid-argument', 'The URL does not point to a valid image file. Please ensure the URL points to a JPG, PNG, WebP, or GIF image.');
            }
            if (errorMessage.includes('Cloudinary')) {
                throw new functions.https.HttpsError('internal', 'Failed to upload image to storage. Please try again.');
            }
            // Generic error with the original message if it's informative
            throw new functions.https.HttpsError('internal', `Image processing failed: ${errorMessage}`);
        }
        // Fallback for unknown errors
        throw new functions.https.HttpsError('internal', 'An unexpected error occurred while processing the image. Please try again.');
    }
});
//# sourceMappingURL=index.js.map