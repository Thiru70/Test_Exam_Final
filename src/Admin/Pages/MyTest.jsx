import React, { useEffect, useState, useRef } from "react";
import Folder from "../../Asstes/Folder.png";

const MyTest = () => {
  const [open, setOpen] = useState(false);
  const [documentOpen, setDocumentOpen] = useState(false);
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
              onClick={() => {
                setOpen(false);
              }}
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
      
{documentOpen && (
         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg w-full max-w-sm md:max-w-md relative">
                <div className=" flex justify-between border-b-2 border-black">
                  <h2 className="font-semibold">Import test</h2>
                  
                </div>
            <h1
              className="font-semibold"
            >
              Upload a file containing a list of questions
            </h1>
            <p>Supports a single-choice, multiple-choice and description questions</p>
            <p>Add media afterwards</p>
            <p>For best results use our templates</p>
            <div className="border-2 border-dashed border-blue-400 rounded-lg p-5 text-center max-w-sm w-full">
        <div className="flex flex-col items-center space-y-4">
          <img
            src={Folder}
            alt="Upload icon"
            className="w-12 h-12"
          />
          <p className="text-gray-700 text-sm">
            Select a pdf, microsoft word (.docx) or text file to upload
          </p>
          <hr className="border-gray-300 w-full" />
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
      <div className="flex justify-end mt-3 gap-3">
        <button className="border-2 px-4 py-2 rounded-md" onClick={() => setDocumentOpen(false)}>Cancal</button>
        <button className="bg-[#808080] text-white px-4 py-2 rounded-md">Import</button>
      </div>
          </div>
          </div>
        )}
    </div>
    
    </>
  );
};

export default MyTest;
