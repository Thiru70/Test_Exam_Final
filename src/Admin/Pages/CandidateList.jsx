import React, { useEffect, useState } from "react";
import { IoIosMenu } from "react-icons/io";
import axiosInstance from "../../utils/axiosInstance";

const CandidateList = () => {
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [candidateData, setCandidateData] = useState([]);
  const rowsPerPage = 10;
  // const candidateData = [
  //     { id: 1, name: 'Floyd Miles', twelfth: 70, graduation: 70, email: 'michelle.rivera@example.com' },
  //     { id: 2, name: 'Ronald Richards', twelfth: 50, graduation: 50, email: 'nathan.roberts@example.com' },
  //     { id: 3, name: 'Albert Flores', twelfth: 60, graduation: 60, email: 'debra.holt@example.com' },
  //     { id: 4, name: 'Leslie Alexander', twelfth: 90, graduation: 90, email: 'tim.jennings@example.com' },
  //     { id: 5, name: 'Kristin Watson', twelfth: 90, graduation: 90, email: 'jackson.graham@example.com' },
  //     { id: 6, name: 'Floyd Miles', twelfth: 80, graduation: 80, email: 'sara.cruz@example.com' },
  //     { id: 7, name: 'Jane Cooper', twelfth: 70, graduation: 70, email: 'debbie.baker@example.com' },
  //     { id: 8, name: 'Eleanor Pena', twelfth: 80, graduation: 80, email: 'jessica.hanson@example.com' },
  // ];
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const totalPages = Math.ceil(candidateData.length / rowsPerPage);
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentCandidates = candidateData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const fetchAllStudents = async () => {
    const response = await axiosInstance.get("student/all");
    console.log(response.data.students, "responseData");
    setCandidateData(response?.data?.students);
  };

  useEffect(() => {
    fetchAllStudents();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#333B69]">Candidate list</h2>
        <button className="border px-4 py-2 rounded text-sm flex items-center space-x-2">
          <span>
            <IoIosMenu className="mt-1" />
          </span>
          <span>Filter</span>
        </button>
      </div>

      <table className="w-full table-auto border-collapse text-sm">
        <thead className="text-[#718EBF]">
          <tr className="border-b">
            <th className="text-left p-2">SL No</th>
            <th className="text-left p-2">Student name</th>
            <th className="text-left p-2">12th</th>
            <th className="text-center p-2">Graduation</th>
            <th className="text-left p-2">Gmail</th>
            <th className="text-left p-2">Form</th>
          </tr>
        </thead>
        <tbody>
          {currentCandidates.map((candidate, index) => (
            <tr key={candidate.id} className="border-b hover:bg-gray-50">
              <td className="p-2 flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selected.includes(candidate.id)}
                  onChange={() => toggleSelect(candidate.id)}
                  className="cursor-pointer"
                />
                <span>{String(index + 1).padStart(2, "0")}.</span>
              </td>
              <td className="p-2">{candidate.full_name}</td>
              <td className="p-2">{candidate["12th_percentage"]}%</td>
              <td className="p-2 text-center">
                {candidate.graduation_percentage}%
              </td>
              <td className="p-2">{candidate.email}</td>
              <td className="p-2">
                <button className="text-blue-600 border border-blue-500 rounded-full px-4 py-1 text-xs hover:bg-blue-50">
                  view
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Page Navigation */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Showing {indexOfFirstItem + 1}-
          {Math.min(indexOfLastItem, candidateData.length)} of{" "}
          {candidateData.length}
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
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : ""
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
  );
};

export default CandidateList;
