import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Cookies from 'js-cookie';
import {  LogOut } from "lucide-react";
import { Icon } from "@iconify-icon/react";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate()
  const email = localStorage.getItem('adminEmail')
  const [openProfile, setOpenProfile] = useState(false)
  const [profileIcon,setProfileIcon] = useState(false)
  const dropdownRef = useRef(null)

  const fetchProfileData = async () => {
    const response = await axiosInstance.get(`/company/profile/${email}`);
    setProfileIcon(response.data.profile.first_name.split('')[0]);
  };

  const handleLogout = () => {
    Cookies.remove('token')
    localStorage.clear()
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [email]);
  return (
    <header onClick={()=>setOpenProfile(!openProfile)} className="flex items-center justify-end px-6 py-4 bg-white border-b sticky top-0 z-10">
      <h1 className="bg-black text-white font-bold rounded-full w-10 h-10 flex justify-center items-center text-xl">
        {profileIcon || "U"}
      </h1>
      {
        openProfile ? <div className="w-48 absolute top-14 bg-white z-40 shadow-2xl flex flex-col gap-2 p-2">
          <profileIcon/>
        
       <Link classNam="flex items-center" ref={dropdownRef }  to="/account" className="px-2 hover:bg-zinc-200"
       >
        <div className="flex items-center gap-2">
        <Icon icon="mdi:account-circle-outline" width={24}/>
        <span> My Account</span>
        </div>
       </Link>
       <Link ref={dropdownRef }  onClick={handleLogout} to="/login" className="px-2 hover:bg-zinc-200">   <span className="flex gap-2"><LogOut className="h-6 w-6"/> Logout</span></Link>
        </div> : null
      }

    </header>
  );
};

export default Navbar;
