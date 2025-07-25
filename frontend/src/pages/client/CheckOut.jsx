import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Check, ArrowLeft } from 'lucide-react';

const BASE_URL = 'http://localhost:3000';

const Checkout = () => {
  const qrCodeSrc = "../../../assets/qrcode.png";
  const location = useLocation();
  const { shippingAddress, cartItems, totalPrice } = location.state || {};

  // Calculate dynamic prices if available from location.state
  const subtotal = totalPrice || 120.00;
  const shippingFee = 5.99;
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + shippingFee + tax;

  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Complete Your Purchase</h1>
          <Link
            to="/cart"
            className="text-baby-pink-600 hover:text-baby-pink-700 font-semibold flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Order Summary (Full width on mobile, 60% on desktop) */}
              <div className="lg:w-[50%]">
                {/* Cart Items */}
                <div className="w-full mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Items</h2>
                  <div className="divide-y divide-gray-200">
                    {cartItems?.map((item) => (
                      <div key={item.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.flower.image || `https://images.pexels.com/photos/1164985/pexels-photo-1164985.jpeg?auto=compress&cs=tinysrgb&w=200`}
                            alt={item.flower.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-800">{item.flower.name}</h3>
                            <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                            <p className="text-baby-pink-600 font-semibold mt-1">${item.flower.price}</p>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-800">
                              ${(item.flower.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="w-full mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold">${shippingFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-semibold">${tax.toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-baby-pink-600">
                          ${grandTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {shippingAddress && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-800 mb-2">Shipping Address</h3>
                      <p className="text-gray-700">{shippingAddress.street}</p>
                      <p className="text-gray-700">{shippingAddress.city}, {shippingAddress.commune}</p>
                      <p className="text-gray-700">{shippingAddress.province}, {shippingAddress.country}</p>
                      {shippingAddress.postalCode && (
                        <p className="text-gray-700">Postal: {shippingAddress.postalCode}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Payment QR Code (Full width on mobile, 40% on desktop) */}
              <div className="lg:w-[50%]">
                <div className="sticky top-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Method</h2>
                  
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-medium">Scan to Pay with Mobile Banking</span>
                    </div>
                    
                    <div className="mb-6">
                      <img 
                        src={qrCodeSrc} 
                        alt="Payment QR Code" 
                        className="w-64 h-64 mx-auto border border-gray-200 rounded-lg"
                      />
                    </div>
                    
                    <div className="space-y-3 text-sm text-gray-600">
                      <p>1. Open your mobile banking app</p>
                      <p>2. Select "Scan QR Code"</p>
                      <p>3. Point your camera at this code</p>
                      <p>4. Confirm the payment details</p>
                      <p>5. Complete the transaction</p>
                    </div>
                  </div>

                  <div className="mt-6 bg-yellow-50 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800 mb-2">Important</h3>
                    <p className="text-sm text-gray-600">
                      Please complete your payment within 15 minutes. Your order will be processed automatically after payment confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
              <Link
                to="/shop"
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </Link>
              <button
                className="px-6 py-3 bg-gradient-primary text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                I've Completed Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;