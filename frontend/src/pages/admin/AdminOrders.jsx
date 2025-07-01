import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Search, Filter, Eye, Package, Truck, CheckCircle, Clock, Edit } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data - replace with API calls
  useEffect(() => {
    const mockOrders = [
      {
        id: '1001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
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
        },
        payment: {
          method: 'Credit Card',
          status: 'paid'
        }
      },
      {
        id: '1002',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        date: '2024-01-10',
        status: 'in_transit',
        total: 39.99,
        items: [
          { name: 'Mixed Spring Flowers', quantity: 1, price: 34.99 }
        ],
        shipping: {
          address: '456 Oak Ave, City, State 12345',
          method: 'Express Delivery',
          trackingNumber: 'BS1002234567'
        },
        payment: {
          method: 'PayPal',
          status: 'paid'
        }
      },
      {
        id: '1003',
        customerName: 'Mike Johnson',
        customerEmail: 'mike@example.com',
        date: '2024-01-05',
        status: 'processing',
        total: 129.99,
        items: [
          { name: 'Wedding Bouquet Set', quantity: 3, price: 42.99 }
        ],
        shipping: {
          address: '789 Pine Rd, City, State 12345',
          method: 'Premium Delivery',
          trackingNumber: 'BS1003234567'
        },
        payment: {
          method: 'Credit Card',
          status: 'paid'
        }
      },
      {
        id: '1004',
        customerName: 'Sarah Wilson',
        customerEmail: 'sarah@example.com',
        date: '2024-01-20',
        status: 'pending',
        total: 67.98,
        items: [
          { name: 'Pink Tulip Bouquet', quantity: 2, price: 27.99 },
          { name: 'White Lily Arrangement', quantity: 1, price: 42.99 }
        ],
        shipping: {
          address: '321 Elm St, City, State 12345',
          method: 'Standard Delivery',
          trackingNumber: null
        },
        payment: {
          method: 'Credit Card',
          status: 'pending'
        }
      }
    ];
    setOrders(mockOrders);
  }, []);

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.includes(searchTerm) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'processing':
        return <Package className="h-5 w-5" />;
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
      case 'pending':
        return 'text-orange-600 bg-orange-50';
      case 'processing':
        return 'text-yellow-600 bg-yellow-50';
      case 'in_transit':
        return 'text-blue-600 bg-blue-50';
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    setShowModal(false);
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Management</h1>
        <p className="text-gray-600">View and manage customer orders</p>
      </div>

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
                  placeholder="Search orders, customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baby-pink-500 focus:border-baby-pink-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-baby-pink-500 focus:border-baby-pink-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Orders ({filteredOrders.length})
              </h2>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Package className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No orders found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">Order ID</th>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">Customer</th>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">Items</th>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">Total</th>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium text-baby-pink-600">
                          #{order.id}
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-semibold text-gray-800">{order.customerName}</p>
                            <p className="text-sm text-gray-600">{order.customerEmail}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {order.date}
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm text-gray-800">
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-gray-600 truncate max-w-xs">
                            {order.items.map(item => item.name).join(', ')}
                          </p>
                        </td>
                        <td className="py-4 px-6 font-semibold text-gray-800">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span>{getStatusText(order.status)}</span>
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => viewOrderDetails(order)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => viewOrderDetails(order)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                              title="Update Status"
                            >
                              <Edit className="h-4 w-4" />
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

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Order #{selectedOrder.id}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Status Update */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Update Order Status</h3>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.slice(1).map(status => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusUpdate(selectedOrder.id, status.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        selectedOrder.status === status.value
                          ? 'bg-baby-pink-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-baby-pink-50'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedOrder.customerName}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.customerEmail}</p>
                    <p><span className="font-medium">Order Date:</span> {selectedOrder.date}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Shipping Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Address:</span> {selectedOrder.shipping.address}</p>
                    <p><span className="font-medium">Method:</span> {selectedOrder.shipping.method}</p>
                    {selectedOrder.shipping.trackingNumber && (
                      <p><span className="font-medium">Tracking:</span> {selectedOrder.shipping.trackingNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Item</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Quantity</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="py-3 px-4 font-medium text-gray-800">{item.name}</td>
                          <td className="py-3 px-4 text-gray-600">{item.quantity}</td>
                          <td className="py-3 px-4 text-gray-600">${item.price.toFixed(2)}</td>
                          <td className="py-3 px-4 font-semibold text-gray-800">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="3" className="py-3 px-4 font-semibold text-gray-800 text-right">
                          Total:
                        </td>
                        <td className="py-3 px-4 font-bold text-baby-pink-600 text-lg">
                          ${selectedOrder.total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Payment Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p><span className="font-medium">Method:</span> {selectedOrder.payment.method}</p>
                      <p><span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                          selectedOrder.payment.status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedOrder.payment.status.toUpperCase()}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-baby-pink-600">
                        ${selectedOrder.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;