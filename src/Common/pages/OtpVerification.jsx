import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import emailjs from 'emailjs-com';
import Sidebar from '../components/Sidebar';
import AuthCard from '../components/AuthCard';
import { EMAILJS_CONFIG } from '../../services/emailConfig';

const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email') || '';
  const userType = new URLSearchParams(location.search).get('type') || 'student';
  
  const inputRefs = Array(4).fill(0).map(() => React.createRef());
  
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
      const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
      localStorage.setItem('currentOtp', newOtp);
      localStorage.setItem('otpEmail', email);
    }
  }, [email]);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    
    // Auto-focus next input field after filling current one
    if (value && index < 3) {
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
    setError('');
    
    // Get stored OTP
    const storedOtp = localStorage.getItem('currentOtp');
    const enteredOtp = otp.join('');
    
    setTimeout(() => {
      setLoading(false);
      
      if (storedOtp === enteredOtp) {
        // OTP is valid
        navigate(`/complete-profile?type=${userType}`);
      } else {
        // Invalid OTP
        setError('The verification code you entered is incorrect. Please try again.');
      }
    }, 1000);
  };
  
  const handleResend = () => {
    // Reset timer first
    setTimer(30);
    setLoading(true);
    
    // Get email from URL or localStorage
    const userEmail = email || localStorage.getItem('otpEmail');
    const userType = new URLSearchParams(location.search).get('type') || 'student';
    
    if (!userEmail) {
      setLoading(false);
      alert('Email address not found. Please go back to the previous step.');
      return;
    }
    
    // Generate new OTP
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Prepare email template parameters
    const templateParams = {
      to_name: userEmail.split('@')[0],
      to_email: userEmail,
      otp: newOtp,
      user_type: userType.charAt(0).toUpperCase() + userType.slice(1)
    };
    
    // Send email with new OTP
    emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.OTP_TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    ).then((response) => {
      console.log('New OTP email sent successfully!', response.status);
      
      // Store new OTP in localStorage
      localStorage.setItem('currentOtp', newOtp);
      localStorage.setItem('otpEmail', userEmail);
      
      setLoading(false);
      
    }).catch((err) => {
      console.error('Failed to send new OTP email:', err);
      setLoading(false);
      alert('Failed to resend verification code. Please try again.');
    });
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Sidebar with exam sheets */}
      <Sidebar />
      
      {/* Right side - Auth Content */}
      <AuthCard 
        title="Enter Verification Code" 
        subtitle={`We've sent a verification code to ${email}. Please enter it below.`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8 w-full max-w-md">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
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