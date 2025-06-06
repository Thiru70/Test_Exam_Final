import React, { useState } from 'react';
import { Icon } from '@iconify-icon/react';
import Folder from "../../Asstes/Folder.png";
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const StudentEmailForm = () => {
    const navigate = useNavigate();
    const [emailFormat, setEmailFormat] = useState();
    const [heading, setHeading] = useState('');
    const [description, setDescription] = useState('');
    const [fileName, setFileName] = useState('');
    const [email, setEmail] = useState('');
    const [emails, setEmails] = useState([]);
    const [selectedEmails, setSelectedEmails] = useState({});

    const addEmail = () => {
        if (email && !emails.includes(email)) {
            setEmails([...emails, email]);
            setEmail('');
        }
    };

    const toggleSelect = (email) => {
        setSelectedEmails((prev) => ({
            ...prev,
            [email]: !prev[email],
        }));
    };

    const deleteSelected = () => {
        const filtered = emails.filter((e) => !selectedEmails[e]);
        setEmails(filtered);
        setSelectedEmails({});
    };

    const handleSend = () => {
        const toSend = emails;
        console.log('Sending to:', toSend);
        navigate('/Emailsuccess')
    };
    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        }
    };

    return (
        <div className="p-2">
            <h2 className="text-xl font-semibold">Basic Information</h2>

            <h2 className=" mt-3 text-xl font-semibold">Email Format</h2>
            {/* Email Format Box */}
            <div className="bg-gray-50 border border-gray-300 rounded p-4 relative">

                <textarea
                    value={emailFormat}
                    onChange={(e) => setEmailFormat(e.target.value)}
                    className="w-full h-64 resize-none bg-transparent outline-none text-sm"
                ></textarea>

                <div className="absolute bottom-4 right-4 flex gap-2 text-gray-600">
                    <button >
                        <FaRegEdit className="text-xl hover:text-black" />
                    </button>
                    <button >
                        <Icon icon="mdi:content-save" className="mt-2 text-xl hover:text-black" />
                    </button>
                </div>
            </div>

            {/* Heading Input */}
            <div>
                <label className="block mb-1 font-semibold mt-2">Heading</label>
                <input
                    type="text"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2"
                />
            </div>

            {/* Description Input */}
            <div>
                <label className="block mb-1 font-semibold mt-2">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border bg-gray-50 border-gray-300 rounded px-3 py-2 h-28"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                    Description(optional notes visible only to you)
                </p>
            </div>

            {/* File Upload */}
            <div className='mt-3'>
                <label className="block font-semibold mb-2">Email list</label>
                <label className=" font-semibold mb-2">Import email list from file</label>
                <p className="mb-2 font-semibold">
                    If you have a list of address in the text or csv (*.txt,*csv) format, upload it here:
                </p>

                <div className="border-2 border-dashed border-blue-400 rounded-md max-w-md w-full p-6 text-center">
                    <label className="cursor-pointer flex flex-col items-center space-y-2">
                        <img src={Folder} alt="Upload icon" className="w-10 h-10" />
                        <span className="text-sm text-gray-700">Choose .txt or .csv file</span>
                        <input
                            type="file"
                            accept=".txt,.csv"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>
                    <p className="text-xs mt-2 text-gray-600">OR</p>
                    <button className="mt-2 px-4 py-1 border border-blue-600 text-blue-600 rounded text-sm hover:bg-blue-50" onChange={handleFileChange}>
                        Browse files
                    </button>

                    {fileName && <p className="mt-2 text-sm text-green-600">{fileName} selected</p>}
                </div>
            </div>
            <div>
                <label className="block font-semibold mb-2 mt-2">Add new email</label>
                <p className='test-sm'>Add respondents email addresses</p>
                {/* Email Input */}
                <div className='mb-3'>
                    <label className="block mb-1 font-semibold mt-2">Email Address</label>
                    <div className='flex gap-3'>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className=" max-w-md w-full border border-[#B1B1B1] rounded px-3 py-2"
                        />
                        <button className='border border-[#000000] text-[#525252] px-3 py-2' onClick={addEmail}>+ Add</button>
                    </div>
                </div>
            </div>
            <div>
                {/* Email List */}
                {emails.length > 0 && (
                    <div>
                        <h4 className="font-semibold mt-6 mb-2">Delete selected</h4>
                        <div className="border rounded  max-w-lg w-full">
                            <div className=" px-10 py-2 font-semibold">Email addresses</div>
                            {emails.map((e, index) => (
                                <div
                                    key={e}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700"
                                >
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={!!selectedEmails[e]}
                                        onChange={() => toggleSelect(e)}
                                    />
                                    <span className="w-6">{index + 1}</span>
                                    <span className="ml-4">{e}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={deleteSelected}
                            className="mt-3 text-red-600 border border-red-500 px-4 py-2 mb-2 text-sm"
                        >
                            Delete selected
                        </button>
                    </div>
                )}

                {/* Send Button */}
                <button
                    onClick={handleSend}
                    className="bg-[#0079EA] hover:bg-blue-700 text-white font-medium px-6 py-2 rounded"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default StudentEmailForm;
