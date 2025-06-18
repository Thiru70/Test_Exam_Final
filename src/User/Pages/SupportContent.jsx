import React, { useState } from "react";

// Toast Component (same as StudentLogin)
const Toast = ({ message, type = 'success', onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`rounded-md p-4 shadow-lg ${
        type === 'success' 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {type === 'success' ? (
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${
              type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                type === 'success' 
                  ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' 
                  : 'text-red-500 hover:bg-red-100 focus:ring-red-600'
              }`}
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SupportContent = () => {
  const [openSection, setOpenSection] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    issue_description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/support/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          issue_description: formData.issue_description
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to submit: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Contact form response:', data);
      
      // Show success toast
      setToast({
        message: 'Your Request has been sent successfully! We will get back to you soon.',
        type: 'success'
      });
      
      // Reset form
      setFormData({
        full_name: '',
        email: '',
        issue_description: ''
      });
      
    } catch (err) {
      console.error('Contact form error:', err);
      setToast({
        message: 'Failed to send message. Please try again later.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
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
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Enter your Name"
                      required
                      disabled={isLoading}
                      className="w-full p-3 bg-gray-200 rounded border-0 text-sm placeholder-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your Email"
                      required
                      disabled={isLoading}
                      className="w-full p-3 bg-gray-200 rounded border-0 text-sm placeholder-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issue Description
                    </label>
                    <textarea 
                      rows="4"
                      name="issue_description"
                      value={formData.issue_description}
                      onChange={handleInputChange}
                      placeholder="Describe the issue that you are facing"
                      required
                      disabled={isLoading}
                      className="w-full p-3 bg-gray-200 rounded border-0 text-sm placeholder-gray-500 resize-none disabled:bg-gray-300 disabled:cursor-not-allowed"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading || !formData.full_name || !formData.email || !formData.issue_description}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2.5 rounded transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
                
                <p className="text-xs text-gray-600 mt-4">
                  You can also email us directly at <span className="text-blue-600">support@examportal.com</span>
                </p>
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          @keyframes slide-in {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          .animate-slide-in {
            animation: slide-in 0.3s ease-out;
          }
        `}</style>
      </div>
    </>
  );
};

export default SupportContent;