import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Plus, 
  X, 
  Upload, 
  Image as ImageIcon, 
  Save, 
  ArrowLeft,
  Trash2
} from 'lucide-react';
import { Product, ProductVariant, addProduct, getProductById, updateProduct } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  // Form state
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<Partial<Product>>({
    name: '',
    description: '',
    detailedDescription: '',
    category: '',
    price: '',
    originalPrice: '',
    image: '',
    images: [],
    inStock: true,
    variants: [],
    nutritionalInfo: '',
    ingredients: '',
    origin: '',
    weight: '',
    dimensions: ''
  });

  // Variant form state
  const [showVariantDialog, setShowVariantDialog] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [variantForm, setVariantForm] = useState<ProductVariant>({
    name: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    isDefault: false
  });

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);

  const categories = [
    'Food',
    'Decor',
    'Spices',
    'Rice & Grains',
    'Snacks',
    'Sweets',
    'Decorative Items',
    'Religious Items',
    'Handicrafts'
  ];

  // Load product data for editing
  useEffect(() => {
    if (isEdit && id) {
      loadProduct(id);
    }
  }, [id, isEdit]);

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);
      const product = await getProductById(productId);
      if (product) {
        setProductData(product);
      } else {
        toast({
          title: "Error",
          description: "Product not found.",
          variant: "destructive",
        });
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast({
        title: "Error",
        description: "Failed to load product data.",
        variant: "destructive",
      });
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setProductData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      
      // In a real app, you would upload to Cloudinary or Firebase Storage
      // For now, we'll create a mock URL
      const imageUrl = URL.createObjectURL(file);
      
      if (!productData.image) {
        handleInputChange('image', imageUrl);
      } else {
        const currentImages = productData.images || [];
        handleInputChange('images', [...currentImages, imageUrl]);
      }

      toast({
        title: "Success",
        description: "Image uploaded successfully.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (imageUrl: string, isMain: boolean = false) => {
    if (isMain) {
      handleInputChange('image', '');
    } else {
      const currentImages = productData.images || [];
      handleInputChange('images', currentImages.filter(img => img !== imageUrl));
    }
  };

  const handleVariantSubmit = () => {
    if (!variantForm.name || variantForm.price <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required variant fields.",
        variant: "destructive",
      });
      return;
    }

    const currentVariants = productData.variants || [];
    
    if (editingVariant) {
      // Update existing variant
      const updatedVariants = currentVariants.map(v => 
        v.name === editingVariant.name ? variantForm : v
      );
      handleInputChange('variants', updatedVariants);
    } else {
      // Add new variant
      handleInputChange('variants', [...currentVariants, variantForm]);
    }

    setShowVariantDialog(false);
    setEditingVariant(null);
    setVariantForm({
      name: '',
      price: 0,
      originalPrice: 0,
      stock: 0,
      isDefault: false
    });
  };

  const editVariant = (variant: ProductVariant) => {
    setVariantForm(variant);
    setEditingVariant(variant);
    setShowVariantDialog(true);
  };

  const removeVariant = (variantName: string) => {
    const currentVariants = productData.variants || [];
    handleInputChange('variants', currentVariants.filter(v => v.name !== variantName));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productData.name || !productData.description || !productData.category || !productData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      if (isEdit && id) {
        await updateProduct(id, productData as Product);
        toast({
          title: "Success",
          description: "Product updated successfully.",
        });
      } else {
        await addProduct(productData as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
        toast({
          title: "Success",
          description: "Product added successfully.",
        });
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading product data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/admin/products')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-500">
            {isEdit ? 'Update product information' : 'Create a new product for your catalog'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={productData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={productData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description *</Label>
              <Textarea
                id="description"
                value={productData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description for product listing"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="detailedDescription">Detailed Description</Label>
              <Textarea
                id="detailedDescription"
                value={productData.detailedDescription}
                onChange={(e) => handleInputChange('detailedDescription', e.target.value)}
                placeholder="Detailed product description"
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  value={productData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="₹0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price (Optional)</Label>
                <Input
                  id="originalPrice"
                  value={productData.originalPrice}
                  onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                  placeholder="₹0.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {/* Main Image */}
              <div>
                <Label>Main Product Image</Label>
                {productData.image ? (
                  <div className="mt-2 relative inline-block">
                    <img
                      src={productData.image}
                      alt="Main product"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2"
                      onClick={() => removeImage(productData.image!, true)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No main image uploaded</p>
                  </div>
                )}
              </div>

              {/* Additional Images */}
              <div>
                <Label>Additional Images</Label>
                <div className="mt-2 grid grid-cols-4 gap-4">
                  {productData.images?.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2"
                        onClick={() => removeImage(image)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload Button */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={uploadingImage}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Variants */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Product Variants</CardTitle>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowVariantDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Variant
            </Button>
          </CardHeader>
          <CardContent>
            {productData.variants && productData.variants.length > 0 ? (
              <div className="space-y-3">
                {productData.variants.map((variant, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{variant.name}</span>
                        {variant.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        Price: ₹{variant.price} | Stock: {variant.stock} units
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editVariant(variant)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(variant.name)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No variants added. Click "Add Variant" to create different options for this product.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  value={productData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="e.g., 1kg, 500g"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <Input
                  id="origin"
                  value={productData.origin}
                  onChange={(e) => handleInputChange('origin', e.target.value)}
                  placeholder="e.g., India, Andhra Pradesh"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients</Label>
              <Textarea
                id="ingredients"
                value={productData.ingredients}
                onChange={(e) => handleInputChange('ingredients', e.target.value)}
                placeholder="List of ingredients"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nutritionalInfo">Nutritional Information</Label>
              <Textarea
                id="nutritionalInfo"
                value={productData.nutritionalInfo}
                onChange={(e) => handleInputChange('nutritionalInfo', e.target.value)}
                placeholder="Nutritional facts and information"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                checked={productData.inStock}
                onCheckedChange={(checked) => handleInputChange('inStock', checked)}
              />
              <Label htmlFor="inStock">Product is in stock</Label>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/products')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
          </Button>
        </div>
      </form>

      {/* Variant Dialog */}
      <AlertDialog open={showVariantDialog} onOpenChange={setShowVariantDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {editingVariant ? 'Edit Variant' : 'Add Product Variant'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Create different options for your product (e.g., different sizes, weights, etc.)
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="variantName">Variant Name</Label>
              <Input
                id="variantName"
                value={variantForm.name}
                onChange={(e) => setVariantForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., 500g, Large, Premium"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="variantPrice">Price</Label>
                <Input
                  id="variantPrice"
                  type="number"
                  value={variantForm.price}
                  onChange={(e) => setVariantForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variantStock">Stock</Label>
                <Input
                  id="variantStock"
                  type="number"
                  value={variantForm.stock}
                  onChange={(e) => setVariantForm(prev => ({ ...prev, stock: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                checked={variantForm.isDefault}
                onCheckedChange={(checked) => setVariantForm(prev => ({ ...prev, isDefault: checked as boolean }))}
              />
              <Label htmlFor="isDefault">Set as default variant</Label>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleVariantSubmit}>
              {editingVariant ? 'Update' : 'Add'} Variant
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProductForm;