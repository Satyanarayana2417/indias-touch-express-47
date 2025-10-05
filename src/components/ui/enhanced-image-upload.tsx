import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Upload, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  X, 
  Loader2,
  Check,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { ImageUploadService } from '@/lib/imageUpload';
import { UrlImageService } from '@/lib/urlImageService';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";
import RealtimeImageSync from '@/lib/realtimeImageSync';

interface EnhancedImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  onImageRemoved: (imageUrl: string, isMain?: boolean) => void;
  currentImages: string[];
  mainImage?: string;
  productId?: string;
  disabled?: boolean;
}

interface UrlInputState {
  url: string;
  isValidating: boolean;
  isValid: boolean | null;
  error: string | null;
  previewInfo: {
    contentType?: string;
    size?: number;
  } | null;
}

const EnhancedImageUpload: React.FC<EnhancedImageUploadProps> = ({
  onImageUploaded,
  onImageRemoved,
  currentImages,
  mainImage,
  productId,
  disabled = false
}) => {
  const { toast } = useToast();
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState<UrlInputState>({
    url: '',
    isValidating: false,
    isValid: null,
    error: null,
    previewInfo: null
  });

  // Handle file upload (existing functionality)
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📁 File upload started:', file.name, file.type, file.size);

    try {
      setUploadingFile(true);
      
      // Validate file
      const validation = ImageUploadService.validateFile(file);
      if (!validation.isValid) {
        console.error('❌ File validation failed:', validation.error);
        toast({
          title: "Validation Error",
          description: validation.error,
          variant: "destructive",
        });
        return;
      }

      console.log('✅ File validation passed, compressing...');
      
      // Compress and upload
      const compressedFile = await ImageUploadService.compressImage(file);
      console.log('✅ File compressed, uploading to Firebase...');
      
      const imageUrl = await ImageUploadService.uploadProductImage(
        compressedFile,
        productId,
        !mainImage // is main image if no main image exists
      );
      
      console.log('✅ Firebase upload successful:', imageUrl);
      onImageUploaded(imageUrl);
      
      // Trigger real-time sync
      RealtimeImageSync.onImageUploaded(productId);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully.",
      });
    } catch (error) {
      console.error('❌ File upload error:', error);
      
      let errorMessage = "Failed to upload image.";
      
      if (error instanceof Error) {
        if (error.message.includes('storage/unauthorized')) {
          errorMessage = "Upload failed: Please login as admin first.";
        } else if (error.message.includes('storage/forbidden')) {
          errorMessage = "Upload failed: Admin permission required.";
        } else if (error.message.includes('storage/canceled')) {
          errorMessage = "Upload was canceled. Please try again.";
        } else if (error.message.includes('storage/unknown')) {
          errorMessage = "Upload failed due to server error. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploadingFile(false);
      // Reset the input
      event.target.value = '';
    }
  };

  // Handle URL input change with validation
  const handleUrlChange = (url: string) => {
    setUrlInput(prev => ({
      ...prev,
      url,
      isValid: null,
      error: null,
      previewInfo: null
    }));

    // Basic validation on change
    if (url.trim()) {
      const validation = UrlImageService.validateImageUrl(url.trim());
      if (!validation.isValid) {
        setUrlInput(prev => ({
          ...prev,
          isValid: false,
          error: validation.error || 'Invalid URL'
        }));
      } else {
        setUrlInput(prev => ({
          ...prev,
          isValid: true,
          error: null
        }));
      }
    }
  };

  // Preview URL (check if it's actually an image)
  const handlePreviewUrl = async () => {
    const url = urlInput.url.trim();
    if (!url) return;

    try {
      setUrlInput(prev => ({ ...prev, isValidating: true }));
      
      const result = await UrlImageService.checkUrlIsImage(url);
      
      if (result.isImage) {
        setUrlInput(prev => ({
          ...prev,
          isValid: true,
          error: null,
          previewInfo: {
            contentType: result.contentType,
            size: result.size
          }
        }));
        
        toast({
          title: "Valid Image URL",
          description: `Found ${result.contentType} image${result.size ? ` (${Math.round(result.size / 1024)} KB)` : ''}`,
        });
      } else {
        setUrlInput(prev => ({
          ...prev,
          isValid: false,
          error: 'URL does not appear to be an image'
        }));
      }
    } catch (error) {
      setUrlInput(prev => ({
        ...prev,
        isValid: false,
        error: 'Could not access the URL'
      }));
    } finally {
      setUrlInput(prev => ({ ...prev, isValidating: false }));
    }
  };

  // Fetch image from URL
  const handleFetchFromUrl = async () => {
    const url = urlInput.url.trim();
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a valid image URL.",
        variant: "destructive",
      });
      return;
    }

    console.log('🌐 URL upload started:', url);

    // Validate URL format before attempting fetch
    const validation = UrlImageService.validateImageUrl(url);
    if (!validation.isValid) {
      console.error('❌ URL validation failed:', validation.error);
      toast({
        title: "Invalid URL",
        description: validation.error || "Please enter a valid image URL.",
        variant: "destructive",
      });
      return;
    }

    try {
      setFetchingUrl(true);
      
      console.log('✅ URL validation passed, fetching image...');
      
      const cloudinaryUrl = await UrlImageService.fetchAndUploadImage(
        url,
        productId,
        !mainImage // is main image if no main image exists
      );
      
      console.log('✅ URL upload successful:', cloudinaryUrl);
      
      onImageUploaded(cloudinaryUrl);
      
      // Trigger real-time sync
      RealtimeImageSync.onImageUploaded(productId);
      
      // Reset URL input
      setUrlInput({
        url: '',
        isValidating: false,
        isValid: null,
        error: null,
        previewInfo: null
      });
      
      toast({
        title: "Success",
        description: "Image fetched and uploaded successfully!",
      });
    } catch (error) {
      console.error('❌ URL upload error:', error);
      
      let errorMessage = "Failed to fetch image from URL.";
      
      if (error instanceof Error) {
        if (error.message.includes('unauthenticated')) {
          errorMessage = "Please login as admin to upload images.";
        } else if (error.message.includes('permission-denied')) {
          errorMessage = "Admin permission required to upload images.";
        } else if (error.message.includes('functions/not-found')) {
          errorMessage = "Image upload service is not available. Please contact support.";
        } else if (error.message.includes('functions/internal')) {
          errorMessage = "Server error occurred. Please try again later.";
        } else if (error.message.includes('Could not reach')) {
          errorMessage = "Cannot access the image URL. Please check the URL and try again.";
        } else if (error.message.includes('404')) {
          errorMessage = "Image not found at the provided URL.";
        } else {
          errorMessage = error.message;
        }
      }
      
      // Show user-friendly error message
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Update URL input state to show error
      setUrlInput(prev => ({
        ...prev,
        isValid: false,
        error: errorMessage
      }));
    } finally {
      setFetchingUrl(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const isUploadDisabled = disabled || uploadingFile || fetchingUrl;

  return (
    <div className="space-y-4">
      {/* Current Images Display */}
      {(mainImage || currentImages.length > 0) && (
        <div className="space-y-4">
          {/* Main Image */}
          {mainImage && (
            <div>
              <Label className="text-sm font-medium">Main Product Image</Label>
              <div className="mt-2 relative inline-block">
                <img
                  src={mainImage}
                  alt="Main product"
                  className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={() => onImageRemoved(mainImage, true)}
                  disabled={isUploadDisabled}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Additional Images */}
          {currentImages.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Additional Images</Label>
              <div className="mt-2 grid grid-cols-4 gap-4">
                {currentImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border shadow-sm"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => onImageRemoved(image)}
                      disabled={isUploadDisabled}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Interface */}
      <Card>
        <CardContent className="p-4">
          <Tabs defaultValue="file" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file" disabled={isUploadDisabled}>
                <Upload className="h-4 w-4 mr-2" />
                Upload from Computer
              </TabsTrigger>
              <TabsTrigger value="url" disabled={isUploadDisabled}>
                <LinkIcon className="h-4 w-4 mr-2" />
                Add from URL
              </TabsTrigger>
            </TabsList>

            {/* File Upload Tab */}
            <TabsContent value="file" className="space-y-4">
              <div className="text-center">
                {!mainImage && currentImages.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No images uploaded</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      disabled={isUploadDisabled}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      disabled={isUploadDisabled}
                    >
                      {uploadingFile ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Add more images to your product</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload-additional"
                      disabled={isUploadDisabled}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload-additional')?.click()}
                      disabled={isUploadDisabled}
                    >
                      {uploadingFile ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Add Another Image
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 text-center">
                Supported formats: JPEG, PNG, WebP • Max size: 5MB
              </div>
            </TabsContent>

            {/* URL Upload Tab */}
            <TabsContent value="url" className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="image-url">Image URL</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      id="image-url"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={urlInput.url}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      disabled={isUploadDisabled}
                      className={
                        urlInput.isValid === false ? 'border-red-500' :
                        urlInput.isValid === true ? 'border-green-500' : ''
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviewUrl}
                    disabled={!urlInput.url.trim() || urlInput.isValidating || isUploadDisabled}
                  >
                    {urlInput.isValidating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ExternalLink className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* URL Validation Feedback */}
                {urlInput.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{urlInput.error}</AlertDescription>
                  </Alert>
                )}

                {urlInput.isValid && urlInput.previewInfo && (
                  <Alert>
                    <Check className="h-4 w-4" />
                    <AlertDescription>
                      Valid image found: {urlInput.previewInfo.contentType}
                      {urlInput.previewInfo.size && ` • ${formatFileSize(urlInput.previewInfo.size)}`}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Fetch Button */}
                <Button
                  type="button"
                  onClick={handleFetchFromUrl}
                  disabled={!urlInput.url.trim() || urlInput.isValid !== true || fetchingUrl || isUploadDisabled}
                  className="w-full"
                >
                  {fetchingUrl ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Fetching Image...
                    </>
                  ) : (
                    <>
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Fetch Image from URL
                    </>
                  )}
                </Button>

                <div className="text-xs text-gray-500">
                  <p>• Paste the direct URL of an image</p>
                  <p>• The image will be downloaded and uploaded to our servers</p>
                  <p>• Supported formats: JPEG, PNG, GIF, WebP</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedImageUpload;
