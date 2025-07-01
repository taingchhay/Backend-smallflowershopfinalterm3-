import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Plus, Heart, X, ShoppingCart, Zap, Star } from 'lucide-react';

const FlowerCard = ({ flower }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(flower, quantity);
    setShowModal(false);
    setQuantity(1);
    // Show success message
    alert(`Added ${quantity} ${flower.name} to cart!`);
  };

  const handleBuyNow = async () => {
    // Add to cart first
    addToCart(flower, quantity);
    setShowModal(false);
    setQuantity(1);
    
    // Small delay to ensure cart state is updated
    setTimeout(() => {
      navigate('/cart');
    }, 100);
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(flower, 1);
    alert(`Added ${flower.name} to cart!`);
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
          <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-baby-pink-50 transition-colors">
            <Heart className="h-4 w-4 text-gray-600 hover:text-baby-pink-500" />
          </button>
          <div className="absolute bottom-3 left-3 bg-baby-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {flower.category || 'Bouquet'}
          </div>
          {flower.originalPrice && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              SALE
            </div>
          )}
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
              <button
                onClick={handleQuickAdd}
                className="bg-baby-pink-100 text-baby-pink-600 p-2 rounded-full hover:bg-baby-pink-200 transition-colors"
                title="Quick Add to Cart"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                onClick={openModal}
                className="bg-gradient-primary text-white p-2 rounded-full hover:shadow-lg transform hover:scale-110 transition-all duration-200"
                title="View Details & Buy"
              >
                <ShoppingCart className="h-4 w-4" />
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
                        className="px-3 py-2 hover:bg-gray-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-baby-pink-100 text-baby-pink-700 py-4 rounded-xl font-semibold hover:bg-baby-pink-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-gradient-primary text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Zap className="h-5 w-5" />
                  <span>Buy Now</span>
                </button>
              </div>

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