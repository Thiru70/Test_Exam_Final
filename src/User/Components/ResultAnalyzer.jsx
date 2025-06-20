import React, { useState } from 'react';

const ResultAnalyzer = ({ analyzerData, onClose }) => {
  const [activeTab, setActiveTab] = useState('consolidated');

  if (!analyzerData) return null;

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-t-lg">
        <h2 className="text-lg font-semibold text-gray-900">Result Analysis</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl font-semibold bg-transparent border-none cursor-pointer"
        >
          ×
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex">
        <button
          onClick={() => setActiveTab('consolidated')}
          className={`px-6 py-3 text-sm font-medium border-b-2 ${
            activeTab === 'consolidated'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'text-gray-600 hover:text-gray-800 bg-gray-100 border-transparent'
          }`}
        >
          Consolidated
        </button>
        <button
          onClick={() => setActiveTab('detailed')}
          className={`px-6 py-3 text-sm font-medium border-b-2 ${
            activeTab === 'detailed'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'text-gray-600 hover:text-gray-800 bg-gray-100 border-transparent'
          }`}
        >
          Detailed
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'consolidated' && (
          <ConsolidatedView data={analyzerData.consolidated} />
        )}

        {activeTab === 'detailed' && (
          <DetailedView data={analyzerData.detailed} />
        )}
      </div>
    </div>
  );
};

// Consolidated View Component
const ConsolidatedView = ({ data }) => (
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
            {data.performanceStatus.sections.map((section, index) => (
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
              <td className="px-4 py-3 text-sm text-gray-900 text-center">{data.performanceStatus.total.totalMarks}</td>
              <td className="px-4 py-3 text-sm text-gray-900 text-center">{data.performanceStatus.total.score}</td>
              <td className="px-4 py-3 text-sm text-gray-900 text-center">{data.performanceStatus.total.averageScore}</td>
              <td className="px-4 py-3 text-sm text-gray-900 text-center">{data.performanceStatus.total.topScore}</td>
              <td className="px-4 py-3 text-sm text-gray-900 text-center">{data.performanceStatus.total.leastScore}</td>
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
            {data.questionStatus.sections.map((section, index) => (
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
              <td className="px-4 py-3 text-sm text-gray-900 text-center">{data.questionStatus.total.totalQuestions}</td>
              <td className="px-4 py-3 text-sm text-gray-900 text-center">{data.questionStatus.total.attempted}</td>
              <td className="px-4 py-3 text-sm text-gray-900 text-center">{data.questionStatus.total.correct}</td>
              <td className="px-4 py-3 text-sm text-gray-900 text-center">{data.questionStatus.total.wrong}</td>
              <td className="px-4 py-3 text-sm text-gray-900 text-center">{data.questionStatus.total.skipped}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Detailed View Component
const DetailedView = ({ data }) => (
  <div className="bg-gray-50 min-h-screen">
    {/* Test Name Header with blue dot */}
    <div className="mb-6 p-4 bg-white rounded-lg">
      <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
        {data.testName}
      </div>
    </div>

    {/* Questions List */}
    <div className="space-y-4">
      {data.questions.map((question, index) => (
        <QuestionCard 
          key={index} 
          question={question} 
          testType={data.testType} 
        />
      ))}
    </div>
  </div>
);

// Question Card Component
const QuestionCard = ({ question, testType }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4">
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
      
      {/* Show marks for coding questions */}
      {testType === 'coding' && (
        <div className="mt-2 text-sm">
          <span className="text-gray-600">Marks: </span>
          <span className={`font-medium ${question.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {question.awardedMarks} / {question.totalMarks}
          </span>
        </div>
      )}
    </div>

    {/* Content based on test type */}
    {testType === 'MCQ' && (
      <MCQOptions 
        options={question.options}
        selectedAnswer={question.selectedAnswer}
        isCorrect={question.isCorrect}
      />
    )}

    {/* Coding test cases */}
    {testType === 'coding' && (
      <TestCases testCases={question.testCases} />
    )}
  </div>
);

// MCQ Options Component
const MCQOptions = ({ options, selectedAnswer, isCorrect }) => (
  <div className="space-y-2 ml-4">
    {options && options.map((option, optionIndex) => {
      const normalizeText = (text) => {
        if (text === null || text === undefined) return '';
        return String(text).trim().toLowerCase().replace(/[^\w]/g, '');
      };

      const normalizedOption = normalizeText(option);
      const normalizedSelected = normalizeText(selectedAnswer);
      
      const isSelected = normalizedSelected === normalizedOption || 
                       normalizedSelected.includes(normalizedOption) ||
                       normalizedOption.includes(normalizedSelected);
      
      let circleClass = 'border-2 border-gray-300 bg-white';
      let textClass = 'text-gray-700';
      let showDot = false;
      let labelText = '';
      let labelClass = '';

      if (isSelected) {
        if (isCorrect) {
          circleClass = 'border-2 border-green-500 bg-green-500';
          textClass = 'text-green-700 font-medium';
          showDot = true;
          labelText = 'Correct Answer';
          labelClass = 'bg-green-100 text-green-800';
        } else {
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
);

// Test Cases Component
const TestCases = ({ testCases }) => (
  <div className="ml-4">
    <div className="text-sm font-medium text-gray-700 mb-2">Test Cases:</div>
    <div className="space-y-2">
      {testCases && testCases.map((testCase, tcIndex) => (
        <div key={tcIndex} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
          <div className={`w-3 h-3 rounded-full ${
            testCase.status === 'pass' ? 'bg-green-500' : 
            testCase.status === 'fail' ? 'bg-red-500' : 'bg-gray-400'
          }`}></div>
          <div className="flex-1 text-sm">
            <span className="text-gray-600">Input: </span>
            <span className="font-mono">{testCase.input}</span>
            <span className="text-gray-600 ml-4">Expected: </span>
            <span className="font-mono">{testCase.expectedOutput}</span>
            <span className={`ml-4 px-2 py-1 rounded text-xs ${
              testCase.status === 'pass' ? 'bg-green-100 text-green-800' :
              testCase.status === 'fail' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-gray-800'
            }`}>
              {testCase.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ResultAnalyzer;