import React from 'react';
import { FaRegUser } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { LuSend } from "react-icons/lu";
import { IoIosTimer } from "react-icons/io";
import { LuNotepadText } from "react-icons/lu";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const testData = {
  testName: 'Aptitude test',
  respondent: 'Wade Warren',
  status: 'Test Passed',
  score: 66.7,
  totalTime: '00:00:52',
  allottedTime: '00:12:00',
  date: '2025-01-10',
  startTime: '18:14',
  endTime: '18:14',
  questions: [
    { question: 'Which factories have production results higher than 350 in 2019?', result: '0/1' },
    { question: 'Which factories have production results higher than 350 in 2019?', result: '2/2' },
    { question: 'Which factories have production results higher than 350 in 2019?', result: '1/1' },
    { question: 'Which factories have production results higher than 350 in 2019?', result: '1/1' },
  ],
};

const isCorrect = (res) => {
  const [got, total] = res.split('/').map(Number);
  return got === total;
};

const TestSheetReview = () => {
  return (
    <div className="p-6 space-y-6">
      
        <h2 className="text-xl font-semibold">Test sheet review</h2>
      {/* Header */}
      <div className="flex justify-between items-center bg-[#F9F9F9] py-2 px-2">
        
          <h3 className="text-lg font-medium">{testData.testName}</h3>
        <div className="flex gap-4">
          <span className="flex gap-2"><FaRegUser className='mt-1'/> Respondent view</span>
          <button className="flex gap-2"><LuDownload /> Download</button>
          <button className="flex gap-2"><LuSend className='mt-1'/> Send</button>
        </div>
      </div>

      {/* Test & Respondent */}
      <div className="flex flex-col md:flex-row justify-between bg-[#F9F9F9] p-4 rounded-md shadow">
        <div>
          <p className="text-gray-600 mt-1 flex gap-2"><FaRegUser className='mt-1'/> Respondent: <strong>{testData.respondent}</strong></p>
        </div>
      </div>

      {/* Result & Timer */}
      <div className="grid md:grid-cols-2 gap-4">
       {/* Result */}
<div className="bg-white border rounded-md p-6 shadow flex justify-between">
 <div>
  <h1 className='flex gap-2 '><LuNotepadText /> Result</h1>
  <span className={`font-semibold text-center flex  gap-2 items-center mt-2 ${testData.status ? 'text-[#34C759]' : 'text-[#FF0000]'}`}>
                                        {testData.status ? <FaCheckCircle />:<IoMdCloseCircle />}
                                        {testData.status ? "Test Passed" : "Test Failed"}
                                    </span>
  <p className="text-sm text-gray-500 mb-4">Respondent result is available</p>
 </div>
  <div className="w-24 h-24">
    <CircularProgressbar
      value={testData.score}
      text={`${testData.score}%`}
      styles={buildStyles({
        pathColor: testData.score >= 60 ? '#34C759' : '#D91919',
        textColor: '#111827',
        trailColor: '#e5e7eb',
        textSize: '18px',
      })}
    />
  </div>
</div>


        {/* Timer */}
        <div className="bg-white border rounded-md p-6 shadow text-sm text-gray-700">
          <h4 className="font-medium mb-2 flex gap-1"><IoIosTimer className='text-black text-sm'/> Timer</h4>
          <p>Total time: </p>
          <div className='flex justify-between'>
            <p className='mt-2'><strong>{testData.totalTime}</strong> / <strong>{testData.allottedTime}</strong></p>
          <p>Date: <strong>{testData.date}</strong></p>
          </div>
         <div className='flex justify-between max-w-sm w-full mt-2'>
           <p>Start time: <strong>{testData.startTime}</strong></p>
          <p>End time: <strong>{testData.endTime}</strong></p>
         </div>
        </div>
      </div>

      {/* Questions */}
      <div className="bg-white rounded-md shadow border overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 text-sm font-semibold">QUESTION</div>
        <ul>
          {testData.questions.map((q, i) => (
            <li key={i} className="flex justify-between items-center px-4 py-3 border-t">
              <span className="text-sm text-gray-800">Q{i + 1}. {q.question}</span>
              <span
                className={`text-sm font-medium ${
                  isCorrect(q.result) ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {q.result}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TestSheetReview;
