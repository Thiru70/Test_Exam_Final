import React, { useState, useRef } from "react";

const FormPage = () => {
  const [open, setOpen] = useState(false); // toggle section visibility
  const fileInputRef = useRef(null); // ref to hidden input

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      // You can add file upload logic here
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f8ff] p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold">My tests</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="border px-3 py-1 rounded-full text-sm w-60 outline-none"
          />
          <button className="bg-green-500 text-white px-4 py-1 rounded text-sm font-medium">
            form responses
          </button>
          <div className="flex gap-3 text-xl">
            <button title="Edit">✏️</button>
            <button title="Save">💾</button>
            <button title="Share">🔗</button>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Document to add (resume, photo, etc)</label>
        <div className="flex items-center gap-4">
          {/* Hidden Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {/* Custom Browse Button */}
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded text-sm"
            onClick={handleBrowseClick}
          >
            Browse File
          </button>

          <button className="bg-green-500 text-white px-4 py-1 rounded text-sm">
            Add more
          </button>
        </div>
      </div>

      {/* Personal Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input type="text" placeholder="First Name" className="border-b border-black outline-none" />
        <input type="text" placeholder="Last name" className="border-b border-black outline-none" />
        <input type="text" placeholder="Gender" className="border-b border-black outline-none" />
        <input type="text" placeholder="DOB" className="border-b border-black outline-none" />
        <input type="text" placeholder="Address" className="border-b border-black outline-none" />
        <input type="text" placeholder="Postcode" className="border-b border-black outline-none" />
        <input type="email" placeholder="Gmail" className="border-b border-black outline-none" />
        <input type="tel" placeholder="Contact Phone" className="border-b border-black outline-none" />
      </div>

       <button className="bg-blue-500 text-white px-4 py-1 rounded text-sm mb-6">Add more</button> 

      {/* Education */}
      <h2 className="font-semibold mb-2">Education</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input type="text" placeholder="School name" className="border-b border-black outline-none" />
        <input type="text" placeholder="Percentage" className="border-b border-black outline-none" />
        <input type="text" placeholder="Class" className="border-b border-black outline-none" />
        <input type="text" placeholder="College name" className="border-b border-black outline-none" />
        <input type="text" placeholder="Percentage" className="border-b border-black outline-none" />
        <input type="text" placeholder="Course" className="border-b border-black outline-none" />
      </div>

       <button className="bg-blue-500 text-white px-4 py-1 rounded text-sm mb-6">Add more</button> 



      {open && (
        <div className="bg-white border rounded p-4 shadow mb-6">
          <label className="block text-sm font-medium mb-1">Additional Notes</label>
          <textarea
            placeholder="Write something..."
            className="w-full border rounded p-2 outline-none"
            rows={4}
          ></textarea>
        </div>
      )}

      {/* Criteria Toggles */}
      <div className="space-y-4">
        {["Class 10th percentage", "Class 12th percentage", "Graduate"].map((label, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <input type="text" placeholder={label} className="border-b border-black outline-none w-1/2" />
            <div className="flex items-center gap-2">
              <span className="text-sm">Set criteria</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-300"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormPage;
