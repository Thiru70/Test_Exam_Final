import React, { useState } from "react";

const MarksObtainedTab = ({ test }) => {
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [activeAnalyzerTab, setActiveAnalyzerTab] = useState('consolidated');

  // Sample data - you can derive this from your test prop
  const marksData = {
    timeSpent: "00:24:06",
    testScore: "66.00 / 100.00",
    sections: [
      {
        name: "Aptitude test",
        score: 66,
        averageScore: 66,
        topScore: 90,
        leastScore: 45
      }
    ]
  };

  // Sample analyzer data
  const analyzerData = {
    consolidated: {
      performanceStatus: {
        sections: [
          {
            sNo: "01.",
            section: "Aptitude test",
            totalMarks: 100,
            score: 66,
            averageScore: 66,
            topScore: 90,
            leastScore: 45
          }
        ],
        total: {
          totalMarks: 100,
          score: 66,
          averageScore: 66,
          topScore: 90,
          leastScore: 45
        }
      },
      questionStatus: {
        sections: [
          {
            sNo: "01.",
            section: "Aptitude test",
            totalQuestions: 30,
            attempted: 28,
            correct: 21,
            wrong: 7,
            skipped: 2
          }
        ],
        total: {
          totalQuestions: 30,
          attempted: 28,
          correct: 21,
          wrong: 7,
          skipped: 2
        }
      }
    },
    detailed: {
      testName: "Aptitude Test (30)",
      questions: [
        {
          questionNo: 1,
          type: "Multi Choice Type Question",
          question: "Eesha Works For 1800 Metres She Is Involved In A Mission To Intercept A Comet That Is Likely To Collide With In 1 Month.She Is Developing A C Program To Calculate The Trajectory Of The Missile To Be Launched To Intercept And Descending The Approaching Comet In Order To Achieve Highest Accuracy Of The Missile Trajectory What Data Type Should She Use For The Variables In Her Equation.?",
          options: ["Double", "Float", "Long int", "int"],
          selectedAnswer: "Double",
          isCorrect: true
        },
        {
          questionNo: 2,
          type: "Multi Choice Type Question", 
          question: "Eesha Works For 1800 Metres She Is Involved In A Mission To Intercept A Comet That Is Likely To Collide With In 1 Month.She Is Developing A C Program To Calculate The Trajectory Of The Missile To Be Launched To Intercept And Descending The Approaching Comet In Order To Achieve Highest Accuracy Of The Missile Trajectory What Data Type Should She Use For The Variables In Her Equation.?",
          options: ["Double", "Float", "Long int", "int"],
          selectedAnswer: "Double",
          isCorrect: true
        }
      ]
    }
  };

  const handleAnalyzeResult = () => {
    setShowAnalyzer(true);
  };

  const closeAnalyzer = () => {
    setShowAnalyzer(false);
  };

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
      {showAnalyzer && (
        <div className="mt-6">
          {/* Header */}
          <div className="flex justify-between items-center p-4  bg-gray-50 rounded-t-lg">
            <h2 className="text-lg font-semibold text-gray-900"></h2>
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
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeAnalyzerTab === 'consolidated'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'text-gray-600 hover:text-gray-800 bg-gray-100 border-transparent'
              }`}
            >
              Consolidated
            </button>
            <button
              onClick={() => setActiveAnalyzerTab('detailed')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeAnalyzerTab === 'detailed'
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

                      {/* Options */}
                      <div className="space-y-2 ml-4">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              question.selectedAnswer === option
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            }`}>
                              {question.selectedAnswer === option && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                            <span className={`text-sm ${
                              question.selectedAnswer === option 
                                ? 'text-blue-600 font-medium' 
                                : 'text-gray-700'
                            }`}>
                              {option}
                            </span>
                          </div>
                        ))}
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