import React from "react";
import {
  FaHome,
  FaClipboardList,
  FaInfoCircle,
  FaLifeRing,
  FaUser,
} from "react-icons/fa";

const MyResults = () => {
  return (
    <div className="flex min-h-screen font-sans">
      {/* Sidebar (optional) */}
      {/* You can add sidebar here if needed */}

      {/* Main Content */}
      <main className="flex-1 bg-blue-100 p-6">
        {/* Header */}
        <div className="bg-white shadow-md rounded-md mb-4 p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">My tests</h1>
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-1 rounded-full border border-gray-300 focus:outline-none"
          />
        </div>

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-2">
          Results &gt; Results &gt; Created -2025-03-10
        </div>

        {/* Results Card */}
        <div className="bg-white rounded shadow-md">
          {/* Date header */}
          <div className="bg-blue-600 text-white px-4 py-2 font-semibold rounded-t">
            Created -2025-03-10
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <div className="px-4 py-2 font-medium text-blue-600 border-b-2 border-blue-600">
              Overview
            </div>
            <div className="px-4 py-2 text-gray-500">Marks obtained</div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto p-4">
            <table className="min-w-full text-sm text-left">
              <thead className="text-gray-600 border-b">
                <tr>
                  <th className="py-2 px-4">SL No</th>
                  <th className="py-2 px-4">test name</th>
                  <th className="py-2 px-4">Questions</th>
                  <th className="py-2 px-4">Duration(min)</th>
                  <th className="py-2 px-4">Marks</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4">01.</td>
                  <td className="py-2 px-4">Aptitude test</td>
                  <td className="py-2 px-4">30</td>
                  <td className="py-2 px-4">30</td>
                  <td className="py-2 px-4">100</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-semibold">total</td>
                  <td className="py-2 px-4"></td>
                  <td className="py-2 px-4">30</td>
                  <td className="py-2 px-4">30</td>
                  <td className="py-2 px-4">100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyResults;
