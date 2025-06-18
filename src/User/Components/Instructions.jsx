import React, { useState, useEffect } from 'react';
import { AlertTriangle, Mic, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Instructions = () => {
  const [allInstructionsAccepted, setAllInstructionsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState(null);
  const navigate = useNavigate();

  // Fetch test data on component mount
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const studentId = localStorage.getItem('student_id');
        if (!studentId) {
          console.error('No student ID found in localStorage');
          return;
        }

        const response = await fetch(`https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/user-tests?studentId=${studentId}`);
        const data = await response.json();
        setTestData(data);
        console.log('Fetched test data:', data); // Debug log
      } catch (error) {
        console.error('Error fetching test data:', error);
      }
    };

    fetchTestData();
  }, []);

  // Handle checkbox change for all instructions
  const handleAcceptAllInstructions = () => {
    setAllInstructionsAccepted(!allInstructionsAccepted);
  };

  const handleStartExam = async () => {
    if (!allInstructionsAccepted) {
      return;
    }

    setLoading(true);

    try {
      // Get test ID from localStorage
      const currentTestId = localStorage.getItem('currentTestId');
      
      console.log('Current Test ID from localStorage:', currentTestId); // Debug log
      
      if (!currentTestId) {
        console.error('No test ID found in localStorage');
        alert('Test ID not found. Please select a test first.');
        setLoading(false);
        return;
      }

      if (!testData || !testData.testData) {
        console.error('Test data not loaded');
        alert('Test data not loaded. Please refresh the page.');
        setLoading(false);
        return;
      }

      console.log('Available tests:', testData.testData); 

      // Find the matching test in the API response
      const matchingTest = testData.testData.find(test => test.testId === currentTestId);

      if (!matchingTest) {
        console.error('Test ID from localStorage does not match any test in API response');
        console.error('Looking for:', currentTestId);
        console.error('Available test IDs:', testData.testData.map(test => test.testId));
        alert('Test not found. Please select a valid test.');
        setLoading(false);
        return;
      }

      console.log('Matching test found:', matchingTest);
      console.log('Test type:', matchingTest.type);

      // Navigate based on test type (with better debugging)
      if (matchingTest.type === 'coding') {
        console.log('Navigating to coding section');
        navigate('/coding-section');
      } else if (matchingTest.type === 'MCQ') {
        console.log('Navigating to aptitude test');
        // Try multiple possible routes - uncomment the one that works for your app
        navigate('/aptitude-test');
        // navigate('/aptitude');
        // navigate('/aptitude-section');
        // navigate('/mcq-test');
      } else {
        console.error('Unknown test type:', matchingTest.type);
        alert(`Unknown test type: ${matchingTest.type}. Please contact administrator.`);
      }
    } catch (error) {
      console.error('Error during exam start:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const instructions = [
    {
      icon: <Mic className="w-5 h-5 text-blue-500" />,
      title: "Important Guidelines for Your Online Exam/Test",
      isHeader: true
    },
    {
      text: "Check Your System: Ensure your device (PC/laptop/tablet) is fully charged and connected to a stable internet connection."
    },
    {
      text: "Browser Compatibility: Use the recommended browser (e.g., Chrome, Firefox) and disable unnecessary extensions."
    },
    {
      text: "Quiet Environment: Choose a distraction-free, well-lit space for the test."
    },
    {
      text: "Webcam & Microphone: If required, allow access to your webcam and microphone for monitoring."
    },
    {
      text: "Login on Time: Join at least 10-15 minutes before the test starts to avoid last-minute issues."
    },
    {
      text: "Read Instructions: Carefully review all guidelines before starting the test."
    },
    {
      text: "No External Help: Do not use unauthorized materials, apps, or communication during the exam."
    },
    {
      text: "Submission: Ensure you submit your answers before the timer expires."
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
                  {!instruction.isHeader && !instruction.isWarning && (
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
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
                      className="leading-relaxed text-gray-700"
                      style={{ 
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        fontSize: '20px',
                        lineHeight: '100%',
                        letterSpacing: '0%'
                      }}
                    >
                      {instruction.text}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Single Accept All Instructions Checkbox */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <div
                  className={`w-6 h-6 border-2 rounded cursor-pointer flex items-center justify-center transition-all duration-200 mt-0.5 ${
                    allInstructionsAccepted
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-400 hover:border-blue-400'
                  }`}
                  onClick={handleAcceptAllInstructions}
                >
                  {allInstructionsAccepted && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p 
                    className="leading-relaxed text-gray-800 font-medium cursor-pointer"
                    style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      fontSize: '18px',
                      lineHeight: '140%',
                      letterSpacing: '0%'
                    }}
                    onClick={handleAcceptAllInstructions}
                  >
                    I have read and understood all the above instructions and agree to follow them during the examination.
                  </p>
                </div>
              </div>
            </div>
             
            <div className="flex items-center space-x-2 mt-6">
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
            disabled={!allInstructionsAccepted || loading}
            className={`font-semibold px-12 py-4 rounded-full text-lg shadow-lg transform transition-all duration-200 ${
              allInstructionsAccepted && !loading
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
            {loading ? 'Loading...' : 'Start Exam'}
          </button>
        </div>
      </div>
      
      {/* Load Poppins font */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
    </div>
  );
};

export default Instructions;