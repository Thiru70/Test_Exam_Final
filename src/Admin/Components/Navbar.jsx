import React, { useState, useEffect } from "react";
import { Icon } from "@iconify-icon/react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  

  return (
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">My Tests</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full sm:w-64 px-4 py-2 pl-10 border rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <Icon
              icon="mdi:magnify"
              className="absolute left-3 top-2.5 text-gray-400"
              width={20}
            />
          </div>
        </div>
      </header>
    );
};

export default Navbar;
