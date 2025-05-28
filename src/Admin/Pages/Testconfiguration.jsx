import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Result = () => {
  const navigate = useNavigate();
   const [FromData , setFormdata]= useState({
    name:'',
    Category:'',
    language :'',
   });
const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };
  return (
    <div className="p-6 ">
      <div className='mt-2'>
        <label className="block mb-1 font-semibold mt-2">Test Name</label>
        <input
          type="text"
          value={FromData.name}
          onChange={(e) => handleFileChange(e.target.value)}
          className="w-full border-b border-[#000000] rounded px-3 py-2 focus:outline-none"
        />
      </div>

    <div className='mt-2'>
        <label className="block mb-1 font-semibold mt-2">Category</label>
        <input
          type="text"
          value={FromData.Category}
          onChange={(e) => handleFileChange(e.target.value)}
          className="w-full border-b border-[#000000] rounded px-3 py-2 focus:outline-none"
        />
      </div>

      <div className='mt-2'>
        <label className="block mb-1 font-semibold mt-2">Test language</label>
        <select name="" className='px-8 mt-2 py-2 border border-black focus:outline-none rounded-md'>
            <option value="">Language</option>
            <option value="English">English</option>
            <option value="Tamil">Tamil</option>
            <option value="Hindi">Hindi</option>
        </select>
      </div>
      <button className='px-5 py-2 bg-[#0079EA] text-[#fff] rounded-md mt-5' onClick={() => navigate('/questionSet')}>Save</button>
    </div>
  );
};

export default Result;
