import React, { useState, useEffect } from "react";

const OverviewTab = ({ test, testID }) => {
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestData = async () => {
      if (!testID) {
        setError("No test ID provided");
        setLoading(false);
        return;
      }

      try {
        const studentId = localStorage.getItem('student_id');
        const response = await fetch(`https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/user-test/student-results/${studentId}`);
        const data = await response.json();
        
        // Filter results by testID
        const filteredResults = data.results.filter(result => result.testId === testID);
        
        if (filteredResults.length === 0) {
          setError("No test data found for the given test ID");
          setTestData(null);
        } else {
          // Use the first matching result (or you could aggregate if needed)
          setTestData(filteredResults[0]);
        }
      } catch (error) {
        console.error('Error fetching test data:', error);
        setError('Failed to fetch test data');
        setTestData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [testID]);

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

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-b-lg p-8 text-center">
        <p className="text-gray-500">Loading test data...</p>
      </div>
    );
  }

  if (error || !testData) {
    return (
      <div className="bg-white border border-gray-200 rounded-b-lg p-4">
        <p className="text-red-500">{error || "No test data available"}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-b-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sl. No
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Test name
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Questions
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration(min)
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Marks
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Obtained Marks
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
              1
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
              {getTestTitle(testData.type)}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
              {testData.answers ? testData.answers.length : 0}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
              {testData.totalDuration || testData.duration || 0}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
              {testData.totalMarks || 0}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
              {testData.score || 0}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
              <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                testData.status?.toLowerCase() === 'passed' 
                  ? 'text-green-600 bg-green-50 border border-green-200' 
                  : testData.status?.toLowerCase() === 'failed'
                  ? 'text-red-600 bg-red-50 border border-red-200'
                  : 'text-gray-600 bg-gray-50 border border-gray-200'
              }`}>
                {testData.status || 'Unknown'}
              </span>
            </td>
          </tr>
          
          {/* Summary/Total Row */}
          <tr className="bg-gray-50 font-medium">
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
              <strong>Total</strong>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
              <strong>{testData.answers ? testData.answers.length : 0}</strong>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
              <strong>{testData.totalDuration || testData.duration || 0}</strong>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
              <strong>{testData.totalMarks || 0}</strong>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
              <strong>{testData.score || 0}</strong>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                (testData.score || 0) >= (testData.passingMarks || 0)
                  ? 'text-green-600 bg-green-50 border border-green-200' 
                  : 'text-red-600 bg-red-50 border border-red-200'
              }`}>
                {(testData.score || 0) >= (testData.passingMarks || 0) ? 'PASSED' : 'FAILED'}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

     
     
    </div>
  );
};

export default OverviewTab;