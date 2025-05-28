import React from 'react';
import { AlertTriangle, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Instructions = () => {
  const navigate = useNavigate();

  // Blue diamond icon component
  const BlueDiamond = () => (
    <div className="w-3 h-3 bg-blue-500 transform rotate-45"></div>
  );

  const handleStartExam = () => {
    navigate('/aptitude-test');
  };

  const instructions = [
    {
      icon: <Mic className="w-5 h-5 text-blue-500" />,
      title: "Important Guidelines for Your Online Exam/Test",
      isHeader: true
    },
    {
      icon: <BlueDiamond />,
      text: "Check Your System: Ensure your device (PC/laptop/tablet) is fully charged and connected to a stable internet connection."
    },
    {
      icon: <BlueDiamond />,
      text: "Browser Compatibility: Use the recommended browser (e.g., Chrome, Firefox) and disable unnecessary extensions."
    },
    {
      icon: <BlueDiamond />,
      text: "Quiet Environment: Choose a distraction-free, well-lit space for the test."
    },
    {
      icon: <BlueDiamond />,
      text: "Webcam & Microphone: If required, allow access to your webcam and microphone for monitoring."
    },
    {
      icon: <BlueDiamond />,
      text: "Login on Time: Join at least 10-15 minutes before the test starts to avoid last-minute issues."
    },
    {
      icon: <BlueDiamond />,
      text: "Read Instructions: Carefully review all guidelines before starting the test."
    },
    {
      icon: <BlueDiamond />,
      text: "No External Help: Do not use unauthorized materials, apps, or communication during the exam."
    },
    {
      icon: <BlueDiamond />,
      text: "Submission: Ensure you submit your answers before the timer expires."
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      text: "Any violations of the rules may result in disqualification."
    }
  ];

  return (
    <div className="min-h-screen bg-white-50 py-8 px-4 w-full" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="w-full max-w-none mx-auto">
        {/* Header */}
        <div className=" w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6" >
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
                  {instruction.icon}
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
                    <p className="text-gray-700 leading-relaxed" style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 500,
                      fontSize: '20px',
                      lineHeight: '100%',
                      letterSpacing: '0%'
                    }}>
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
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-12 py-4 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
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