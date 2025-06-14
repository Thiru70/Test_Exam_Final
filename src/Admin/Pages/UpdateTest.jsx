import React,  { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const UpdateTest = () => {
  const { testId } = useParams();
  const [form, setForm] = useState({
    testName: 'Aptitude Test',
    duration: 45,
    passingMarks: 5,
    shuffle: true,
    eligibility: {
      required: true,
      tenthPercentage: 60,
      twelfthPercentage: 60,
    },
    sessionExam: {
      isSession: true,
      startDate: '2025-06-5',
      endDate: '2025-06-10',
      startTime: '09:00',
      endTime: '11:00',
    },
  });



  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name in form.eligibility) {
      setForm({
        ...form,
        eligibility: {
          ...form.eligibility,
          [name]: type === 'checkbox' ? checked : value,
        },
      });
    } else if (name in form.sessionExam) {
      setForm({
        ...form,
        sessionExam: {
          ...form.sessionExam,
          [name]: type === 'checkbox' ? checked : value,
        },
      });
    } else {
      setForm({
        ...form,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };
    useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axiosInstance.get(`/test/${testId}`);
        setForm(res.data);
      } catch (error) {
        setMessage('Failed to fetch test data.');
      }
    };
    fetchTest();
  }, [testId]);

  if (!form) return <div className="text-center mt-10">Loading...</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/test/${testId}`, form);
      setMessage('Test updated successfully!');
    } catch (error) {
      setMessage('Failed to update test.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-8 text-center">Update Test</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-base font-medium mb-1">Test Name</label>
          <input
            name="testName"
            value={form.testName}
            onChange={handleChange}
            placeholder="Test Name"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-base font-medium mb-1">Duration</label>
          <input
            name="duration"
            type="number"
            value={form.duration}
            onChange={handleChange}
            placeholder="Duration"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-base font-medium mb-1">Passing Marks</label>
          <input
            name="passingMarks"
            type="number"
            value={form.passingMarks}
            onChange={handleChange}
            placeholder="Passing Marks"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            name="shuffle"
            type="checkbox"
            checked={form.shuffle}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label className="text-base font-medium">Shuffle</label>
        </div>

        <h4 className="text-lg font-semibold mt-6 mb-2">Eligibility</h4>
        <div className="flex items-center space-x-2">
          <input
            name="required"
            type="checkbox"
            checked={form.eligibility.required}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label className="text-base font-medium">Required</label>
        </div>
        <div>
          <label className="block text-base font-medium mb-1">10th %</label>
          <input
            name="tenthPercentage"
            type="number"
            value={form.eligibility.tenthPercentage}
            onChange={handleChange}
            placeholder="10th %"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-base font-medium mb-1">12th %</label>
          <input
            name="twelfthPercentage"
            type="number"
            value={form.eligibility.twelfthPercentage}
            onChange={handleChange}
            placeholder="12th %"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        <h4 className="text-lg font-semibold mt-6 mb-2">Session Exam</h4>
        <div className="flex items-center space-x-2">
          <input
            name="isSession"
            type="checkbox"
            checked={form.sessionExam.isSession}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label className="text-base font-medium">Is Session</label>
        </div>
        <div>
          <label className="block text-base font-medium mb-1">Start Date</label>
          <input
            name="startDate"
            type="date"
            value={form.sessionExam.startDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-base font-medium mb-1">End Date</label>
          <input
            name="endDate"
            type="date"
            value={form.sessionExam.endDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-base font-medium mb-1">Start Time</label>
          <input
            name="startTime"
            type="time"
            value={form.sessionExam.startTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-base font-medium mb-1">End Time</label>
          <input
            name="endTime"
            type="time"
            value={form.sessionExam.endTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <button
          type="submit"
          className="w-full mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        >
          Update Test
        </button>
      </form>
      {message && <p className="mt-4 text-center text-blue-600 font-medium">{message}</p>}
    </div>
  );
};

export default UpdateTest;