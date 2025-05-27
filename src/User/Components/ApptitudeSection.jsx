import React, { useState, useEffect, useRef } from 'react';
import { Camera, Flag, Clock, User } from 'lucide-react';

const AptitudeTest = ({ onNavigateToCoding }) => {
    // Mock questions data
    const mockQuestions = [
        {
            id: 1,
            text: "Eesha Works For ISRO Where She Is Involved In A Mission To Intercept A Comet That Is Likely To Collide With In 1 Month.She Is Developing A C Program To Calculate The Trajectory Of The Missile To Be Launched To Intercept And Destroying The Approaching Comet.She Wants To Order To Achieve Highest Accuracy Of The Missile Trajectory What Data Type Should She Use For The Variables In Her Equation??",
            options: ["Double", "Float", "Long int", "Int"]
        },
        {
            id: 2,
            text: "What is the time complexity of binary search algorithm?",
            options: ["O(n)", "O(log n)", "O(n²)", "O(1)"]
        },
        {
            id: 3,
            text: "What is the output of 3 + 2 * 4 in most programming languages?",
            options: ["20", "11", "14", "9"]
        },
        {
            id: 4,
            text: "What does SQL stand for?",
            options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "System Query Language"]
        },
        {
            id: 5,
            text: "Which of the following is not a programming paradigm?",
            options: ["Object-Oriented", "Functional", "Procedural", "Algorithmic"]
        },
        {
            id: 6,
            text: "Which data structure follows LIFO principle?",
            options: ["Queue", "Stack", "Array", "Linked List"]
        },
        {
            id: 7,
            text: "Which protocol is used for secure web communication?",
            options: ["HTTP", "HTTPS", "FTP", "SMTP"]
        },
        {
            id: 8,
            text: "What is the primary purpose of a database index?",
            options: ["Data storage", "Query optimization", "Data security", "Data backup"]
        },
        {
            id: 9,
            text: "Which sorting algorithm has the best average-case time complexity?",
            options: ["Bubble Sort", "Selection Sort", "Quick Sort", "Insertion Sort"]
        },
        {
            id: 10,
            text: "What does API stand for?",
            options: ["Application Programming Interface", "Advanced Programming Interface", "Automatic Programming Interface", "Applied Programming Interface"]
        }
    ];

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
    const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
    const [cameraStream, setCameraStream] = useState(null);
    const videoRef = useRef(null);

    // Timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Auto-submit when time runs out
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Camera setup
    useEffect(() => {
        const setupCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 200, height: 150 },
                    audio: false
                });
                setCameraStream(stream);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
            }
        };

        setupCamera();

        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = (optionIndex) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion]: optionIndex
        }));
    };

    const handleFlag = () => {
        setFlaggedQuestions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(currentQuestion)) {
                newSet.delete(currentQuestion);
            } else {
                newSet.add(currentQuestion);
            }
            return newSet;
        });
    };

    const handleNext = () => {
        if (currentQuestion < mockQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const handleQuestionNavigation = (questionIndex) => {
        setCurrentQuestion(questionIndex);
    };

    const handleSubmit = () => {
        const unansweredCount = mockQuestions.length - Object.keys(answers).length;
        
        if (unansweredCount > 0) {
            const confirmSubmit = window.confirm(
                `You have ${unansweredCount} unanswered questions. Are you sure you want to proceed to the coding section?`
            );
            if (!confirmSubmit) return;
        }

        // Store aptitude test results (in a real app, you'd send to server)
        const testResults = {
            aptitudeAnswers: answers,
            answeredCount: Object.keys(answers).length,
            totalQuestions: mockQuestions.length,
            completedAt: new Date().toISOString()
        };
        
        console.log('Aptitude test completed:', testResults);
        
        // Show completion message and navigate to coding section
        alert(`Aptitude section completed! You answered ${Object.keys(answers).length} out of ${mockQuestions.length} questions. Proceeding to coding section...`);
        
       
        if (onNavigateToCoding) {
            onNavigateToCoding();
        }
    };

    const getQuestionStatus = (index) => {
        if (flaggedQuestions.has(index)) return 'flagged';
        if (answers.hasOwnProperty(index)) return 'answered';
        return 'not-answered';
    };

    const getAnsweredCount = () => {
        return Object.keys(answers).length;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-blue-500 text-white p-4">
                <h1 className="text-2xl font-bold">Aptitude Test</h1>
            </div>

            <div className="flex">
                {/* Main Content */}
                <div className="flex-1 p-6">
                    {/* Question Section */}
                    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                        <div className="mb-6 flex flex-row items-start space-x-2">
                            <span className="text-sm font-medium text-gray-600 mt-1">
                                {currentQuestion + 1}.
                            </span>
                            <p className="text-gray-800 leading-relaxed">
                                {mockQuestions[currentQuestion].text}
                            </p>
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            {mockQuestions[currentQuestion].options.map((option, index) => (
                                <label key={index} className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="answer"
                                        value={index}
                                        checked={answers[currentQuestion] === index}
                                        onChange={() => handleAnswerSelect(index)}
                                        className="w-4 h-4 text-blue-500"
                                    />
                                    <span className="text-gray-700">{option}</span>
                                </label>
                            ))}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-end gap-3 mt-8">
                            <div>
                                {currentQuestion > 0 && (
                                    <button
                                        onClick={handlePrevious}
                                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                                    >
                                        Previous
                                    </button>
                                )}
                            </div>

                            <div className="space-x-3">
                                <button
                                    onClick={handleFlag}
                                    className={`px-6 py-2 rounded-md transition-colors ${flaggedQuestions.has(currentQuestion)
                                            ? 'bg-yellow-400 text-gray-800'
                                            : 'bg-yellow-300 text-gray-700 hover:bg-yellow-400'
                                        }`}
                                >
                                    <Flag className="inline w-4 h-4 mr-1" />
                                    Flag
                                </button>

                                {currentQuestion < mockQuestions.length - 1 && (
                                    <button
                                        onClick={handleNext}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-80 p-6 bg-white border-l">
                    {/* Timer */}
                    <div className="mb-6">
                        <div className="text-sm text-gray-600 mb-1">Time to complete</div>
                        <div className="text-2xl font-bold text-orange-500">
                            {formatTime(timeLeft)} / 05:00
                        </div>
                    </div>

                    {/* Question Status */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-4 text-xs mb-3">
                            <div className="flex items-center space-x-1">
                                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                <span>Answer</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="w-3 h-3 bg-gray-300 rounded"></div>
                                <span>Not Answer</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#F3DF2C' }}></div>
                                <span>Flag</span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <span className="text-sm font-medium">Questions</span>
                        </div>

                        {/* Question Grid */}
                        <div className="grid grid-cols-5 gap-2 mb-4">
                            {mockQuestions.map((_, index) => {
                                const status = getQuestionStatus(index);
                                let bgColor = 'bg-gray-300';

                                if (status === 'answered') bgColor = 'bg-blue-500';
                                else if (status === 'flagged') bgColor = 'bg-yellow-400';

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleQuestionNavigation(index)}
                                        className={`w-10 h-10 rounded text-sm font-medium transition-colors ${bgColor} ${currentQuestion === index ? 'ring-2 ring-blue-700' : ''
                                            } ${status === 'answered' ? 'text-white' : 'text-gray-700'}`}
                                    >
                                        {index + 1}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Progress Summary */}
                        <div className="text-sm text-gray-600 mb-4">
                            Answered: {getAnsweredCount()} / {mockQuestions.length}
                        </div>
                    </div>

                    {/* Camera Feed */}
                    <div className="bg-gray-100 rounded-lg">
                        <div className="relative">
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-32 bg-gray-200 rounded object-cover"
                            />
                        </div>
                    </div>

                    {/* Next Section Button - Only show on last question */}
                    {currentQuestion === mockQuestions.length - 1 && (
                        <button
                            onClick={handleSubmit}
                            className="w-full px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium text-center mt-4"
                        >
                            Next Section (Coding)
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AptitudeTest;