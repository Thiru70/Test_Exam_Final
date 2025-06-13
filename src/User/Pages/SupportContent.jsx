import React from "react";

const SupportContent = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-2">Support</h2>
        <p className="text-sm text-gray-600">Get help with your exam portal</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-medium text-gray-800 mb-3">Contact Support</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-500">Email:</span>
              <span className="ml-2 text-gray-800">support@examportal.com</span>
            </div>
            <div>
              <span className="text-gray-500">Phone:</span>
              <span className="ml-2 text-gray-800">+1 (555) 123-4567</span>
            </div>
            <div>
              <span className="text-gray-500">Hours:</span>
              <span className="ml-2 text-gray-800">Monday - Friday, 9 AM - 6 PM</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-medium text-gray-800 mb-3">Frequently Asked Questions</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-gray-700">How do I reset my password?</p>
              <p className="text-gray-600">Click on "Forgot Password" on the login page</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Can I retake a test?</p>
              <p className="text-gray-600">Contact support for retake permissions</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Technical issues during test?</p>
              <p className="text-gray-600">Contact support immediately for assistance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportContent;