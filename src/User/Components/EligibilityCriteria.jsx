import React, { useState } from "react";

const streams = [
  "Any",
  "Computer Science",
  "Electronics",
  "Mechanical",
  // Add more streams as needed
];

const SetEligibilityCriteria = () => {
  const [min12th, setMin12th] = useState("");
  const [minCGPA, setMinCGPA] = useState("");
  const [allowedStreams, setAllowedStreams] = useState(["Any"]);

  const handleStreamChange = (e) => {
    const options = Array.from(e.target.options);
    const selected = options.filter((o) => o.selected).map((o) => o.value);
    setAllowedStreams(selected);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert(
      `Criteria Set:\n12th %: ${min12th}\nCGPA: ${minCGPA}\nStreams: ${allowedStreams.join(
        ", "
      )}`
    );
  };

  return (
    <div style={{ padding: "2rem 3rem" }}>
      <h2 style={{ color: "#1a237e", marginBottom: "2rem" }}>
        Set Eligibility Criteria
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <div>
          <label style={{ fontWeight: "bold" }}>Minimum 12th %</label>
          <input
            type="number"
            placeholder="e.g. 60"
            value={min12th}
            onChange={(e) => setMin12th(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              marginTop: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
            min="0"
            max="100"
            required
          />
        </div>
        <div>
          <label style={{ fontWeight: "bold" }}>Minimum CGPA</label>
          <input
            type="number"
            placeholder="e.g. 6"
            value={minCGPA}
            onChange={(e) => setMinCGPA(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              marginTop: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
            min="0"
            max="10"
            step="0.01"
            required
          />
        </div>
        <div>
          <label style={{ fontWeight: "bold" }}>Allowed Streams</label>
          <select
            multiple
            value={allowedStreams}
            onChange={handleStreamChange}
            style={{
              width: "100%",
              padding: "0.75rem",
              marginTop: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              height: "120px",
            }}
          >
            {streams.map((stream) => (
              <option key={stream} value={stream}>
                {stream}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          style={{
            width: "160px",
            padding: "0.8rem",
            backgroundColor: "#2196f3",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            alignSelf: "flex-start",
            cursor: "pointer",
          }}
        >
          Set Criteria
        </button>
      </form>
    </div>
  );
};

export default SetEligibilityCriteria;
