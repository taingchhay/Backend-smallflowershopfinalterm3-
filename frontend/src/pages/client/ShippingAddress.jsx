import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Plus, Edit, Trash2, X, Check, MapPin, Home, Briefcase, User } from 'lucide-react';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:3000';

const ShippingAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    commune: '',
    province: '',
    postalCode: '',
    country: 'Cambodia',
    label: ''
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const decode = jwtDecode(token);
        const userId = decode.userId;

        const response = await axios.get(`${BASE_URL}/api/shipping-addresses/${userId}`);
        if (response.data.success) {
          setAddresses(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const decode = jwtDecode(token);
      const userId = decode.userId;

      const response = await axios.post(`${BASE_URL}/api/shipping-addresses`, {
        ...formData,
        userId
      });

      if (response.data.success) {
        setAddresses(prev => [...prev, response.data.data]);
        setIsModalOpen(false);
        setFormData({
          street: '',
          city: '',
          commune: '',
          province: '',
          postalCode: '',
          country: 'Cambodia',
          label: ''
        });

      }
    } catch (error) {
      console.error('Error creating address:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/shipping-addresses/${id}`);
      if (response.data.success) {
        setAddresses(prev => prev.filter(address => address.id !== id));
        toast.success('Shipping Address Deleted Successfully');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const getLabelIcon = (label) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('home')) return <Home className="h-5 w-5 text-baby-pink-600" />;
    if (lowerLabel.includes('work') || lowerLabel.includes('office')) return <Briefcase className="h-5 w-5 text-baby-pink-600" />;
    return <User className="h-5 w-5 text-baby-pink-600" />;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <div className="animate-pulse bg-white rounded-xl shadow-lg p-12">
          <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Shipping Addresses</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-primary text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Shipping Addresses</h2>
          <p className="text-gray-600 mb-8">You haven't added any shipping addresses yet.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-primary text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {getLabelIcon(address.label)}
                  <span className="ml-2 font-semibold text-gray-800">{address.label}</span>
                </div>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-2 text-gray-600">
                <p className="flex items-start">
                  <span className="w-24 text-gray-500">Street:</span>
                  <span>{address.street}</span>
                </p>
                <p className="flex items-start">
                  <span className="w-24 text-gray-500">City:</span>
                  <span>{address.city}</span>
                </p>
                <p className="flex items-start">
                  <span className="w-24 text-gray-500">Commune:</span>
                  <span>{address.commune}</span>
                </p>
                <p className="flex items-start">
                  <span className="w-24 text-gray-500">Province:</span>
                  <span>{address.province}</span>
                </p>
                {address.postalCode && (
                  <p className="flex items-start">
                    <span className="w-24 text-gray-500">Postal Code:</span>
                    <span>{address.postalCode}</span>
                  </p>
                )}
                <p className="flex items-start">
                  <span className="w-24 text-gray-500">Country:</span>
                  <span>{address.country}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Add New Address</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    id="label"
                    name="label"
                    value={formData.label}
                    onChange={handleInputChange}
                    placeholder="e.g., Home, Work, Mom's House"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-baby-pink-500 focus:border-baby-pink-500"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-baby-pink-500 focus:border-baby-pink-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City/District
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-baby-pink-500 focus:border-baby-pink-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="commune" className="block text-sm font-medium text-gray-700 mb-1">
                        Commune/Ward
                      </label>
                      <input
                        type="text"
                        id="commune"
                        name="commune"
                        value={formData.commune}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-baby-pink-500 focus:border-baby-pink-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                        Province/State
                      </label>
                      <input
                        type="text"
                        id="province"
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-baby-pink-500 focus:border-baby-pink-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code (Optional)
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-baby-pink-500 focus:border-baby-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-baby-pink-500 focus:border-baby-pink-500"
                      required
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-primary text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingAddress;