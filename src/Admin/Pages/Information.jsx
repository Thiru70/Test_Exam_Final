import { Eye, EyeOff  } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";


export default function InfromationForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex flex-1 bg-blue-600 items-center justify-center">
        <img
          src="./exam-sheet.png"
          alt="Exam Sheets"
          className="w-[400px] max-w-[90%] drop-shadow-2xl"
        />
      </div>
      <div className="flex-1 bg-white flex flex-col justify-center px-4 md:px-16 py-8 relative">
     
        <div className="absolute top-6 right-8 text-sm text-gray-400">
          Already have an account?{" "}
          <Link to='/login' className="text-blue-600 hover:underline font-medium">
            Sign In
          </Link>
        </div>

        <form className="max-w-2xl mx-auto w-full mt-16 md:mt-0">
          <h2 className="text-2xl font-bold mb-8">Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1">First Name</label>
              <input
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="First Name"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Last Name</label>
              <input
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Last Name"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Email"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Company name</label>
              <input
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Company name"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Position</label>
              <input
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Position"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Employee ID</label>
              <input
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Employee ID"
              />
            </div>
          </div>
       
          <div className="mb-4">
            <label className="block text-sm mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                placeholder="Confirm Password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                tabIndex={-1}
                onClick={() => setShowConfirm((v) => !v)}
              >
                {showConfirm ? <Eye /> : <EyeOff />}
              </button>
            </div>
          </div>
        
          <div className="flex items-center mb-8">
            <input
              type="checkbox"
              id="terms"
              className="h-4 w-4 border-gray-300 rounded mr-2"
            />
            <label htmlFor="terms" className="text-sm">
              I agree to all the{" "}
              <a href="#" className="text-red-400 hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-red-400 hover:underline">
                Privacy Policies
              </a>
            </label>
          </div>
         
          <div className="w-full text-center">
            <button
              type="submit"
              className="rounded-full bg-blue-600 hover:scale-105 text-white font-semibold px-20 py-2 text-lg transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
