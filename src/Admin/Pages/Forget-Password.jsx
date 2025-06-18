import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// import Sidebar from '../components/Sidebar';
// import AuthCard from '../components/AuthCard';
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import Sidebar from '../../Common/components/Sidebar';
import AuthCard from '../../Common/components/AuthCard';

const CompanyForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userType = 'company';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call your backend API to send OTP email
      toast.success('Otp Sent Successfully!')
      const response = await fetch('https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/api/verify-email', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, userType }),
      });

      const data = await response.json();

      if (response.ok) {
        // OTP sent successfully, don't store OTP in frontend for security
        // Store email so you know which email is verifying
        
        setLoading(false);
        navigate(`/otp-verification?email=${encodeURIComponent(email)}&type=${userType}`);
      } else {
        setLoading(false);
        toast.error(data.message || 'Failed to send verification code.');
      }
    } catch (error) {
      setLoading(false);
      toast.error('Error occured while sending verification code. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="flex w-full min-h-screen">
      <ToastContainer />
      <Sidebar />

      <AuthCard title="Email Verification" subtitle="Please enter your email address to receive a verification code.">
        <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md gap-6 mt-8">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-600">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            className={`bg-blue-600 text-white py-3 rounded-lg font-medium transition-all
              ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            disabled={loading}
          >
            {loading ? 'Sending verification code...' : 'Send Verification Code'}
          </button>

          <div className="text-center">
            <Link to="/company-login" className="text-blue-600 hover:underline">
              Go back
            </Link>
          </div>
        </form>
      </AuthCard>
    </div>
  );
};

export default CompanyForgetPassword;