import React from 'react';
import { Flower2, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t-2 border-baby-pink-100 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Flower2 className="h-8 w-8 text-baby-pink-500" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                BloomShop
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Your premier destination for fresh, beautiful flowers. We bring nature's beauty 
              directly to your doorstep with our carefully curated selection of blooms.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@bloomshop.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/shop" className="text-gray-600 hover:text-baby-pink-500 transition-colors">
                  Shop Flowers
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 hover:text-baby-pink-500 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 hover:text-baby-pink-500 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-600 hover:text-baby-pink-500 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2 text-baby-pink-500" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-baby-pink-500" />
                <span>123 Flower St, Garden City</span>
              </li>
              <li className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2 text-baby-pink-500" />
                <span>support@bloomshop.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600">
            © 2024 BloomShop. All rights reserved. Made with ❤️ for flower lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;