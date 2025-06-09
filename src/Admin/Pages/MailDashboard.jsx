import React from "react";
import { FaEdit, FaSave, FaTrash, FaPaperPlane, FaPlus } from "react-icons/fa";

const MailDashboard = () => {
  const mails = [
    { id: 1, email: "Khush235344sherdvrvrv@gmail.com", status: "Selected" },
    { id: 2, email: "Khush235344sherdvrvrv@gmail.com", status: "Selected" },
    { id: 3, email: "Khush235344sherdvrvrv@gmail.com", status: "Not Selected" },
    { id: 4, email: "Khush235344sherdvrvrv@gmail.com", status: "Selected" },
  ];

  const getStatusIcon = (status) => {
    if (status === "Selected")
      return <span className="text-green-500">🟢</span>;
    return <span className="text-red-500">🔴</span>;
  };

  return (
    <div className="min-h-screen bg-blue-300 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-blue-700">Mail Dashboard</h2>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Email Address"
              className="border rounded-l px-3 py-1"
            />
            <span className="bg-gray-100 border px-2 py-1 text-sm">gmail.com</span>
            <button className="bg-blue-500 text-white px-4 py-1 rounded-r hover:bg-blue-600">
              Search
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center mb-4">
          <div className="space-x-2">
            <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Select</button>
            <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Refresh</button>
            <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Send</button>
            <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Received</button>
          </div>
          <div className="relative">
            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              Filter ⌄
            </button>
            {/* Dropdown Example (static) */}
            <div className="absolute bg-white shadow border rounded mt-1 w-32 text-sm text-gray-700">
              <div className="px-3 py-1 hover:bg-gray-100">All</div>
              <div className="px-3 py-1 hover:bg-gray-100">Selected</div>
              <div className="px-3 py-1 hover:bg-gray-100">Not Selected</div>
            </div>
          </div>
          <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
            <FaPlus />
          </button>
        </div>

        {/* Mail List Table */}
        <div className="divide-y">
          {mails.map((mail) => (
            <div
              key={mail.id}
              className="flex justify-between items-center py-3 px-2 hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                {mail.status === "Selected" ? (
                  <span className="text-green-500 text-xl">✅</span>
                ) : (
                  <span className="text-orange-500 text-xl">☑️</span>
                )}
                <span>{mail.email}</span>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-sm font-medium ${
                    mail.status === "Selected"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {mail.status}
                </span>
                <div className="flex gap-2 text-gray-700">
                  <button title="Edit"><FaEdit /></button>
                  <button title="Save"><FaSave /></button>
                  <button title="Delete"><FaTrash /></button>
                  <button title="Send"><FaPaperPlane /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MailDashboard;
