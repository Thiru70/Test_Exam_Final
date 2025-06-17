import React, { useState } from "react";
import { User } from "lucide-react";

const Header = ({ activeItem, setActiveItem }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const studentId = localStorage.getItem('student_id');
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    setActiveItem('Profile'); // This will trigger the same ProfileContent component as Sidebar
  };
  
  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    // Clear any user data or perform logout cleanup here
    console.log('Logout clicked');
    
    // Navigate to StudentLogin page
    window.location.href = '/StudentLogin';
  };
  
  return (
    <>
      <header className="bg-white shadow-sm py-3 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
        </div>
        
        {/* Profile Section */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">{studentId}</span>
            <svg 
              className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button
                onClick={handleProfileClick}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <User size={16} />
                Profile
              </button>
              <hr className="my-1" />
              <button
                onClick={handleLogoutClick}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      
      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </>
  );
};

export default Header;