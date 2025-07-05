import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, Eye } from 'lucide-react';

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock orders data
  const orders = [
    {
      id: '1001',
      date: '2024-01-15',
      status: 'delivered',
      total: 54.99,
      items: [
        { name: 'Red Rose Bouquet', quantity: 1, price: 29.99 },
        { name: 'Sunflower Bundle', quantity: 1, price: 24.99 }
      ],
      shipping: {
        address: '123 Main St, City, State 12345',
        method: 'Standard Delivery',
        trackingNumber: 'BS1001234567'
      }
    },
    {
      id: '1002',
      date: '2024-01-10',
      status: 'in_transit',
      total: 39.99,
      items: [
        { name: 'Mixed Spring Flowers', quantity: 1, price: 34.99 }
      ],
      shipping: {
        address: '123 Main St, City, State 12345',
        method: 'Express Delivery',
        trackingNumber: 'BS1002234567'
      }
    },
    {
      id: '1003',
      date: '2024-01-05',
      status: 'processing',
      total: 129.99,
      items: [
        { name: 'Wedding Bouquet Set', quantity: 3, price: 42.99 }
      ],
      shipping: {
        address: '456 Oak Ave, City, State 12345',
        method: 'Premium Delivery',
        trackingNumber: 'BS1003234567'
      }
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-5 w-5" />;
      case 'in_transit':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'text-yellow-600 bg-yellow-50';
      case 'in_transit':
        return 'text-blue-600 bg-blue-50';
      case 'delivered':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'processing':
        return 'Processing';
      case 'in_transit':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
        <p className="text-gray-600">Track and manage your flower orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h2>
          <p className="text-gray-600">Your order history will appear here once you make your first purchase.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Order #{order.id}
                    </h3>
                    <span className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-800">${order.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{order.date}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Items ({order.items.length})</h4>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          {item.quantity}x {item.name}
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Shipping Address</h4>
                    <p className="text-sm text-gray-600">{order.shipping.address}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Tracking</h4>
                    <p className="text-sm text-gray-600 mb-1">{order.shipping.method}</p>
                    <p className="text-sm font-mono text-baby-pink-600">{order.shipping.trackingNumber}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                    className="flex items-center space-x-2 text-baby-pink-600 hover:text-baby-pink-700 font-semibold"
                  >
                    <Eye className="h-4 w-4" />
                    <span>{selectedOrder === order.id ? 'Hide Details' : 'View Details'}</span>
                  </button>
                  
                  <div className="flex space-x-3">
                    {order.status === 'delivered' && (
                      <button className="bg-baby-pink-100 text-baby-pink-700 px-4 py-2 rounded-lg hover:bg-baby-pink-200 transition-colors">
                        Reorder
                      </button>
                    )}
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                      Contact Support
                    </button>
                  </div>
                </div>

                {/* Order Details */}
                {selectedOrder === order.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4">Order Details</h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2">
                          <div>
                            <p className="font-medium text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-gray-800">${item.price.toFixed(2)}</p>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between items-center font-semibold text-lg">
                          <span>Total</span>
                          <span className="text-baby-pink-600">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;