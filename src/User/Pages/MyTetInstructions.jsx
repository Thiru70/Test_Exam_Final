import React from "react";

const ExamInstructions = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-2">Exam Instructions</h2>
        <p className="text-sm text-gray-600">Please read carefully before starting your test</p>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-800 mb-2">General Instructions:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Ensure you have a stable internet connection</li>
              <li>Use a desktop or laptop for the best experience</li>
              <li>Clear your browser cache before starting</li>
              <li>Close all unnecessary applications and browser tabs</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-2">During the Test:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Do not refresh the page or navigate away</li>
              <li>Answer all questions to the best of your ability</li>
              <li>You can review and change answers before submitting</li>
              <li>Submit your test before the time limit expires</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Technical Requirements:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
              <li>Minimum screen resolution: 1024x768</li>
              <li>JavaScript enabled</li>
              <li>Cookies enabled</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInstructions;