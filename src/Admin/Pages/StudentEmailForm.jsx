import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify-icon/react';
import { useLocation } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";

const StudentEmailForm = () => {
  const location = useLocation();
  const studentData = location.state?.studentData;

  // Updated default email template with student_id placeholder
  const defaultEmailFormat = `Dear [Candidate Name],

We are excited to inform you that we have an opening for the [Job Title] role at [Company Name]. We believe your skills and experience align well, and we would love to invite you to apply for the position.

Your unique Student ID: [Student ID]
Date of Birth on file: [Date of Birth]

To apply, please click on the link below and fill out the application form to help ensure that you provide your skills and career information:

Application Form Link: [link to our form]

If you have any questions or need further assistance, feel free to contact us.

We look forward to receiving your application.

Best regards,
[Your Name]
[Your Title]
[Company Website]
[Contact Information]`;

  const [emailFormat, setEmailFormat] = useState(defaultEmailFormat);
  const [subject, setSubject] = useState('Exciting Job Opportunity at [Company Name] – Apply Now!');
  const [description, setDescription] = useState('Description(optional notes visible only to you)');
  const [sending, setSending] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  // Auto-fill data if student data is passed
  useEffect(() => {
    if (studentData) {
      // Replace placeholders with student data including student_id and dob
      let processedEmailBody = emailFormat
        .replace(/\[Candidate Name\]/g, studentData.full_name || 'Student')
        .replace(/\[Student ID\]/g, studentData.student_id || 'Not Available')
        .replace(/\[Date of Birth\]/g, studentData.dob || 'Not Available')
        .replace(/\[Job Title\]/g, 'Software Developer')
        .replace(/\[Company Name\]/g, 'HertzWorkz')
        .replace(/\[Your Name\]/g, 'HR Team')
        .replace(/\[Your Title\]/g, 'Human Resources')
        .replace(/\[Company Website\]/g, 'www.hertzworkz.com')
        .replace(/\[Contact Information\]/g, 'support@hertzworkz.com');
      
      setEmailFormat(processedEmailBody);
      
      // Update subject
      setSubject('Exciting Job Opportunity at HertzWorkz – Apply Now!');
      setDescription('For support, contact us at support@hertzworkz.com');
    }
  }, [studentData]);

  const handleSend = async () => {
    if (!studentData || !studentData.email) {
      alert('No student data available. Please select a student first.');
      return;
    }

    setSending(true);
    setApiResponse(null);
    
    try {
      const requestBody = {
        email: studentData.email,
        full_name: studentData.full_name || 'Student',
        dob: studentData.dob || '',
        student_id: studentData.student_id || '', 
        subject: subject,
        email_body: emailFormat,
        description: description
      };

      console.log('Sending API request:', requestBody);

      const response = await fetch('https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/send-student-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.json();
      
      console.log('API Response Status:', response.status);
      console.log('API Response Data:', responseData);
      
      setApiResponse({
        status: response.status,
        data: responseData,
        success: response.ok
      });

      if (response.ok) {
        alert(`Email sent successfully to: ${studentData.email}`);
      } else {
        throw new Error(responseData.message || 'Failed to send email');
      }
      
    } catch (error) {
      console.error('Error sending email:', error);
      setApiResponse({
        status: 'error',
        data: { error: error.message },
        success: false
      });
      alert(`Error sending email: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">

      {/* Email Format Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Email format</h3>
        
        <div className="relative">
          <div className="bg-gray-50 border-2 border-blue-400 rounded-lg p-4">
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-600">Body</span>
            </div>
            
            <textarea
              value={emailFormat}
              onChange={(e) => setEmailFormat(e.target.value)}
              className="w-full h-80 resize-none bg-transparent outline-none text-sm leading-relaxed"
              placeholder="Enter your email template here..."
            />

            {/* Action Icons */}
            <div className="absolute bottom-4 right-4 flex gap-3">
              <button className="p-2 hover:bg-gray-200 rounded">
                <FaRegEdit className="text-lg text-gray-600 hover:text-black" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded">
                <Icon icon="mdi:content-save" className="text-lg text-gray-600 hover:text-black" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Section */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-3">Subject</label>
        <div className="bg-gray-100 rounded px-3 py-2">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-transparent outline-none text-sm"
            placeholder="Enter email subject"
          />
        </div>
      </div>

      {/* Description Section */}
      <div className="mb-8">
        <label className="block text-lg font-semibold mb-3">Description</label>
        <div className="bg-gray-100 rounded p-3 min-h-[100px]">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-transparent outline-none text-sm resize-none h-20"
            placeholder="Description(optional notes visible only to you)"
          />
        </div>
      </div>

      

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={sending || !studentData}
        className={`${
          sending || !studentData
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white font-medium px-8 py-3 rounded-lg transition-colors`}
      >
        {sending ? 'Sending...' : 'Send'}
      </button>

      {!studentData && (
        <p className="text-red-600 text-sm mt-2">
          Please select a student from the student table to send an email.
        </p>
      )}
    </div>
  );
};

export default StudentEmailForm;