import { Cookie, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Cookies from 'js-cookie';
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

export default function CompanyConfirmPassword() {
  const [formData, setFormData] = useState({
    email : localStorage.getItem('adminEmail'),
    otp_input :"",
    new_password :"",
    confirm_password :""
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    if (!formData.new_password) return "Password is required";
    if (formData.new_password.length < 6) return "Password must be at least 6 characters";
    if (formData.new_password !== formData.confirm_password) return "Confirm password is not matching";
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData,"formData")
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    } 

    try {
      const response = await axiosInstance.post("/reset-password_api", formData);
      console.log("Form submitted:", response.data)
      navigate("/company-login");
      toast.success("Forget password successfully!");
    } catch (err) {
      console.error("Submission error:", err);
      toast.error(err.response?.data?.error || err.message || err);
    }
  };

  
  return (
    <div className="min-h-screen flex">
      <ToastContainer />
      <div className="hidden md:flex flex-1 bg-blue-600 items-center justify-center">
        <img
          src="./exam-sheet.png"
          alt="Exam Sheets"
          className="w-[400px] max-w-[90%] drop-shadow-2xl"
        />
      </div>
      <div className="flex-1 bg-white flex flex-col px-4 md:px-16 py-8 relative">
       

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto w-full mt-32" noValidate>
          <h2 className="text-2xl font-bold mb-20">Exam Portal</h2>

          <div className="mb-4">
            <label className="block text-sm mb-1">NEW OTP</label>
            <div className="relative w-[500px]">
              <input
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter OTP"
                name="otp_input"
                value={formData.otp_input}
                onChange={handleInputChange}
              />
            </div>
          
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">New Password</label>
            <div className="relative w-[500px]">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="New Password"
                name="new_password"
                value={formData.new_password}
                onChange={handleInputChange}
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
            <div className="relative w-[500px]">
              <input
                type="password"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Confirm Password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleInputChange}
              />
            </div>
          
          </div>
          <div className="w-[90%] mt-5 text-center">
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