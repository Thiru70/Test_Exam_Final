import React from "react";

const ResultsList = ({ onViewTest }) => {
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
                onClick={() => onViewTest(test)}
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

export default ResultsList;