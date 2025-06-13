import React from "react";

const ExamInstructions = () => {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-8">Exam Instructions</h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-100 rounded-lg p-6 shadow-sm">
          <ul className="space-y-2 text-sm text-gray-800">
            <li className="flex items-start">
              <span className="inline-block w-1.5 h-1.5 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Ensure a stable internet connection throughout the exam.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-1.5 h-1.5 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Enable camera and microphone access for proctoring purposes.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-1.5 h-1.5 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>You must not refresh, reload, or close the browser during the test.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-1.5 h-1.5 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Avoid switching tabs or opening other applications during the test.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-1.5 h-1.5 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Keep your ID card ready for identity verification if asked.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-1.5 h-1.5 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>The exam is time-bound and will auto-submit when the timer ends.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-1.5 h-1.5 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Do not attempt to copy, share, or record the test content.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-1.5 h-1.5 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>If you face any issue, contact support immediately via the provided button.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-1.5 h-1.5 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Click the checkbox below to agree and proceed to the test.</span>
            </li>
          </ul>
          
          <div className="mt-6 mb-6">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                className="mt-0.5 w-4 h-4 text-blue-600 border-gray-400 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-800">
                I have read and agree to follow the above instructions.
              </span>
            </label>
          </div>
          
          <div className="text-right">
            <button className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2.5 rounded-md transition-colors duration-200">
              Go to My test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInstructions;