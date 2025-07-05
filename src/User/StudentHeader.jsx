import React, { useState, useEffect } from "react";
import { User } from "lucide-react";

const Header = ({ activeItem, setActiveItem }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Get student ID from localStorage or use the one from API response
  const studentId = localStorage.getItem('student_id');
  
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(`https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/student/${studentId}`);
        const data = await response.json();
        
        if (data && data.student) {
          setStudentData(data.student);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId]);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    setActiveItem('Profile');
  };
  
  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    // Clear any user data or perform logout cleanup here
    localStorage.clear();
    console.log('Logout clicked');
    
    // Navigate to StudentLogin page
    window.location.href = '/StudentLogin';
  };

  // Get the first letter of student's name
  const getFirstLetter = () => {
    if (studentData?.full_name) {
      return studentData.full_name.charAt(0).toUpperCase();
    }
    return 'S'; // Default to 'S' for Student if no name
  };

  if (loading) {
    return (
      <header className="bg-white shadow-sm py-3 px-6 flex items-center justify-between mt-10 md:mt-0">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="bg-white shadow-sm py-3 px-6 flex items-center justify-between mt-10 md:mt-0">
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
              <span className="text-sm font-bold text-white">
                {getFirstLetter()}
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-gray-800">
                {studentData?.full_name || 'Student'}
              </span>
              <span className="text-xs text-gray-500">
                {studentData?.student_id || studentId}
              </span>
            </div>
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
