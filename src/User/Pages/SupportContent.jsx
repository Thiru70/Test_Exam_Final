import React, { useState } from "react";

const SupportContent = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-8">Support</h1>
      
      <div className="max-w-2xl mx-auto">
        {/* FAQs Section */}
        <div className="mb-4">
          <div 
            className="bg-gray-100 p-4 rounded-lg cursor-pointer flex justify-between items-center"
            onClick={() => toggleSection('faqs')}
          >
            <span className="font-medium text-gray-800">FAQs</span>
            <span className="text-gray-600">
              {openSection === 'faqs' ? '−' : '+'}
            </span>
          </div>
          
          {openSection === 'faqs' && (
            <div className="bg-gray-50 p-4 rounded-b-lg border-t">
              <div className="space-y-4 text-sm text-gray-800">
                <div>
                  <p className="font-medium mb-1">Q: What should I do if the exam page doesn't load?</p>
                  <p className="ml-2">A: Try refreshing the page or check your internet connection. Contact support if the issue persists.</p>
                </div>
                
                <div>
                  <p className="font-medium mb-1">Q: Can I use my phone to take the exam?</p>
                  <p className="ml-2">A: We recommend using a laptop or desktop for better compatibility and proctoring support.</p>
                </div>
                
                <div>
                  <p className="font-medium mb-1">Q: What happens if I lose connection during the exam?</p>
                  <p className="ml-2">A: The system attempts to autosave your progress. Reconnect quickly and rejoin the exam. Inform support immediately.</p>
                </div>
                
                <div>
                  <p className="font-medium mb-1">Q: How will I receive my results?</p>
                  <p className="ml-2">A: Results will be shared via email or displayed in the portal once evaluated.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contact Us Section */}
        <div className="mb-4">
          <div 
            className="bg-gray-100 p-4 rounded-lg cursor-pointer flex justify-between items-center"
            onClick={() => toggleSection('contact')}
          >
            <span className="font-medium text-gray-800">Contact Us</span>
            <span className="text-gray-600">
              {openSection === 'contact' ? '−' : '+'}
            </span>
          </div>
          
          {openSection === 'contact' && (
            <div className="bg-gray-50 p-4 rounded-b-lg border-t">
              <p className="text-sm text-gray-800 mb-4">
                If you're facing technical issues or have questions regarding the exam, please reach out using the form below or contact us directly.
              </p>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter your Name"
                    className="w-full p-3 bg-gray-200 rounded border-0 text-sm placeholder-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input 
                    type="email" 
                    placeholder="Enter your Email"
                    className="w-full p-3 bg-gray-200 rounded border-0 text-sm placeholder-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Description
                  </label>
                  <textarea 
                    rows="4"
                    placeholder="Describe the issue that you are facing"
                    className="w-full p-3 bg-gray-200 rounded border-0 text-sm placeholder-gray-500 resize-none"
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2.5 rounded transition-colors duration-200"
                >
                  Submit
                </button>
              </form>
              
              <p className="text-xs text-gray-600 mt-4">
                You can also email us directly at <span className="text-blue-600">support@examportal.com</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportContent;