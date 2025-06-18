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
          // Prioritize completed attempts with answers/questions
          let bestResult = null;
          
          // First, try to find a result with actual content (answers or questions)
          const completedResults = filteredResults.filter(result => {
            if (result.type?.toLowerCase() === 'mcq') {
              return result.answers && result.answers.length > 0;
            } else if (result.type?.toLowerCase() === 'coding') {
              return result.questions && result.questions.length > 0;
            }
            return false;
          });
          
          if (completedResults.length > 0) {
            // Get the most recent completed result
            bestResult = completedResults.reduce((latest, current) => {
              const latestTime = new Date(latest.timestamp || latest.endTime);
              const currentTime = new Date(current.timestamp || current.endTime);
              return currentTime > latestTime ? current : latest;
            });
          } else {
            // Fallback to most recent result if no completed ones found
            bestResult = filteredResults.reduce((latest, current) => {
              const latestTime = new Date(latest.timestamp || latest.endTime);
              const currentTime = new Date(current.timestamp || current.endTime);
              return currentTime > latestTime ? current : latest;
            });
          }
          
          setTestData(bestResult);
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

  // Function to get questions count based on test type
  const getQuestionsCount = (testData) => {
    if (!testData) return 0;
    
    console.log('Test Data:', testData); // Debug log
    console.log('Test Type:', testData.type); // Debug log
    
    if (testData.type?.toLowerCase() === 'mcq') {
      const count = testData.answers ? testData.answers.length : 0;
      console.log('MCQ Questions Count:', count, 'Answers:', testData.answers); // Debug log
      return count;
    } else if (testData.type?.toLowerCase() === 'coding') {
      const count = testData.questions ? testData.questions.length : 0;
      console.log('Coding Questions Count:', count, 'Questions:', testData.questions); // Debug log
      return count;
    }
    
    // Fallback: try to determine from available data
    if (testData.answers && Array.isArray(testData.answers)) {
      console.log('Fallback: Using answers array length:', testData.answers.length);
      return testData.answers.length;
    }
    if (testData.questions && Array.isArray(testData.questions)) {
      console.log('Fallback: Using questions array length:', testData.questions.length);
      return testData.questions.length;
    }
    
    console.log('No questions found, returning 0');
    return 0;
  };

  // Function to get obtained marks/score based on test type
  const getObtainedMarks = (testData) => {
    if (!testData) return 0;
    
    if (testData.type?.toLowerCase() === 'mcq') {
      return testData.score || 0;
    } else if (testData.type?.toLowerCase() === 'coding') {
      return testData.totalScore || 0;
    }
    return testData.score || 0;
  };

  // Function to get duration based on test type
  const getDuration = (testData) => {
    if (!testData) return 0;
    
    if (testData.type?.toLowerCase() === 'mcq') {
      return testData.totalDuration || 0;
    } else if (testData.type?.toLowerCase() === 'coding') {
      // Convert seconds to minutes for coding tests
      const durationInMinutes = Math.round((testData.totalDuration || 0) / 60);
      return durationInMinutes;
    }
    return testData.totalDuration || testData.duration || 0;
  };

  // Function to determine pass/fail status
  const getPassStatus = (testData) => {
    if (!testData) return 'Unknown';
    
    // Use the actual status field from the API response
    if (testData.status) {
      return testData.status.toUpperCase();
    }
    
    // Fallback logic for MCQ tests if status is not available
    if (testData.type?.toLowerCase() === 'mcq') {
      const score = testData.score || 0;
      const passingMarks = testData.passingMarks || 0;
      return score >= passingMarks ? 'PASSED' : 'FAILED';
    }
    
    return 'Unknown';
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

  const questionsCount = getQuestionsCount(testData);
  const obtainedMarks = getObtainedMarks(testData);
  const duration = getDuration(testData);
  const passStatus = getPassStatus(testData);

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
              {questionsCount}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
              {duration}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
              {testData.totalMarks || 0}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
              {obtainedMarks}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
              <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                passStatus === 'PASSED'
                  ? 'text-green-600 bg-green-50 border border-green-200' 
                  : passStatus === 'FAILED'
                  ? 'text-red-600 bg-red-50 border border-red-200'
                  : 'text-gray-600 bg-gray-50 border border-gray-200'
              }`}>
                {passStatus}
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
              <strong>{questionsCount}</strong>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
              <strong>{duration}</strong>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
              <strong>{testData.totalMarks || 0}</strong>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
              <strong>{obtainedMarks}</strong>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                passStatus === 'PASSED'
                  ? 'text-green-600 bg-green-50 border border-green-200' 
                  : 'text-red-600 bg-red-50 border border-red-200'
              }`}>
                <strong>{passStatus}</strong>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OverviewTab;