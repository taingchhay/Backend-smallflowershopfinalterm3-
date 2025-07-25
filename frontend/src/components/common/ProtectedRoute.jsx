import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole = 'admin' }) => {
  const [isAuthorized, setIsAuthorized] = useState(null); // null = loading, true = access, false = reject

  useEffect(() => {
    const checkAuthentication = () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return setIsAuthorized(false);
        
        const decoded = jwtDecode(token);
        if (decoded.role === requiredRole) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Token error:', error);
        setIsAuthorized(false);
      }
    };

    checkAuthentication();
  }, [requiredRole]);

  if (isAuthorized === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;