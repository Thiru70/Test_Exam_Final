import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Result = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    Category: '',
    language: '',
    eligibility: {
      required: false,
      tenthPercentage: '',
      twelfthPercentage: ''
    },
    sessionExam: {
      isSession: false,
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: ''
    }
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('eligibility.')) {
      const key = name.split('.')[1];
      setFormData(prev => {
        const updated = {
          ...prev,
          eligibility: {
            ...prev.eligibility,
            [key]: type === 'checkbox' ? checked : value
          }
        };
        localStorage.setItem("formData", JSON.stringify(updated));
        return updated;
      });

    } else if (name.startsWith('sessionExam.')) {
      const key = name.split('.')[1];
      setFormData(prev => {
        const updated = {
          ...prev,
          sessionExam: {
            ...prev.sessionExam,
            [key]: type === 'checkbox' ? checked : value
          }
        };
        localStorage.setItem("formData", JSON.stringify(updated));
        return updated;
      });

    } else {
      setFormData(prev => {
        const updated = { ...prev, [name]: value };
        localStorage.setItem("formData", JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleSave = () => {
    // You can save the entire formData to localStorage or send to backend here
    // localStorage.setItem('formData', JSON.stringify(formData));
    navigate('/questionSet');
  };

  return (
    <div className="p-6">
  {/* Test Name */}
  <div className="mt-2">
    <label className="block mb-1 font-semibold mt-2">Test Name</label>
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleInputChange}
      className="w-full border-b border-[#000000] rounded px-3 py-2 focus:outline-none"
      required
    />
  </div>

  {/* Eligibility Section */}
  <div className="mt-4 border-t pt-4">
    <h3 className="font-bold mb-2">Eligibility</h3>
    <label className="flex items-center mb-2">
      <input
        type="checkbox"
        name="eligibility.required"
        checked={formData.eligibility.required}
        onChange={handleInputChange}
        className="mr-2"
      />
      Required
    </label>
    <div className="flex gap-4">
      <div className="w-1/2">
        <label className="block mb-1">10th Percentage</label>
        <input
          type="number"
          name="eligibility.tenthPercentage"
          value={formData.eligibility.tenthPercentage}
          onChange={handleInputChange}
          className="w-full border-b border-[#000000] rounded px-3 py-2 focus:outline-none"
          min="0"
          max="100"
        />
      </div>
      <div className="w-1/2">
        <label className="block mb-1">12th Percentage</label>
        <input
          type="number"
          name="eligibility.twelfthPercentage"
          value={formData.eligibility.twelfthPercentage}
          onChange={handleInputChange}
          className="w-full border-b border-[#000000] rounded px-3 py-2 focus:outline-none"
          min="0"
          max="100"
        />
      </div>
    </div>
  </div>

  {/* Session Exam Section */}
  <div className="mt-4 border-t pt-4">
    <h3 className="font-bold mb-2">Session Exam</h3>
    <label className="flex items-center mb-2">
      <input
        type="checkbox"
        name="sessionExam.isSession"
        checked={formData.sessionExam.isSession}
        onChange={handleInputChange}
        className="mr-2"
      />
      Is Session Exam
    </label>

    {/* Start & End Dates in one row */}
    <div className="flex gap-4 mb-2">
      <div className="w-1/2">
        <label className="block mb-1">Start Date</label>
        <input
          type="date"
          name="sessionExam.startDate"
          value={formData.sessionExam.startDate}
          onChange={handleInputChange}
          className="w-full border-b border-[#000000] rounded px-3 py-2 focus:outline-none"
        />
      </div>
      <div className="w-1/2">
        <label className="block mb-1">End Date</label>
        <input
          type="date"
          name="sessionExam.endDate"
          value={formData.sessionExam.endDate}
          onChange={handleInputChange}
          className="w-full border-b border-[#000000] rounded px-3 py-2 focus:outline-none"
        />
      </div>
    </div>

    {/* Start & End Times in one row */}
    <div className="flex gap-4">
      <div className="w-1/2">
        <label className="block mb-1">Start Time</label>
        <input
          type="time"
          name="sessionExam.startTime"
          value={formData.sessionExam.startTime}
          onChange={handleInputChange}
          className="w-full border-b border-[#000000] rounded px-3 py-2 focus:outline-none"
        />
      </div>
      <div className="w-1/2">
        <label className="block mb-1">End Time</label>
        <input
          type="time"
          name="sessionExam.endTime"
          value={formData.sessionExam.endTime}
          onChange={handleInputChange}
          className="w-full border-b border-[#000000] rounded px-3 py-2 focus:outline-none"
        />
      </div>
    </div>
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
