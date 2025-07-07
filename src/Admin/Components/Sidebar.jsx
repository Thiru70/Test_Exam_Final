import React, { useState, useEffect } from "react";
import { Icon } from "@iconify-icon/react";
import { Link, useLocation } from "react-router-dom";

import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

const Sidebar = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menu = [
    { path: "/myTest", label: "Home", icon: "mdi:home" },
    // { path: "/candidateList", label: "Candidate list", icon: "mdi:user" },
    // { path: "/SetCriteria",label:"SetCriteria", icon: "mdi-calendar-check-outline"},
    // { path: "/respondents", label: "Respondents", icon: "mdi:account-group-outline" },
    { path: "/candidateList", label: "Candidate List", icon: "mdi:form-select" },
    { path: "/results", label: "Results", icon: "mdi:database" },
    { path: "/account", label: "My Account", icon: "mdi:account-circle-outline" },
  ];

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
    <ToastContainer />
      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-start px-4 py-3 bg-white shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-4 text-gray-600"
          >
            <Icon icon="mdi:menu" className="flex items-center text-2xl" />
          </button>
          <h1 className="text-lg font-semibold">Exam Portal</h1>
        </header>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`bg-white border-r h-screen p-4 shadow-sm z-10
          ${isMobile ? "fixed top-0 left-0 w-64 transition-transform duration-300" : "sticky top-0 w-60"} 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-lg font-semibold text-gray-700">Exam Portal</h1>
        </div>
        <nav className="flex flex-col gap-1">
          {menu.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                ${isActive(item.path)
                  ? "text-blue-600 font-medium border-l-4 border-blue-600 "
                  : "text-gray-600 hover:bg-gray-100"}`}
              onClick={() => isMobile && setSidebarOpen(false)}
            >
              <Icon 
                icon={item.icon} 
                width={20} 
                className={isActive(item.path) ? "text-blue-600" : "text-gray-500"} 
              />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

    </>
  );
};
export default Sidebar;
