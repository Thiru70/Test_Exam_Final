import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

export default function CompanyLoginForm() {
  const [formData, setFormData] = useState({
    employee_id: "",
    password: "",
  });
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/company/login', formData);
      console.log('Form submitted:', response.data);
      window.alert('Company registered successfully')
      navigate('/myTest')
    } catch (err) {
      console.error('Submission error:', err);
      window.alert(err.response.data.error || err)
    }
  };

  return (
    <div className="min-h-screen flex">
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
            to="/information"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto w-full mt-32">
          <h2 className="text-2xl font-bold mb-20">Exam Portal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1">Employee ID</label>
              <input
                className="w-[500px] border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Employee ID"
                name ="employee_id"
                value={formData.employee_id}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Password</label>
            <div className="relative w-[500px]">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Password"
                name ="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                onChange={handleInputChange}
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>
          </div>
          <div className="w-[90%] mt-10 text-center">
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
