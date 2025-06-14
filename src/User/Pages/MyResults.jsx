import React, { useState } from "react";
import ResultsList from "../Components/ResultList";
import ResultsDetail from "../Components/ResultsDetails";

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

  // Conditional rendering based on selectedTest state
  if (selectedTest) {
    return (
      <ResultsDetail 
        test={selectedTest} 
        onBack={handleBackToList} 
      />
    );
  }

  return (
    <ResultsList 
      tests={completedTests} 
      onViewTest={handleViewTest} 
    />
  );
};

export default MyResults;