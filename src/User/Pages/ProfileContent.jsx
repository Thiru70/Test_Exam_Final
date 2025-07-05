import React, { useState } from "react";
import RightSidebar from "../Components/RightSideBar";
import ProfileInformation from "../Components/ProfileInformation";
import ChangePassword from "../Components/ChangePassword";

const ProfileContent = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [studentData, setStudentData] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdatePassword = async () => {
    // Validate password fields
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    try {
      // Get student ID from localStorage
      const studentId = localStorage.getItem('student_id');
      
      if (!studentId) {
        alert('Student ID not found. Please log in again.');
        return;
      }

      console.log('Update password for student:', studentId);
      
      const response = await fetch('https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/student/change-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentId,
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword
        })
      });

      let result;
      const responseText = await response.text();
      console.log('Password change response:', responseText);

      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse password response as JSON:', parseError);
        throw new Error(`Server returned invalid JSON. Status: ${response.status}`);
      }

      if (!response.ok) {
        const errorMessage = result.message || result.error || 'Failed to update password';
        throw new Error(errorMessage);
      }

      // Reset password form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      alert('Password updated successfully!');
      
    } catch (error) {
      console.error('Error updating password:', error);
      alert(`Failed to update password: ${error.message}`);
    }
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
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProfilePicture = () => {
    setStudentData(prev => ({
      ...prev,
      profile_picture: null
    }));
  };

  const handleLogoutClick = () => {
    console.log('Logout clicked');
    if (window.confirm('Are you sure you want to logout?')) {
      alert('Logout functionality would redirect to login page');
    }
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <ProfileInformation
            studentData={studentData}
            setStudentData={setStudentData}
          />
        );
      case 'password':
        return (
          <ChangePassword
            passwordData={passwordData}
            handlePasswordChange={handlePasswordChange}
            handleUpdatePassword={handleUpdatePassword}
          />
        );
      default:
        return (
          <ProfileInformation
            studentData={studentData}
            setStudentData={setStudentData}
          />
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {renderMainContent()}
      </div>
      
      {/* Right Sidebar */}
      <RightSidebar
        studentData={studentData}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        handleProfilePictureUpload={handleProfilePictureUpload}
        handleDeleteProfilePicture={handleDeleteProfilePicture}
        handleLogoutClick={handleLogoutClick}
      />
    </div>
  );
};

export default ProfileContent;
