import React from 'react';
import ExamSheets from '../../Asstes/Images/ExamSheets.svg';

const Sidebar = () => {
  return (
    <div className="w-1/3 bg-blue-600 min-h-screen flex items-center justify-center relative">
      <div className="w-full h-full bg-[#1565d8] flex items-center justify-center p-4">
        <img
          src={ExamSheets}
          alt="Exam sheets illustration"
          className="max-w-full max-h-full object-contain w-80 h-80"
        />
      </div>
    </div>
  );
};

export default Sidebar;