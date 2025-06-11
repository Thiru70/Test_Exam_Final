import React, { useState } from "react";
import { FaEdit, FaSave, FaTrash, FaPaperPlane, FaPlus } from "react-icons/fa";

const MailDashboard = () => {
  const [filterOpen, setFilterOpen] = useState(false);

  const emails = [
    { id: 1, email: "khush235344sherdvrvrv@gmail.com", status: "Selected" },
    { id: 2, email: "khush235344sherdvrvrv@gmail.com", status: "Selected" },
    { id: 3, email: "khush235344sherdvrvrv@gmail.com", status: "Not Selected" },
    { id: 4, email: "khush235344sherdvrvrv@gmail.com", status: "Selected" },
  ];

  const getStatusIcon = (status) => {
    return status === "Selected" ? (
      <span className="text-green-500 text-xl">✅</span>
    ) : (
      <span className="text-orange-500 text-xl">🟥</span>
    );
  };

  return (
    <div className="bg-[#00a9dc] min-h-screen p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-[#00a9dc] mb-6">Mail Dashboard</h2>

        {/* Top Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          {/* Left: Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button className="bg-gray-50 hover:bg-gray-300 px-4 py-1 rounded-full">Select</button>
            <button className="bg-gray-50 hover:bg-gray-300 px-4 py-1 rounded-full">Refresh</button>
            <button className="bg-gray-50 hover:bg-gray-300 px-4 py-1 rounded-full">Sent</button>
            <button className="bg-gray-50 hover:bg-gray-300 px-4 py-1 rounded-full">Received</button>
            <button className="bg-[#00a9dc] hover:bg-[#008cb7] text-white px-4 py-1 rounded-full">Send</button>
          </div>

          {/* Right: Search, Filter, Add Button */}
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Email Address   gmail.com"
              className="px-3 py-1 border rounded"
            />
            <button className="bg-[#00a9dc] text-white px-4 py-1 rounded">Search</button>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="bg-[#00a9dc] text-white px-4 py-1 rounded"
              >
                Filter ⌄
              </button>
              {filterOpen && (
                <div className="absolute z-10 right-0 mt-1 bg-white border rounded shadow-md w-32">
                  <button className="w-full px-4 py-2 hover:bg-gray-100 text-left">All</button>
                  <button className="w-full px-4 py-2 hover:bg-gray-100 text-left">Selected</button>
                  <button className="w-full px-4 py-2 hover:bg-gray-100 text-left">Not Selected</button>
                </div>
              )}
            </div>

            {/* ✅ Add New Mail Button */}
            <button className="flex items-center gap-2 bg-[#00a9dc] text-white px-4 py-1 rounded-full hover:bg-[#008cb7]">
              <FaPlus className="text-sm" />
              Add New Mail
            </button>
          </div>
        </div>
           {/* Email List Title */}
               <h3 className="text-xl font-bold text-cyan-700 mt-8 mb-3">Candidate Mail</h3>

        {/* Email List */}
        <div className="space-y-3">
  {emails.map((item) => (
    <div
      key={item.id}
      className="flex justify-between items-center border rounded px-4 py-2 shadow-sm hover:bg-gray-50"
    >
      <div className="flex items-center gap-3">
        {getStatusIcon(item.status)}
        <div className="font-medium">
          {item.email} <span className="text-gray-500">   {item.status}  </span>
        </div>
      </div>

              <div className="flex gap-3 text-gray-600 text-lg">
                <FaEdit className="hover:text-blue-500 cursor-pointer" title="Edit" />
                <FaSave className="hover:text-green-500 cursor-pointer" title="Save" />
                <FaTrash className="hover:text-red-500 cursor-pointer" title="Delete" />
                <FaPaperPlane className="hover:text-purple-500 cursor-pointer" title="Send" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MailDashboard;
