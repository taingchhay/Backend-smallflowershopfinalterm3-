import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:3000';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shippingAddress, setShippingAddress] = useState([]);
  const navigate = useNavigate();

  const handleSelect = (address) => {
    setSelectedAddress(address);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      const decode = jwtDecode(token);
      const userId = decode.userId

      const cartItems = await axios.get(`${BASE_URL}/api/cart/${userId}`);
      console.log(cartItems.data.data);
      if (cartItems.data.success) {
        setCartItems(cartItems.data.data);
      }

      const shippingAddressLabels = await axios.get(`${BASE_URL}/api/shipping-addresses/address-labels/${userId}`);
      console.log(shippingAddressLabels);
      if (shippingAddressLabels.data.success) {
        setShippingAddress(shippingAddressLabels.data.data);
      }
    };

    fetchData();
  }, []);

  const handleQuantityChange = (flowerId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(flowerId);
    } else {
      updateQuantity(flowerId, newQuantity);
    }
  };

  const updateQuantity = (flowerId, newQuantity) => {
    setCartItems((prevItems) => 
      prevItems.map((item) => 
        item.flowerId === flowerId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    let price = 0;
    cartItems.map((item) => 
      price += item.unit_price * item.quantity
    );
    return price;
  };

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    // alert('Checkout functionality will be implemented with backend integration');
    // clearCart();
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }
    
    const checkoutData = {
      shippingAddress: selectedAddress,
      cartItems: cartItems.map(item => ({
        ...item, // Spread all existing item properties
        flower: {
          id: item.flower.id,
          name: item.flower.name,
          image: item.flower.image,
          price: item.flower.price,
          // Include any other flower details needed in checkout
        }
      })),
      totalPrice: getTotalPrice()
    };

    navigate('/checkout', { state: checkoutData });
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="bg-white rounded-xl shadow-lg p-12">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any flowers to your cart yet.</p>
          <Link
            to="/shop"
            className="bg-gradient-primary text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-flex items-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
        <Link
          to="/shop"
          className="text-baby-pink-600 hover:text-baby-pink-700 font-semibold flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Cart Items ({cartItems.length})</h2>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 font-semibold text-sm"
                >
                  Clear All
                </button>
              </div>
            </div> */}

            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.id} className="p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.flower.image || `https://images.pexels.com/photos/1164985/pexels-photo-1164985.jpeg?auto=compress&cs=tinysrgb&w=200`}
                      alt={item.flower.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">{item.flower.name}</h3>
                      <p className="text-gray-600 text-sm truncate">{item.flower.description}</p>
                      <p className="text-baby-pink-600 font-semibold mt-1">${item.flower.price}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(item.flowerId, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                      
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.flowerId, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Plus className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-800">
                        ${(item.flower.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className='flex gap-3 flex-col lg:row-span-2'>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Shipping Address
              </h2>

              <div className="space-y-4">
                {shippingAddress.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => handleSelect(address)}
                    className={`p-4 border rounded-lg cursor-pointer transition duration-150 ease-in-out ${
                      selectedAddress?.id === address.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    <p className="text-gray-800 font-bold">{address.label}</p>
                    <p className="text-sm text-gray-500">{address.street}, {address.commune}, {address.city}, {address.province}, {address.country}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">$5.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${(getTotalPrice() * 0.08).toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-baby-pink-600">
                      ${(getTotalPrice() + 5.99 + (getTotalPrice() * 0.08)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-primary text-white py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Proceed to Checkout
              </button>

              {/* <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Free shipping on orders over $75
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;