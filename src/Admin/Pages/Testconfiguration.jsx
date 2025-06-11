import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Result = () => {
  const navigate = useNavigate();
   const [FromData , setFormdata]= useState({
    name:'',
    Category:'',
    language :'',
   });
 const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="p-6 ">
      <div className='mt-2'>
        <label className="block mb-1 font-semibold mt-2">Test Name</label>
        <input
          type="text"
         name="name"
          value={FromData.name}
          onChange={handleInputChange}
          className="w-full border-b border-[#000000] rounded px-3 py-2 focus:outline-none"
        />
      </div>

    <div className='mt-2'>
        <label className="block mb-1 font-semibold mt-2">Category</label>
        <input
          type="text"
          name="Category"
          value={FromData.Category}
          onChange={handleInputChange}
          className="w-full border-b border-[#000000] rounded px-3 py-2 focus:outline-none"
        />
      </div>

      <div className='mt-2'>
        <label className="block mb-1 font-semibold mt-2">Test language</label>
        <select
          name="language"
          value={FromData.language}
          onChange={handleInputChange}
          className='px-8 mt-2 py-2 border border-black focus:outline-none rounded-md'
        >
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
