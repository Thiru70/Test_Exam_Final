import React, { useState } from "react";

const EligibilityCriteriaForm = () => {
  const [min12th, setMin12th] = useState("");
  const [minCGPA, setMinCGPA] = useState("");
  const [allowedStream, setAllowedStream] = useState("Any");

  const streams = ["Any", "Computer Science", "Electronics", "Mechanical"];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process form data here
    alert(`Criteria set:\n12th % >= ${min12th}\nCGPA >= ${minCGPA}\nStream: ${allowedStream}`);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "auto", background: "#fff" }}>
      <h2 style={{ color: "#33475b", marginBottom: "24px" }}>Set Eligibility Criteria</h2>

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
          Minimum 12th %
        </label>
        <input
          type="number"
          placeholder="e.g. 60"
          value={min12th}
          onChange={(e) => setMin12th(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            marginBottom: "20px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
          min="0"
          max="100"
          required
        />

        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
          Minimum CGPA
        </label>
        <input
          type="number"
          placeholder="e.g. 6"
          value={minCGPA}
          onChange={(e) => setMinCGPA(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            marginBottom: "20px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
          min="0"
          max="10"
          step="0.01"
          required
        />

        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
          Allowed Streams
        </label>
        <select
          value={allowedStream}
          onChange={(e) => setAllowedStream(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            marginBottom: "20px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "16px",
            height: "120px",
          }}
          size={streams.length}
          required
        >
          {streams.map((stream) => (
            <option key={stream} value={stream}>
              {stream}
            </option>
          ))}
        </select>

        <button
          type="submit"
          style={{
            backgroundColor: "#2d86f0",
            color: "white",
            padding: "10px 24px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          Set Criteria
        </button>
      </form>
    </div>
  );
};

export default EligibilityCriteriaForm;
