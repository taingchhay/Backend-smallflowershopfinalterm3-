import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/client/Dashboard';
import Shop from './pages/client/Shop';
import Cart from './pages/client/Cart';
import Orders from './pages/client/Orders';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFlowers from './pages/admin/AdminFlowers';
import AdminOrders from './pages/admin/AdminOrders';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gradient-pink">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/shop" element={<Shop />} />
                
                {/* User Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute role="user">
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/cart" element={
                  <ProtectedRoute role="user">
                    <Cart />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute role="user">
                    <Orders />
                  </ProtectedRoute>
                } />
                
                {/* Admin Protected Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/flowers" element={
                  <ProtectedRoute role="admin">
                    <AdminFlowers />
                  </ProtectedRoute>
                } />
                <Route path="/admin/orders" element={
                  <ProtectedRoute role="admin">
                    <AdminOrders />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;