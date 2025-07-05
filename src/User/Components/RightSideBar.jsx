import React from "react";
import { User, LogOut, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Add this import

const RightSidebar = ({ 
  studentData, 
  activeSection, 
  setActiveSection, 
  handleProfilePictureUpload, 
  handleDeleteProfilePicture 
}) => {
  const navigate = useNavigate();
  
  const handleLogoutClick = () => {
    try {
      // Clear all localStorage data
      localStorage.clear();
      
      // Alternative: Remove specific keys if you want to be selective
       localStorage.removeItem('studentToken');
       localStorage.removeItem('studentData');
      localStorage.removeItem('authToken');
      
      // Navigate to StudentLogin page
      navigate('/StudentLogin'); // Adjust the route path as needed
      
    } catch (error) {
      console.error('Error during logout:', error);
      // Still navigate even if localStorage clearing fails
      navigate('/StudentLogin');
    }
  };

  // Get the first letter of student's name
  const getFirstLetter = () => {
    if (studentData?.full_name) {
      return studentData.full_name.charAt(0).toUpperCase();
    }
    return 'S'; // Default to 'S' for Student if no name
  };

  return (
    <div className="w-full sm:w-80 bg-gray-100 flex flex-col h-full">
      <div className="p-6 flex flex-col h-full">
        {/* Profile Picture Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-2 text-center flex-shrink-0">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto flex items-center justify-center overflow-hidden">
              {studentData?.profile_picture ? (
                <img 
                  src={studentData.profile_picture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-gray-600">
                  {getFirstLetter()}
                </span>
              )}
            </div>
          </div>
          
          <div className="text-center mb-4">
            <h4 className="font-semibold text-gray-800">{studentData?.full_name}</h4>
            <p className="text-sm text-gray-600">{studentData?.student_id}</p>
          </div>
          
          <div className="space-y-2">
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              className="hidden"
            />
            <label
              htmlFor="profile-upload"
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm cursor-pointer transition-colors"
            >
              Update Profile Picture
            </label>
            {studentData?.profile_picture && (
              <button 
                onClick={handleDeleteProfilePicture}
                className="block w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded text-sm transition-colors"
              >
                Delete Profile Picture
              </button>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-700 mb-2">Menu</h3>
          <div className="space-y-2 flex-1">
            <button 
              onClick={() => setActiveSection('profile')}
              className={`w-full text-left py-3 px-4 rounded text-sm transition-colors flex items-center ${
                activeSection === 'profile' 
                  ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              Profile Information
            </button>
            <button 
              onClick={() => setActiveSection('password')}
              className={`w-full text-left py-3 px-4 rounded text-sm transition-colors flex items-center ${
                activeSection === 'password' 
                  ? 'bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </button>
          </div>

          {/* Logout Button */}
          <div className="flex-shrink-0">
            <button 
              onClick={handleLogoutClick}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded font-medium flex items-center justify-center transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
