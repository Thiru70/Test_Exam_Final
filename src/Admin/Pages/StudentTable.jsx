import React, { useState } from 'react';
import { IoIosMenu } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const studentData = [
    { id: 1, name: 'Floyd Miles', graduation: 70, eligible: true, email: 'michelle.rivera@example.com' },
    { id: 2, name: 'Ronald Richards', graduation: 50, eligible: false, email: 'nathan.roberts@example.com' },
    { id: 3, name: 'Albert Flores', graduation: 60, eligible: true, email: 'debra.holt@example.com' },
    { id: 4, name: 'Leslie Alexander', graduation: 90, eligible: true, email: 'tim.jennings@example.com' },
    { id: 5, name: 'Kristin Watson', graduation: 90, eligible: true, email: 'jackson.graham@example.com' },
    { id: 6, name: 'Floyd Miles', graduation: 80, eligible: true, email: 'sara.cruz@example.com' },
    { id: 7, name: 'Jane Cooper', graduation: 70, eligible: true, email: 'debbie.baker@example.com' },
    { id: 8, name: 'Eleanor Pena', graduation: 80, eligible: true, email: 'jessica.hanson@example.com' },
];

const StudentTable = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const filteredStudents = studentData.filter((student) => {
        if (filter === 'Eligibility') return student.eligible;
        if (filter === 'Non-Eligibility') return !student.eligible;
        if (filter === 'graduation marks') return student.graduation >= 80;
        return true;
    });
    const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentCandidates = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);

    const goToPage = (pageNum) => {
        if (pageNum >= 1 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
        }
    };
    return (
        <>
            <div className='p-2 flex gap-2 justify-end'>
                <button className='bg-[#0BC279] text-white py-2 px-4 rounded-md'>form responses</button>
                <button className='bg-[#0BC279] text-white py-2 px-4 rounded-md'>Create form</button>
            </div>
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Student form</h2>
                    <div className="relative inline-block text-left">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="border px-4 py-2 rounded bg-white shadow-sm flex gap-2"
                        >
                            <IoIosMenu className='mt-1' /> Filter by
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-10">
                                {['Eligibility', 'Non-Eligibility', 'graduation marks', 'All'].map(option => (
                                    <div
                                        key={option}
                                        onClick={() => {
                                            setFilter(option);
                                            setDropdownOpen(false);
                                        }}
                                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <table className="w-full text-sm text-center">
                    <thead className="">
                        <tr className="text-[#718EBF]">
                            <th className="px-4 py-2">SL No</th>
                            <th className="px-4 py-2">Student name</th>
                            <th className="px-4 py-2">Graduation</th>
                            <th className="px-4 py-2">Eligible</th>
                            <th className="px-4 py-2">Gmail</th>
                            <th className="px-4 py-2">Form</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCandidates.map((student, index) => (
                            <tr key={student.id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-2">{String(index + 1).padStart(2, '0')}.</td>
                                <td className="px-4 py-2">{student.name}</td>
                                <td className="px-4 py-2">{student.graduation}%</td>
                                <td className="px-4 py-2">
                                    <span
                                        className={`px-2 py-1 text-white text-xs rounded ${student.eligible ? 'bg-green-600' : 'bg-red-600'
                                            }`}
                                    >
                                        {student.eligible ? 'Eligible' : 'Not Eligible'}
                                    </span>
                                </td>
                                <td className="px-4 py-2">{student.email}</td>
                                <td className="px-4 py-2">
                                    <button className="text-blue-600 border border-blue-600 px-3 py-1 rounded-full hover:bg-blue-600 hover:text-white transition" onClick={() => navigate('/studentEmail-form')} >view</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Page Navigation */}
                <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-gray-600">
                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredStudents.length)} of {filteredStudents.length}
                    </p>
                    <div className="space-x-1">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => goToPage(i + 1)}
                                className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : ''
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentTable;
