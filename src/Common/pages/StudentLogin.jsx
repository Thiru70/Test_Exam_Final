import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../Common/components/Sidebar';

const styles = `
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// Auth Card Component
const AuthCard = ({ title, subtitle, children }) => {
  return (
    <div className="flex-1 bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <div className="text-right mb-8">
          
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          {subtitle && (
            <p className="text-gray-600 text-sm mb-6">{subtitle}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

// Toast Component
const Toast = ({ message, type = 'success', onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`rounded-md p-4 shadow-lg ${
        type === 'success' 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {type === 'success' ? (
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${
              type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                type === 'success' 
                  ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' 
                  : 'text-red-500 hover:bg-red-100 focus:ring-red-600'
              }`}
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Exam Portal Component
const StudentLogin = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    studentId: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/student/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: formData.studentId,
          password: formData.password
        })
      });
      
      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Console log the response
      console.log('Login Response:', data);
      
      // Store student data in localStorage
      const studentId = data.student_id || formData.studentId;
      localStorage.setItem('student_id', studentId);
      
      // Store additional data if available
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      
      // Store entire student data as JSON for easy access
      localStorage.setItem('student_data', JSON.stringify(data));
      
      // Store login timestamp
      localStorage.setItem('login_timestamp', new Date().toISOString());
      
      // Set flag for welcome toast (NEW LINE)
      sessionStorage.setItem('justLoggedIn', 'true');
      
      console.log('Student data stored in localStorage:', {
        student_id: studentId,
        token: data.token,
        login_time: new Date().toISOString()
      });
      
      // Show success toast
      setToast({
        message: `Welcome back! Redirecting to dashboard...`,
        type: 'success'
      });
      
      // Navigate to student dashboard after a short delay
      setTimeout(() => {
        navigate('/student-dashboard', { 
          state: { 
            studentData: data,
            studentId: studentId 
          } 
        });
      }, 1500);
      
    } catch (err) {
      console.error('Login Error:', err);
      setError(err.message || 'Login failed. Please check your credentials and try again.');
      setToast({
        message: 'Login failed. Please check your credentials.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
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
      
      <div className="flex min-h-screen w-full bg-white">
        {/* Left side - Sidebar with exam sheets (1/3 width) */}
        <Sidebar />

        {/* Right side - Auth Content (remaining width) */}
        <AuthCard 
          title="Exam Portal" 
          subtitle="Please log in using your Student ID provided to you. Your password is your Date of Birth (DOB) in DD/MM/YYYY format. Ensure you update your password after logging in for the first time."
        >
          <div className="space-y-6">

            {/* Student ID Field */}
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                Student ID
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your student ID"
              />
            </div>
            
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !formData.studentId || !formData.password}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                'Log In'
              )}
            </button>
          </div>
        </AuthCard>
      </div>
    </>
  );
};

export default StudentLogin;