  import React, { useEffect, useState } from "react";
  import axiosInstance from "../../utils/axiosInstance";

  const ProfileForm = () => {
    const email = localStorage.getItem('otpEmail')
    const [profileData,setProfileData] = useState([])

    const fetchProfileData = async() => {
      const response = await axiosInstance.get(`/company/profile/${email}`)
      console.log(response.data,"responsedata")
      setProfileData(response.data.profile)
    }

    useEffect(()=> {
      fetchProfileData()
    },[email])
    return (
      <div className="bg-gray-100 p-6 md:p-10">
        {/* Header */}
        <div className="bg-blue-600 text-white py-4 px-6 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-semibold">Profile</h2>
          <button className="bg-white text-blue-600 font-medium px-4 py-1 rounded hover:bg-gray-100">
            Edit
          </button>
        </div>

        {/* Profile Info */}
        <div className="p-6 flex flex-col md:flex-row items-start gap-6 bg-white rounded-b-lg shadow-md">
          {/* Profile Image and Name */}
          <div className="flex flex-col items-center">
            <img
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fth.bing.com%2Fth%3Fid%3DOIP.MNYMRopweKA9axhd73z_GwHaE8%26cb%3Dthvnextc1%26pid%3DApi&f=1&ipt=3544f43d14fbfc3a922fe861f96504cf9fe1eea12a5dee223f35a4db92da62a5&ipo=images"
              alt="Profile"
              className="rounded-full w-20 h-20 object-cover"
            />
            <div className="text-center mt-2">
              <h3 className="text-md font-semibold">{profileData.first_name + " " +profileData.last_name}</h3>
              <p className="text-sm text-gray-500">{profileData.email}</p>
            </div>
          </div>

          {/* Input Fields */}
          <form className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                placeholder="Enter here"
                value={profileData.first_name}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={profileData.last_name}
                placeholder="Enter here"
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="text"
                value={profileData.email}
                placeholder="Enter here"
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <input
                type="text"
                value={profileData.position}
                placeholder="Enter here"
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                value={profileData.company_name}
                placeholder="Enter here"
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Created At</label>
              <input
                type="text"
                value={new Date(profileData.created_at).toLocaleDateString()}
                placeholder="Enter here"
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="w-[200%] text-end">
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Save
          </button>
        </div>
          </form>
        </div>

        {/* Logout */}
        <div className="flex justify-end mt-6">
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            logout
          </button>
        </div>
      </div>
    );
  };

  export default ProfileForm;
