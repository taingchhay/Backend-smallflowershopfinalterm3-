import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Plus, Edit, Trash2, Search, Filter, Eye, RotateCcw } from 'lucide-react';

const AdminFlowers = () => {
  const [flowers, setFlowers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingFlower, setEditingFlower] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'roses',
    stock: '',
    image: ''
  });

  // Load flowers from localStorage on component mount
  useEffect(() => {
    loadFlowers();
  }, []);

  const loadFlowers = () => {
    const savedFlowers = localStorage.getItem('adminFlowers');
    if (savedFlowers) {
      try {
        const parsedFlowers = JSON.parse(savedFlowers);
        console.log('Loaded flowers from storage:', parsedFlowers);
        setFlowers(parsedFlowers);
      } catch (error) {
        console.error('Error parsing saved flowers:', error);
        loadDefaultFlowers();
      }
    } else {
      console.log('No saved flowers found, loading defaults');
      loadDefaultFlowers();
    }
  };

  const loadDefaultFlowers = () => {
    const defaultFlowers = [
      {
        id: 1,
        name: 'Red Rose Bouquet',
        description: 'Beautiful red roses perfect for romantic occasions',
        price: 29.99,
        category: 'roses',
        stock: 25,
        image: 'https://theglasshouseflowers.com/cdn/shop/files/One-Dozen-Roses-2.jpg?v=1702952433',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Sunflower Bundle',
        description: 'Bright and cheerful sunflowers to brighten any day',
        price: 24.99,
        category: 'sunflowers',
        stock: 18,
        image: 'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?auto=compress&cs=tinysrgb&w=400',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Mixed Spring Flowers',
        description: 'A beautiful arrangement of seasonal spring flowers',
        price: 34.99,
        category: 'mixed',
        stock: 12,
        image: 'https://images.pexels.com/photos/1146603/pexels-photo-1146603.jpeg?auto=compress&cs=tinysrgb&w=400',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 4,
        name: 'White Lily Arrangement',
        description: 'Elegant white lilies for special occasions',
        price: 42.99,
        category: 'lilies',
        stock: 15,
        image: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=400',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 5,
        name: 'Pink Tulip Bouquet',
        description: 'Fresh pink tulips perfect for spring celebrations',
        price: 27.99,
        category: 'tulips',
        stock: 20,
        image: 'https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg?auto=compress&cs=tinysrgb&w=400',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 6,
        name: 'Purple Orchid Plant',
        description: 'Exotic purple orchid plant for home decoration',
        price: 55.99,
        category: 'orchids',
        stock: 8,
        image: 'https://images.pexels.com/photos/1449087/pexels-photo-1449087.jpeg?auto=compress&cs=tinysrgb&w=400',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    setFlowers(defaultFlowers);
    saveFlowers(defaultFlowers);
  };

  // Save flowers to localStorage
  const saveFlowers = (flowersToSave) => {
    try {
      console.log('Saving flowers to storage:', flowersToSave);
      localStorage.setItem('adminFlowers', JSON.stringify(flowersToSave));
      localStorage.setItem('shopFlowers', JSON.stringify(flowersToSave)); // Sync with shop
    } catch (error) {
      console.error('Error saving flowers:', error);
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'roses', label: 'Roses' },
    { value: 'sunflowers', label: 'Sunflowers' },
    { value: 'lilies', label: 'Lilies' },
    { value: 'tulips', label: 'Tulips' },
    { value: 'orchids', label: 'Orchids' },
    { value: 'mixed', label: 'Mixed' }
  ];

  const filteredFlowers = flowers.filter(flower => {
    const matchesSearch = flower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flower.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || flower.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedFlowers = [...flowers];
    
    if (editingFlower) {
      // Update existing flower
      const index = updatedFlowers.findIndex(flower => flower.id === editingFlower.id);
      if (index !== -1) {
        updatedFlowers[index] = {
          ...updatedFlowers[index],
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          updatedAt: new Date().toISOString()
        };
        showSuccess(`"${formData.name}" updated successfully!`);
      }
    } else {
      // Add new flower
      const newFlower = {
        id: Date.now(), // Simple ID generation
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      updatedFlowers.push(newFlower);
      showSuccess(`"${formData.name}" added successfully!`);
    }
    
    setFlowers(updatedFlowers);
    saveFlowers(updatedFlowers);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'roses',
      stock: '',
      image: ''
    });
    setEditingFlower(null);
    setShowModal(false);
  };

  const handleEdit = (flower) => {
    setEditingFlower(flower);
    setFormData({
      name: flower.name,
      description: flower.description,
      price: flower.price.toString(),
      category: flower.category,
      stock: flower.stock.toString(),
      image: flower.image || ''
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const flowerToDelete = flowers.find(f => f.id === id);
    if (window.confirm(`Are you sure you want to delete "${flowerToDelete?.name}"? This action cannot be undone.`)) {
      const updatedFlowers = flowers.filter(flower => flower.id !== id);
      setFlowers(updatedFlowers);
      saveFlowers(updatedFlowers);
      showSuccess(`"${flowerToDelete?.name}" deleted successfully!`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Flowers</h1>
        <p className="text-gray-600">Add, edit, and manage your flower inventory</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 animate-fadeIn">
          ✅ {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Header Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1">
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

              {/* Add Button */}
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Flower
              </button>
            </div>
          </div>

          {/* Flowers Table/Grid */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Flowers ({filteredFlowers.length})
              </h2>
            </div>

            {filteredFlowers.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No flowers found</h3>
                <p className="text-gray-600">Try adjusting your search or add a new flower</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">Image</th>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">Category</th>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">Price</th>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">Stock</th>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredFlowers.map((flower) => (
                      <tr key={flower.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <img
                            src={flower.image || `https://images.pexels.com/photos/1164985/pexels-photo-1164985.jpeg?auto=compress&cs=tinysrgb&w=100`}
                            alt={flower.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-semibold text-gray-800">{flower.name}</p>
                            <p className="text-sm text-gray-600 truncate max-w-xs">{flower.description}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-baby-pink-100 text-baby-pink-800 rounded-full text-sm font-semibold capitalize">
                            {flower.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-semibold text-gray-800">
                          ${flower.price.toFixed(2)}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            flower.stock > 10 ? 'bg-green-100 text-green-800' :
                            flower.stock > 5 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {flower.stock}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(flower)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(flower.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingFlower ? 'Edit Flower' : 'Add New Flower'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Flower Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baby-pink-500 focus:border-baby-pink-500"
                    placeholder="Enter flower name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baby-pink-500 focus:border-baby-pink-500"
                  >
                    {categories.slice(1).map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baby-pink-500 focus:border-baby-pink-500"
                  placeholder="Enter flower description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baby-pink-500 focus:border-baby-pink-500"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baby-pink-500 focus:border-baby-pink-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baby-pink-500 focus:border-baby-pink-500"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave empty to use default image
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-primary text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  {editingFlower ? 'Update Flower' : 'Add Flower'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFlowers;