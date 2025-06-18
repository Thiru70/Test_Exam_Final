import React, { useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";
import { FaRegUser } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { LuSend } from "react-icons/lu";
import { IoIosTimer } from "react-icons/io";
import { LuNotepadText } from "react-icons/lu";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const TestSheetReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const printRef = useRef();
  const { result, testName } = location.state || {};



  const handleDownload = () => {
    const element = printRef.current;
    const opt = {
      margin: 0.5,
      filename: `${testName || "test-sheet"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const totalMarks = result?.answers.reduce((accumulator, currentValue) => {        
    return Number(accumulator) + Number(currentValue.marks);
  }, 0);

  function formatISOToTime(isoString) {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  const fetchUserData = async() => {
    const response = await axiosInstance(`user-test/results/${testId}`)
    console.log(response.data)
  }

  useEffect(() => {
    fetchUserData()
  },[])
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold flex gap-2">
        <FaArrowAltCircleLeft
          className="mt-1 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        Test sheet review
      </h2>
      {/* Header */}
      <div className="flex justify-between items-center bg-[#F9F9F9] py-2 px-2">
        <h3 className="text-lg font-medium">{testName}</h3>
        <div className="flex gap-4">
          {/* <span className="flex gap-2">
            <FaRegUser className="mt-1" /> 
          </span> */}
         <button onClick={handleDownload}  className="flex gap-2">
            <LuDownload /> Download
          </button> 
        
          {/* <button className="flex gap-2">
            <LuSend className="mt-1" /> Send
          </button> */}
        </div>
      </div>

     <div  ref={printRef} className="">
       {/* Test & Respondent */}
       <div   className="flex flex-col md:flex-row justify-between bg-[#F9F9F9] p-4 rounded-md shadow">
        <div>
          <p className="text-gray-600 mt-1 flex gap-2">
            <FaRegUser className="mt-1" /> Respondent:{" "}
            <strong>{result.userId}</strong>
          </p>
        </div>
      </div>

      {/* Result & Timer */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Result */}
        <div className="bg-white border rounded-md p-6 shadow flex justify-between">
          <div>
            <h1 className="flex gap-2 ">
              <LuNotepadText /> Result
            </h1>
            <span
              className={`font-semibold text-center flex  gap-2 items-center mt-2 ${
                result.status === 'passed' ? "text-[#34C759]" : "text-[#FF0000]"
              }`}
            >
              {result.status=== 'passed' ? <FaCheckCircle /> : <IoMdCloseCircle />}
              {result.status ? "Test Passed" : "Test Failed"}
            </span>
            <p className="text-sm text-gray-500 mb-4">
              Respondent result is available
            </p>
          </div>
          <div className="w-24 h-24">
            <CircularProgressbar
              value={((result.score /totalMarks)*100).toFixed(2)}
              text={`${((result.score/totalMarks)*100).toFixed(2)}%`}
              styles={buildStyles({
                pathColor: result.status === 'passed' ? "#34C759" : "#D91919",
                textColor: "#111827",
                trailColor: "#e5e7eb",
                textSize: "18px",
              })}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="bg-white border rounded-md p-6 shadow text-sm text-gray-700">
          <h4 className="font-medium mb-2 flex gap-1">
            <IoIosTimer className="text-black text-sm" /> Timer
          </h4>
          <p>Total time: </p>
          <div className="flex justify-between">
            <p className="mt-2">
              <strong>{(result.totalDuration)}</strong> /{" "}
              <strong>{result.duration}</strong>
            </p>
            <p>
              Date: <strong>{result.timestamp.split('T')[0]}</strong>
            </p>
          </div>
          <div className="flex justify-between max-w-sm w-full mt-2">
            <p>
              Start time: <strong>{formatISOToTime(result.startTime)}</strong>
            </p>
            <p>
              End time: <strong>{formatISOToTime(result.endTime)}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="bg-white rounded-md shadow border overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 text-sm font-semibold">
          QUESTION
        </div>
        <ul>
          {result?.answers.map((q, i) => (
            <li
              key={i}
              className="flex justify-between items-center px-4 py-3 border-t"
            >
              <span className="text-sm text-gray-800">
                Q{i + 1}. {q.question}
              </span>
              <span
                className={`text-sm font-medium ${
                  q.status=='correct' ? "text-green-600" : "text-red-500"
                }`}
              >
                {q.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
     </div>
    </div>
  );
};

export default TestSheetReview;
