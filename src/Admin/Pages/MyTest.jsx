import React, { useEffect, useState, useRef } from "react";
import Folder from "../../Asstes/Folder.png";
import { useNavigate } from "react-router-dom";
import { Dialog } from 'primereact/dialog';

const MyTest = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [documentOpen, setDocumentOpen] = useState(false);
  const [eligibility, setEligibility] = useState('');
  const [showDateInputs, setShowDateInputs] = useState('');
  const [showTimeInputs, setShowTimeInputs] = useState('');
  const fileInputRef = useRef(null);

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected file:', file);
      // Handle file upload here
    }
  };

 const testData = [
  {
    id: 1,
    status: "Setup in progress",
    statusType: "danger",
    title: "Quiz of General knowledge",
    description: "Description",
    date: "2025-03-10",
  },
  {
    id: 2,
    status: "Setup in progress",
    statusType: "danger",
    title: "Quiz of General knowledge",
    description: "Description",
    date: "2025-03-10",
  },
  {
    id: 3,
    status: "Setup in progress",
    statusType: "danger",
    title: "Quiz of General knowledge",
    description: "Description",
    date: "2025-03-10",
  },
  {
    id: 4,
    status: "Active",
    statusType: "success",
    title: "Aptitude test",
    description: "Description",
    date: "2025-03-10",
  },
];
  return (
    <>
       <div className="p-2">
        <div className="flex justify-end gap-3 p-5">
        <button className="bg-[#8772C1] text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700">
          Generate questions
        </button>
        <button onClick={() => setOpen(!open)} className="bg-[#0BC279] text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">
          New Test
        </button>
        {open && (
          <div className="absolute right-2 top-36 mt-2 w-48 bg-[#F4F4F4] border rounded-md shadow z-50">
            <div
              onClick={() => navigate('/testconfiguration')}
              className="px-4 py-2 text-sm hover:bg-gray-100 border-b-2 cursor-pointer"
            >
              Start from scratch
            </div>
            <div
              onClick={() => setDocumentOpen(true)}
              className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              Upload document
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testData.map((test) => (
          <div
            key={test.id}
            className="bg-[#F8F8F8] rounded-lg shadow border p-4 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center mb-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded border 
                  ${
                    test.statusType === "danger"
                      ? " text-[#D91919] border-[#F10A0A]"
                      : " text-[#34C759] border-[#34C759]"
                  }`}
              >
                {test.status}
              </span>
              <span className="text-sm text-gray-500">Created: {test.date}</span>
            </div>
            <div>
              <h3 className="font-semibold">{test.title}</h3>
              <p className="text-sm text-gray-500">{test.description}</p>
            </div>
          </div>
        ))}
      </div>
      
<Dialog
      header="Import Test"
      visible={documentOpen}
      style={{ width: '40rem' }}
      onHide={() => setDocumentOpen(false)}
      className="bg-white p-6"
    >
      <div className="space-y-4">
        <p className="font-semibold">Upload a file containing a list of questions</p>
        <p>Supports single-choice, multiple-choice and description questions</p>
        <p>Add media afterwards</p>
        <p>For best results, use our templates</p>

        <div>
          <label className="font-semibold">Test Name</label>
          <input type="text" className="border w-full p-2 focus:outline-none mb-2" />
        </div>

        {/* Eligibility */}
        <div>
          <label className="text-lg font-semibold mb-2">Eligibility</label>
          <div className="flex gap-4 mb-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="eligibility"
                value="yes"
                checked={eligibility === 'yes'}
                onChange={(e) => setEligibility(e.target.value)}
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="eligibility"
                value="no"
                checked={eligibility === 'no'}
                onChange={(e) => setEligibility(e.target.value)}
              />
              <span>No</span>
            </label>
          </div>

          {eligibility === 'yes' && (
            <div className="space-y-3">
              <input type="number" placeholder="Enter 12th %" className="w-full border p-2" />
              <input type="number" placeholder="Enter 10th %" className="w-full border p-2" />
            </div>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="text-lg font-semibold mb-2">Date</label>
          <div className="flex gap-4 mb-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="dateOption"
                value="yes"
                checked={showDateInputs === 'yes'}
                onChange={(e) => setShowDateInputs(e.target.value)}
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="dateOption"
                value="no"
                checked={showDateInputs === 'no'}
                onChange={(e) => setShowDateInputs(e.target.value)}
              />
              <span>No</span>
            </label>
          </div>

          {showDateInputs === 'yes' && (
            <div className="space-y-3">
              <input type="date" className="w-full border p-2" />
              <input type="date" className="w-full border p-2" />
            </div>
          )}
        </div>

        {/* Time */}
        <div>
          <label className="text-lg font-semibold mb-2">Time</label>
          <div className="flex gap-4 mb-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="timeOption"
                value="yes"
                checked={showTimeInputs === 'yes'}
                onChange={(e) => setShowTimeInputs(e.target.value)}
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="timeOption"
                value="no"
                checked={showTimeInputs === 'no'}
                onChange={(e) => setShowTimeInputs(e.target.value)}
              />
              <span>No</span>
            </label>
          </div>

          {showTimeInputs === 'yes' && (
            <div className="space-y-3">
              <input type="time" className="w-full border p-2" />
              <input type="time" className="w-full border p-2" />
            </div>
          )}
        </div>

        {/* File Upload */}
        <div className="border-2 border-dashed border-blue-400 rounded-lg p-5 text-center">
          <img src={Folder} alt="Upload icon" className="w-12 h-12 mx-auto mb-2" />
          <p className="text-gray-700 text-sm mb-2">
            Select a PDF, Microsoft Word (.docx), or text file to upload
          </p>
          <button
            onClick={handleBrowseClick}
            className="border border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-blue-50"
          >
            Browse files
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.docx,.txt"
          />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end mt-5 gap-3">
        <button className="border px-4 py-2 rounded-md" onClick={() => setDocumentOpen(false)}>
          Cancel
        </button>
        <button className="bg-gray-700 text-white px-4 py-2 rounded-md">Import</button>
      </div>
    </Dialog>
    </div>
    
    </>
  );
};

export default MyTest;
