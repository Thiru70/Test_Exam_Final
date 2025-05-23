import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AuthCard from '../components/AuthCard';

const InfoForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userType = new URLSearchParams(location.search).get('type') || 'student';
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    ...(userType === 'company' ? { 
      companyName: '',
      position: '',
    } : {
      college: '',
      course: '',
      year: '',
    }),
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Sidebar with exam sheets */}
      <Sidebar />
      
      {/* Right side - Auth Content */}
      <AuthCard 
        title="Complete Your Profile" 
        subtitle={`Please provide the following ${userType === 'company' ? 'company' : 'student'} information to complete your registration.`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-6 w-full max-w-md">
          {/* Common fields for both company and student */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="fullName" className="text-sm text-gray-600 font-medium">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="phoneNumber" className="text-sm text-gray-600 font-medium">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
              required
            />
          </div>
          
          {/* Specific fields based on user type */}
          {userType === 'company' ? (
            <>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="companyName" className="text-sm text-gray-600 font-medium">
                  Company Name
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter company name"
                  required
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label htmlFor="position" className="text-sm text-gray-600 font-medium">
                  Your Position
                </label>
                <input
                  id="position"
                  name="position"
                  type="text"
                  value={formData.position}
                  onChange={handleChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your position"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="college" className="text-sm text-gray-600 font-medium">
                  College Name
                </label>
                <input
                  id="college"
                  name="college"
                  type="text"
                  value={formData.college}
                  onChange={handleChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter college name"
                  required
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label htmlFor="course" className="text-sm text-gray-600 font-medium">
                  Course
                </label>
                <input
                  id="course"
                  name="course"
                  type="text"
                  value={formData.course}
                  onChange={handleChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your course"
                  required
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label htmlFor="year" className="text-sm text-gray-600 font-medium">
                  Year of Study
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </>
          )}
          
          {/* Password fields for both */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm text-gray-600 font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Create a password"
              required
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="text-sm text-gray-600 font-medium">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <button
            type="submit"
            className={`mt-2 bg-blue-600 text-white py-3 rounded-lg font-medium transition-all
              ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>
      </AuthCard>
    </div>
  );
};

export default InfoForm;