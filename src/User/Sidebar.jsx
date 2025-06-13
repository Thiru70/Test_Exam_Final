import React, { useState, useEffect } from "react";
import { Home, User, FileText, HelpCircle, BarChart3 } from "lucide-react";

const Sidebar = ({ activeItem, setActiveItem }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menu = [
    { path: "/myTest", label: "My test", icon: Home },
    { path: "/myResults", label: "My Results", icon: User },
    { path: "/examInstructions", label: "Exam Instructions", icon: FileText },
    { path: "/support", label: "Support", icon: HelpCircle },
    { path: "/profile", label: "Profile", icon: BarChart3 },
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

  const isActive = (label) => activeItem === label;

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm py-3 px-4 flex items-center z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 mr-4"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-lg font-semibold">Exam Portal</h1>
        </header>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`bg-white h-screen shadow-sm z-10
          ${isMobile ? "fixed top-0 left-0 w-64 transition-transform duration-300" : "sticky top-0 w-60"}
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="pt-8 pb-6 px-6">
          <h1 className="text-xl font-medium text-gray-800 ml-11 -mt-3">Exam Portal</h1>
        </div>
        
        <nav className="px-0">
          {menu.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <button
                key={idx}
                onClick={() => setActiveItem(item.label)}
                className={`w-full flex items-center gap-4 px-6 py-4 text-base transition-colors relative text-left
                  ${isActive(item.label)
                    ? "text-blue-600 font-medium border-l-4 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"}`}
              >
                <IconComponent
                  size={20}
                  className={isActive(item.label) ? "text-blue-600" : "text-gray-400"}
                />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;