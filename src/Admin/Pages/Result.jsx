import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../utils/axiosInstance';

const Result = () => {
  const [testData, setTestData] = useState([]);
  const navigate = useNavigate();
  const email = localStorage.getItem('adminEmail')

  const fetchAllTests = async () => {
    const response = await axiosInstance.get(
      `/tests?createdBy=${email}`
    );
    setTestData(response.data);
    console.log(response.data, "response");
  };


  useEffect(()=> {
    fetchAllTests()
  },[])


 const getStatusStyles = (status) => {
    switch (status) {
      case 'Passed':
        return 'text-green-600 border-green-400';
      case 'Failed':
        return 'text-red-600 border-red-400';
      case 'Active':
        return 'text-blue-600 border-blue-400';
      default:
        return 'text-gray-600 border-gray-300';
    }
  };

  return (
    <div className="p-6 space-y-8">
      {testData.map((test) => (
        <div key={test.testId}>
          <h3 className="text-sm font-medium text-gray-800 mb-3">{test.type ==='MCQ'?'Round 1':test.type==='coding' ?'Round 2':'Interview'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2 shadow-sm cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <span className={`text-xs border px-2 py-1 rounded-md ${
                    new Date(test.sessionExam.endDate) < Date.now()
                      ? "text-[#D91919] border-[#F10A0A]"
                      : "text-[#34C759] border-[#34C759]"
                  }` }>
                  {new Date(test.sessionExam.endDate) < Date.now() ?"ended":"active"}
                  </span>
                  <span className="text-xs text-gray-500">
                    Created - {new Date(test.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-800">
                  {test.testName}
                </div>
                <div className="text-sm text-gray-600">{test.type}</div>
                <div className='text-end ' onClick={() => navigate('/resultTable',{state: { testId : test.testId, testName: test.testName}})} >
                  <button className=' border text-blue-500 border-blue-400 px-4 py-0.5 rounded-full '>View</button>
                
                </div>

              </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Result;
