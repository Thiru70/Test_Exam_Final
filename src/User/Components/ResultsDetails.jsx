import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import OverviewTab from "./OverviewTab";
import MarksObtainedTab from "./MarksObtainedTab";

const ResultsDetail = ({ test, onBack }) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ChevronLeft size={16} />
          <span className="text-sm">Back to Results</span>
        </button>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Results</h2>
        <p className="text-sm text-gray-500">Results Created: {test.testResults.createdDate}</p>
      </div>

      {/* Blue Header */}
      <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg">
        <span className="text-sm font-medium">Created: {test.testResults.createdDate}</span>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-200 flex">
        <button 
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "overview" 
              ? "text-gray-700 bg-white border-b-2 border-blue-600" 
              : "text-gray-600 hover:text-gray-700"
          }`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab("marks")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "marks" 
              ? "text-gray-700 bg-white border-b-2 border-blue-600" 
              : "text-gray-600 hover:text-gray-700"
          }`}
        >
          Marks obtained
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" ? (
        <OverviewTab test={test} />
      ) : (
        <MarksObtainedTab test={test} />
      )}
    </div>
  );
};

export default ResultsDetail;