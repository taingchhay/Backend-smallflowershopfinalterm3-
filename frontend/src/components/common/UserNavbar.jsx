import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Flower2, User, ShoppingCart, Menu, X, LogOut } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const UserNavbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchCartQuantity = async () => {
      const token = localStorage.getItem('accessToken');
      const decode = jwtDecode(token);
      const id = decode.userId;

      const response = await axios.get(`http://localhost:3000/api/cart/cart-quantity/${id}`);

      if (response.data.success) {
        setTotalItems(response.data.data);
      }
    };

    fetchCartQuantity();
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b-2 border-baby-pink-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Flower2 className="h-8 w-8 text-baby-pink-500" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">BloomShop</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`transition-colors ${location.pathname === '/' ? 'text-baby-pink-500 font-semibold' : 'text-gray-700 hover:text-baby-pink-500'}`}>Home</Link>
            <Link to="/shop" className={`transition-colors ${location.pathname === '/shop' ? 'text-baby-pink-500 font-semibold' : 'text-gray-700 hover:text-baby-pink-500'}`}>Shop</Link>
            <Link to="/dashboard" className={`transition-colors ${location.pathname === '/dashboard' ? 'text-baby-pink-500 font-semibold' : 'text-gray-700 hover:text-baby-pink-500'}`}>Dashboard</Link>
            
            <Link to="/cart" className="relative text-gray-700 hover:text-baby-pink-500 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-baby-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 text-gray-700 hover:text-baby-pink-500 transition-colors">
                <User className="h-6 w-6" />
                <span>{user?.name}</span>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link to="/dashboard" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-baby-pink-50">Dashboard</Link>
                  <Link to="/orders" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-baby-pink-50">My Orders</Link>
                  <Link to="/shipping-address" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-baby-pink-50">Shipping Address</Link>
                  <hr className="my-2" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-baby-pink-50">
                    <LogOut className="inline-block mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-baby-pink-500">Home</Link>
              <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-baby-pink-500">Shop</Link>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-baby-pink-500">Dashboard</Link>
              <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-baby-pink-500">Cart ({totalItems})</Link>
              <button onClick={handleLogout} className="text-left text-gray-700 hover:text-baby-pink-500">Logout</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default UserNavbar;