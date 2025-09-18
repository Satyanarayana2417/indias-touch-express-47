import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';

interface ProductFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  isFilterOpen: boolean;
  onFilterToggle: (open: boolean) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
}

const categories = [
  { value: "all", label: "All Categories" },
  { value: "spices", label: "Spices & Seasonings" },
  { value: "grains", label: "Rice & Grains" },
  { value: "snacks", label: "Indian Snacks" },
  { value: "sweets", label: "Traditional Sweets" },
  { value: "pickles", label: "Pickles & Preserves" },
  { value: "decorative", label: "Decorative Items" },
  { value: "religious", label: "Religious Items" },
  { value: "kitchen", label: "Kitchen Essentials" }
];

const sortOptions = [
  { value: "relevance", label: "Most Relevant" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" }
];

const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  isFilterOpen,
  onFilterToggle,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onClearFilters
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="text-sm font-medium mb-2 block">Search Products</label>
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div>
        <label className="text-sm font-medium mb-2 block">Category</label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
        </label>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => onPriceRangeChange(value as [number, number])}
            max={20000}
            min={0}
            step={100}
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>₹0</span>
          <span>₹20,000</span>
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="text-sm font-medium mb-2 block">Sort By</label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        onClick={onClearFilters}
        className="w-full"
      >
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Bar */}
      <div className="lg:hidden mb-4">
        <div className="flex gap-2 items-center">
          <Sheet open={isFilterOpen} onOpenChange={onFilterToggle}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Filter products by category, price, and more
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Quick Sort for Mobile */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Filters</h3>
          </div>
          <FilterContent />
        </div>
      </div>
    </>
  );
};

export default ProductFilters;