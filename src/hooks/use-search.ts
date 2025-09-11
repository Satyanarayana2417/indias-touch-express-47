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
}

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Debounce function
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  // Mock data for development (since Firebase might not be configured)
  const mockProducts: SearchProduct[] = [
    // Products starting with 'A'
    {
      id: '1',
      name: 'Asafoetida (Hing) Powder',
      name_lowercase: 'asafoetida (hing) powder',
      price: '₹1,349',
      image: 'https://5.imimg.com/data5/SELLER/Default/2020/12/YS/DI/CX/8765432/asafoetida-powder-500x500.jpg',
      category: 'spices'
    },
    {
      id: '2',
      name: 'Ajwain (Carom Seeds)',
      name_lowercase: 'ajwain (carom seeds)',
      price: '₹759',
      image: 'https://5.imimg.com/data5/SELLER/Default/2021/7/QF/MC/WE/12345678/ajwain-seeds-500x500.jpg',
      category: 'spices'
    },
    // Products starting with 'B'
    {
      id: '3',
      name: 'Basmati Rice Premium',
      name_lowercase: 'basmati rice premium',
      price: '₹1,999',
      image: 'https://5.imimg.com/data5/SELLER/Default/2022/9/AW/WY/JQ/17906995/basmati-rice-1000x1000.jpg',
      category: 'rice-grains'
    },
    {
      id: '4',
      name: 'Brass Diya Set',
      name_lowercase: 'brass diya set',
      price: '$34.99',
      image: 'https://m.media-amazon.com/images/I/61eiR2QdMJL.jpg',
      category: 'decorative'
    },
    {
      id: '5',
      name: 'Black Mustard Seeds',
      name_lowercase: 'black mustard seeds',
      price: '$6.99',
      image: 'https://5.imimg.com/data5/SELLER/Default/2021/4/GP/RY/LT/9876543/black-mustard-seeds-500x500.jpg',
      category: 'spices'
    },
    // Products starting with 'C'
    {
      id: '6',
      name: 'Cardamom Pods Green',
      name_lowercase: 'cardamom pods green',
      price: '$24.99',
      image: 'https://media.istockphoto.com/id/1327578667/photo/cardamom-pods-isolated-on-white-background-top-view.jpg?s=612x612&w=0&k=20&c=Z4FXGWlmYi9qXTs26a4xsa2eZAzHDkdf_b_WFy_BnmI=',
      category: 'spices'
    },
    {
      id: '7',
      name: 'Cumin Seeds Whole',
      name_lowercase: 'cumin seeds whole',
      price: '$12.99',
      image: 'https://www.shutterstock.com/image-photo/front-view-wooden-scoop-filled-600nw-2447634023.jpg',
      category: 'spices'
    },
    {
      id: '8',
      name: 'Coriander Powder',
      name_lowercase: 'coriander powder',
      price: '$9.99',
      image: 'https://5.imimg.com/data5/SELLER/Default/2020/12/YS/DI/CX/8765432/coriander-powder-500x500.jpg',
      category: 'spices'
    },
    {
      id: '9',
      name: 'Coffee Powder Premium',
      name_lowercase: 'coffee powder premium',
      price: '₹1,999',
      image: 'https://www.jiomart.com/images/product/original/rvfav9k7op/pack-of-2-200-gram-100-arabica-instant-classic-strong-coffee-powder-premium-coffee-strong-coffee-classic-coffee-espresso-latte-cappucino-pure-coffee-hot-cold-coffee-non-breakable-jar-product-images-orvfav9k7op-p600689638-0-202304190917.png?im=Resize=(1000,1000)',
      category: 'beverages'
    },
    // Products starting with 'G'
    {
      id: '10',
      name: 'Garam Masala Premium',
      name_lowercase: 'garam masala premium',
      price: '$18.99',
      image: 'https://png.pngtree.com/png-vector/20240810/ourmid/pngtree-authentic-garam-masala-powder-for-rich-indian-flavors-png-image_13440740.png',
      category: 'spices'
    },
    {
      id: '11',
      name: 'Ghee Pure Cow',
      name_lowercase: 'ghee pure cow',
      price: '₹899',
      image: 'https://5.imimg.com/data5/SELLER/Default/2021/3/RE/GL/LJ/5885760/pure-cow-ghee-500x500.jpg',
      category: 'oils'
    },
    {
      id: '12',
      name: 'Green Tea Organic',
      name_lowercase: 'green tea organic',
      price: '₹449',
      image: 'https://5.imimg.com/data5/SELLER/Default/2021/4/GP/RY/LT/9876543/green-tea-bags-500x500.jpg',
      category: 'beverages'
    },
    // Products starting with 'H'
    {
      id: '13',
      name: 'Haldi (Turmeric) Powder',
      name_lowercase: 'haldi (turmeric) powder',
      price: '$12.99',
      image: 'https://media.istockphoto.com/id/1137344824/photo/turmeric-powder-and-roots-shot-from-above-on-white-background.jpg?s=612x612&w=0&k=20&c=f7q7ZkG-xp4ya1lLimbtdGj1hO5jafG46KEO3cRSsIA=',
      category: 'spices'
    },
    {
      id: '14',
      name: 'Honey Pure Raw',
      name_lowercase: 'honey pure raw',
      price: '$16.99',
      image: 'https://5.imimg.com/data5/SELLER/Default/2021/8/HK/LM/NO/1234567/raw-honey-500x500.jpg',
      category: 'natural'
    },
    // Products starting with 'J'
    {
      id: '15',
      name: 'Jaggery Organic',
      name_lowercase: 'jaggery organic',
      price: '₹349',
      image: 'https://5.imimg.com/data5/SELLER/Default/2021/2/LM/NO/PQ/1234567/organic-jaggery-500x500.jpg',
      category: 'natural'
    },
    {
      id: '16',
      name: 'Jeera (Cumin) Powder',
      name_lowercase: 'jeera (cumin) powder',
      price: '$11.99',
      image: 'https://5.imimg.com/data5/SELLER/Default/2020/11/AB/CD/EF/9876543/cumin-powder-500x500.jpg',
      category: 'spices'
    },
    // Products starting with 'M'
    {
      id: '17',
      name: 'Masala Chai Blend',
      name_lowercase: 'masala chai blend',
      price: '₹299',
      image: 'https://png.pngtree.com/png-clipart/20250124/original/pngtree-masala-tea-on-white-background-png-image_20310650.png',
      category: 'beverages'
    },
    {
      id: '18',
      name: 'Mustard Oil Pure',
      name_lowercase: 'mustard oil pure',
      price: '₹599',
      image: 'https://5.imimg.com/data5/SELLER/Default/2021/5/XY/ZA/BC/2345678/mustard-oil-500x500.jpg',
      category: 'oils'
    },
    // Products starting with 'R'
    {
      id: '19',
      name: 'Red Chili Powder',
      name_lowercase: 'red chili powder',
      price: '₹299',
      image: 'https://5.imimg.com/data5/SELLER/Default/2021/7/QF/MC/WE/12345678/red-chilli-powder-500x500.jpg',
      category: 'spices'
    },
    {
      id: '20',
      name: 'Rice Basmati Long Grain',
      name_lowercase: 'rice basmati long grain',
      price: '₹799',
      image: 'https://5.imimg.com/data5/SELLER/Default/2022/8/MN/OP/QR/17906995/long-grain-rice-500x500.jpg',
      category: 'rice-grains'
    },
    // Products starting with 'T'
    {
      id: '21',
      name: 'Turmeric Powder Organic',
      name_lowercase: 'turmeric powder organic',
      price: '$12.99',
      image: 'https://m.media-amazon.com/images/I/616TtvR-zQS._UF350,350_QL80_.jpg',
      category: 'spices'
    },
    {
      id: '22',
      name: 'Tea Masala Chai',
      name_lowercase: 'tea masala chai',
      price: '₹399',
      image: 'https://5.imimg.com/data5/SELLER/Default/2021/6/ST/UV/WX/3456789/masala-tea-500x500.jpg',
      category: 'beverages'
    },
    // Products starting with 'W'
    {
      id: '23',
      name: 'Wooden Elephant Figurine',
      name_lowercase: 'wooden elephant figurine',
      price: '$28.99',
      image: 'https://media.istockphoto.com/id/1129684071/photo/elephant-mother-and-baby-figurine.jpg?s=612x612&w=0&k=20&c=1xV50ZIJjo6ufDuTx_TMh25emQFuICXLtGu6NKnPnWc=',
      category: 'decorative'
    },
    {
      id: '24',
      name: 'Whole Wheat Flour',
      name_lowercase: 'whole wheat flour',
      price: '₹199',
      image: 'https://5.imimg.com/data5/SELLER/Default/2021/9/YZ/AB/CD/4567890/wheat-flour-500x500.jpg',
      category: 'flour'
    }
  ];

  // Search function for Firestore
  const searchFirestore = async (term: string): Promise<SearchProduct[]> => {
    try {
      const normalizedTerm = term.toLowerCase().trim();
      
      // Firestore "starts with" query using range
      const q = query(
        collection(db, 'products'),
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
          image: data.image || '/placeholder.svg',
          category: data.category || 'general'
        });
      });

      return searchResults;
    } catch (error) {
      console.error('Error searching Firestore:', error);
      // Fallback to mock search
      return searchMockData(term);
    }
  };

  // Mock search function for development
  const searchMockData = (term: string): SearchProduct[] => {
    const normalizedTerm = term.toLowerCase().trim();
    if (!normalizedTerm) return [];
    
    return mockProducts
      .filter(product => 
        product.name_lowercase.startsWith(normalizedTerm)
      )
      .slice(0, 6);
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
        // Try Firebase first, fallback to mock data if needed
        const searchResults = await searchFirestore(term);
        setResults(searchResults);
        setIsOpen(searchResults.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        // Fallback to mock search
        const mockResults = searchMockData(term);
        setResults(mockResults);
        setIsOpen(mockResults.length > 0);
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

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setIsOpen(false);
    setIsLoading(false);
  };

  // Close dropdown
  const closeDropdown = () => {
    setIsOpen(false);
  };

  return {
    searchTerm,
    results,
    isLoading,
    isOpen,
    handleSearchChange,
    clearSearch,
    closeDropdown,
    setSearchTerm
  };
};
