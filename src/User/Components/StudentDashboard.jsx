import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  ChevronDown,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  TwitterIcon,
} from "lucide-react";

function StudentDashboard() {
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [isProcessOpen, setIsProcessOpen] = useState(false);
  const processDropdownRef = useRef(null);
  const testDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        processDropdownRef.current &&
        !processDropdownRef.current.contains(event.target)
      ) {
        setIsProcessOpen(false);
      }
      if (
        testDropdownRef.current &&
        !testDropdownRef.current.contains(event.target)
      ) {
        setIsTestOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="font-sans">

      <header className="flex items-center justify-between px-4 shadow-md bg-white">
        <div className="text-lg font-bold text-blue-600 flex flex-col items-center">
          <img src="/logo.png" alt="Logo" className="w-16 h-16 mr-2" />
          <span className="mt-[-15px]">School Name</span>
          <span className="text-gray-500 text-sm mt-[-5px]">Tagline Here</span>
        </div>
        <nav className="space-x-8 hidden md:flex">
          <Link to="#" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <div
            ref={processDropdownRef}
            className="relative inline-block text-left"
          >
            <button
              onClick={() => setIsProcessOpen(!isProcessOpen)}
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
            >
              <span>Process</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isProcessOpen && (
              <div className="absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1 text-gray-700">
                  <button className="block w-full text-left px-4 py-2 hover:bg-blue-300">
                    Hiring
                  </button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-blue-300">
                    Candidate Applicaation
                  </button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-blue-300">
                    Mail Box
                  </button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-blue-300">
                    Eligibility Form
                  </button>

                  <button className="block w-full text-left px-4 py-2 hover:bg-blue-300">
                    Candidate Resume
                  </button>
                </div>
              </div>
            )}
          </div>
          <div
            ref={testDropdownRef}
            className="relative inline-block text-left"
          >
            <button
              onClick={() => setIsTestOpen(!isTestOpen)}
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
            >
              <span>Test</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isTestOpen && (
              <div className="absolute mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1 text-gray-700">
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-300">
                    Interview
                  </button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    Aptitute
                  </button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    Technical/coding
                  </button>
                </div>
              </div>
            )}
          </div>
          <Link to="#" className="text-gray-700 hover:text-blue-600">
            Contact Us
          </Link>
        </nav>
        <div className="space-x-2">
          <button className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
            Login
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="p-8 bg-blue-50 flex flex-col-reverse lg:flex-row items-center justify-between">
        <div className="max-w-lg text-center lg:text-left">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Find Your Perfect Candidate with{" "}
            <span className="text-blue-600">Invites</span>
          </h1>
          <p className="text-gray-600 mb-6">
            A smarter way to screen, evaluate, and hire top talent for your
            organization.
          </p>
          <div className="flex justify-center lg:justify-start gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Start Hiring
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100">
              For Candidates
            </button>
          </div>
        </div>

        <section className="relative flex flex-col-reverse lg:flex-row items-center justify-between overflow-hidden min-h-[500px]">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50 z-0"></div>
          <div className=" mt-56">
            <img src="./Line 1.png" alt="" />
          </div>

          <div className="relative z-10 p-8 w-full flex justify-center">
            <div className="relative max-w-sm mr-10">
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="w-[300px] h-[300px] bg-blue-500 rounded-full -z-10"></div>
              </div>

              <img
                src="./student.png"
                alt="Hero"
                className="rounded-full w-[300px] h-[300px] object-cover"
              />

              <div className="absolute -top-6 right-0 flex flex-col items-center">
                <span className="bg-green-500 text-white text-sm px-4 py-1 rounded-md shadow-md">
                  Hired!
                </span>
                <img
                  src="./Line 2.png"
                  alt="Line"
                  className="mt-2 w-12 h-auto"
                />
              </div>

              <div className="absolute -left-20 bottom-10 bg-white shadow-md px-3 py-2 flex items-center gap-2 max-w-48 text-sm rounded-full">
                <img src="./icon1.png" alt="icon" className="w-8 h-8" />
                <span>Believe in yourself, and all that you are</span>
              </div>

              <div className="absolute -right-20 bottom-0 bg-white shadow-md px-3 py-2 flex items-center gap-2 max-w-48 text-sm rounded-full break-words">
                <img src="./icon2.png" alt="icon" className="w-8 h-8" />
                <span>Very expert was once a beginner.</span>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section className="py-12 bg-blue-100 text-center">
        <h2 className="text-2xl font-bold mb-10">Why Choose Invites?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {[
            {
              title: "AI-Powered Screening",
              desc: "Find the right candidates faster with intelligent resume matching.",
            },
            {
              title: "Customizable Application Forms",
              desc: "Create personalized forms to get the information you need.",
            },
            {
              title: "Streamlined Interview Scheduling",
              desc: "Easily manage interview slots and scheduling with automation.",
            },
            {
              title: "Easy Communication",
              desc: "Send emails, messages, and feedback effortlessly.",
            },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-blue-600 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 bg-white text-center">
        <h2 className="text-2xl font-bold mb-10">Testimonials Section</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-100"
            >
              <h4 className="text-blue-600 font-semibold mb-2">
                Candidate Quality
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                "TestDrive significantly improves our hiring decisions and the
                overall quality of our candidates."
              </p>
              <div className="text-yellow-400">★★★★★</div>
            </div>
          ))}
        </div>
      </section>
      <div className="bg-blue-50 px-6 py-10 rounded-lg flex flex-col md:flex-row items-center justify-between gap-8">
  
        <div className="w-full md:w-1/3 flex justify-center">
          <img
            src="./persons.png" 
            alt="Skater"
            className="w-64 h-64 object-contain"
          />
        </div>

        <div className="w-full md:w-2/3 text-center md:text-left space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600">
            Join thousands of companies and candidates using Invites to make <br />
            hiring simple and effective.
          </p>

          <div className="mt-4 flex justify-between">
          <button className= " h-12 bg-cyan-700 text-white px-5 py-2 rounded-md shadow hover:bg-cyan-800 transition">
            Get Started Today
          </button>

            <img
              src="./persons.png" 
              alt="Handshake"
              className="w-40 h-auto mx-auto md:mx-0"
            />
          </div>
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 py-10 px-6 md:px-16 pt-20 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-700">

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <img src="/logo.png" alt="Logo" className="w-16 h-16 mb-2" />
            <h2 className="text-blue-600 font-bold text-lg">SCHOOL NAME</h2>
            <p className="text-xs text-gray-600 mb-4">TAGLINE HERE</p>
            <p className="text-sm">
              We create eco-friendly, artisan-crafted products <br /> from
              sustainably sourced palm materials, bringing <br /> natures beauty
              and durability into everyday life. <br /> Our collection
              celebrates traditional <br /> craftsmanship with a modern,
              sustainable twist <br />
              Download the app by clicking the link below:
            </p>
            <div className="flex flex-col mt-4 ">
              <span className="text-sm font-bold">Connect with us:</span>
              <div className="flex space-x-4 mt-4">
                <Link to="">
                  <Facebook className="w-8 h-8 p-2 rounded-full bg-gray-400" />
                </Link>
                <Link to="">
                  <TwitterIcon className="w-8 h-8 p-2 rounded-full bg-gray-400" />
                </Link>
                <Link to="">
                  <Instagram className="w-8 h-8 p-2 rounded-full bg-gray-400" />
                </Link>
                <Link to="">
                  <Linkedin className="w-8 h-8 p-2 rounded-full bg-gray-400" />
                </Link>
              </div>
            </div>
          </div>

          <div className="">
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">
              Contact us
            </h3>
            <p className="mb-4 text-gray-600">
              Together, let's build a future defined by innovation and
              excellence.
            </p>
            <p className="flex items-center gap-2">
              📧 <span className="font-semibold">santa@gmail.com</span>
            </p>
            <p className="flex items-center gap-2 mt-2">
              📞 <span className="font-semibold">+91 8952058110</span>
            </p>
            <p className="flex items-center gap-2 mt-2">
              📍 <span className="font-semibold">ABC Addresss Delhi</span>
            </p>
          </div>

          <div className="bg-blue-500 text-white rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">
              Subscribe to our newsletter
            </h3>
            <p className="text-sm mb-4">
              Receive latest updates, insights, and announcements from
              Examportal
            </p>
            <form className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:flex-1 px-4 py-2 rounded-md text-gray-900"
              />
              <button
                type="submit"
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default StudentDashboard;
