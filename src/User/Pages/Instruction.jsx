import React, { useState } from "react";
import { FaMicrophone, FaExclamationTriangle } from "react-icons/fa";

const guidelines = [
  "Check Your System: Ensure your device (PC/laptop/tablet) is fully charged and connected to a stable internet connection.",
  "Browser Compatibility: Use the recommended browser (e.g., Chrome, Firefox) and disable unnecessary extensions.",
  "Quiet Environment: Choose a distraction-free, well-lit space for the test.",
  "Webcam & Microphone: If required, allow access to your webcam and microphone for monitoring.",
  "Login on Time: Join at least 10–15 minutes before the test starts to avoid last-minute issues.",
  "Read Instructions: Carefully review all guidelines before starting the test.",
  "No External Help: Do not use unauthorized materials, apps, or communication during the exam.",
  "Submission: Ensure you submit your answers before the timer expires.",
];

const InstructionPage = () => {
  const [checked, setChecked] = useState(Array(guidelines.length).fill(false));

  const toggleCheck = (index) => {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];
    setChecked(newChecked);
  };

  const allChecked = checked.every(Boolean);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Exam Portal</h1>
        <p className="text-gray-600 mb-6">
          Here’s a general online exam/test guidance message you can use:
        </p>

        <div className="text-blue-600 font-semibold flex items-center gap-2 mb-4">
          <FaMicrophone className="text-xl" />
          <span>Important Guidelines for Your Online Exam/Test</span>
        </div>

        <ul className="space-y-3">
          {guidelines.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 accent-blue-600 w-4 h-4"
                checked={checked[index]}
                onChange={() => toggleCheck(index)}
              />
              <span className="text-gray-800">{item}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center mt-6 gap-2 text-red-600 text-sm">
          <FaExclamationTriangle />
          <p>Any violations of the rules may result in disqualification.</p>
        </div>

        <p className="mt-4 text-green-700 font-bold text-lg">
          Best of luck! 🍀
        </p>

        <div className="mt-6 text-right">
          <button
            className={`px-6 py-2 rounded-full text-white font-semibold transition ${
              allChecked
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!allChecked}
          >
            Start Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionPage;
