import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/lib/products';

interface ProductTabsProps {
  product: Product;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      
      <TabsContent value="description" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Product Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
            {product.detailedDescription && (
              <div className="mt-4">
                <p className="text-gray-700 leading-relaxed">
                  {product.detailedDescription}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="details" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Product Details</h3>
            <div className="space-y-3">
              {product.origin && (
                <div className="flex justify-between">
                  <span className="font-medium">Origin:</span>
                  <span className="text-gray-700">{product.origin}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex justify-between">
                  <span className="font-medium">Weight:</span>
                  <span className="text-gray-700">{product.weight}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex justify-between">
                  <span className="font-medium">Dimensions:</span>
                  <span className="text-gray-700">{product.dimensions}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium">Category:</span>
                <span className="text-gray-700">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Availability:</span>
                <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="nutrition" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Nutritional Information</h3>
            {product.nutritionalInfo ? (
              <div className="space-y-2">
                <p className="text-gray-700 whitespace-pre-line">
                  {product.nutritionalInfo}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 italic">
                Nutritional information not available for this product.
              </p>
            )}
            
            {product.ingredients && (
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Ingredients:</h4>
                <p className="text-gray-700">
                  {product.ingredients}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="reviews" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold">{product.rating || 0}</div>
                <div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < Math.floor(product.rating || 0)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    Based on {product.reviews || 0} reviews
                  </p>
                </div>
              </div>
              
              {/* Placeholder for actual reviews */}
              <div className="mt-6">
                <p className="text-gray-500 italic">
                  Customer reviews will be displayed here once available.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProductTabs;