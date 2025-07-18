import React from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { TrendingUp, Package, Users, DollarSign, ShoppingBag, Flower2 } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,345',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Total Orders',
      value: '156',
      change: '+8.2%',
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Active Customers',
      value: '89',
      change: '+15.3%',
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'Flowers in Stock',
      value: '234',
      change: '-2.1%',
      icon: Flower2,
      color: 'text-baby-pink-600',
      bg: 'bg-baby-pink-50'
    }
  ];

  const recentOrders = [
    {
      id: '1001',
      customer: 'John Doe',
      items: 'Rose Bouquet + Sunflowers',
      total: '$54.99',
      status: 'Processing'
    },
    {
      id: '1002',
      customer: 'Jane Smith',
      items: 'Mixed Flower Arrangement',
      total: '$39.99',
      status: 'Shipped'
    },
    {
      id: '1003',
      customer: 'Mike Johnson',
      items: 'Wedding Bouquet Set',
      total: '$129.99',
      status: 'Delivered'
    }
  ];

  const topFlowers = [
    { name: 'Red Rose Bouquet', sold: 45, revenue: '$1,349.55' },
    { name: 'Sunflower Bundle', sold: 32, revenue: '$799.68' },
    { name: 'Mixed Spring Flowers', sold: 28, revenue: '$979.72' },
    { name: 'White Lily Arrangement', sold: 19, revenue: '$816.81' }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your flower shop.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.bg} ${stat.color} p-3 rounded-full`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`text-sm font-semibold ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
                <button className="text-baby-pink-600 hover:text-baby-pink-700 font-semibold">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">#{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                      <p className="text-sm text-gray-600">{order.items}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{order.total}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Selling Flowers */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Top Selling Flowers</h2>
                <TrendingUp className="h-5 w-5 text-baby-pink-600" />
              </div>
              <div className="space-y-4">
                {topFlowers.map((flower, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{flower.name}</p>
                      <p className="text-sm text-gray-600">{flower.sold} sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-baby-pink-600">{flower.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {/* <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-gradient-primary text-white p-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-center">
                <Package className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold">Add New Flower</h3>
                <p className="text-sm opacity-90">Add products to inventory</p>
              </button>
              
              <button className="bg-baby-pink-500 text-white p-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-center">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold">Manage Orders</h3>
                <p className="text-sm opacity-90">Process pending orders</p>
              </button>
              
              <button className="bg-purple-500 text-white p-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold">View Analytics</h3>
                <p className="text-sm opacity-90">Check performance metrics</p>
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;