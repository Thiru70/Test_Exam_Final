import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from '../../utils/axiosInstance';



const ResultTable = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const {testId,testName} = location.state || {}
  const [results,setResults] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(results.length / rowsPerPage);
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentCandidates = results.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

 

  const fetchAllTestResult = async() => {
    const response = await axiosInstance(`user-test/results/${testId}`)
    console.log(response.data)
    setResults(response.data.results)
  }

  useEffect(() => {
    fetchAllTestResult()
  },[])
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
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Marksheet</th>
            </tr>
          </thead>
          <tbody>
            {currentCandidates.map((result, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{index +1}</td>
                <td className="px-4 py-2">{testName}</td>
                <td className="px-4 py-2">{result.userId}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-white rounded font-semibold ${result.status == 'passed' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                  >
                    {((result?.score/result?.totalMarks)*100).toFixed(2) || 0}%
                  </span>
                </td>
                <td className="px-4 py-2">{new Date(result.timestamp).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 border border-blue-600 px-3 py-1 rounded-full hover:bg-blue-600 hover:text-white transition" onClick={() => navigate('/testReview',{state: {result:result, testName}})} >
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
