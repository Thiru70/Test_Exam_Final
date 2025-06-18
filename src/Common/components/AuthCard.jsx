import React from 'react';
import { Link } from 'react-router-dom';

const AuthCard = ({ title, subtitle, children }) => {
  return (
    <div className="w-2/3 bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        {/* Top navigation */}
        {/* <div className="flex justify-end mb-8">
          {window.location.pathname !== '/login' ? (
            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
              Already have an account? <span className="text-blue-600 font-medium">Log in</span>
            </Link>
          ) : (
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
              Don't have an account? <span className="text-blue-600 font-medium">Sign up</span>
            </Link>
          )}
        </div> */}
        
        {/* Title and subtitle */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-2">{subtitle}</p>
        </div>
        
        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default AuthCard;