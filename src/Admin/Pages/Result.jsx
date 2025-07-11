import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { Loader2 } from "lucide-react";
const fallbackImage = "https://cdn-icons-png.flaticon.com/512/4076/4076549.png"; 

const Result = () => {
  const [testData, setTestData] = useState([]);
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();
  const email = localStorage.getItem("adminEmail");

  const fetchAllTests = async () => {
    setLoading(true)
    const response = await axiosInstance.get(`/tests?createdBy=${email}`);
    setTestData(response.data);
    setLoading(false)
  };

  function getRoundLabel(type) {
    if (type === "MCQ") return "Round 1";
    if (type === "coding") return "Round 2";
    return "Round 3";
  }

  // Group tests by round using useMemo for performance
  const groupedTests = useMemo(() => {
    const groups = {
      "Round 1": [],
      "Round 2": [],
      "Round 3": [],
    };
    testData.forEach((test) => {
      const round = getRoundLabel(test.type);
      groups[round].push(test);
    });
    return groups;
  }, [testData]);

  useEffect(() => {
    fetchAllTests();
  }, []);

  if (loading) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                <p className="text-gray-600">Loading results...</p>
            </div>
        </div>
    );
}

if (!loading && testData.length === 0) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
      <img
        src={fallbackImage}
        alt="No candidates"
        className="w-64 h-64 opacity-70"
      />
      <p className="text-2xl text-gray-500 font-semibold">No Results found</p>
    </div>
  );
}
  return (
    <div className="p-6 space-y-8">
      {Object.entries(groupedTests).map(([round, tests]) =>
        tests.length > 0 ? (
          <div key={round}>
            <h2 className="text-lg font-bold mb-4">{round}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {tests.map((test) => (
                <div
                  key={test.testId}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2 shadow-sm cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs border px-2 py-1 rounded-md ${
                        new Date(test.sessionExam.endDate) < Date.now()
                          ? "text-[#D91919] border-[#F10A0A]"
                          : "text-[#34C759] border-[#34C759]"
                      }`}
                    >
                      {new Date(test.sessionExam.endDate) < Date.now()
                        ? "ended"
                        : "active"}
                    </span>
                    <span className="text-xs text-gray-500">
                      Created -{" "}
                      {new Date(test.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-800">
                    {test.testName}
                  </div>
                  <div className="text-sm text-gray-600">{test.type}</div>
                  <div
                    className="text-end"
                    onClick={() =>
                      navigate("/resultTable", {
                        state: {
                          testId: test.testId,
                          testName: test.testName,
                        },
                      })
                    }
                  >
                    <button className="border text-blue-500 border-blue-400 px-4 py-0.5 rounded-full">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
};

export default Result;
