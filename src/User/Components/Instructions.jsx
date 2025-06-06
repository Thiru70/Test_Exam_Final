import React, { useState } from 'react';
import { AlertTriangle, Mic, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Instructions = () => {
  const [checkedItems, setCheckedItems] = useState({});
  const navigate = useNavigate();

  // Handle checkbox changes
  const handleCheckboxChange = (index) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

 
  const allRequiredChecked = () => {
    const requiredIndices = [1, 2, 3, 4, 5, 6, 7, 8]; // All instruction items except header (0) and warning (9)
    return requiredIndices.every(index => checkedItems[index]);
  };

  const handleStartExam = () => {
    if (allRequiredChecked()) {
   
      console.log('All instructions checked - navigating to aptitude test');
     
      navigate('/aptitude-test');
    }
  };

  const instructions = [
    {
      icon: <Mic className="w-5 h-5 text-blue-500" />,
      title: "Important Guidelines for Your Online Exam/Test",
      isHeader: true
    },
    {
      text: "Check Your System: Ensure your device (PC/laptop/tablet) is fully charged and connected to a stable internet connection.",
      hasCheckbox: true
    },
    {
      text: "Browser Compatibility: Use the recommended browser (e.g., Chrome, Firefox) and disable unnecessary extensions.",
      hasCheckbox: true
    },
    {
      text: "Quiet Environment: Choose a distraction-free, well-lit space for the test.",
      hasCheckbox: true
    },
    {
      text: "Webcam & Microphone: If required, allow access to your webcam and microphone for monitoring.",
      hasCheckbox: true
    },
    {
      text: "Login on Time: Join at least 10-15 minutes before the test starts to avoid last-minute issues.",
      hasCheckbox: true
    },
    {
      text: "Read Instructions: Carefully review all guidelines before starting the test.",
      hasCheckbox: true
    },
    {
      text: "No External Help: Do not use unauthorized materials, apps, or communication during the exam.",
      hasCheckbox: true
    },
    {
      text: "Submission: Ensure you submit your answers before the timer expires.",
      hasCheckbox: true
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      text: "Any violations of the rules may result in disqualification.",
      isWarning: true
    }
  ];

  return (
    <div className="min-h-screen bg-white-50 py-8 px-4 w-full" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="w-full max-w-none mx-auto">
        {/* Header */}
        <div className="w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Exam Portal
          </h1>
          
          <p className="text-gray-600 mb-6" style={{ 
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
            fontSize: '20px',
            lineHeight: '100%',
            letterSpacing: '0%'
          }}>
            Here's a general online exam/test guidance message you can use:
          </p>

          {/* Instructions List */}
          <div className="space-y-4">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {instruction.isHeader && instruction.icon}
                  {instruction.isWarning && instruction.icon}
                  {instruction.hasCheckbox && (
                    <div
                      className={`w-5 h-5 border-2 rounded cursor-pointer flex items-center justify-center transition-all duration-200 ${
                        checkedItems[index]
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                      onClick={() => handleCheckboxChange(index)}
                    >
                      {checkedItems[index] && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  {instruction.isHeader ? (
                    <h2 className="text-lg font-semibold text-gray-800" style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 500,
                      fontSize: '20px',
                      lineHeight: '100%',
                      letterSpacing: '0%'
                    }}>
                      {instruction.title}
                    </h2>
                  ) : (
                    <p 
                      className={`leading-relaxed ${
                        instruction.hasCheckbox ? 'text-gray-700 cursor-pointer' : 'text-gray-700'
                      }`}
                      style={{ 
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        fontSize: '20px',
                        lineHeight: '100%',
                        letterSpacing: '0%'
                      }}
                      onClick={instruction.hasCheckbox ? () => handleCheckboxChange(index) : undefined}
                    >
                      {instruction.text}
                    </p>
                  )}
                </div>
              </div>
            ))}
             
            <div className="flex items-center space-x-2">
              <p className="text-green-800 font-medium" style={{ 
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: '20px',
                lineHeight: '100%',
                letterSpacing: '0%'
              }}>
                Best of luck!
              </p><span className="text-2xl">🍀</span>
            </div>
          </div>
        </div>

        {/* Start Exam Button - Bottom Right */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={handleStartExam}
            disabled={!allRequiredChecked()}
            className={`font-semibold px-12 py-4 rounded-full text-lg shadow-lg transform transition-all duration-200 ${
              allRequiredChecked()
                ? 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105 hover:shadow-xl cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              fontSize: '20px',
              lineHeight: '100%',
              letterSpacing: '0%'
            }}
          >
            Start Exam
          </button>
        </div>
      </div>
      
      {/* Load Poppins font */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
    </div>
  );
};

export default Instructions;