import React, { useState, useRef } from 'react';

const TestSettingsForm = () => {
  const [testName, setTestName] = useState('');
  const [passMarkEnabled, setPassMarkEnabled] = useState(true);
  const [passMarkValue, setPassMarkValue] = useState(40);
  const [passMarkUnit, setPassMarkUnit] = useState('%');
  const [timeMethod, setTimeMethod] = useState('per-question');
  const [totalTestTime, setTotalTestTime] = useState('');
  const [timePerQuestion, setTimePerQuestion] = useState('2:00');

  const [activationMethod, setActivationMethod] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const inputRef = useRef();

  const formatDateTime = () => {
    if (!selectedDate || !startTime || !endTime) return '';
    const formattedDate = new Date(selectedDate).toLocaleDateString('en-GB');
    return `${formattedDate}, ${startTime} - ${endTime}`;
  }

  console.log(localStorage.getItem('testName'),"testName")
  const handleSave = () => {
    const data = {
      testName,
      passMarkEnabled,
      passMarkValue,
      passMarkUnit,
      timeMethod,
      totalTestTime,
      timePerQuestion,
    };
    console.log('Saved settings:', data);
  };

  const buildTestPayload = () => {
    return {
      testName: "Aptitude Test - General",
      duration: 45, 
      passingMarks: 5,
      shuffle,
      questions: questionsList.map((q) => ({
        question: q.question,
        type: q.answerType === "single" || q.answerType === "multiple" ? "MCQ" : q.answerType,
        options: q.answers?.map((a) => a.text) || [],
        answer:
          q.answerType === "short"
            ? "" 
            : q.answers?.find((a) => a.correct)?.text || "", // Only returns the first correct answer
        difficulty: "easy", x 
      })),
      eligibility: {
        required: true,
        tenthPercentage: 60,
        twelfthPercentage: 65,
      },
      sessionExam: {
        isSession: true,
        startDate: "2025-06-10",
        endDate: "2025-06-15",
        startTime: "09:00",
        endTime: "11:00",
      },
      createdBy: "admin@yourdomain.com",
    };
  };
  
  const handleSaveTest = async () => {
    const payload = buildTestPayload();
    try {
      const response = await axiosInstance.post('/test',payload)
  
      if (!response) throw new Error("Failed to save test");
  
      alert("Test saved successfully!");
      navigate("/GradingCriteria");
    } catch (error) {
      console.error(error);
      alert("Error saving test");
    }
  };

  return (
    <div className="mx-auto p-8 text-gray-800 font-sans space-y-10 bg-white rounded-md shadow-md">
      
      {/* Test Name Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-1 text-gray-800">Grading criteria</h2>
        <h3 className="mb-4 text-lg">Set grading criteria </h3>
         <p className="mb-4 text-md">Define grading criteria for the test</p>
       
      </div>

      {/* Grading Section */}
      <div>
        <p className="text-lg mb-2 ">Maximum possible score (100%):</p>

        {/* Pass Mark Toggle */}
        <div className="flex items-center gap-5 mb-4">
          <label className="text-md font-medium ">Pass mark</label>
         <div
  onClick={() => setPassMarkEnabled(!passMarkEnabled)}
  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition duration-300 ${
    passMarkEnabled ? 'bg-green-500' : 'bg-gray-300'
  }`}
>
  <div
    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
      passMarkEnabled ? 'translate-x-5' : 'translate-x-0'
    }`}
  />
</div>
        </div>

        {/* Value & Unit */}
        <div className="flex gap-6">
          <div>
            <label className="block text-md  mb-1">Value</label>
            <input
              type="number"
              value={passMarkValue}
              onChange={(e) => setPassMarkValue(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-md w-28 text-sm"
            />
          </div>
          <div>
            <label className="block text-md mb-1">Unit</label>
            <select
              value={passMarkUnit}
              onChange={(e) => setPassMarkUnit(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md w-28 text-sm"
            >
              <option value="%">%</option>
              <option value="points">Points</option>
            </select>
          </div>
        </div>
      </div>

      {/* Time Settings */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Time settings</h2>
        <p className="  mb-0">Test duration</p>
        <p className="mb-3 text-md">Select test duration measuring method:</p>
        <div className="space-y-5 pl-3">
          <div className="flex items-center gap-3">
            <input
              type="radio"
              id="full-test"
              name="timeMethod"
              value="full-test"
              checked={timeMethod === 'full-test'}
              onChange={() => setTimeMethod('full-test')}
              className="accent-blue-600"
            />
            <label htmlFor="full-test" className="text-md">
              Time to complete the test: (hh:mm)
            </label>
            <input
              type="text"
              value={totalTestTime}
              onChange={(e) => setTotalTestTime(e.target.value)}
              disabled={timeMethod !== 'full-test'}
              className="ml-2 px-3 py-1 border rounded-md w-28 text-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="radio"
              id="per-question"
              name="timeMethod"
              value="per-question"
              checked={timeMethod === 'per-question'}
              onChange={() => setTimeMethod('per-question')}
              className="accent-blue-600"
            />
            <label htmlFor="per-question" className="text-md ">
              Time limit for each test question (mm:ss)
            </label>
            <input
              type="text"
              value={timePerQuestion}
              onChange={(e) => setTimePerQuestion(e.target.value)}
              disabled={timeMethod !== 'per-question'}
              className="ml-2 px-3 py-1 border rounded-md w-28 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Test Activation */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Test activation options</h2>

        <div className="mb-4">
          <label className="block text-md mb-1 font-medium text-gray-700">Choose test activation method:</label>
          <input
            type="text"
            value={activationMethod}
            onChange={(e) => setActivationMethod(e.target.value)}
            placeholder="e.g., Manual, Scheduled"
            className="w-1/3 px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        <div className="relative">
          <label className="block text-md font-medium  mb-1">Test will remain active for</label>
          <input
            ref={inputRef}
            type="text"
            readOnly
            value={formatDateTime()}
            onClick={() => setShowDatePicker(true)}
            placeholder="Select date and time"
            className="w-1/3 px-3 py-2 border rounded-md text-sm cursor-pointer"
          />

          {showDatePicker && (
            <div className="absolute top-full mt-2 p-4 bg-white border rounded-md shadow-lg z-10 w-full max-w-md">
              <div className="mb-4">
                <label className="block text-sm mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-md"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default TestSettingsForm;
