import React, { useState, useEffect } from "react";
import { User, GraduationCap, Briefcase, FileText, Edit3, Save, X, Upload, Trash2 } from "lucide-react";

import Toast from "./ToastComponent"

const ProfileInformation = ({ studentData, setStudentData }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [saving, setSaving] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [toast, setToast] = useState(null);

    // Field configurations for dynamic rendering
    const fieldConfig = {
        personal: [
            { key: 'full_name', label: 'Full Name', type: 'text', editable: true },
            { key: 'student_id', label: 'Student ID', type: 'text', editable: false },
            { key: 'email', label: 'Email', type: 'email', editable: false },
            { key: 'contact', label: 'Phone', type: 'tel', editable: true },
            { key: 'gender', label: 'Gender', type: 'select', editable: true, options: ['Male', 'Female', 'Other'] },
            { key: 'dob', label: 'Date of Birth', type: 'date', editable: false },
            { key: 'address_pincode', label: 'Address & Pincode', type: 'textarea', editable: true, fullWidth: true }
        ],
        educational: [
            { key: 'college_name', label: 'College Name', type: 'text', editable: true },
            { key: 'course', label: 'Course', type: 'text', editable: true },
            { key: 'current_semester', label: 'Current Semester', type: 'text', editable: true },
            { key: 'eligibility_status', label: 'Eligibility Status', type: 'select', editable: true, options: ['Eligible', 'Not Eligible', 'Pending'] },
            { key: '10th_percentage', label: '10th Percentage', type: 'number', editable: true, suffix: '%' },
            { key: '12th_percentage', label: '12th Percentage', type: 'number', editable: true, suffix: '%' },
            { key: 'graduation_percentage', label: 'Graduation Percentage', type: 'number', editable: true, suffix: '%', fullWidth: true }
        ],
        professional: [
            { key: 'preferred_job_roles', label: 'Preferred Job Roles', type: 'textarea', editable: true },
            { key: 'internship_experience', label: 'Internship Experience', type: 'text', editable: true },
            { key: 'internship_details', label: 'Internship Details', type: 'textarea', editable: true }
        ]
    };

    // Fetch student data
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const studentId = localStorage.getItem('student_id');
                if (!studentId) {
                    throw new Error('Student ID not found. Please log in again.');
                }

                setLoading(true);
                const response = await fetch(`https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/student/${studentId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    mode: 'cors',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (!data.student) {
                    throw new Error('Student data not found');
                }

                const studentInfo = data.student;
                const transformedData = {
                    student_id: studentInfo.student_id,
                    full_name: studentInfo.full_name,
                    email: studentInfo.email,
                    contact: studentInfo.contact,
                    gender: studentInfo.gender,
                    dob: studentInfo.dob,
                    address_pincode: studentInfo["address_&_pincode"],
                    college_name: studentInfo.college_name,
                    course: studentInfo.course,
                    current_semester: studentInfo.current_semester,
                    eligibility_status: studentInfo.eligibility_status,
                    "10th_percentage": studentInfo["10th_percentage"],
                    "12th_percentage": studentInfo["12th_percentage"],
                    graduation_percentage: studentInfo.graduation_percentage,
                    preferred_job_roles: studentInfo.preferred_job_roles,
                    internship_experience: studentInfo.internship_experience,
                    internship_details: studentInfo.internship_details,
                    resume_url: studentInfo.resume_url,
                    profile_picture: studentInfo.profile_picture || null,
                    testIds: studentInfo.testIds || []
                };

                setStudentData(transformedData);
                setError(null);
            } catch (err) {
                setError('Failed to load student data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [setStudentData]);

    const handleEditClick = () => {
        setIsEditMode(true);
        setEditedData({ ...studentData });
        setSelectedFile(null);
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const allowedTypes = ['.pdf', '.doc', '.docx'];
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

            if (!allowedTypes.includes(fileExtension)) {
                setToast({ message: 'Please select a valid resume file (PDF, DOC, or DOCX)', type: 'error' });
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setToast({ message: 'File size must be less than 5MB', type: 'error' });
                return;
            }

            setSelectedFile(file);
            setError(null);
        }
    };

    const handleResumeUpload = async () => {
        if (!selectedFile) return;

        setUploadingResume(true);
        try {
            const formData = new FormData();
            formData.append('resume', selectedFile);
            formData.append('student_id', studentData.student_id);

            const response = await fetch('https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/student/upload-resume', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status}`);
            }

            const result = await response.json();
            setEditedData(prev => ({
                ...prev,
                resume_url: result.resume_url || result.url
            }));

            setSelectedFile(null);
            setError(null);
            setToast({ message: 'Resume uploaded successfully!', type: 'success' });

        } catch (err) {
            setToast({ message: 'Failed to upload resume. Please try again.', type: 'error' });
        } finally {
            setUploadingResume(false);
        }
    };

    const handleSaveClick = async () => {
        setSaving(true);
        try {
            const updatePayload = { student_id: studentData.student_id };
            
            const fieldMapping = {
                full_name: 'full_name',
                contact: 'contact',
                gender: 'gender',
                address_pincode: 'address_&_pincode',
                college_name: 'college_name',
                course: 'course',
                current_semester: 'current_semester',
                eligibility_status: 'eligibility_status',
                '10th_percentage': '10th_percentage',
                '12th_percentage': '12th_percentage',
                graduation_percentage: 'graduation_percentage',
                preferred_job_roles: 'preferred_job_roles',
                internship_experience: 'internship_experience',
                internship_details: 'internship_details',
                resume_url: 'resume_url'
            };

            Object.keys(editedData).forEach(field => {
                if (editedData[field] !== undefined && editedData[field] !== studentData[field]) {
                    const apiFieldName = fieldMapping[field] || field;
                    updatePayload[apiFieldName] = editedData[field];
                }
            });

            const response = await fetch('https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/student/edit', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(updatePayload)
            });

            const responseText = await response.text();
            let result;

            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                throw new Error(`Server returned invalid JSON. Status: ${response.status}`);
            }

            if (!response.ok) {
                throw new Error(result.message || result.error || `HTTP error! status: ${response.status}`);
            }

            setStudentData({...studentData, ...editedData});
            setIsEditMode(false);
            setError(null);
            setSelectedFile(null);
            setToast({ message: 'Profile updated successfully!', type: 'success' });

        } catch (err) {
            setToast({ message: 'Failed to update profile. Please try again.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleCancelClick = () => {
        setIsEditMode(false);
        setEditedData({});
        setSelectedFile(null);
        setError(null);
    };

    const handleInputChange = (field, value) => {
        setEditedData(prev => ({ ...prev, [field]: value }));
    };

    // Generic field renderer
    const renderField = (field, isEdit = false) => {
        const value = isEdit ? 
            (editedData[field.key] !== undefined ? editedData[field.key] : studentData[field.key] || '') :
            studentData?.[field.key];

        const displayValue = field.suffix && value ? `${value}${field.suffix}` : value;

        if (!isEdit) {
            return (
                <div className={`mb-4 ${field.fullWidth ? 'md:col-span-2' : ''}`} key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                        {!field.editable && <span className="text-xs text-gray-500 ml-1">(Read Only)</span>}
                    </label>
                    <div className={`text-gray-900 p-3 rounded-md border ${!field.editable ? 'bg-gray-100' : 'bg-gray-50'}`}>
                        {displayValue || <span className="text-gray-400 italic">Not provided</span>}
                    </div>
                </div>
            );
        }

        if (!field.editable) {
            return renderField(field, false);
        }

        const inputProps = {
            className: "w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
            value: value,
            onChange: (e) => handleInputChange(field.key, e.target.value),
            placeholder: `Enter ${field.label.toLowerCase()}`
        };

        return (
            <div className={`mb-4 ${field.fullWidth ? 'md:col-span-2' : ''}`} key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                {field.type === 'textarea' ? (
                    <textarea {...inputProps} rows="3" />
                ) : field.type === 'select' ? (
                    <select {...inputProps}>
                        <option value="">Select {field.label}</option>
                        {field.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                ) : (
                    <input type={field.type} {...inputProps} />
                )}
            </div>
        );
    };

    const renderResumeField = () => {
        const currentResumeUrl = editedData.resume_url || studentData?.resume_url;

        return (
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>

                {currentResumeUrl && (
                    <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center justify-between">
                            <a
                                href={currentResumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-green-600 hover:text-green-800 underline transition-colors"
                            >
                                <FileText className="w-4 h-4 mr-1" />
                                Current Resume
                            </a>
                            <span className="text-xs text-green-600">✓ Uploaded</span>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <div>
                        <input
                            type="file"
                            id="resume-upload"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <label
                            htmlFor="resume-upload"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose New Resume
                        </label>
                        <span className="ml-2 text-xs text-gray-500">(PDF, DOC, DOCX - Max 5MB)</span>
                    </div>

                    {selectedFile && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FileText className="w-4 h-4 mr-2 text-blue-600" />
                                    <span className="text-sm text-blue-800">{selectedFile.name}</span>
                                    <span className="ml-2 text-xs text-blue-600">
                                        ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handleResumeUpload}
                                        disabled={uploadingResume}
                                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {uploadingResume ? (
                                            <>
                                                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin inline-block mr-1"></div>
                                                Uploading...
                                            </>
                                        ) : (
                                            'Upload'
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setSelectedFile(null)}
                                        disabled={uploadingResume}
                                        className="p-1 text-red-600 hover:text-red-800 disabled:text-red-300 transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="bg-blue-500 text-white p-4 rounded-t-lg">
                    <div className="flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        <span className="font-semibold">Profile Information</span>
                    </div>
                </div>
                <div className="p-6 text-center">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-gray-600">Loading profile data...</div>
                </div>
            </div>
        );
    }

    if (error && !studentData) {
        return (
            <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="bg-blue-500 text-white p-4 rounded-t-lg">
                    <div className="flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        <span className="font-semibold">Profile Information</span>
                    </div>
                </div>
                <div className="p-6 text-center">
                    <div className="text-red-600 font-medium mb-2">Error Loading Profile</div>
                    <div className="text-gray-600 mb-4">{error}</div>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Toast Notification */}
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}

            <div className="bg-white rounded-lg shadow-sm mb-6">
                {/* Header */}
                <div className="bg-blue-500 text-white p-4 rounded-t-lg flex items-center justify-between sticky top-0 z-10">
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
                                    className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm flex items-center transition-colors"
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
                                    className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm flex items-center transition-colors"
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
                <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            <strong className="font-bold">Error: </strong>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-8">
                        {/* Personal Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-6 flex items-center border-b pb-2">
                                <User className="w-5 h-5 mr-2 text-blue-500" />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {fieldConfig.personal.map(field => renderField(field, isEditMode))}
                            </div>
                        </div>

                        {/* Educational Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-6 flex items-center border-b pb-2">
                                <GraduationCap className="w-5 h-5 mr-2 text-green-500" />
                                Educational Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {fieldConfig.educational.map(field => renderField(field, isEditMode))}
                            </div>
                        </div>

                        {/* Professional Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-6 flex items-center border-b pb-2">
                                <Briefcase className="w-5 h-5 mr-2 text-purple-500" />
                                Professional Information
                            </h3>
                            <div className="space-y-6">
                                {fieldConfig.professional.map(field => renderField(field, isEditMode))}
                                {isEditMode ? renderResumeField() : (
                                    studentData?.resume_url && (
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
                                            <a
                                                href={studentData.resume_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-blue-600 hover:text-blue-800 underline transition-colors"
                                            >
                                                <FileText className="w-4 h-4 mr-1" />
                                                View Resume
                                            </a>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileInformation;