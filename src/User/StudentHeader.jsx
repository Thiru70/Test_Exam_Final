import React from "react";
import { Search } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center" style={{gap: '10px'}}>
        <h1 className="text-lg font-medium text-gray-800">My tests</h1>
        
        <div className="relative">
          <div className="flex items-center bg-purple-100 rounded-full px-4 py-2 w-80">
            <input
              type="text"
              placeholder=""
              className="bg-transparent outline-none flex-1 text-sm text-gray-600 placeholder-gray-400"
            />
            <Search size={16} className="text-gray-500 ml-2" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;