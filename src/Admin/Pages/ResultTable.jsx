import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";



const ResultTable = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const results = [
    {
      slNo: 1,
      testName: 'Aptitude test',
      studentName: 'Wade Warren',
      score: 86,
      endDate: '25/03/25',
      time: '00:55',
    },
    {
      slNo: 2,
      testName: 'Aptitude test',
      studentName: 'Floyd Miles',
      score: 50,
      endDate: '25/03/25',
      time: '00:55',
    },
    {
      slNo: 3,
      testName: 'Aptitude test',
      studentName: 'Jenny Wilson',
      score: 78,
      endDate: '25/03/25',
      time: '00:55',
    },
    {
      slNo: 4,
      testName: 'Aptitude test',
      studentName: 'Cody Fisher',
      score: 86,
      endDate: '25/03/25',
      time: '00:55',
    },
    {
      slNo: 5,
      testName: 'Aptitude test',
      studentName: 'Bessie Cooper',
      score: 90,
      endDate: '25/03/25',
      time: '00:55',
    },
    {
      slNo: 6,
      testName: 'Aptitude test',
      studentName: 'Kristin Watson',
      score: 70,
      endDate: '25/03/25',
      time: '00:55',
    },
    {
      slNo: 7,
      testName: 'Aptitude test',
      studentName: 'Darlene Robertson',
      score: 45,
      endDate: '25/03/25',
      time: '00:55',
    },
    {
      slNo: 8,
      testName: 'Aptitude test',
      studentName: 'Eleanor Pena',
      score: 86,
      endDate: '25/03/25',
      time: '00:55',
    },
  ];
  const totalPages = Math.ceil(results.length / rowsPerPage);
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentCandidates = results.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Result ({results.length})</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="">
            <tr className="text-[#718EBF]">
              <th className="px-4 py-2">SL No</th>
              <th className="px-4 py-2">Test name</th>
              <th className="px-4 py-2">Student name</th>
              <th className="px-4 py-2">Total score</th>
              <th className="px-4 py-2">End date</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Marksheet</th>
            </tr>
          </thead>
          <tbody>
            {currentCandidates.map((result, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{result.slNo}</td>
                <td className="px-4 py-2">{result.testName}</td>
                <td className="px-4 py-2">{result.studentName}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-white rounded font-semibold ${result.score >= 60 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                  >
                    {result.score}%
                  </span>
                </td>
                <td className="px-4 py-2">{result.endDate}</td>
                <td className="px-4 py-2">{result.time}</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 border border-blue-600 px-3 py-1 rounded-full hover:bg-blue-600 hover:text-white transition" onClick={() => navigate('/testReview')} >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Page Navigation */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, results.length)} of {results.length}
          </p>
          <div className="space-x-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : ''
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ResultTable;
