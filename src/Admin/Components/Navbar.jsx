import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Cookies from 'js-cookie';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate()
  const email = localStorage.getItem('adminEmail')
  const [openProfile, setOpenProfile] = useState(false)
  const [profileIcon,setProfileIcon] = useState(false)

  const fetchProfileData = async () => {
    const response = await axiosInstance.get(`/company/profile/${email}`);
    setProfileIcon(response.data.profile.first_name.split('')[0]);
  };

  const handleLogout = () => {
    Cookies.remove('token')
    localStorage.clear()


  }

  useEffect(() => {
    fetchProfileData();
  }, [email]);
  return (
    <header onClick={()=>setOpenProfile(!openProfile)} className="flex items-center justify-end px-6 py-4 bg-white border-b sticky top-0 z-10">
      <h1 className="bg-black text-white font-bold rounded-full w-10 h-10 flex justify-center items-center text-xl">
        {profileIcon || "U"}
      </h1>
      {
        openProfile ? <div className="w-32 absolute top-14 bg-white z-40 shadow-2xl flex flex-col gap-2 p-2">
        <Link  to="/account" className="px-2 hover:bg-zinc-200">My Account</Link>
        <Link onClick={handleLogout} to="/home" className="px-2 hover:bg-zinc-200">Logout</Link>
        </div> : null
      }

    </header>
  );
};

export default Navbar;
