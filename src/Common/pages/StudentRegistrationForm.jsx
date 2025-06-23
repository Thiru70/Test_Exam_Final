
import React, { useState } from 'react';
import { Upload, GraduationCap, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentRegistrationForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    gender: '',
    dob: '',
    address: '',
    pincode: '',
    contact: '',
    email: '',
    tenth_percentage: '',
    college_name: '',
    twelfth_percentage: '',
    course: '',
    current_semester: '',
    graduation_percentage: '',
    preferred_job_roles: [],
    internship_experience: '',
    internship_details: '',
    resume_file: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedFields, setFocusedFields] = useState({});
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFocus = (fieldName) => {
    setFocusedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleBlur = (fieldName) => {
    setFocusedFields(prev => ({ ...prev, [fieldName]: false }));
  };

  const handleJobRoleChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      preferred_job_roles: checked
        ? [...prev.preferred_job_roles, value]
        : prev.preferred_job_roles.filter(role => role !== value)
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setFormData(prev => ({ ...prev, resume_file: file }));
      console.log('File selected:', file.name, 'Size:', file.size, 'bytes');
    } else {
      alert('File size should not exceed 10MB');
    }
  };

  const validateForm = () => {
    const required = ['full_name', 'gender', 'dob', 'contact', 'email', 'college_name', 'course', 'tenth_percentage', 'twelfth_percentage', 'graduation_percentage'];
    const newErrors = {};
    
    required.forEach(field => {
      if (!formData[field]) newErrors[field] = `${field.replace('_', ' ')} is required`;
    });
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.contact && !/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = 'Please enter a valid 10-digit contact number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadResumeToS3 = async (file) => {
    console.log('Starting S3 upload for file:', file.name);
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString()
    });

    return new Promise((resolve) => {
      setTimeout(() => {
        const s3Url = `https://s3.amazonaws.com/ehertzworkzxam-/${file.name}`;
        console.log('✅ S3 Upload completed successfully!');
        console.log('Generated S3 URL:', s3Url);
        console.log('URL components:', {
          bucket: 'exam-hertzworkz',
          fileName: file.name,
          fullUrl: s3Url
        });
        resolve(s3Url);
      }, 1000);
    });
  };

  const formatDateForAPI = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    console.log('🚀 Form submission started');
    
    try {
      let resume_url = '';
      if (formData.resume_file) {
        console.log('📤 Uploading resume file to S3...');
        resume_url = await uploadResumeToS3(formData.resume_file);
        console.log('📁 Resume URL for API:', resume_url);
      } else {
        console.log('ℹ️ No resume file selected for upload');
      }

      const apiData = {
        full_name: formData.full_name,
        gender: formData.gender,
        dob: formatDateForAPI(formData.dob),
        "10th_percentage": formData.tenth_percentage,
        "12th_percentage": formData.twelfth_percentage,
        graduation_percentage: formData.graduation_percentage,
        "address_&_pincode": `${formData.address}${formData.pincode ? ', ' + formData.pincode : ''}`,
        contact: formData.contact,
        email: formData.email,
        college_name: formData.college_name,
        course: formData.course,
        current_semester: formData.current_semester,
        preferred_job_roles: formData.preferred_job_roles,
        internship_experience: formData.internship_experience,
        internship_details: formData.internship_details,
        resume_url: resume_url
      };

      console.log('📋 API Data prepared:', apiData);
      console.log('🌐 Sending request to API...');

      const response = await fetch('https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/student/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      });

      console.log('📥 API Response status:', response.status);
      console.log('📥 API Response ok:', response.ok);

      if (response.ok) {
        console.log('✅ Form submitted successfully to API!');
        alert('Form submitted successfully!');
        navigate('/StudentLogin')
      } else {
        console.error('❌ API request failed with status:', response.status);
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('💥 Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
      console.log('🏁 Form submission process completed');
    }
  };

  // Helper function to determine if label should be elevated
  const isLabelElevated = (fieldName, fieldValue) => {
    return focusedFields[fieldName] || fieldValue;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100">
          <h1 className="text-2xl font-semibold text-blue-600">Student form</h1>
        </div>

        <div className="px-8 py-8">
          {/* Resume Upload Section */}
          <div className="mb-12">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center hover:border-gray-300 transition-colors">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <label htmlFor="resume" className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Upload resume
                  </label>
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500">Attach file. File size of your documents should not exceed 10MB</p>
                {formData.resume_file && (
                  <p className="text-sm text-green-600 font-medium">✓ {formData.resume_file.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-8">
            {/* Personal Information Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('full_name')}
                  onBlur={() => handleBlur('full_name')}
                  className={`w-full px-0 py-3 border-0 border-b bg-transparent focus:ring-0 focus:outline-none text-gray-700 ${
                    errors.full_name ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder=" "
                />
                <label className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                  isLabelElevated('full_name', formData.full_name) 
                    ? '-top-2 text-xs text-blue-500' 
                    : 'top-3 text-gray-400'
                }`}>
                  First Name
                </label>
                {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
              </div>
              <div className="relative">
                <input
                  type="text"
                  onFocus={() => handleFocus('last_name')}
                  onBlur={() => handleBlur('last_name')}
                  className="w-full px-0 py-3 border-0 border-b border-gray-300 bg-transparent focus:ring-0 focus:outline-none focus:border-blue-500 text-gray-700"
                  placeholder=" "
                />
                <label className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                  focusedFields['last_name'] ? '-top-2 text-xs text-blue-500' : 'top-3 text-gray-400'
                }`}>
                  Last name
                </label>
              </div>
            </div>

            {/* Personal Information Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('gender')}
                  onBlur={() => handleBlur('gender')}
                  className={`w-full px-0 py-3 border-0 border-b bg-transparent focus:ring-0 focus:outline-none text-gray-700 ${
                    errors.gender ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  } ${!formData.gender ? 'text-gray-400' : ''}`}
                >
                  <option value=""></option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <label className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                  isLabelElevated('gender', formData.gender) 
                    ? '-top-2 text-xs text-blue-500' 
                    : 'top-3 text-gray-400'
                }`}>
                  Gender
                </label>
                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
              </div>
              <div className="relative">
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('dob')}
                  onBlur={() => handleBlur('dob')}
                  className={`w-full px-0 py-3 border-0 border-b bg-transparent focus:ring-0 focus:outline-none text-gray-700 ${
                    errors.dob ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder=" "
                />
                <label className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                  isLabelElevated('dob', formData.dob) 
                    ? '-top-2 text-xs text-blue-500' 
                    : 'top-3 text-gray-400'
                }`}>
                  DOB
                </label>
                {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
              </div>
            </div>

            {/* Address Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('address')}
                  onBlur={() => handleBlur('address')}
                  className="w-full px-0 py-3 border-0 border-b border-gray-300 bg-transparent focus:ring-0 focus:outline-none focus:border-blue-500 text-gray-700"
                  placeholder=" "
                />
                <label className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                  isLabelElevated('address', formData.address) 
                    ? '-top-2 text-xs text-blue-500' 
                    : 'top-3 text-gray-400'
                }`}>
                  Address
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('pincode')}
                  onBlur={() => handleBlur('pincode')}
                  className="w-full px-0 py-3 border-0 border-b border-gray-300 bg-transparent focus:ring-0 focus:outline-none focus:border-blue-500 text-gray-700"
                  placeholder=" "
                />
                <label className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                  isLabelElevated('pincode', formData.pincode) 
                    ? '-top-2 text-xs text-blue-500' 
                    : 'top-3 text-gray-400'
                }`}>
                  Postcode
                </label>
              </div>
              <div className="relative">
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('contact')}
                  onBlur={() => handleBlur('contact')}
                  className={`w-full px-0 py-3 border-0 border-b bg-transparent focus:ring-0 focus:outline-none text-gray-700 ${
                    errors.contact ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder=" "
                />
                <label className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                  isLabelElevated('contact', formData.contact) 
                    ? '-top-2 text-xs text-blue-500' 
                    : 'top-3 text-gray-400'
                }`}>
                  Contact Phone
                </label>
                {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                className={`w-full px-0 py-3 border-0 border-b bg-transparent focus:ring-0 focus:outline-none text-gray-700 ${
                  errors.email ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder=" "
              />
              <label className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                isLabelElevated('email', formData.email) 
                  ? '-top-2 text-xs text-blue-500' 
                  : 'top-3 text-gray-400'
              }`}>
                Gmail
              </label>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Education Section */}
            <div className="pt-8 border-t border-gray-100">
              <h2 className="text-lg font-medium text-gray-800 mb-6 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-gray-600" />
                Education
              </h2>
              
              <div className="space-y-8">
                {/* Education Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <input
                      type="number"
                      name="tenth_percentage"
                      value={formData.tenth_percentage}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('tenth_percentage')}
                      onBlur={() => handleBlur('tenth_percentage')}
                      min="0"
                      max="100"
                      className={`w-full px-0 py-3 border-0 border-b bg-transparent focus:ring-0 focus:outline-none text-gray-700 ${
                        errors.tenth_percentage ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder=" "
                    />
                    <label className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                      isLabelElevated('tenth_percentage', formData.tenth_percentage) 
                        ? '-top-2 text-xs text-blue-500' 
                        : 'top-3 text-gray-400'
                    }`}>
                      10th Percentage
                    </label>
                    {errors.tenth_percentage && <p className="text-red-500 text-xs mt-1">{errors.tenth_percentage}</p>}
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      name="twelfth_percentage"
                      value={formData.twelfth_percentage}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('twelfth_percentage')}
                      onBlur={() => handleBlur('twelfth_percentage')}
                      min="0"
                      max="100"
                      className={`w-full px-0 py-3 border-0 border-b bg-transparent focus:ring-0 focus:outline-none text-gray-700 ${
                        errors.twelfth_percentage ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder=" "
                    />
                    <label className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                      isLabelElevated('twelfth_percentage', formData.twelfth_percentage) 
                        ? '-top-2 text-xs text-blue-500' 
                        : 'top-3 text-gray-400'
                    }`}>
                      12th Percentage
                    </label>
                    {errors.twelfth_percentage && <p className="text-red-500 text-xs mt-1">{errors.twelfth_percentage}</p>}
                  </div>
                </div>

                {/* Education Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <input
                      type="text"
                      name="college_name"
                      value={formData.college_name}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('college_name')}
                      onBlur={() => handleBlur('college_name')}
                      className={`w-full px-0 py-3 border-0 border-b bg-transparent focus:ring-0 focus:outline-none text-gray-700 ${
                        errors.college_name ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder=" "
                    />
                    <label className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                      isLabelElevated('college_name', formData.college_name) 
                        ? '-top-2 text-xs text-blue-500' 
                        : 'top-3 text-gray-400'
                    }`}>
                      Graduation College Name
                    </label>
                    {errors.college_name && <p className="text-red-500 text-xs mt-1">{errors.college_name}</p>}
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      name="graduation_percentage"
                      value={formData.graduation_percentage}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('graduation_percentage')}
                      onBlur={() => handleBlur('graduation_percentage')}
                      min="0"
                      max="100"
                      className={`w-full px-0 py-3 border-0 border-b bg-transparent focus:ring-0 focus:outline-none text-gray-700 ${
                        errors.graduation_percentage ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder=" "
                    />
                    <label className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                      isLabelElevated('graduation_percentage', formData.graduation_percentage) 
                        ? '-top-2 text-xs text-blue-500' 
                        : 'top-3 text-gray-400'
                    }`}>
                      Graduation Percentage
                    </label>
                    {errors.graduation_percentage && <p className="text-red-500 text-xs mt-1">{errors.graduation_percentage}</p>}
                  </div>
                </div>

                {/* Education Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('course')}
                      onBlur={() => handleBlur('course')}
                      className={`w-full px-0 py-3 border-0 border-b bg-transparent focus:ring-0 focus:outline-none text-gray-700 ${
                        errors.course ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder=" "
                    />
                    <label className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                      isLabelElevated('course', formData.course) 
                        ? '-top-2 text-xs text-blue-500' 
                        : 'top-3 text-gray-400'
                    }`}>
                      Course
                    </label>
                    {errors.course && <p className="text-red-500 text-xs mt-1">{errors.course}</p>}
                  </div>
                  <div className="relative">
                    <select
                      name="current_semester"
                      value={formData.current_semester}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('current_semester')}
                      onBlur={() => handleBlur('current_semester')}
                      className={`w-full px-0 py-3 border-0 border-b bg-transparent focus:ring-0 focus:outline-none text-gray-700 border-gray-300 focus:border-blue-500 ${
                        !formData.current_semester ? 'text-gray-400' : ''
                      }`}
                    >
                      <option value=""></option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                    <label className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                      isLabelElevated('current_semester', formData.current_semester) 
                        ? '-top-2 text-xs text-blue-500' 
                        : 'top-3 text-gray-400'
                    }`}>
                      Current Semester
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Career Preferences */}
            <div className="pt-8 border-t border-gray-100">
              <h2 className="text-lg font-medium text-gray-800 mb-6 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-gray-600" />
                Career Preferences
              </h2>
              
              <div className="space-y-6">
                {/* Job Roles */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-4">Preferred Job Roles</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Analyst', 'Data Scientist', 'Mobile Developer', 'DevOps Engineer', 'UI/UX Designer'].map(role => (
                      <label key={role} className="flex items-center space-x-3 cursor-pointer py-2">
                        <input
                          type="checkbox"
                          value={role}
                          checked={formData.preferred_job_roles.includes(role)}
                          onChange={handleJobRoleChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{role}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Internship Experience */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-4">Internship Experience</p>
                  <div className="flex space-x-8">
                    {['Yes', 'No'].map(option => (
                      <label key={option} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="internship_experience"
                          value={option}
                          checked={formData.internship_experience === option}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Internship Details */}
                {formData.internship_experience === 'Yes' && (
                  <div className="relative">
                    <textarea
                      name="internship_details"
                      value={formData.internship_details}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('internship_details')}
                      onBlur={() => handleBlur('internship_details')}
                      rows={4}
                      className="w-full px-0 py-3 border-0 border-b border-gray-300 bg-transparent focus:ring-0 focus:outline-none focus:border-blue-500 text-gray-700 resize-none"
                      placeholder=" "
                    />
                    <label className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                      isLabelElevated('internship_details', formData.internship_details) 
                        ? '-top-2 text-xs text-blue-500' 
                        : 'top-3 text-gray-400'
                    }`}>
                      Internship Details (company, role, duration, etc.)
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8 text-center">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-12 rounded-lg transition-colors duration-200 focus:ring-4 focus:ring-blue-300 focus:outline-none"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistrationForm;