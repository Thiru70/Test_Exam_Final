import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';

// Sidebar Component
const Sidebar = () => {
  return (
    <div className="w-1/2 bg-blue-600 relative flex items-center justify-center">
      <div className="relative">
        {/* Main exam sheet */}
        <div className="bg-white p-8 rounded-lg shadow-xl transform rotate-3 w-80 h-96">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">EXAM SHEET</h3>
            <div className="text-red-500 text-2xl font-bold">A+</div>
          </div>
          
          {/* Mock exam content */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
              <div className="h-2 bg-gray-300 rounded flex-1"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-gray-400 rounded bg-blue-500"></div>
              <div className="h-2 bg-gray-300 rounded flex-1"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
              <div className="h-2 bg-gray-300 rounded flex-1"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-gray-400 rounded bg-blue-500"></div>
              <div className="h-2 bg-gray-300 rounded flex-1"></div>
            </div>
            
            {/* Answer bubbles section */}
            <div className="mt-6 space-y-2">
              <div className="flex space-x-2">
                {[1,2,3,4,5].map(num => (
                  <div key={num} className="flex flex-col items-center">
                    <span className="text-xs text-gray-600">{num}</span>
                    <div className="flex space-x-1">
                      {['A','B','C','D'].map(letter => (
                        <div key={letter} className={`w-3 h-3 rounded-full border ${
                          (num === 2 && letter === 'B') || (num === 4 && letter === 'A') 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-400'
                        }`}></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Secondary exam sheet */}
        <div className="absolute -top-4 -right-4 bg-white p-6 rounded-lg shadow-lg transform -rotate-2 w-64 h-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-gray-800">ANSWER SHEET</h3>
            <div className="text-red-500 text-lg font-bold">B</div>
          </div>
          
          {/* Grid of answer bubbles */}
          <div className="grid grid-cols-5 gap-2">
            {Array.from({length: 25}, (_, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-xs text-gray-500">{i+1}</span>
                <div className="flex space-x-1">
                  {['A','B','C','D'].map(letter => (
                    <div key={letter} className={`w-2 h-2 rounded-full border ${
                      Math.random() > 0.7 ? 'bg-blue-400 border-blue-400' : 'border-gray-300'
                    }`}></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Pencil */}
        <div className="absolute bottom-10 left-10 w-32 h-2 bg-yellow-400 rounded-full transform rotate-45 shadow-md">
          <div className="w-4 h-2 bg-pink-300 rounded-full"></div>
          <div className="absolute right-0 w-3 h-3 bg-gray-700 rounded-full transform translate-x-1"></div>
        </div>
      </div>
    </div>
  );
};

// Auth Card Component
const AuthCard = ({ title, subtitle, children }) => {
  return (
    <div className="w-1/2 bg-gray-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-right mb-8">
          <span className="text-gray-600">Already have an account? </span>
          <a href="#" className="text-blue-600 font-medium hover:underline">
            Log in
          </a>
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

// Main Exam Portal Component
const ExamPortalForm = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const resonse = axiosInstance.post('/student/login',{...formData})
    
    console.log('Form submitted:', resonse.data);
    alert('Login attempt for Student ID: ' + formData.studentId);
  };
  
  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Sidebar with exam sheets */}
      <Sidebar />
      
      {/* Right side - Auth Content */}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                placeholder="DD/MM/YYYY"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium"
          >
            Log In
          </button>
        </div>
  
      </AuthCard>
    </div>
  );
};

export default ExamPortalForm;