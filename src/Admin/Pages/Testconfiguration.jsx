import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Result = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    testName: '',
    duration: '',
    passingMarks: '',
    shuffle: '',
    eligibility: {
      required: '',
      tenthPercentage: '',
      twelfthPercentage: '',
    },
    sessionExam: {
      isSession: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
    },
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (name in formData.eligibility) {
      setFormData((prev) => ({
        ...prev,
        eligibility: {
          ...prev.eligibility,
          [name]: type === 'checkbox' ? checked : value,
        },
      }));
    } else if (name in formData.sessionExam) {
      setFormData((prev) => ({
        ...prev,
        sessionExam: {
          ...prev.sessionExam,
          [name]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };
  

  const handleSave = () => {
    const { testName, duration,passingMarks,eligibility, sessionExam } = formData;

    if (!testName.trim()) {
      toast.error("Please enter the Test Name.");
      return;
    }

    if (!duration) {
      toast.error("Please enter the test duration");
      return;
    }

    if (!passingMarks) {
      toast.error("Please enter the passing marks");
      return;
    }
    
    if (eligibility) {
      if (!eligibility.tenthPercentage || isNaN(eligibility.tenthPercentage)) {
        toast.error("Please enter a valid 10th Percentage.");
        return;
      }
      if (
        !eligibility.twelfthPercentage ||
        isNaN(eligibility.twelfthPercentage)
      ) {
        toast.error("Please enter a valid 12th Percentage.");
        return;
      }
    }

    if (sessionExam.isSession) {
      if (!sessionExam.startDate) {
        toast.error("Please enter the session start date.");
        return;
      }
      if (!sessionExam.endDate) {
        toast.error("Please enter the session end date.");
        return;
      }
      if (!sessionExam.startTime) {
        toast.error("Please enter the session start time.");
        return;
      }
      if (!sessionExam.endTime) {
        toast.error("Please enter the session end time.");
        return;
      }
    }
    localStorage.setItem('formData',JSON.stringify(formData))
    navigate("/questionSet");
  };

  return (
    <div className="p-6">
      <ToastContainer />
      {/* Test Name */}
      <div>
          <label className="block text-base font-medium mb-1">Test Name</label>
          <input
            name="testName"
            value={formData.testName}
            onChange={handleInputChange}
            placeholder="Test Name"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-base font-medium mb-1">Duration</label>
          <input
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="Duration"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-base font-medium mb-1">Passing Marks</label>
          <input
            name="passingMarks"
            type="number"
            value={formData.passingMarks}
            onChange={handleInputChange}
            placeholder="Passing Marks"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            name="shuffle"
            type="checkbox"
            checked={formData.shuffle}
            onChange={handleInputChange}
            className="h-4 w-4"
          />
          <label className="text-base font-medium">Shuffle</label>
        </div>

        <h4 className="text-lg font-semibold mt-6 mb-2">Eligibility</h4>
        <div className="flex items-center space-x-2">
          <input
            name="required"
            type="checkbox"
            checked={formData.eligibility.required}
            onChange={handleInputChange}
            className="h-4 w-4"
          />
          <label className="text-base font-medium">Required</label>
        </div>
        <div>
          <label className="block text-base font-medium mb-1">10th %</label>
          <input
            name="tenthPercentage"
            type="number"
            value={formData.eligibility.tenthPercentage}
            onChange={handleInputChange}
            placeholder="10th %"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-base font-medium mb-1">12th %</label>
          <input
            name="twelfthPercentage"
            type="number"
            value={formData.eligibility.twelfthPercentage}
            onChange={handleInputChange}
            placeholder="12th %"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        <h4 className="text-lg font-semibold mt-6 mb-2">Session Exam</h4>
        <div className="flex items-center space-x-2">
          <input
            name="isSession"
            type="checkbox"
            checked={formData.sessionExam.isSession}
            onChange={handleInputChange}
            className="h-4 w-4"
          />
          <label className="text-base font-medium">Is Session</label>
        </div>
        <div>
          <label className="block text-base font-medium mb-1">Start Date</label>
          <input
            name="startDate"
            type="date"
            value={formData.sessionExam.startDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-base font-medium mb-1">End Date</label>
          <input
            name="endDate"
            type="date"
            value={formData.sessionExam.endDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-base font-medium mb-1">Start Time</label>
          <input
            name="startTime"
            type="time"
            value={formData.sessionExam.startTime}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-base font-medium mb-1">End Time</label>
          <input
            name="endTime"
            type="time"
            value={formData.sessionExam.endTime}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
      {/* Save Button */}
      <button
        className="px-5 py-2 bg-[#0079EA] text-[#fff] rounded-md mt-5"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
};

export default Result;
