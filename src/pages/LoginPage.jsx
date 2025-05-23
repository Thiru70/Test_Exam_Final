import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AuthCard from '../components/AuthCard';
import OptionCard from '../components/OptionCard';

const LoginPage = () => {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Sidebar with exam sheets */}
      <Sidebar />
      
      {/* Right side - Auth Content */}
      <AuthCard title="Login" subtitle="Welcome back to the platform. Tell us what type of user you're logging in as.">
        <div className="flex flex-col gap-4 mt-8">
          <OptionCard 
            type="company"
            title="Company"
            description="For recruiters posting jobs or campus drives at partner colleges"
            selected={true}
            to="#"
          />
          
          <OptionCard 
            type="student"
            title="Student"
            description="For students seeking opportunities and campus placement"
            to="#"
          />
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account? <Link to="/" className="text-blue-600 font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </AuthCard>
    </div>
  );
};

export default LoginPage;