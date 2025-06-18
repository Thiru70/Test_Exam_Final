import React, { useEffect, useState, useRef } from "react";
import Folder from "../../Asstes/Folder.png";
import { Link, useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import axiosInstance from "../../utils/axiosInstance";
import { Edit, Trash } from "lucide-react";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyTest = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [testData, setTestData] = useState([]);
  const [documentOpen, setDocumentOpen] = useState(false);
  const [eligibility, setEligibility] = useState("");
  const [showDateInputs, setShowDateInputs] = useState("");
  const [showTimeInputs, setShowTimeInputs] = useState("");
  const [currentTestId, setCurrentTestId] = useState(null);
  const email = localStorage.getItem("adminEmail");

  const fetchAllTests = async () => {
    const response = await axiosInstance.get(`/tests?createdBy=${email}`);
    setTestData(response.data);
    // toast.success("Successfully fetched all tests.");
  };

  const handleTestDelete = async (getCurrentTestId) => {
    await axiosInstance.delete(`/test/${getCurrentTestId}`);
    toast.success("Successfully deleted the test");
    setCurrentTestId(getCurrentTestId);
  };

  const [testName, setTestName] = useState("");
  const [duration, setDuration] = useState(45);
  const [passingMarks, setPassingMarks] = useState(5);
  const [excelQuestions, setExcelQuestions] = useState([]);
  const [percent10, setPercent10] = useState("");
  const [percent12, setPercent12] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const fileInputRef = useRef();
  const dropdownRef = useRef();

  const handleBrowseClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("File not uploaded, Please try again!");
      return;
    }

    toast.success("Excel file uploaded successfully");
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const questions = jsonData.map((q) => {
        const isMCQ = (q.type || "").toLowerCase() === "mcq";
        return {
          question: q.question,
          type: q.type,
          ...(isMCQ && {
            options: [q.option1, q.option2, q.option3, q.option4].filter(
              (opt) => !!opt
            ),
          }),
          answer: q.answer,
          difficulty: (q.difficulty || "").toLowerCase(),
        };
      });
      setExcelQuestions(questions);
    };

    reader.readAsBinaryString(file);
  };

  const handleImportTest = async () => {
    const payload = {
      testName,
      duration: Number(duration),
      passingMarks: Number(passingMarks),
      shuffle: true,
      questions: excelQuestions,
      eligibility: {
        required: eligibility === "yes",
        tenthPercentage: Number(percent10),
        twelfthPercentage: Number(percent12),
      },
      sessionExam: {
        isSession: showDateInputs === "yes" || showTimeInputs === "yes",
        startDate: dateStart,
        endDate: dateEnd,
        startTime: timeStart,
        endTime: timeEnd,
      },
      createdBy: email,
    };

    try {
      await axiosInstance.post("/test", payload);
      toast.success("successfully created new test");
      setDocumentOpen(false);
    } catch (error) {
      toast.error("Upload failed:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    fetchAllTests();
  }, [currentTestId, documentOpen]);

  return (
    <>
      <div className="p-2">
        <ToastContainer />
        <div className="flex justify-end gap-3 p-5">
          <button
            onClick={() => setOpen(!open)}
            className="bg-[#0BC279] text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
          >
            Create New Test
          </button>
          {open && (
            <div
              ref={dropdownRef}
              className="absolute right-2 top-36 mt-2 w-48 bg-[#F4F4F4] border rounded-md shadow z-50"
            >
              <div
                onClick={() => navigate("/testconfiguration")}
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
              key={test.testId}
              className="bg-[#F8F8F8] rounded-lg shadow border p-4 flex flex-col justify-between"
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded border 
                  ${
                    new Date(test.sessionExam.endDate) < Date.now()
                      ? " text-[#D91919] border-[#F10A0A]"
                      : " text-[#34C759] border-[#34C759]"
                  }`}
                >
                  {new Date(test.sessionExam.endDate) < Date.now()
                    ? "ended"
                    : "active"}
                </span>
                <span className="text-sm text-gray-500">
                  Created: {new Date(test.timestamp).toLocaleDateString()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold">{test.testName}</h3>
                <p>Description</p>
              </div>

              <div className="flex justify-end gap-5">
                <Edit
                  onClick={() => navigate(`/UpdateTest/${test.testId}`)}
                  className="cursor-pointer"
                />
                <Trash onClick={() => handleTestDelete(test.testId)} />
              </div>
            </div>
          ))}
        </div>

        <Dialog
          header="Import Test"
          visible={documentOpen}
          style={{ width: "40rem" }}
          onHide={() => setDocumentOpen(false)}
          className="bg-white p-6 z-40 shadow-2xl"
        >
          <div className="space-y-4">
            <p className="font-semibold">
              Upload a file containing a list of questions
            </p>
            <p>
              Supports single-choice, multiple-choice and description questions
            </p>
            <p>Add media afterwards</p>
            <p className="text-sm text-gray-600">
              For best results, use our template:
              <a
                href="./MCQ_Questions.xlsx"
                download
                className="text-blue-600 underline ml-1"
              >
                Download Template
              </a>
            </p>

            <div>
              <label className="font-semibold">Test Name</label>
              <input
                type="text"
                className="border w-full p-2 focus:outline-none mb-2"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
              />
            </div>

            <div>
              <label className="font-semibold">Passing Marks</label>
              <input
                type="number"
                className="border w-full p-2 focus:outline-none mb-2"
                value={passingMarks}
                onChange={(e) => setPassingMarks(e.target.value)}
              />
            </div>

            <div>
              <label className="font-semibold">Duration (minutes)</label>
              <input
                type="number"
                className="border w-full p-2 focus:outline-none mb-2"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
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
                    checked={eligibility === "yes"}
                    onChange={(e) => setEligibility(e.target.value)}
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="eligibility"
                    value="no"
                    checked={eligibility === "no"}
                    onChange={(e) => setEligibility(e.target.value)}
                  />
                  <span>No</span>
                </label>
              </div>

              {eligibility === "yes" && (
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Enter 12th %"
                    className="w-full border p-2"
                    value={percent12}
                    onChange={(e) => setPercent12(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Enter 10th %"
                    className="w-full border p-2"
                    value={percent10}
                    onChange={(e) => setPercent10(e.target.value)}
                  />
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
                    checked={showDateInputs === "yes"}
                    onChange={(e) => setShowDateInputs(e.target.value)}
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="dateOption"
                    value="no"
                    checked={showDateInputs === "no"}
                    onChange={(e) => setShowDateInputs(e.target.value)}
                  />
                  <span>No</span>
                </label>
              </div>

              {showDateInputs === "yes" && (
                <div className="space-y-3">
                  <input
                    type="date"
                    className="w-full border p-2"
                    value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)}
                  />
                  <input
                    type="date"
                    className="w-full border p-2"
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                  />
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
                    checked={showTimeInputs === "yes"}
                    onChange={(e) => setShowTimeInputs(e.target.value)}
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="timeOption"
                    value="no"
                    checked={showTimeInputs === "no"}
                    onChange={(e) => setShowTimeInputs(e.target.value)}
                  />
                  <span>No</span>
                </label>
              </div>

              {showTimeInputs === "yes" && (
                <div className="space-y-3">
                  <input
                    type="time"
                    className="w-full border p-2"
                    value={timeStart}
                    onChange={(e) => setTimeStart(e.target.value)}
                  />
                  <input
                    type="time"
                    className="w-full border p-2"
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* File Upload */}
            <div className="border-2 border-dashed border-blue-400 rounded-lg p-5 text-center">
              <img
                src={Folder}
                alt="Upload icon"
                className="w-12 h-12 mx-auto mb-2"
              />
              <p className="text-gray-700 text-sm mb-2">
                Select a Excel file to upload
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
                accept=".xlsx"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end mt-5 gap-3">
            <button
              className="border px-4 py-2 rounded-md"
              onClick={() => setDocumentOpen(false)}
            >
              Cancel
            </button>
            <button
              onClick={handleImportTest}
              className="bg-gray-700 text-white px-4 py-2 rounded-md"
            >
              Import
            </button>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default MyTest;
