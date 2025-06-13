import React, { useState } from "react";
import { User, Key, Shield, LogOut } from "lucide-react";

const ProfileContent = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-2xl">
          {/* Profile Information Section */}
          <div className="bg-gray-200 rounded-lg mb-4">
            <div 
              className="p-4 cursor-pointer flex items-center"
              onClick={() => toggleSection('profile')}
            >
              <User className="w-5 h-5 mr-2 text-gray-600" />
              <span className="font-medium text-gray-800">Profile Information</span>
            </div>
            
            {openSection === 'profile' && (
              <div className="px-4 pb-4">
                <div className="space-y-3">
                  <input 
                    type="text" 
                    className="w-full p-2 bg-gray-300 border border-gray-400 rounded text-sm"
                    placeholder="Full Name"
                  />
                  <input 
                    type="email" 
                    className="w-full p-2 bg-gray-300 border border-gray-400 rounded text-sm"
                    placeholder="Email"
                  />
                  <input 
                    type="text" 
                    className="w-full p-2 bg-gray-300 border border-gray-400 rounded text-sm"
                    placeholder="Phone"
                  />
                  <input 
                    type="text" 
                    className="w-full p-2 bg-gray-300 border border-gray-400 rounded text-sm"
                    placeholder="Address"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Change Password Section */}
          <div className="bg-gray-200 rounded-lg mb-4">
            <div 
              className="p-4 cursor-pointer flex items-center"
              onClick={() => toggleSection('password')}
            >
              <Key className="w-5 h-5 mr-2 text-gray-600" />
              <span className="font-medium text-gray-800">Change Password</span>
            </div>
            
            {openSection === 'password' && (
              <div className="px-4 pb-4">
                <div className="space-y-3">
                  <input 
                    type="password" 
                    className="w-full p-2 bg-gray-300 border border-gray-400 rounded text-sm"
                    placeholder="Current password"
                  />
                  <input 
                    type="password" 
                    className="w-full p-2 bg-gray-300 border border-gray-400 rounded text-sm"
                    placeholder="New password"
                  />
                  <input 
                    type="password" 
                    className="w-full p-2 bg-gray-300 border border-gray-400 rounded text-sm"
                    placeholder="Confirm new password"
                  />
                  <div className="pt-2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium">
                      Update password
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Security Section */}
          <div className="bg-gray-200 rounded-lg mb-6">
            <div 
              className="p-4 cursor-pointer flex items-center"
              onClick={() => toggleSection('security')}
            >
              <Shield className="w-5 h-5 mr-2 text-gray-600" />
              <span className="font-medium text-gray-800">Security</span>
            </div>
          </div>

          {/* Logout Button */}
          <div className="text-right">
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded text-sm font-medium">
              logout
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 p-6">
        {/* Profile Picture Section */}
        <div className="bg-gray-300 rounded-lg p-6 mb-4 text-center">
          <div className="w-24 h-24 bg-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="w-12 h-12 text-gray-600" />
          </div>
          <button className="block w-full bg-gray-400 hover:bg-gray-500 text-gray-800 py-2 px-4 rounded text-sm mb-2">
            Update profile picture
          </button>
          <button className="block w-full bg-gray-400 hover:bg-gray-500 text-gray-800 py-2 px-4 rounded text-sm">
            delete profile picture
          </button>
        </div>

        {/* Menu Items */}
        <div className="bg-gray-300 rounded-lg p-4">
          <div className="space-y-2">
            <button className="w-full text-left py-2 px-3 bg-gray-400 hover:bg-gray-500 rounded text-sm text-gray-800">
              Edit profile
            </button>
            <button className="w-full text-left py-2 px-3 bg-gray-400 hover:bg-gray-500 rounded text-sm text-gray-800">
              FAQs
            </button>
            <button className="w-full text-left py-2 px-3 bg-gray-400 hover:bg-gray-500 rounded text-sm text-gray-800">
              Account Settings
            </button>
            <button className="w-full text-left py-2 px-3 bg-gray-400 hover:bg-gray-500 rounded text-sm text-gray-800">
              about us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;