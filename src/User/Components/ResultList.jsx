import React, { useState, useEffect } from "react";

const ResultsList = ({ onViewTest }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch API data
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const studentId = localStorage.getItem('student_id');
        const response = await fetch(`https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/user-test/student-results/${studentId}`);
        const data = await response.json();
        setTests(data.results || []);
      } catch (error) {
        console.error('Error fetching tests:', error);
        setTests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  // Function to get test title based on type
  const getTestTitle = (type) => {
    switch (type?.toLowerCase()) {
      case 'mcq':
        return 'Aptitude Test';
      case 'coding':
        return 'Comprehensive Coding Test';
      default:
        return 'Assessment Test';
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Function to get description
  const getDescription = (test) => {
    // Handle different data structures
    let duration = 0;
    let totalMarks = 0;
    let obtainedMarks = 0;

    // Check if it's the JSON API structure
    if (test.totalDuration || test.duration) {
      duration = test.totalDuration || test.duration || 0;
      totalMarks = test.totalMarks || 0;
      
      // Fix for obtained marks - use totalScore for coding tests, score for MCQ tests
      if (test.type?.toLowerCase() === 'coding') {
        obtainedMarks = test.totalScore || 0;
      } else {
        obtainedMarks = test.score || 0;
      }
    }
    // Check if it's the current component structure
    else if (test.testResults && test.testResults.total) {
      duration = test.testResults.total.duration || 0;
      totalMarks = test.testResults.total.marks || 0;
      // For obtained marks, we'll need to add this to your data or set as 0
      obtainedMarks = test.obtainedMarks || 0;
    }
    
    return {
      duration: `${duration}`,
      totalMarks: `${totalMarks}`,
      obtainedMarks: `${obtainedMarks}`
    };
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'passed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Function to handle view button click
  const handleViewTest = (test) => {
    // Extract testID from the test object
    const testID = test.testId || test.id || test.submissionId || null;
    
    // Pass both the test object and testID to the parent component
    onViewTest({
      ...test,
      testID: testID
    });
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Results</h2>
        <p className="text-sm text-gray-500">Round 1</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 flex flex-col items-center justify-center min-h-[400px]">
          {/* Spinning loader */}
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          
          {/* Loading text */}
          <p className="text-gray-600 mt-4 text-sm font-medium">Loading test results...</p>
          
          {/* Optional subtitle */}
          <p className="text-gray-400 mt-1 text-xs">Please wait while we fetch your data</p>
        </div>
      ) : tests.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          {/* Illustration */}
          <div className="mb-6">
            <svg
              className="w-32 h-32 mx-auto text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          
          {/* Content */}
        
          <p className="text-gray-500 mb-4 max-w-md mx-auto">
            You haven't completed any tests yet. Once you take your first assessment, 
            your results will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test, index) => {
            const description = getDescription(test);
            return (
              <div key={test.submissionId || index} className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex flex-col h-full">
                <div className="flex flex-col flex-1">
                  {/* Status and Date */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <span className={`px-3 py-1 text-xs font-medium border rounded capitalize w-fit ${getStatusColor(test.status)}`}>
                      {test.status || 'Unknown'}
                    </span>
                    <span className="text-xs text-gray-500">
                      EndedOn- {formatDate(test.endTime || test.timestamp)}
                    </span>
                  </div>
                  
                  {/* Test Title */}
                  <h3 className="text-base font-semibold text-gray-800 mb-3">
                    {getTestTitle(test.type)}
                  </h3>
                  
                  {/* Description - Inline format */}
                  <div className="text-sm text-gray-600 mb-4 flex-1 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium">{description.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Marks:</span>
                      <span className="font-medium">{description.totalMarks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Obtained Marks:</span>
                      <span className="font-medium">{description.obtainedMarks}</span>
                    </div>
                  </div>
                </div>
                
                {/* View Button - Always at bottom */}
                <div className="mt-auto">
                  <button
                    onClick={() => handleViewTest(test)}
                    className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResultsList;