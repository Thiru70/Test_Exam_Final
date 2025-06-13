import React from "react";
import { ChevronLeft } from "lucide-react";

const ResultsDetail = ({ selectedTest, onBackToList }) => {
  if (!selectedTest) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <button 
          onClick={onBackToList}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ChevronLeft size={16} />
          <span className="text-sm">Back to Results</span>
        </button>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Results</h2>
        <p className="text-sm text-gray-500">Results Created: {selectedTest.testResults.createdDate}</p>
      </div>

      {/* Blue Header */}
      <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg">
        <span className="text-sm font-medium">Created: {selectedTest.testResults.createdDate}</span>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-200 flex">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-b-2 border-blue-600">
          Overview
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700">
          Marks obtained
        </button>
      </div>

      {/* Results Table */}
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
                Marks
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {selectedTest.testResults.tests.map((test, index) => (
              <tr key={index}>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {test.slNo}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {test.testName}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                  {test.questions}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                  {test.duration}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                  {test.marks}
                </td>
              </tr>
            ))}
            {/* Total Row */}
            <tr className="bg-gray-50 font-medium">
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                total
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                {selectedTest.testResults.total.questions}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                {selectedTest.testResults.total.duration}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                {selectedTest.testResults.total.marks}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsDetail;