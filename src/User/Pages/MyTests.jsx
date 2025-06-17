import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// Toast Component (matching StudentLogin styling)
const Toast = ({ message, type = 'success', onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`rounded-md p-4 shadow-lg ${
        type === 'success' 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {type === 'success' ? (
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${
              type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                type === 'success' 
                  ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' 
                  : 'text-red-500 hover:bg-red-100 focus:ring-red-600'
              }`}
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [toast, setToast] = useState(null);
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
          <p className="text-sm text-gray-600">Round 1</p>
        </div>

        {/* Tests Grid */}
        {tests.length === 0 ? (
          <div className="bg-gray-500 rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No tests available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {tests.map((test, index) => {
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
                  {test.type === 'MCQ' ? 'Multiple Choice Questions' : 
                   test.type === 'coding' ? 'Coding Assessment' : 
                   'Description'}
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
                    <span className="capitalize font-medium">{test.type}</span>
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