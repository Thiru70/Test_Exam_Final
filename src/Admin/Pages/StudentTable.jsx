import { EyeIcon, Loader2, Trash } from "lucide-react";
import React, { useState, useEffect } from "react";
import { IoIosMenu } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const fallbackImage = "https://cdn-icons-png.flaticon.com/512/4076/4076549.png"; 

const StudentTable = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [eligibilityCriteria, setEligibilityCriteria] = useState(null);
  const [candidateDelete, setCandidateDelete] = useState(false);
  const rowsPerPage = 10;

  // Function to check eligibility based on API criteria
  const checkEligibility = (student, criteria) => {
    if (!criteria || !criteria.required) {
      return true; // If no criteria or not required, consider eligible
    }

    const requiredTenth = parseFloat(criteria.tenthPercentage) || 0;
    const requiredTwelfth = parseFloat(criteria.twelfthPercentage) || 0;

    const studentTenth = student.tenth_percentage || 0;
    const studentTwelfth = student.twelfth_percentage || 0;

    return studentTenth >= requiredTenth && studentTwelfth >= requiredTwelfth;
  };

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/student/all"
      );

      if (!response.ok) {
        toast.error("Failed to fetch student data");
      }

      const data = await response.json();
      toast.success("Successfully fetched all candidate list");
      
      // Transform API data to match our component needs
      const transformedData = data.students.map((student, index) => {
        const studentData = {
          id: index + 1,
          name: student.full_name,
          email: student.email,
          graduation: student.graduation_percentage
            ? parseFloat(student.graduation_percentage)
            : 0,
          tenth_percentage: student["10th_percentage"]
            ? parseFloat(student["10th_percentage"])
            : 0,
          twelfth_percentage: student["12th_percentage"]
            ? parseFloat(student["12th_percentage"])
            : 0,
          current_cgpa: student.current_cgpa,
          college_name: student.college_name,
          course: student.course,
          contact: student.contact,
          dob: student.dob, // Store DOB from API
          student_id: student.student_id, // Store student_id from API
          full_name: student.full_name, // Store full_name from API
        };

        // Check eligibility based on API criteria
        studentData.eligible = checkEligibility(
          studentData,
          eligibilityCriteria
        );

        return studentData;
      });

      setStudentData(transformedData);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data from API
  useEffect(() => {
    fetchStudentData();
  }, [eligibilityCriteria, candidateDelete]);

  const filteredStudents = studentData.filter((student) => {
    if (filter === "Eligibility") return student.eligible;
    if (filter === "Non-Eligibility") return !student.eligible;
    if (filter === "graduation marks") return student.graduation >= 80;
    return true;
  });

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentCandidates = filteredStudents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // Handle view button click - navigate with student data including dob and student_id
  const handleViewClick = (student) => {
    navigate("/studentEmail-form", {
      state: {
        studentData: {
          email: student.email,
          full_name: student.full_name, // Changed from student.name to student.full_name
          dob: student.dob || "",
          student_id: student.student_id || "",
          id: student.id,
        },
      },
    });
  };

  const handleUserDelete = async (getEmail) => {
    setCandidateDelete(true);
    try {
      await axiosInstance.delete(`/company/user/${getEmail}`);
      toast.success("Successfully deleted the user!");
      fetchStudentData();
    } catch (error) {
      toast.error("Error deleting user");
    } finally {
      setCandidateDelete(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading Candidate List...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
        <ToastContainer />
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Candidate List</h2>
          </div>
          <div className="relative inline-block text-left">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="border px-4 py-2 rounded bg-white shadow-sm flex gap-2"
            >
              <IoIosMenu className="mt-1" /> Filter by
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-10">
                {[
                  "Eligibility",
                  "Non-Eligibility",
                  "graduation marks",
                  "All",
                ].map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setFilter(option === "All" ? "" : option);
                      setDropdownOpen(false);
                    }}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="">
              <tr className="text-[#718EBF]">
                <th className="px-4 py-2">SL No</th>
                <th className="px-4 py-2">Student name</th>
                <th className="px-4 py-2">10th %</th>
                <th className="px-4 py-2">12th %</th>
                <th className="px-4 py-2">Graduation %</th>
                <th className="px-4 py-2">Eligible</th>
                <th className="px-4 py-2">Gmail</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentCandidates.map((student, index) => (
                <tr key={student.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {String(indexOfFirstItem + index + 1).padStart(2, "0")}.
                  </td>
                  <td className="px-4 py-2">{student.name}</td>
                  <td className="px-4 py-2">
                    {student.tenth_percentage
                      ? `${student.tenth_percentage}%`
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {student.twelfth_percentage
                      ? `${student.twelfth_percentage}%`
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {student.graduation ? `${student.graduation}%` : "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-white text-xs rounded ${
                        student.eligible ? "bg-green-600" : "bg-red-600"
                      }`}
                    >
                      {student.eligible ? "Eligible" : "Not Eligible"}
                    </span>
                  </td>
                  <td className="px-4 py-2">{student.email}</td>
                  <td className="px-4 py-2">
                    <button
                      className="text-blue-600 hover:scale-110 transition"
                      onClick={() => handleViewClick(student)} 
                    >
                      <EyeIcon />
                    </button>
                    <button
                      className="text-blue-600 hover:scale-110 transition ml-3"
                      onClick={() => handleUserDelete(student.email)}
                    >
                      <Trash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Page Navigation */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, filteredStudents.length)} of{" "}
            {filteredStudents.length}
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
    </>
  );
};

export default StudentTable;