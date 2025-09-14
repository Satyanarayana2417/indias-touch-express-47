import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchDropdown } from '@/components/SearchDropdown';
import { useSearch } from '@/hooks/use-search';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  isMobile?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search for Indian food, spices, decorative items...",
  className = "",
  isMobile = false 
}) => {
  const navigate = useNavigate();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    searchTerm,
    results,
    isLoading,
    isOpen,
    handleSearchChange,
    clearSearch,
    closeDropdown
  } = useSearch();

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeDropdown]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchTerm.trim()) {
        closeDropdown();
        navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      }
    } else if (e.key === 'Escape') {
      closeDropdown();
      inputRef.current?.blur();
    }
  };

  // Handle search button click
  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      closeDropdown();
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Handle product selection
  const handleProductClick = (productId: string) => {
    console.log('Product clicked:', productId);
    // Additional analytics or tracking can be added here
  };

  // Handle clear search
  const handleClearSearch = () => {
    clearSearch();
    inputRef.current?.focus();
  };

  return (
    <div ref={searchContainerRef} className={`relative ${className}`}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`
            ${isMobile 
              ? "pl-3 pr-10 h-9 rounded-full w-full bg-white border-0 text-gray-700 placeholder-gray-500 text-sm" 
              : "w-full h-12 pl-4 pr-24 text-base border-2 border-gray-300 rounded-full focus:border-primary transition-colors"
            }
            ${isOpen ? 'rounded-b-none' : ''}
          `}
          autoComplete="off"
        />
        
        {/* Clear button (when there's text) */}
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className={`absolute ${isMobile ? 'right-8 top-2' : 'right-14 top-3'} text-gray-400 hover:text-gray-600 transition-colors`}
            type="button"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Search button */}
        {isMobile ? (
          <Search 
            className="absolute right-3 top-2 h-4 w-4 text-gray-400 cursor-pointer" 
            onClick={handleSearchClick}
          />
        ) : (
          <Button 
            onClick={handleSearchClick}
            size="sm" 
            className="absolute right-1 top-1 h-10 px-4 bg-primary hover:bg-primary-hover rounded-full"
            type="button"
          >
            <Search className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Dropdown */}
      <SearchDropdown
        results={results}
        isLoading={isLoading}
        isOpen={isOpen}
        onProductClick={handleProductClick}
        onClose={closeDropdown}
      />
    </div>
  );
};
