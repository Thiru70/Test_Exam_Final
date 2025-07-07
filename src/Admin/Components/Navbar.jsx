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
    <header onClick={()=>setOpenProfile(!openProfile)} className="absolute sticky top-0 flex items-center justify-end px-6 py-2 border-b">
     <h1 className="flex items-center justify-center w-10 h-10 text-xl font-bold text-white bg-black border border-red-500 rounded-full">
    <span className="flex items-center justify-center w-full h-full z-80 ">{profileIcon || "U"}</span>
 
</h1>


      {
        openProfile ? <div className="absolute z-40 flex flex-col w-48 gap-2 p-2 bg-white shadow-2xl top-16">
          <profileIcon/>
        
       <Link classNam="flex items-center" ref={dropdownRef}  to="/account" className="px-2 hover:bg-zinc-200"
       >
        <div className="flex items-center gap-2">
        <Icon icon="mdi:account-circle-outline" width={24}/>
          <span> My Account</span>
        </div>
       </Link>
       <Link ref={dropdownRef }  onClick={handleLogout} to="/login" className="px-2 hover:bg-zinc-200">   <span className="flex gap-2"><LogOut className="w-6 h-6"/> Logout</span></Link>
        </div> : null
      }

    </header>
  );
};

export default Navbar;
