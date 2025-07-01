import React, { useState, useEffect } from 'react';
import FlowerCard from '../../components/user/FlowerCard';
import { Search, Filter } from 'lucide-react';

const Shop = () => {
  const [flowers, setFlowers] = useState([]);
  const [filteredFlowers, setFilteredFlowers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Mock data - replace with API call
  useEffect(() => {
    const mockFlowers = [
      {
        id: 1,
        name: 'Red Rose Bouquet',
        description: 'Beautiful red roses perfect for romantic occasions',
        price: 29.99,
        originalPrice: 39.99,
        category: 'roses',
        image: 'https://images.pexels.com/photos/1164985/pexels-photo-1164985.jpeg?auto=compress&cs=tinysrgb&w=400',
        inStock: true
      },
      {
        id: 2,
        name: 'Sunflower Bundle',
        description: 'Bright and cheerful sunflowers to brighten any day',
        price: 24.99,
        category: 'sunflowers',
        image: 'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?auto=compress&cs=tinysrgb&w=400',
        inStock: true
      },
      {
        id: 3,
        name: 'Mixed Spring Flowers',
        description: 'A beautiful arrangement of seasonal spring flowers',
        price: 34.99,
        category: 'mixed',
        image: 'https://images.pexels.com/photos/1146603/pexels-photo-1146603.jpeg?auto=compress&cs=tinysrgb&w=400',
        inStock: true
      },
      {
        id: 4,
        name: 'White Lily Arrangement',
        description: 'Elegant white lilies for special occasions',
        price: 42.99,
        category: 'lilies',
        image: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=400',
        inStock: true
      },
      {
        id: 5,
        name: 'Pink Tulip Bouquet',
        description: 'Fresh pink tulips perfect for spring celebrations',
        price: 27.99,
        category: 'tulips',
        image: 'https://cdn.uaeflowers.com/uploads/product/uaeflowers/8379_21_8379.webp',
        inStock: true
      },
      {
        id: 6,
        name: 'Purple Orchid Plant',
        description: 'Exotic purple orchid plant for home decoration',
        price: 55.99,
        category: 'orchids',
        image: 'https://images.pexels.com/photos/1449087/pexels-photo-1449087.jpeg?auto=compress&cs=tinysrgb&w=400',
        inStock: true
      }
    ];
    setFlowers(mockFlowers);
    setFilteredFlowers(mockFlowers);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = flowers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(flower =>
        flower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flower.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(flower => flower.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredFlowers(filtered);
  }, [flowers, searchTerm, selectedCategory, sortBy]);

  const categories = [
    { value: 'all', label: 'All Flowers' },
    { value: 'roses', label: 'Roses' },
    { value: 'sunflowers', label: 'Sunflowers' },
    { value: 'lilies', label: 'Lilies' },
    { value: 'tulips', label: 'Tulips' },
    { value: 'orchids', label: 'Orchids' },
    { value: 'mixed', label: 'Mixed' }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Flower Shop</h1>
        <p className="text-gray-600">Discover our beautiful collection of fresh flowers</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search flowers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baby-pink-500 focus:border-baby-pink-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baby-pink-500 focus:border-baby-pink-500"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baby-pink-500 focus:border-baby-pink-500"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredFlowers.length} of {flowers.length} flowers
        </p>
      </div>

      {/* Flowers Grid - Always in grid layout */}
      {filteredFlowers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFlowers.map(flower => (
            <FlowerCard key={flower.id} flower={flower} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No flowers found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Shop;