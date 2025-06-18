import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import Toast from "./ToastComponent";

const ChangePassword = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [studentId, setStudentId] = useState('STD490737');

  // API Configuration
  const API_BASE_URL = 'https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev';

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePasswords = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setToast({ message: 'All fields are required', type: 'error' });
      return false;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ message: 'New passwords do not match', type: 'error' });
      return false;
    }
    
    if (passwordData.newPassword.length < 6) {
      setToast({ message: 'New password must be at least 6 characters long', type: 'error' });
      return false;
    }
    
    if (passwordData.currentPassword === passwordData.newPassword) {
      setToast({ message: 'New password must be different from current password', type: 'error' });
      return false;
    }
    
    return true;
  };

  const handleUpdatePassword = async () => {
    if (!validatePasswords()) {
      return;
    }

    setLoading(true);

    try {
      const requestBody = {
        student_id: studentId,
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        confirm_password: passwordData.confirmPassword
      };

      // Full API Gateway URL
      const apiUrl = `${API_BASE_URL}/student/change-password`;

      // Log the payload being sent
      console.log('=== CHANGE PASSWORD API PAYLOAD ===');
      console.log('Full URL:', apiUrl);
      console.log('Method: PUT');
      console.log('Headers:', {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      });
      console.log('Body:', JSON.stringify(requestBody, null, 2));
      console.log('=====================================');

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      // Log the response
      console.log('=== API RESPONSE ===');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Headers:', Object.fromEntries(response.headers));

      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('Response Data (JSON):', data);
      } else {
        const textData = await response.text();
        data = { message: textData };
        console.log('Response Data (Text):', textData);
      }
      console.log('===================');

      if (response.ok) {
        setToast({ message: data.message || 'Password updated successfully!', type: 'success' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setToast({ 
          message: data.error || data.message || `HTTP Error: ${response.status} ${response.statusText}`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.log('=== API ERROR ===');
      console.error('Error details:', error);
      console.log('Error name:', error.name);
      console.log('Error message:', error.message);
      console.log('================');
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setToast({ 
          message: 'CORS error: API not accessible from browser. Check CORS settings on your API.', 
          type: 'error' 
        });
      } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setToast({ 
          message: 'Connection failed: Check if API endpoint is correct and accessible.', 
          type: 'error' 
        });
      } else {
        setToast({ 
          message: `Error: ${error.message}`, 
          type: 'error' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="bg-yellow-500 text-white p-4 rounded-t-lg flex items-center">
        <Lock className="w-5 h-5 mr-2" />
        <span className="font-semibold">Change Password</span>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {/* Student ID Display */}
          <div className="bg-gray-50 p-3 rounded-md">
            <span className="text-sm text-gray-600">Student ID: </span>
            <span className="font-medium">{studentId}</span>
          </div>

          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter new password"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Confirm new password"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Update Button */}
          <div className="pt-4">
            <button
              onClick={handleUpdatePassword}
              disabled={loading}
              className={`w-full px-6 py-3 rounded-md font-medium transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600'
              } text-white`}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default ChangePassword;