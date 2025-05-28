import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyTest = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
 const testData = [
  {
    id: 1,
    status: "Closed",
    statusType: "danger",
    title: "Aptitude test",
    description: "Description",
    eligible :"Test mail",
    date: "2025-03-10",
  },
  {
    id: 2,
    status: "Active",
    statusType: "success",
    title: "Aptitude test",
    description: "Description",
    eligible :"eligible form mail",
    date: "2025-03-10",
  },
];
  return (
    <>
       <div className="p-3">
        <div className="flex justify-end gap-3 p-5">
        
        <button onClick={() => navigate('/emailForm')} className="bg-[#0BC279] text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">
            Create mail
        </button>
        
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testData.map((test) => (
          <div
            key={test.id}
            className="bg-[#F8F8F8] rounded-lg shadow border p-4 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center mb-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded border 
                  ${
                    test.statusType === "danger"
                      ? " text-[#D91919] border-[#F10A0A]"
                      : " text-[#34C759] border-[#34C759]"
                  }`}
              >
                {test.status}
              </span>
              <span className="text-sm text-gray-500">Created: {test.date}</span>
            </div>
            <div>
              <h3 className="font-semibold">{test.title}</h3>
              <p className="text-sm mt-1">{test.description}</p>
              <p className="text-sm mt-1">{test.eligible}</p>
            </div>
          </div>
        ))}
      </div>
      

    </div>
    
    </>
  );
};

export default MyTest;
