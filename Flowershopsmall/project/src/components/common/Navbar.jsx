import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Flower2, User, ShoppingCart, Menu, X, LogOut, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b-2 border-baby-pink-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Flower2 className="h-8 w-8 text-baby-pink-500" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              BloomShop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-colors ${
                location.pathname === '/' 
                  ? 'text-baby-pink-500 font-semibold' 
                  : 'text-gray-700 hover:text-baby-pink-500'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className={`transition-colors ${
                location.pathname === '/shop' 
                  ? 'text-baby-pink-500 font-semibold' 
                  : 'text-gray-700 hover:text-baby-pink-500'
              }`}
            >
              Shop
            </Link>
            
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link 
                    to="/admin" 
                    className={`transition-colors ${
                      location.pathname.startsWith('/admin') 
                        ? 'text-baby-pink-500 font-semibold' 
                        : 'text-gray-700 hover:text-baby-pink-500'
                    }`}
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/dashboard" 
                      className={`transition-colors ${
                        location.pathname === '/dashboard' 
                          ? 'text-baby-pink-500 font-semibold' 
                          : 'text-gray-700 hover:text-baby-pink-500'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link to="/cart" className="relative text-gray-700 hover:text-baby-pink-500 transition-colors">
                      <ShoppingCart className="h-6 w-6" />
                      {getTotalItems() > 0 && (
                        <span className="absolute -top-2 -right-2 bg-baby-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {getTotalItems()}
                        </span>
                      )}
                    </Link>
                  </>
                )}
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-baby-pink-500 transition-colors"
                  >
                    <User className="h-6 w-6" />
                    <span>{user.name}</span>
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      {user.role === 'admin' ? (
                        <>
                          <Link
                            to="/admin"
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-baby-pink-50 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Admin Panel
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/dashboard"
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-baby-pink-50 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <User className="h-4 w-4 mr-2" />
                            Dashboard
                          </Link>
                          <Link
                            to="/orders"
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-baby-pink-50 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            My Orders
                          </Link>
                        </>
                      )}
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-baby-pink-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-baby-pink-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-primary text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-baby-pink-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="text-gray-700 hover:text-baby-pink-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              
              {user ? (
                <>
                  {user.role === 'admin' ? (
                    <Link
                      to="/admin"
                      className="text-gray-700 hover:text-baby-pink-500 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/dashboard"
                        className="text-gray-700 hover:text-baby-pink-500 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/cart"
                        className="text-gray-700 hover:text-baby-pink-500 transition-colors flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Cart ({getTotalItems()})
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-700 hover:text-baby-pink-500 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-baby-pink-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-primary text-white px-6 py-2 rounded-full text-center hover:shadow-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;