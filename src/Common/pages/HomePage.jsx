import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

import AuthCard from '../components/AuthCard';
import OptionCard from '../components/OptionCard';

const HomePage = () => {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Sidebar with exam sheets */}
      <Sidebar />
      
      {/* Right side - Auth Content */}
      <AuthCard title="Sign up" subtitle="To begin your journey, tell us what type of user you are going to be.">
        <div className="flex flex-col gap-4 mt-8">
          <OptionCard 
            type="company"
            title="Company"
            description="For recruiters posting jobs or campus drives at partner colleges"
            to="/email-verification?type=company"
          />
          
          <OptionCard 
            type="student"
            title="Student"
            description="For students seeking opportunities and campus placement"
            to="/StudentLogin?type=student"
          />
        </div>
      </AuthCard>
    </div>
  );
};

export default HomePage;