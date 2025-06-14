import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../utils/axiosInstance';

const Result = () => {
  const [testData, setTestData] = useState([]);
  const navigate = useNavigate();
  const email = localStorage.getItem('otpEmail')

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
    const mockData = [
  {
    round: 'Round 1',
    assessments: [
      {
        status: 'Active',
        date: '2025-03-10',
        title: 'Aptitude test',
        description: 'Description',
      },
      {
        status: 'Active',
        date: '2025-03-25',
        title: 'Aptitude test',
        description: 'Description',
      },
    ],
  },
  {
    round: 'Round 2',
    assessments: [
      {
        status: 'Active',
        date: '2025-03-10',
        title: 'Aptitude test',
        description: 'Description',
      },
    ],
  },
  {
    round: 'Interview',
    assessments: [
      {
        status: 'Active',
        date: '2025-03-10',
        title: 'Aptitude test',
        description: 'Description',
      },
    ],
  },
];


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
      {mockData.map((round, idx) => (
        <div key={idx}>
          <h3 className="text-sm font-medium text-gray-800 mb-3">{round.round}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {round.assessments.map((assessment, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2 shadow-sm cursor-pointer"
                onClick={() => navigate('/resultTable')} 
              >
                <div className="flex justify-between items-center">
                  <span className="text-green-600 text-xs border border-green-400 px-2 py-1 rounded-md">
                    {assessment.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    Created - {assessment.date}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-800">
                  {assessment.title}
                </div>
                <div className="text-sm text-gray-600">{assessment.description}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Result;
