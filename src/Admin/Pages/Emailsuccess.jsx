import React, { useState } from 'react';
import success from '../../Asstes/Images/Sended.png'
import { useNavigate } from "react-router-dom";

const EmailSuccess = () => {
  const navigate = useNavigate();


    return (
        <>
        <div className='p-4 flex gap-2 justify-end'>
            <button className='bg-[#0BC279] text-white py-2 px-4 rounded-md'>Preview Mail</button>
            <button className='bg-[#0BC279] text-white py-2 px-4 rounded-md'>Send Mail</button>
        </div>
        <div className='p-6 flex justify-center items-center'>
            <div className='flex flex-col justify-center'>
                <h1 className='text-xl text-[#808080] '>Mail sended to  the selected applicant's </h1>
                <img src={success} alt="" className='h-72 w-72'/>
                <button className='bg-[#0BC279] text-white p-2 rounded-md mt-3 ' onClick={() => navigate('/student-form')}>Back to Table</button>
            </div>
        </div>
        
        </>
    );
};

export default EmailSuccess;
