import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MyTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch('https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/user-test/list/01JXCQEQGN53SBW8FY4KKQXXPC');
        if (!response.ok) {
          throw new Error('Failed to fetch tests');
        }
        const data = await response.json();
        setTests(data.tests || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleStartTest = (testId, testName) => {
    // Store test information in localStorage for use in other components
    localStorage.setItem('currentTestId', testId);
    localStorage.setItem('currentTestName', testName);
    
    // Navigate to face detection to start the test process
    navigate('/face-detection');
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
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-2">Ongoing Tests</h2>
        <p className="text-sm text-gray-600">Round 1 • {tests.length} test{tests.length !== 1 ? 's' : ''} available</p>
      </div>

      {tests.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No tests available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div key={test.testId} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <button 
                  onClick={() => handleStartTest(test.testId, test.testName)}
                  className="px-3 py-1 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {test.status}
                </button>
                {test.createdDate && (
                  <span className="text-xs text-gray-500">
                    Created {new Date(test.createdDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              <h3 className="text-base font-medium text-gray-800 mb-2">{test.testName}</h3>
              
              {test.description && (
                <p className="text-sm text-gray-600 mb-4">{test.description}</p>
              )}
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Duration: {test.duration} min</span>
                <span>Total Marks: {test.totalMarks}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTests;