import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Toast from "../Components/ToastComponent";

const MyTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [displayedTests, setDisplayedTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user just logged in and show welcome toast
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    const studentData = JSON.parse(localStorage.getItem('student_data') || '{}');
    
    if (justLoggedIn === 'true') {
      // Clear the flag immediately
      sessionStorage.removeItem('justLoggedIn');
      
      // Show welcome toast
      const studentName = studentData.name || studentData.student_name || 'Student';
      setToast({
        message: `Welcome back, ${studentName}! Your tests are ready.`,
        type: 'success'
      });
    }

    const fetchTests = async () => {
      try {
        // Get student ID from localStorage
        const studentId = localStorage.getItem('student_id');
        
        if (!studentId) {
          throw new Error('Student ID not found. Please log in again.');
        }

        console.log('Fetching tests for student ID:', studentId);

        const apiUrl = `https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/user-tests?studentId=${studentId}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch tests: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Tests API Response:', data);
        
        // Extract test data and user info from the response
        setTests(data.testData || []);
        setUserInfo(data.user || null);
        
      } catch (err) {
        console.error('Error fetching tests:', err);
        setError(err.message);
        
        // If student ID is missing, redirect to login
        if (err.message.includes('Student ID not found')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [navigate]);

  // Filter and display tests based on round logic
  useEffect(() => {
    if (tests.length === 0) {
      setDisplayedTests([]);
      return;
    }

    // Filter aptitude/MCQ tests for Round 1
    const aptitudeTests = tests.filter(test => 
      test.type === 'MCQ' || 
      test.type === 'aptitude' || 
      test.testName?.toLowerCase().includes('aptitude')
    );

    // Filter coding tests for Round 2
    const codingTests = tests.filter(test => 
      test.type === 'coding' || 
      test.testName?.toLowerCase().includes('coding')
    );

    if (aptitudeTests.length > 0) {
      // Show Round 1 with aptitude tests
      setCurrentRound(1);
      setDisplayedTests(aptitudeTests);
    } else if (codingTests.length > 0) {
      // Show Round 2 with coding tests if no aptitude tests
      setCurrentRound(2);
      setDisplayedTests(codingTests);
    } else {
      // Show all tests if none match the criteria
      setCurrentRound(1);
      setDisplayedTests(tests);
    }
  }, [tests]);

  const handleStartTest = (testId, testName) => {
    // Get student ID from localStorage
    const studentId = localStorage.getItem('student_id');
    
    // Store test information in localStorage for use in other components
    localStorage.setItem('currentTestId', testId);
    localStorage.setItem('currentTestName', testName);
    
    console.log('Starting test:', { testId, testName, studentId });
    
    // Navigate to face detection with student ID and test ID as URL parameters
    navigate(`/face-detection?studentId=${studentId}&testId=${testId}`);
  };

  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
    } catch (e) {
      return 'N/A';
    }
  };

  const isTestAvailable = (test) => {
    // If it's not a session exam, always allow access
    if (!test.sessionExam || !test.sessionExam.isSession) {
      return { available: true, message: '' };
    }

    const now = new Date();
    const { startDate, startTime, endDate, endTime } = test.sessionExam;

    // Parse start and end datetime
    const startDateTime = new Date(`${startDate}T${startTime}:00`);
    const endDateTime = new Date(`${endDate}T${endTime}:00`);

    if (now < startDateTime) {
      return { 
        available: false, 
        message: `Test will be available from ${startDate} at ${startTime}` 
      };
    }

    if (now > endDateTime) {
      return { 
        available: false, 
        message: `Test session ended on ${endDate} at ${endTime}` 
      };
    }

    return { available: true, message: '' };
  };

  // Enhanced Empty State Component
  const EmptyStateIllustration = () => (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      {/* Animated Illustration */}
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center relative overflow-hidden">
          {/* Floating elements animation */}
          <div className="absolute inset-0">
            <div className="absolute top-4 left-8 w-3 h-3 bg-blue-300 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-8 right-6 w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-6 left-6 w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          </div>
          
          {/* Main Icon */}
          <svg className="w-16 h-16 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        
        {/* Decorative rings */}
        <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-ping opacity-20"></div>
        <div className="absolute inset-2 rounded-full border border-indigo-200 animate-pulse opacity-30"></div>
      </div>

      {/* Text Content */}
      <div className="text-center max-w-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          No Tests Available Right Now
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Looks like there are no tests scheduled for you at the moment. Check back later or contact your instructor if you believe this is an error.
        </p>
        
       
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading tests...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error loading tests</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          {error.includes('Student ID not found') && (
            <button
              onClick={() => navigate('/login')}
              className="mt-3 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      <div className="p-6 bg-white min-h-screen">
        {/* Header Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Ongoing test</h2>
          <p className="text-sm text-gray-600">Round {currentRound}</p>
        </div>

        {/* Tests Grid or Empty State */}
        {displayedTests.length === 0 ? (
          <EmptyStateIllustration />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayedTests.map((test, index) => {
              const testAvailability = isTestAvailable(test);
              
              return (
                <div 
                  key={test.testId || index} 
                  className="bg-gray-50 rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  {/* Start Button and Created Date */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                      {testAvailability.available ? (
                        <button 
                          onClick={() => handleStartTest(test.testId, test.testName)}
                          className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded hover:bg-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                          Start
                        </button>
                      ) : (
                        <div className="flex flex-col">
                          <button 
                            disabled
                            className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 border border-gray-300 rounded cursor-not-allowed"
                          >
                            Not Available
                          </button>
                          <span className="text-xs text-red-500 mt-1 max-w-48">
                            {testAvailability.message}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      Created -{formatDate(test.timestamp)}
                    </span>
                  </div>
                
                {/* Test Name */}
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  {test.testName || 'Unnamed Test'}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">
                  {test.type === 'MCQ' || test.type === 'aptitude' ? 'Aptitude Test - Multiple Choice Questions' : 
                   test.type === 'coding' ? 'Coding Assessment' : 
                   'Assessment'}
                </p>
                
                {/* Test Details */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Duration:</span>
                    <span className="font-medium">{test.duration} min</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Total Marks:</span>
                    <span className="font-medium">{test.totalMarks}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Type:</span>
                    <span className="capitalize font-medium">
                      {test.type === 'MCQ' || test.type === 'aptitude' ? 'Aptitude' : test.type}
                    </span>
                  </div>
                  
                </div>

              </div>
              )
            })}
          </div>
        )}

      </div>
    </>
  );
};

export default MyTests;