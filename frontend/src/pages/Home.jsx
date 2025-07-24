import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flower2, Truck, Heart, Star } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Flower2,
      title: 'Fresh Flowers',
      description: 'Hand-picked daily from the finest gardens'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Same-day delivery available in your area'
    },
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Each bouquet crafted with care and attention'
    },
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Only the highest quality flowers make it to you'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-pink rounded-3xl p-8 md:p-16 mb-16 overflow-hidden">
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
            Welcome to{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              BloomShop
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Discover the beauty of fresh flowers. From romantic roses to vibrant sunflowers, 
            we have the perfect blooms for every occasion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="bg-gradient-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              Shop Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/register"
              className="bg-white text-baby-pink-600 px-8 py-4 rounded-full text-lg font-semibold border-2 border-baby-pink-200 hover:bg-baby-pink-50 transition-colors flex items-center justify-center"
            >
              Join Us
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Why Choose BloomShop?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="bg-gradient-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-baby-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Featured Flowers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <img
              src={
                i === 1
                  ? "https://theglasshouseflowers.com/cdn/shop/files/One-Dozen-Roses-2.jpg?v=1702952433"
                  : i === 2
                  ? "https://i.pinimg.com/736x/d3/ab/ad/d3abada9ee1470572c7f55047589a051.jpg"
                  : "https://i.pinimg.com/736x/29/80/3c/29803ccbbc52584cef28600199d0ed8a.jpg"
              }
              alt={`Featured flower ${i}`}
              className="w-full h-48 object-cover"
            />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {i === 1 ? 'Rose Bouquet' : i === 2 ? 'Sunflower Bundle' : 'Mixed Flowers'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {i === 1 ? 'Elegant red roses for special moments' : 
                   i === 2 ? 'Bright sunflowers to brighten your day' : 
                   'A beautiful mix of seasonal flowers'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-baby-pink-600">
                    ${i === 1 ? '29.99' : i === 2 ? '24.99' : '34.99'}
                  </span>
                  <Link
                    to="/shop"
                    className="bg-gradient-primary text-white px-4 py-2 rounded-full hover:shadow-lg transition-shadow"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-primary rounded-3xl p-8 md:p-16 text-center text-white">
        <h2 className="text-4xl font-bold mb-4">Ready to Brighten Someone's Day?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of happy customers who trust BloomShop for their floral needs.
        </p>
        <Link
          to="/register"
          className="bg-white text-baby-pink-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
        >
          Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default Home;