import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-1/3 bg-blue-600 flex items-center justify-center">
      <div className="relative w-3/4 max-w-[350px]">
        {/* Stacked exam sheets image */}
        <div className="relative transform rotate-[-8deg] -ml-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-2 border-b border-gray-200 pb-2 flex justify-between items-center">
              <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm uppercase font-bold">
                EXAM SHEET
              </div>
              <div className="text-red-500 text-2xl font-bold">A+</div>
            </div>
            <div className="space-y-2">
              {Array(8).fill(0).map((_, idx) => (
                <div key={idx} className="w-full h-2 bg-gray-100 rounded-full"></div>
              ))}
            </div>
            {/* Mock pencil */}
            <div className="absolute top-1/2 -right-8 w-2 h-24 bg-yellow-500 transform rotate-45">
              <div className="absolute top-0 w-full h-2 bg-pink-300"></div>
              <div className="absolute bottom-0 w-full h-3 bg-gray-800 transform rotate-[-3deg]"></div>
            </div>
          </div>
        </div>

        {/* Second exam sheet */}
        <div className="absolute top-4 left-6 transform rotate-[-5deg]">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-2 border-b border-gray-200 pb-2 flex justify-between items-center">
              <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm uppercase font-bold">
                EXAM SHEET
              </div>
              <div className="text-red-500 text-2xl font-bold">A</div>
            </div>
            <div className="space-y-2">
              {Array(8).fill(0).map((_, idx) => (
                <div key={idx} className="w-full h-2 bg-gray-100 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Third exam sheet */}
        <div className="absolute top-8 left-10 transform rotate-[-2deg]">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-2 border-b border-gray-200 pb-2 flex justify-between items-center">
              <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm uppercase font-bold">
                EXAM SHEET
              </div>
              <div className="text-red-500 text-2xl font-bold">B</div>
            </div>
            <div className="space-y-2">
              {Array(8).fill(0).map((_, idx) => (
                <div key={idx} className="w-full h-2 bg-gray-100 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;