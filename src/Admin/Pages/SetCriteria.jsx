import React, { useState } from "react";

const EligibilityCriteriaForm = () => {
  const [min12th, setMin12th] = useState("");
  const [minCGPA, setMinCGPA] = useState("");
  const [allowedStream, setAllowedStream] = useState("Any");

  const streams = ["Any", "Computer Science", "Electronics", "Mechanical"];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Criteria set:\n12th % >= ${min12th}\nCGPA >= ${minCGPA}\nStream: ${allowedStream}`
    );
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-10 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">
        Set Eligibility Criteria
      </h2>

      <form onSubmit={handleSubmit}>
        {/* 12th Percentage */}
        <label className="block mb-2 font-semibold text-gray-700">
          Minimum 12th %
        </label>
        <input
          type="number"
          placeholder="e.g. 60"
          value={min12th}
          onChange={(e) => setMin12th(e.target.value)}
          className="w-full px-3 py-2 mb-5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          min="0"
          max="100"
          required
        />

        {/* CGPA */}
        <label className="block mb-2 font-semibold text-gray-700">
          Minimum CGPA
        </label>
        <input
          type="number"
          placeholder="e.g. 6"
          value={minCGPA}
          onChange={(e) => setMinCGPA(e.target.value)}
          className="w-full px-3 py-2 mb-5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          min="0"
          max="10"
          step="0.01"
          required
        />

        {/* Allowed Streams */}
        <label className="block mb-2 font-semibold text-gray-700">
          Allowed Streams
        </label>
        <select
          value={allowedStream}
          onChange={(e) => setAllowedStream(e.target.value)}
          className="w-full px-3 py-2 mb-6 border border-gray-300 rounded"
        >
          {streams.map((stream) => (
            <option key={stream} value={stream}>
              {stream}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition"
        >
          Set Criteria
        </button>
      </form>
    </div>
  );
};

export default EligibilityCriteriaForm;