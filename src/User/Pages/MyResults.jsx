import React, { useState } from "react";
import ResultsList from "../Components/ResultList";
import ResultsDetail from "../Components/ResultsDetails";

const MyResults = () => {
  const [selectedTest, setSelectedTest] = useState(null);

  const handleViewTest = (test) => {
    setSelectedTest(test);
  };

  const handleBackToList = () => {
    setSelectedTest(null);
  };

  
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
      onViewTest={handleViewTest}
    />
  );
};

export default MyResults;