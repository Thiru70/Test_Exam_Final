import React, { useState, useEffect } from "react";
import { User, LogOut, Edit3, Save, X, Mail, Phone, MapPin, Calendar, GraduationCap, School, Award, Briefcase, FileText, BookOpen, Target, Lock, Eye, EyeOff } from "lucide-react";

const ProfileContent = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [activeSection, setActiveSection] = useState('profile');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleEditClick = () => {
    setIsEditMode(true);
    setEditedData({...studentData});
  };

  const handleSaveClick = async () => {
    setSaving(true);
    try {
     
      const updatePayload = {
        student_id: studentData.student_id,
        full_name: editedData.full_name || studentData.full_name,
        contact: editedData.contact || studentData.contact,
        gender: editedData.gender || studentData.gender,
        dob: editedData.dob || studentData.dob,
        "address_&_pincode": editedData.address_pincode || studentData.address_pincode,
        college_name: editedData.college_name || studentData.college_name,
        course: editedData.course || studentData.course,
        current_semester: editedData.current_semester || studentData.current_semester,
        eligibility_status: editedData.eligibility_status || studentData.eligibility_status,
        "10th_percentage": editedData["10th_percentage"] || studentData["10th_percentage"],
        "12th_percentage": editedData["12th_percentage"] || studentData["12th_percentage"],
        graduation_percentage: editedData.graduation_percentage || studentData.graduation_percentage,
        preferred_job_roles: editedData.preferred_job_roles || studentData.preferred_job_roles,
        internship_experience: editedData.internship_experience || studentData.internship_experience,
        internship_details: editedData.internship_details || studentData.internship_details,
        resume_url: editedData.resume_url || studentData.resume_url
      };

      console.log('Sending update payload:', updatePayload);

      const response = await fetch('https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/student/update-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(updatePayload)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      let result;
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error(`Server returned invalid JSON. Status: ${response.status}, Response: ${responseText}`);
      }

      if (!response.ok) {
        const errorMessage = result.message || result.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      
      // Update local state with saved data
      setStudentData({...editedData});
      setIsEditMode(false);
      setError(null);
      
      // Show success message
      alert('Profile updated successfully!');
      
    } catch (err) {
      console.error('Error updating profile:', err);
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (err.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err.message.includes('JSON')) {
        errorMessage = 'Server response error. Please try again later.';
      } else if (err.message) {
        errorMessage = `Update failed: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
    setEditedData({});
    setError(null);
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdatePassword = () => {
    // Add password update logic here
    console.log('Update password:', passwordData);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowChangePassword(false);
  };

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setStudentData(prev => ({
          ...prev,
          profile_picture: imageUrl
        }));
        if (isEditMode) {
          setEditedData(prev => ({
            ...prev,
            profile_picture: imageUrl
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProfilePicture = () => {
    setStudentData(prev => ({
      ...prev,
      profile_picture: null
    }));
    if (isEditMode) {
      setEditedData(prev => ({
        ...prev,
        profile_picture: null
      }));
    }
  };

  const handleLogoutClick = () => {
    console.log('Logout clicked');
    // Simulate logout - in real app this would redirect to login
    alert('Logout functionality would redirect to login page');
  };

  // Fetch student data from API
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/student/STD726469');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform the API data to match our component structure
        const transformedData = {
          student_id: data.student.student_id,
          full_name: data.student.full_name,
          email: data.student.email,
          contact: data.student.contact,
          gender: data.student.gender,
          dob: data.student.dob,
          address_pincode: data.student["address_&_pincode"],
          college_name: data.student.college_name,
          course: data.student.course,
          current_semester: data.student.current_semester,
          eligibility_status: data.student.eligibility_status,
          "10th_percentage": data.student["10th_percentage"],
          "12th_percentage": data.student["12th_percentage"],
          graduation_percentage: data.student.graduation_percentage,
          preferred_job_roles: data.student.preferred_job_roles,
          internship_experience: data.student.internship_experience,
          internship_details: data.student.internship_details,
          resume_url: data.student.resume_url,
          profile_picture: null // API doesn't provide profile picture
        };
        
        setStudentData(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load student data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const renderViewField = (label, value, isUrl = false, isReadOnly = false) => {
    if (isUrl && value) {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 underline"
          >
            <FileText className="w-4 h-4 mr-1" />
            View Resume
          </a>
        </div>
      );
    }

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {isReadOnly && <span className="text-xs text-gray-500 ml-1">(Read Only)</span>}
        </label>
        <div className={`text-gray-900 p-3 rounded-md border ${isReadOnly ? 'bg-gray-100' : 'bg-gray-50'}`}>
          {value || <span className="text-gray-400 italic">Not provided</span>}
        </div>
      </div>
    );
  };

  const renderEditField = (label, field, type = "text", isReadOnly = false) => {
    const value = editedData[field] || '';
    
    if (isReadOnly) {
      return renderViewField(label, value, false, true);
    }
    
    if (type === "textarea") {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={label}
            rows="3"
          />
        </div>
      );
    }
    
    if (type === "select") {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
          >
            <option value="">Select {label}</option>
            {field === 'gender' && (
              <>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </>
            )}
            {field === 'eligibility_status' && (
              <>
                <option value="Eligible">Eligible</option>
                <option value="Not Eligible">Not Eligible</option>
                <option value="Pending">Pending</option>
              </>
            )}
          </select>
        </div>
      );
    }
    
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <input
          type={type}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={label}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600 font-medium">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error && !studentData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-600 font-medium mb-2">Error Loading Profile</div>
          <div className="text-gray-600">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="max-w-4xl">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}

            {/* Profile Information Section */}
            {activeSection === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm mb-6">
                {/* Header */}
                <div className="bg-blue-500 text-white p-4 rounded-t-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Profile Information</span>
                  </div>
                  <div className="flex space-x-2">
                    {isEditMode ? (
                      <>
                        <button 
                          onClick={handleSaveClick}
                          disabled={saving}
                          className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-2 rounded text-sm flex items-center transition-colors"
                        >
                          {saving ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-1" />
                              Save
                            </>
                          )}
                        </button>
                        <button 
                          onClick={handleCancelClick}
                          disabled={saving}
                          className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-2 rounded text-sm flex items-center transition-colors"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={handleEditClick}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center transition-colors"
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="space-y-8">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-6 flex items-center border-b pb-2">
                        <User className="w-5 h-5 mr-2 text-blue-500" />
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isEditMode ? (
                          <>
                            {renderEditField("Full Name", "full_name")}
                            {renderEditField("Student ID", "student_id", "text", true)}
                            {renderEditField("Email", "email", "email", true)}
                            {renderEditField("Phone", "contact", "tel")}
                            {renderEditField("Gender", "gender", "select")}
                            {renderEditField("Date of Birth", "dob", "date")}
                            <div className="md:col-span-2">
                              {renderEditField("Address & Pincode", "address_pincode", "textarea")}
                            </div>
                          </>
                        ) : (
                          <>
                            {renderViewField("Full Name", studentData?.full_name)}
                            {renderViewField("Student ID", studentData?.student_id, false, true)}
                            {renderViewField("Email", studentData?.email, false, true)}
                            {renderViewField("Phone", studentData?.contact)}
                            {renderViewField("Gender", studentData?.gender)}
                            {renderViewField("Date of Birth", studentData?.dob)}
                            <div className="md:col-span-2">
                              {renderViewField("Address & Pincode", studentData?.address_pincode)}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Educational Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-6 flex items-center border-b pb-2">
                        <GraduationCap className="w-5 h-5 mr-2 text-green-500" />
                        Educational Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isEditMode ? (
                          <>
                            {renderEditField("College Name", "college_name")}
                            {renderEditField("Course", "course")}
                            {renderEditField("Current Semester", "current_semester")}
                            {renderEditField("Eligibility Status", "eligibility_status", "select")}
                            {renderEditField("10th Percentage", "10th_percentage", "number")}
                            {renderEditField("12th Percentage", "12th_percentage", "number")}
                            <div className="md:col-span-2">
                              {renderEditField("Graduation Percentage", "graduation_percentage", "number")}
                            </div>
                          </>
                        ) : (
                          <>
                            {renderViewField("College Name", studentData?.college_name)}
                            {renderViewField("Course", studentData?.course)}
                            {renderViewField("Current Semester", studentData?.current_semester)}
                            {renderViewField("Eligibility Status", studentData?.eligibility_status)}
                            {renderViewField("10th Percentage", studentData?.["10th_percentage"])}
                            {renderViewField("12th Percentage", studentData?.["12th_percentage"])}
                            <div className="md:col-span-2">
                              {renderViewField("Graduation Percentage", studentData?.graduation_percentage)}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-6 flex items-center border-b pb-2">
                        <Briefcase className="w-5 h-5 mr-2 text-purple-500" />
                        Professional Information
                      </h3>
                      <div className="space-y-6">
                        {isEditMode ? (
                          <>
                            {renderEditField("Preferred Job Roles", "preferred_job_roles", "textarea")}
                            {renderEditField("Internship Experience", "internship_experience")}
                            {renderEditField("Internship Details", "internship_details", "textarea")}
                            {renderEditField("Resume URL", "resume_url", "url")}
                          </>
                        ) : (
                          <>
                            {renderViewField("Preferred Job Roles", studentData?.preferred_job_roles)}
                            {renderViewField("Internship Experience", studentData?.internship_experience)}
                            {renderViewField("Internship Details", studentData?.internship_details)}
                            {renderViewField("Resume", studentData?.resume_url, true)}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Change Password Section */}
            {activeSection === 'password' && (
              <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="bg-yellow-500 text-white p-4 rounded-t-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Change Password</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="max-w-md space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input 
                        type="password" 
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent" 
                        placeholder="Enter current password"
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input 
                        type="password" 
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent" 
                        placeholder="Enter new password"
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input 
                        type="password" 
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent" 
                        placeholder="Confirm new password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      />
                    </div>
                    <div className="pt-4">
                      <button 
                        onClick={handleUpdatePassword}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Fixed Position */}
      <div className="w-80 bg-gray-100 flex flex-col h-screen">
        <div className="p-6 flex flex-col h-full">
          {/* Profile Picture Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-2 text-center flex-shrink-0">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto flex items-center justify-center overflow-hidden">
                {studentData?.profile_picture ? (
                  <img 
                    src={studentData.profile_picture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-600" />
                )}
              </div>
            </div>
            
            <div className="text-center mb-4">
              <h4 className="font-semibold text-gray-800">{studentData?.full_name}</h4>
              <p className="text-sm text-gray-600">{studentData?.student_id}</p>
            </div>
            
            <div className="space-y-2">
              <input
                type="file"
                id="profile-upload"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
              />
              <label
                htmlFor="profile-upload"
                className="block w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm cursor-pointer transition-colors"
              >
                Update Profile Picture
              </label>
              {studentData?.profile_picture && (
                <button 
                  onClick={handleDeleteProfilePicture}
                  className="block w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded text-sm transition-colors"
                >
                  Delete Profile Picture
                </button>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white rounded-lg shadow-sm p-4 flex-1 flex flex-col">
            <h3 className="font-semibold text-gray-700 mb-2">Menu</h3>
            <div className="space-y-2 flex-1">
              <button 
                onClick={() => setActiveSection('profile')}
                className={`w-full text-left py-3 px-4 rounded text-sm transition-colors flex items-center ${
                  activeSection === 'profile' 
                    ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                Profile Information
              </button>
              <button 
                onClick={() => setActiveSection('password')}
                className={`w-full text-left py-3 px-4 rounded text-sm transition-colors flex items-center ${
                  activeSection === 'password' 
                    ? 'bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </button>
            </div>

            {/* Logout Button */}
            <div className=" flex-shrink-0 ">
              <button 
                onClick={handleLogoutClick}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded font-medium flex items-center justify-center transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;