/**
 * Flower Card Component
 *
 * Displays individual flower products with cart and wishlist integration.
 * Includes real-time stock checking and API integration.
 *
 * @author Flower Shop Team
 * @version 2.0.0
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Heart, X, ShoppingCart, Zap, Star, AlertCircle, Eye } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = 'http://localhost:3000'

const FlowerCard = ({ flower }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {

    setAddingToCart(true);
    try {
      const token = localStorage.getItem('accessToken');
      const decode = jwtDecode(token);
      const userId = decode.userId;

      const response = await axios.post(`${BASE_URL}/api/cart`, { flower, quantity, userId });
      console.log(response);
      if (response.data.success) {
        setShowModal(false);
        setQuantity(1);
        toast.success('Flower added to cart successfully');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error adding flower to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    setAddingToCart(true);
    try {
      const success = await addToCart(flower, quantity);
      if (success) {
        setShowModal(false);
        setQuantity(1);
        navigate('/cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuickAdd = async (e) => {
    e.stopPropagation();

    setAddingToCart(true);
    try {
      await addToCart(flower, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await wishlistAPI.removeFromWishlist(flower.id);
        setIsInWishlist(false);
      } else {
        await wishlistAPI.addToWishlist(flower.id);
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const openModal = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setQuantity(1);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
        <div className="relative">
          <img
            src={flower.image || `https://images.pexels.com/photos/1164985/pexels-photo-1164985.jpeg?auto=compress&cs=tinysrgb&w=400`}
            alt={flower.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {/* Wishlist Button */}
          {/* <button
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            className={`absolute top-3 right-3 p-2 bg-white rounded-full shadow-md transition-colors ${
              isInWishlist
                ? 'text-red-500 hover:bg-red-50'
                : 'text-gray-600 hover:bg-baby-pink-50 hover:text-baby-pink-500'
            } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </button> */}

          {/* Category Badge */}
          <div className="absolute bottom-3 left-3 bg-baby-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {flower.category || 'Bouquet'}
          </div>

          {/* Sale Badge */}
          {flower.originalPrice && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              SALE
            </div>
          )}

          {/* Stock Status */}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{flower.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{flower.description}</p>
          
          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">(4.8)</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-baby-pink-600">${flower.price}</span>
              {flower.originalPrice && (
                <span className="text-sm text-gray-500 line-through">${flower.originalPrice}</span>
              )}
            </div>
            
            <div className="flex space-x-2">
              {/* <button
                onClick={handleQuickAdd}
                disabled={addingToCart}
                className={`p-2 rounded-full transition-colors ${
                  !addingToCart
                    ? 'bg-baby-pink-100 text-baby-pink-600 hover:bg-baby-pink-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                title={"Quick Add to Cart"}
              >
                {addingToCart ? (
                  <div className="h-4 w-4 border-2 border-baby-pink-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </button> */}
              <button
                onClick={openModal}
                className={`p-2 rounded-full transition-all duration-200 ${
                    'bg-gradient-primary text-white hover:shadow-lg transform hover:scale-110'
                }`}
                title={"View Details & Buy"}
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Fixed positioning and z-index */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative">
              <img
                src={flower.image || `https://images.pexels.com/photos/1164985/pexels-photo-1164985.jpeg?auto=compress&cs=tinysrgb&w=600`}
                alt={flower.name}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
              {flower.originalPrice && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  SALE - {Math.round(((flower.originalPrice - flower.price) / flower.originalPrice) * 100)}% OFF
                </div>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Title and Category */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">{flower.name}</h2>
                  <span className="bg-baby-pink-100 text-baby-pink-800 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                    {flower.category || 'Bouquet'}
                  </span>
                </div>
                
                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-600 ml-2">(4.8) • 127 reviews</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{flower.description}</p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-baby-pink-500 rounded-full mr-2"></div>
                    Fresh & Hand-picked
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-baby-pink-500 rounded-full mr-2"></div>
                    Same-day Delivery
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-baby-pink-500 rounded-full mr-2"></div>
                    Premium Quality
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-baby-pink-500 rounded-full mr-2"></div>
                    Care Instructions
                  </div>
                </div>
              </div>

              {/* Price and Quantity */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl font-bold text-baby-pink-600">${flower.price}</span>
                      {flower.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">${flower.originalPrice}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Free shipping on orders over $50</p>
                  </div>
                  
                  {/* Quantity Selector */}
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-700 font-medium">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1 || addingToCart}
                        className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(flower.stock || 99, quantity + 1))}
                        disabled={quantity >= (flower.stock || 99) || addingToCart}
                        className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Stock Info */}
                  {flower.stock && (
                    <div className="text-sm text-gray-600">
                      {flower.stock} in stock
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2`}
                >
                    <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={addingToCart}
                  className={`flex-1 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                    !addingToCart
                      ? 'bg-gradient-primary text-white hover:shadow-lg transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {addingToCart ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Zap className="h-5 w-5" />
                  )}
                  <span>{addingToCart ? 'Processing...' : 'Buy Now'}</span>
                </button>
              </div>

              {/* Out of Stock Message */}
              {/* {!isAvailable && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-700 font-medium">This item is currently out of stock</span>
                </div>
              )} */}

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-baby-pink-600 font-semibold text-2xl">🚚</div>
                    <p className="text-sm text-gray-600 mt-1">Free Delivery</p>
                  </div>
                  <div>
                    <div className="text-baby-pink-600 font-semibold text-2xl">🌸</div>
                    <p className="text-sm text-gray-600 mt-1">Fresh Guarantee</p>
                  </div>
                  <div>
                    <div className="text-baby-pink-600 font-semibold text-2xl">💝</div>
                    <p className="text-sm text-gray-600 mt-1">Gift Wrapping</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FlowerCard;