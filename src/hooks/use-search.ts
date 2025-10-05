import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface SearchProduct {
  id: string;
  name: string;
  name_lowercase: string;
  price: string;
  image: string;
  category: string;
  description: string;
}

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Debounce utility function
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  // Search Firebase products
  const searchFirestore = async (term: string): Promise<SearchProduct[]> => {
    try {
      const normalizedTerm = term.toLowerCase().trim();
      if (!normalizedTerm) return [];

      // Query products that start with the search term
      const productsRef = collection(db, 'products');
      const q = query(
        productsRef,
        where('name_lowercase', '>=', normalizedTerm),
        where('name_lowercase', '<=', normalizedTerm + '\uf8ff'),
        orderBy('name_lowercase'),
        limit(6)
      );

      const querySnapshot = await getDocs(q);
      const searchResults: SearchProduct[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        searchResults.push({
          id: doc.id,
          name: data.name,
          name_lowercase: data.name_lowercase,
          price: data.price,
          image: data.image,
          category: data.category,
          description: data.description
        });
      });

      return searchResults;
    } catch (error) {
      console.error('Firebase search error:', error);
      return [];
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (!term.trim()) {
        setResults([]);
        setIsLoading(false);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      
      try {
        // Search Firebase products
        const searchResults = await searchFirestore(term);
        setResults(searchResults);
        setIsOpen(searchResults.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    if (value.trim().length > 0) {
      debouncedSearch(value);
    } else {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
    }
  };

  // Clear search results
  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setIsOpen(false);
    setIsLoading(false);
  };

  // Close search dropdown
  const closeSearch = () => {
    setIsOpen(false);
  };

  return {
    searchTerm,
    results,
    isLoading,
    isOpen,
    handleSearchChange,
    clearSearch,
    closeSearch
  };
};
