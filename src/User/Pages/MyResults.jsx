import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";

const MyResults = () => {
  const [selectedTest, setSelectedTest] = useState(null);
  
  const completedTests = [
    {
      id: 1,
      title: "Aptitude test",
      description: "Description",
      status: "Ended",
      createdDate: "2025-06-03",
      testResults: {
        createdDate: "2025-03-10",
        tests: [
          {
            slNo: "01.",
            testName: "Aptitude test",
            questions: 30,
            duration: 30,
            marks: 100
          }
        ],
        total: {
          questions: 30,
          duration: 30,
          marks: 100
        }
      }
    },
    {
      id: 2,
      title: "Aptitude test", 
      description: "Description",
      status: "Ended",
      createdDate: "2025-06-03",
      testResults: {
        createdDate: "2025-03-10",
        tests: [
          {
            slNo: "01.",
            testName: "Aptitude test",
            questions: 30,
            duration: 30,
            marks: 100
          }
        ],
        total: {
          questions: 30,
          duration: 30,
          marks: 100
        }
      }
    }
  ];

  const handleViewTest = (test) => {
    setSelectedTest(test);
  };

  const handleBackToList = () => {
    setSelectedTest(null);
  };

  // Results Detail View
  if (selectedTest) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <button 
            onClick={handleBackToList}
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
  }

  // Main Results List View
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Results</h2>
        <p className="text-sm text-gray-500">Round 1</p>
      </div>

      <div className="space-y-4">
        {completedTests.map((test) => (
          <div key={test.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded">
                    {test.status}
                  </span>
                  <span className="text-xs text-gray-500">Created {test.createdDate}</span>
                </div>
                
                <h3 className="text-sm font-medium text-gray-800 mb-1">{test.title}</h3>
                <p className="text-sm text-gray-500">{test.description}</p>
              </div>
              
              <button 
                onClick={() => handleViewTest(test)}
                className="px-4 py-1 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors ml-4"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyResults;