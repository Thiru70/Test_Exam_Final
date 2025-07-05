import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Cookies from 'js-cookie';
import { LogOut, Menu } from "lucide-react";
import { Icon } from "@iconify-icon/react";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const email = localStorage.getItem('adminEmail');
  const [openProfile, setOpenProfile] = useState(false);
  const [profileIcon, setProfileIcon] = useState("U");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchProfileData = async () => {
    try {
      const response = await axiosInstance.get(`/company/profile/${email}`);
      if (response.data.profile.first_name) {
        setProfileIcon(response.data.profile.first_name.charAt(0).toUpperCase());
      }
    } catch (err) {
      setProfileIcon("U"); // fallback if API fails
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.clear();
    navigate('/login');
  };

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
    if (email) {
      fetchProfileData();
    }
  }, [email]);

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white border-b sticky top-0 z-10">
      {/* LEFT: Hamburger menu for mobile + Exam Portal title */}
      <div className="flex items-center gap-2"> 
        <button 
          onClick={toggleSidebar}
          className="md:hidden focus:outline-none p-1"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        <span className="font-bold text-base sm:text-lg block">Exam Portal</span>
      </div>

      {/* RIGHT: Profile icon with dropdown */}
      <div className="flex items-center">
        {/* Profile Icon - Always visible in all screen sizes */}
        <div className="relative">
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="focus:outline-none"
          >
            <span className="bg-black text-white font-bold rounded-full w-8 h-8 sm:w-10 sm:h-10 flex justify-center items-center text-sm sm:text-xl">
              {profileIcon}
            </span>
          </button>

          {openProfile && (
            <div
              ref={dropdownRef}
              className="w-40 sm:w-48 absolute right-0 top-10 sm:top-12 bg-white z-40 shadow-2xl flex flex-col gap-2 p-2 rounded"
            >
              <Link
                to="/account"
                className="flex items-center gap-2 px-2 py-1 hover:bg-zinc-200 rounded text-sm sm:text-base"
              >
                <Icon icon="mdi:account-circle-outline" width={20} className="sm:w-6" />
                <span>My Account</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-2 py-1 hover:bg-zinc-200 rounded w-full text-left text-sm sm:text-base"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
