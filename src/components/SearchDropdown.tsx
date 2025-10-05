import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Package } from 'lucide-react';
import { SearchProduct } from '@/hooks/use-search';

interface SearchDropdownProps {
  results: SearchProduct[];
  isLoading: boolean;
  isOpen: boolean;
  onProductClick: (productId: string) => void;
  onClose: () => void;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  results,
  isLoading,
  isOpen,
  onProductClick,
  onClose
}) => {
  const navigate = useNavigate();

  if (!isOpen) {
    return null;
  }

  const handleProductClick = (product: SearchProduct) => {
    onProductClick(product.id);
    onClose();
    // Navigate to product detail page (you can customize this route)
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          <span className="ml-2 text-sm text-gray-500">Searching...</span>
        </div>
      ) : results.length > 0 ? (
        <div className="py-2">
          {results.map((product) => (
            <button
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-white transition-colors duration-150 text-left focus:outline-none focus:bg-white"
            >
              {/* Product Image */}
              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {product.category}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    <span className="text-sm font-semibold text-primary">
                      {product.price}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
          
          {/* View All Results Link */}
          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={() => {
                onClose();
                navigate(`/search?q=${encodeURIComponent(results[0]?.name_lowercase || '')}`);
              }}
              className="w-full px-4 py-2 text-sm text-primary hover:bg-primary/5 transition-colors duration-150 font-medium"
            >
              View all results
            </button>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No products found</p>
          <p className="text-xs text-gray-400 mt-1">Try searching for something else</p>
        </div>
      )}
    </div>
  );
};

