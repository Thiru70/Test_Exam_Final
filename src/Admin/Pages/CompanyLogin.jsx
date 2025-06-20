import { Cookie, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Cookies from 'js-cookie';
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

export default function CompanyLoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Employee ID is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 0) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const response = await axiosInstance.post("/company/login", formData);
      console.log("Form submitted:", response.data)
      localStorage.setItem('adminEmail',response.data.email)
      Cookies.set('token',response.data.token);
      navigate("/myTest");
      toast.success("Company logged in successfully!");
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
        <div className="absolute top-6 right-8 text-sm text-gray-400 ">
          Already have an account?{" "}
          <Link
            to="/email-verification"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto w-full mt-32" noValidate>
          <h2 className="text-2xl font-bold mb-20">Exam Portal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type = "email"
                className="w-[500px] border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <div className="text-red-500 text-xs mt-1">{errors.email}</div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Password</label>
            <div className="relative w-[500px]">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Password"
                name="password"
                value={formData.password}
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
            {errors.password && (
              <div className="text-red-500 text-xs mt-1">{errors.password}</div>
            )}
          </div>
          <Link to={'/reset-email-verification'} className="w-[75%] text-md underline text-blue-500 flex justify-end">Forget Password</Link>
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