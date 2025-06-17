import React, { useState, useEffect } from "react";

const MarksObtainedTab = ({ test, testID, submissionID }) => {
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [activeAnalyzerTab, setActiveAnalyzerTab] = useState('consolidated');
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

  // Find the specific test result based on testID and submissionID
  const getCurrentTestResult = () => {
    if (!apiData || !apiData.results) return null;

    // Try to find by submissionID first, then testID
    return apiData.results.find(result =>
      result.submissionId === submissionID ||
      result.testId === testID ||
      result.id === testID ||
      result.id === submissionID
    );
  };

  // Calculate statistics from API data
  const calculateMarksData = () => {
    const currentResult = getCurrentTestResult();
    if (!currentResult) {
      return {
        timeSpent: "N/A",
        testScore: "N/A",
        sections: []
      };
    }

    // Calculate time spent
    const timeSpent = currentResult.duration ?
      `00:${String(currentResult.duration).padStart(2, '0')}:00` :
      "N/A";

    // Calculate test score
    const testScore = `${currentResult.score} / ${currentResult.totalMarks}`;

    // For now, create a single section (you can modify this based on your data structure)
    const sections = [{
      name: `${currentResult.type} Test`,
      score: currentResult.score,
      averageScore: currentResult.score, // You might want to calculate this from all results
      topScore: Math.max(...apiData.results.map(r => parseInt(r.score))),
      leastScore: Math.min(...apiData.results.map(r => parseInt(r.score)))
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

    const answers = currentResult.answers || [];
    const totalQuestions = answers.length;
    const attempted = answers.length; // All questions have answers in the API
    const correct = answers.filter(answer => answer.status === 'correct').length;
    const wrong = answers.filter(answer => answer.status === 'incorrect').length;
    const skipped = totalQuestions - attempted;

    // Calculate average, top, and least scores from all results
    const allScores = apiData.results.map(r => parseInt(r.score));
    const averageScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
    const topScore = Math.max(...allScores);
    const leastScore = Math.min(...allScores);

    return {
      consolidated: {
        performanceStatus: {
          sections: [
            {
              sNo: "01.",
              section: `${currentResult.type} Test`,
              totalMarks: parseInt(currentResult.totalMarks),
              score: parseInt(currentResult.score),
              averageScore: averageScore,
              topScore: topScore,
              leastScore: leastScore
            }
          ],
          total: {
            totalMarks: parseInt(currentResult.totalMarks),
            score: parseInt(currentResult.score),
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
              totalQuestions: totalQuestions,
              attempted: attempted,
              correct: correct,
              wrong: wrong,
              skipped: skipped
            }
          ],
          total: {
            totalQuestions: totalQuestions,
            attempted: attempted,
            correct: correct,
            wrong: wrong,
            skipped: skipped
          }
        }
      },
      detailed: {
        testName: `${currentResult.type} Test (${totalQuestions})`,
        questions: answers.map((answer, index) => ({
          questionNo: index + 1,
          type: "Multi Choice Type Question",
          question: answer.question,
          options: answer.options,
          selectedAnswer: answer.selectedOption,
          isCorrect: answer.status === 'correct'
        }))
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

      {/* Analyzer Section - Displayed below the marks table */}
      {showAnalyzer && analyzerData && (
        <div className="mt-6">
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-t-lg">
            <h2 className="text-lg font-semibold text-gray-900">Result Analysis</h2>
            <button
              onClick={closeAnalyzer}
              className="text-gray-500 hover:text-gray-700 text-xl font-semibold bg-transparent border-none cursor-pointer"
            >
              ×
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex">
            <button
              onClick={() => setActiveAnalyzerTab('consolidated')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${activeAnalyzerTab === 'consolidated'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'text-gray-600 hover:text-gray-800 bg-gray-100 border-transparent'
                }`}
            >
              Consolidated
            </button>
            <button
              onClick={() => setActiveAnalyzerTab('detailed')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${activeAnalyzerTab === 'detailed'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'text-gray-600 hover:text-gray-800 bg-gray-100 border-transparent'
                }`}
            >
              Detailed
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeAnalyzerTab === 'consolidated' && (
              <div className="space-y-6">
                {/* Performance Status */}
                <div>
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-t-lg">
                    <h3 className="font-medium">Performance Status</h3>
                  </div>
                  <div className="border border-gray-200 rounded-b-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.No</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sections</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total Marks</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Score</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Average score</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Top Score</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">least score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {analyzerData.consolidated.performanceStatus.sections.map((section, index) => (
                          <tr key={index} className="bg-white">
                            <td className="px-4 py-3 text-sm text-gray-900">{section.sNo}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{section.section}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-center">{section.totalMarks}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-center">{section.score}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-center">{section.averageScore}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-center">{section.topScore}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-center">{section.leastScore}</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 font-medium">
                          <td className="px-4 py-3 text-sm text-gray-900"></td>
                          <td className="px-4 py-3 text-sm text-gray-900">total</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-center">{analyzerData.consolidated.performanceStatus.total.totalMarks}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-center">{analyzerData.consolidated.performanceStatus.total.score}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-center">{analyzerData.consolidated.performanceStatus.total.averageScore}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-center">{analyzerData.consolidated.performanceStatus.total.topScore}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-center">{analyzerData.consolidated.performanceStatus.total.leastScore}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Question Status */}
                <div>
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-t-lg">
                    <h3 className="font-medium">Question Status</h3>
                  </div>
                  <div className="border border-gray-200 rounded-b-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.No</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sections</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total question</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Question attempted</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Question correct</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Question Wrong</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Question Skipped</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {analyzerData.consolidated.questionStatus.sections.map((section, index) => (
                          <tr key={index} className="bg-white">
                            <td className="px-4 py-3 text-sm text-gray-900">{section.sNo}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{section.section}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-center">{section.totalQuestions}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-center">{section.attempted}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-center">{section.correct}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-center">{section.wrong}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-center">{section.skipped}</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 font-medium">
                          <td className="px-4 py-3 text-sm text-gray-900"></td>
                          <td className="px-4 py-3 text-sm text-gray-900">total</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-center">{analyzerData.consolidated.questionStatus.total.totalQuestions}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-center">{analyzerData.consolidated.questionStatus.total.attempted}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-center">{analyzerData.consolidated.questionStatus.total.correct}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-center">{analyzerData.consolidated.questionStatus.total.wrong}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-center">{analyzerData.consolidated.questionStatus.total.skipped}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeAnalyzerTab === 'detailed' && (
              <div className="bg-gray-50 min-h-screen">
                {/* Test Name Header with blue dot */}
                <div className="mb-6 p-4 bg-white rounded-lg">
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    {analyzerData.detailed.testName}
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                  {analyzerData.detailed.questions.map((question, index) => (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                      {/* Question Header */}
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          Question No: {question.questionNo}
                        </div>
                        <div className="text-sm text-gray-600 font-medium mb-3">
                          {question.type}
                        </div>
                        <div className="text-sm text-gray-900 leading-relaxed">
                          {question.questionNo}. {question.question}
                        </div>
                      </div>

                      {/* Options with Fixed Color Logic */}
                      <div className="space-y-2 ml-4">
                        {question.options && question.options.map((option, optionIndex) => {
                          // Better normalization function that handles units and numbers
                          const normalizeText = (text) => {
                            if (text === null || text === undefined) return '';
                            return String(text).trim().toLowerCase().replace(/[^\w]/g, '');
                          };

                          const normalizedOption = normalizeText(option);
                          const normalizedSelected = normalizeText(question.selectedAnswer);
                          
                          // Check if this option matches the selected answer
                          // Also check if the option number matches the selected answer number
                          const isSelected = normalizedSelected === normalizedOption || 
                                           normalizedSelected.includes(normalizedOption) ||
                                           normalizedOption.includes(normalizedSelected);
                          
                          // Determine the visual state based on question status and selection
                          let circleClass = 'border-2 border-gray-300 bg-white';
                          let textClass = 'text-gray-700';
                          let showDot = false;
                          let labelText = '';
                          let labelClass = '';

                          if (isSelected) {
                            if (question.isCorrect) {
                              // User selected this option and it's correct - GREEN
                              circleClass = 'border-2 border-green-500 bg-green-500';
                              textClass = 'text-green-700 font-medium';
                              showDot = true;
                              labelText = 'Correct Answer';
                              labelClass = 'bg-green-100 text-green-800';
                            } else {
                              // User selected this option and it's wrong - RED
                              circleClass = 'border-2 border-red-500 bg-red-500';
                              textClass = 'text-red-700 font-medium';
                              showDot = true;
                              labelText = 'Your Answer (Wrong)';
                              labelClass = 'bg-red-100 text-red-800';
                            }
                          }

                          return (
                            <div key={optionIndex} className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${circleClass}`}>
                                {showDot && (
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                              <span className={`text-sm flex-1 ${textClass}`}>
                                {option}
                              </span>
                              {labelText && (
                                <span className={`text-xs px-2 py-1 rounded-full ${labelClass}`}>
                                  {labelText}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MarksObtainedTab;