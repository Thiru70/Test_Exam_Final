import React, { useState, useEffect } from "react";
import ResultAnalyzer from "./ResultAnalyzer";

const MarksObtainedTab = ({ test, testID, submissionID }) => {
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract student ID from test or use a default
  const studentId = localStorage.getItem('student_id');
 
  // Fetch API data
  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/user-test/student-results/${studentId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setApiData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching test results:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchTestResults();
    }
  }, [studentId]);



// Alternative approach - if you want to prioritize results with actual data:
const getCurrentTestResult = () => {
  if (!apiData || !apiData.results) return null;

  // First try exact matches
  let result = apiData.results.find(result => 
    result.submissionId === submissionID || 
    result.testId === testID
  );

  // If found but it's an empty result (score 0 and no duration/timeTaken), 
  // try to find a better match for the same test
  if (result && (result.score === "0" || result.score === 0) && 
      (result.duration === "0" || !result.duration) && 
      (!result.timeTaken || result.timeTaken === "0")) {
    
    // Look for another result with the same testId but with actual data
    const betterResult = apiData.results.find(r => 
      r.testId === result.testId && 
      r.submissionId !== result.submissionId &&
      (parseInt(r.score || r.totalScore || 0) > 0 || 
       (r.duration && r.duration !== "0") || 
       (r.timeTaken && r.timeTaken !== "0"))
    );
    
    if (betterResult) {
      return betterResult;
    }
  }

  return result;
};

  // Helper function to format time
 // Improved formatTime function
const formatTime = (seconds) => {
  // Handle null, undefined, or invalid values
  if (!seconds || isNaN(seconds) || seconds < 0) {
    return "00:00:00";
  }
  
  // Convert to integer if it's a string
  const totalSeconds = parseInt(seconds);
  
  // Calculate hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  
  // Format with leading zeros
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

  // Calculate statistics from API data
// Updated calculateMarksData function with proper time calculation
const calculateMarksData = () => {
  const currentResult = getCurrentTestResult();
  if (!currentResult) {
    return {
      timeSpent: "N/A",
      testScore: "N/A",
      sections: []
    };
  }

  // Calculate time spent with improved logic
  let timeSpent = "N/A";
  
  // For coding tests - use timeTaken
  if (currentResult.timeTaken && currentResult.timeTaken !== "0") {
    timeSpent = formatTime(parseInt(currentResult.timeTaken));
  }
  // For MCQ tests - calculate from startTime and endTime
  else if (currentResult.startTime && currentResult.endTime) {
    try {
      const start = new Date(currentResult.startTime);
      const end = new Date(currentResult.endTime);
      const diffInMilliseconds = end - start;
      const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
      
      if (diffInSeconds > 0) {
        timeSpent = formatTime(diffInSeconds);
      } else {
        // If the calculated time is 0 or negative, show minimal time
        timeSpent = "00:00:01";
      }
    } catch (error) {
      console.error('Error calculating time from timestamps:', error);
      timeSpent = "N/A";
    }
  }
  // Fallback to duration if available and not zero
  else if (currentResult.duration && currentResult.duration !== "0") {
    timeSpent = formatTime(parseInt(currentResult.duration));
  }

  // Calculate test score
  const score = currentResult.score || currentResult.totalScore || "0";
  const totalMarks = currentResult.totalMarks || "0";
  const testScore = `${score} / ${totalMarks}`;

  // Get all results of the same type for comparison
  const sameTypeResults = apiData.results.filter(r => r.type === currentResult.type);
  const scores = sameTypeResults.map(r => parseInt(r.score || r.totalScore || 0));
  
  // Calculate statistics
  const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const topScore = scores.length > 0 ? Math.max(...scores) : 0;
  const leastScore = scores.length > 0 ? Math.min(...scores) : 0;

  const sections = [{
    name: `${currentResult.type} Test`,
    score: parseInt(score),
    averageScore: averageScore,
    topScore: topScore,
    leastScore: leastScore
  }];

  return {
    timeSpent,
    testScore,
    sections
  };
};

  // Calculate analyzer data
  const calculateAnalyzerData = () => {
    const currentResult = getCurrentTestResult();
    if (!currentResult) return null;

    // Get all results of the same type for comparison
    const sameTypeResults = apiData.results.filter(r => r.type === currentResult.type);
    const scores = sameTypeResults.map(r => parseInt(r.score || r.totalScore || 0));
    
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const topScore = scores.length > 0 ? Math.max(...scores) : 0;
    const leastScore = scores.length > 0 ? Math.min(...scores) : 0;

    let questionData = {
      totalQuestions: 0,
      attempted: 0,
      correct: 0,
      wrong: 0,
      skipped: 0
    };

    let detailedQuestions = [];

    if (currentResult.type === 'MCQ') {
      const answers = currentResult.answers || [];
      questionData = {
        totalQuestions: answers.length,
        attempted: answers.length,
        correct: answers.filter(answer => answer.status === 'correct').length,
        wrong: answers.filter(answer => answer.status === 'incorrect').length,
        skipped: 0 // MCQ tests typically don't have skipped questions in this data structure
      };

      detailedQuestions = answers.map((answer, index) => ({
        questionNo: index + 1,
        type: "Multi Choice Type Question",
        question: answer.question,
        options: answer.options,
        selectedAnswer: answer.selectedOption,
        isCorrect: answer.status === 'correct'
      }));
    } else if (currentResult.type === 'coding') {
      const questions = currentResult.questions || [];
      const totalTestCases = questions.reduce((sum, q) => sum + (q.testCases ? q.testCases.length : 0), 0);
      const passedTestCases = questions.reduce((sum, q) => 
        sum + (q.testCases ? q.testCases.filter(tc => tc.status === 'passed').length : 0), 0);
      const attemptedQuestions = questions.filter(q => 
        q.testCases && q.testCases.some(tc => tc.status !== 'not_attempted')).length;

      questionData = {
        totalQuestions: questions.length,
        attempted: attemptedQuestions,
        correct: questions.filter(q => parseInt(q.awardedMarks) > 0).length,
        wrong: attemptedQuestions - questions.filter(q => parseInt(q.awardedMarks) > 0).length,
        skipped: questions.length - attemptedQuestions
      };

      detailedQuestions = questions.map((question, index) => ({
        questionNo: index + 1,
        type: "Coding Question",
        question: question.question,
        totalMarks: question.totalMarks,
        awardedMarks: question.awardedMarks,
        testCases: question.testCases,
        isCorrect: parseInt(question.awardedMarks) > 0
      }));
    }

    return {
      consolidated: {
        performanceStatus: {
          sections: [
            {
              sNo: "01.",
              section: `${currentResult.type} Test`,
              totalMarks: parseInt(currentResult.totalMarks),
              score: parseInt(currentResult.score || currentResult.totalScore || 0),
              averageScore: averageScore,
              topScore: topScore,
              leastScore: leastScore
            }
          ],
          total: {
            totalMarks: parseInt(currentResult.totalMarks),
            score: parseInt(currentResult.score || currentResult.totalScore || 0),
            averageScore: averageScore,
            topScore: topScore,
            leastScore: leastScore
          }
        },
        questionStatus: {
          sections: [
            {
              sNo: "01.",
              section: `${currentResult.type} Test`,
              totalQuestions: questionData.totalQuestions,
              attempted: questionData.attempted,
              correct: questionData.correct,
              wrong: questionData.wrong,
              skipped: questionData.skipped
            }
          ],
          total: questionData
        }
      },
      detailed: {
        testName: `${currentResult.type} Test (${questionData.totalQuestions})`,
        testType: currentResult.type,
        questions: detailedQuestions
      }
    };
  };

  const handleAnalyzeResult = () => {
    setShowAnalyzer(true);
  };

  const closeAnalyzer = () => {
    setShowAnalyzer(false);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-b-lg p-6">
        <div className="flex items-center justify-center">
          <div className="text-gray-500">Loading test results...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-b-lg p-6">
        <div className="text-red-600">
          Error loading test results: {error}
        </div>
      </div>
    );
  }

  // Show no data state
  if (!getCurrentTestResult()) {
    return (
      <div className="bg-white border border-gray-200 rounded-b-lg p-6">
        <div className="text-gray-500">
          No test results found for Test ID: {testID} / Submission ID: {submissionID}
        </div>
      </div>
    );
  }

  const marksData = calculateMarksData();
  const analyzerData = calculateAnalyzerData();

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-b-lg">
        {/* Score Summary */}
        <div className="bg-gray-100 px-6 py-4 flex justify-end gap-8 text-sm">
          <div>
            <span className="text-gray-600">Time Spent:</span>
            <span className="ml-2 font-medium">{marksData.timeSpent}</span>
          </div>
          <div>
            <span className="text-gray-600">Test Score:</span>
            <span className="ml-2 font-medium">{marksData.testScore}</span>
          </div>
        </div>

        {/* Sections Table */}
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sections
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Average score
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Top Score
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                least score
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {marksData.sections.map((section, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {section.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                  {section.score}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                  {section.averageScore}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                  {section.topScore}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                  {section.leastScore}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Analyze Result Link */}
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={handleAnalyzeResult}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium underline bg-transparent border-none cursor-pointer"
          >
            Analyze Result
          </button>
        </div>
      </div>

      {/* Analyzer Section - Now using the separate component */}
      {showAnalyzer && analyzerData && (
        <ResultAnalyzer 
          analyzerData={analyzerData}
          onClose={closeAnalyzer}
        />
      )}
    </>
  );
};

export default MarksObtainedTab;