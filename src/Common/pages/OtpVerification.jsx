import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import emailjs from 'emailjs-com';
import Sidebar from '../components/Sidebar';
import AuthCard from '../components/AuthCard';
import { EMAILJS_CONFIG } from '../../services/emailConfig';
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email') || '';
  const userType = new URLSearchParams(location.search).get('type') || 'student';
  
  const inputRefs = Array(5).fill(0).map(() => React.createRef());
  
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);
  
  useEffect(() => {
    // Check if we have the expected email in localStorage
    const storedEmail = localStorage.getItem('otpEmail');
    if (storedEmail !== email) {
      // If emails don't match, generate new OTP for current email
      const newOtp = Math.floor(10000 + Math.random() * 90000).toString();
      localStorage.setItem('currentOtp', newOtp);
    }
  }, [email]);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input field after filling current one
    if (value && index < 4) {
      inputRefs[index + 1].current.focus();
    }
  };
  
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Get stored OTP
    const enteredOtp = otp.join('');

fetch('https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/api/submit-otp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ email, otp: enteredOtp, user_type: userType })
})
  .then(res => {
    if (res.ok) {
      setLoading(false);
      console.log(res.data,"data")
      navigate(`/information`);
      toast.success('Otp verify succesfully')
    } else {
      toast.error(data.message || 'Invalid verification code.')
    }
  })
  .catch(err => {
    setLoading(false)
    toast.error('Server error. Please try again.')
    console.error(err);
  });

  };
  
  const handleResend = () => {
    // Reset timer first
    setTimer(30);
    setLoading(true);

    const userEmail = email || localStorage.getItem('adminEmail');
    const userType = 'company';
    
    console.log(userEmail,userType,"user email and user type")
    if (!userEmail) {
      setLoading(false);
      toast.error('Email address not found. Please go back to the previous step.')
      return;
    }
    
    // Generate new OTP
    const newOtp = Math.floor(10000 + Math.random() * 90000).toString();
    
    // Prepare email template parameters
    const templateParams = {
      to_name: userEmail.split('@')[0],
      to_email: userEmail,
      otp: newOtp,
      user_type: userType.charAt(0).toUpperCase() + userType.slice(1)
    };
    
    // Send email with new OTP
    fetch('https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/api/verify-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ email: userEmail, userType: userType })
})
  .then(res => {
    if (res.ok) {
      setLoading(false);
      toast.success('A new verification code has been sent.');
    } else {
      toast.error(res?.data?.message || 'Failed to resend verification code.');
    }
  })
  .catch(err => {
    setLoading(false);
    console.error('Failed to resend OTP:', err);
    toast.error('Server error. Please try again.');
  });

  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Sidebar with exam sheets */}
      <ToastContainer />
      <Sidebar />
      
      {/* Right side - Auth Content */}
      <AuthCard 
        title="Enter Verification Code" 
        subtitle={`We've sent a verification code to ${email}. Please enter it below.`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8 w-full max-w-md">
          {/* {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div> */}
          {/* )} */}
          
          <div className="flex justify-center gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={1}
                required
              />
            ))}
          </div>
          
          <button
            type="submit"
            className={`bg-blue-600 text-white py-3 rounded-lg font-medium transition-all
              ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            disabled={loading || otp.some(digit => !digit)}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          
          <div className="text-center flex flex-col gap-2">
            <p>
              {timer > 0 ? (
                <span>Resend code in {timer}s</span>
              ) : (
                <button
                  type="button" 
                  onClick={handleResend}
                  className="text-blue-600 hover:underline"
                >
                  Resend verification code
                </button>
              )}
            </p>
            
            <Link to="/email-verification" className="text-blue-600 hover:underline">
              Change email address
            </Link>
          </div>
        </form>
      </AuthCard>
    </div>
  );
};

export default OtpVerification;