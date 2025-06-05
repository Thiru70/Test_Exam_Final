import React, { useState, useEffect, useRef } from 'react';
import { Camera, Flag, Clock, User, Loader2, Maximize, AlertTriangle } from 'lucide-react';

const AptitudeTest = ({ onNavigateToCoding }) => {
    const BASE_URL = 'https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev';
    const TEST_ID = '01JW63VR696G45BTB5MNGX85G3';
    const USER_ID = 'user123';

    const [questions, setQuestions] = useState([]);
    const [testDuration, setTestDuration] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
    const [timeLeft, setTimeLeft] = useState(null);
    const [cameraStream, setCameraStream] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showFullScreenPrompt, setShowFullScreenPrompt] = useState(false);
    const [testStarted, setTestStarted] = useState(false);
    const [violationCount, setViolationCount] = useState(0);
    const [showViolationWarning, setShowViolationWarning] = useState(false);
    
    const videoRef = useRef(null);

    // Security event handlers
    const preventCopy = (e) => { e.preventDefault(); return false; };
    const preventKeyboardShortcuts = (e) => {
        if ((e.ctrlKey && ['c','a','s','p','u'].includes(e.key)) || e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key))) {
            e.preventDefault();
            return false;
        }
    };

    // Copy protection
    useEffect(() => {
        if (testStarted) {
            const events = [
                ['copy', preventCopy], ['contextmenu', preventCopy], 
                ['keydown', preventKeyboardShortcuts], ['selectstart', preventCopy], 
                ['dragstart', preventCopy]
            ];
            events.forEach(([event, handler]) => document.addEventListener(event, handler));
            Object.assign(document.body.style, { 
                userSelect: 'none', webkitUserSelect: 'none', 
                mozUserSelect: 'none', msUserSelect: 'none' 
            });
            return () => {
                events.forEach(([event, handler]) => document.removeEventListener(event, handler));
                Object.assign(document.body.style, { 
                    userSelect: '', webkitUserSelect: '', mozUserSelect: '', msUserSelect: '' 
                });
            };
        }
    }, [testStarted]);

    // Full screen and security management
    useEffect(() => {
        const handleFullScreenChange = () => {
            const isCurrentlyFullScreen = !!(document.fullscreenElement || document.webkitFullscreenElement || 
                document.mozFullScreenElement || document.msFullscreenElement);
            setIsFullScreen(isCurrentlyFullScreen);
            
            if (!isCurrentlyFullScreen && testStarted && timeLeft > 0) {
                setViolationCount(prev => prev + 1);
                setShowViolationWarning(true);
                if (violationCount >= 2) {
                    alert('Test terminated due to multiple violations.');
                    handleSubmit();
                } else {
                    setTimeout(() => {
                        setShowViolationWarning(false);
                        requestFullScreen();
                    }, 2000);
                }
            }
        };

        const handleBeforeUnload = (e) => {
            if (testStarted && timeLeft > 0) {
                e.preventDefault();
                e.returnValue = 'Are you sure you want to leave the test?';
                return e.returnValue;
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden && testStarted && timeLeft > 0) {
                setViolationCount(prev => prev + 1);
                setShowViolationWarning(true);
            }
        };

        const events = [
            ['fullscreenchange', handleFullScreenChange], ['webkitfullscreenchange', handleFullScreenChange],
            ['mozfullscreenchange', handleFullScreenChange], ['MSFullscreenChange', handleFullScreenChange],
            ['visibilitychange', handleVisibilityChange]
        ];
        events.forEach(([event, handler]) => document.addEventListener(event, handler));
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            events.forEach(([event, handler]) => document.removeEventListener(event, handler));
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [testStarted, timeLeft, violationCount]);

    const requestFullScreen = () => {
        const element = document.documentElement;
        const methods = ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen'];
        methods.find(method => element[method] && element[method]());
    };

    const startTest = () => {
        setShowFullScreenPrompt(false);
        setTestStarted(true);
        requestFullScreen();
    };

    // Fetch questions from API
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${BASE_URL}/user-test/${TEST_ID}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                
                const data = await response.json();
                if (data.questions && Array.isArray(data.questions)) {
                    setQuestions(data.questions.map((q, index) => ({ ...q, id: index + 1 })));
                    if (data.duration) {
                        const durationInSeconds = parseInt(data.duration) * 60;
                        setTestDuration(durationInSeconds);
                        setTimeLeft(durationInSeconds);
                    }
                    setShowFullScreenPrompt(true);
                } else {
                    throw new Error('Invalid API response structure');
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching questions:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    // Timer effect
    useEffect(() => {
        if (loading || !questions.length || timeLeft === null || !testStarted) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [loading, questions.length, timeLeft, testStarted]);

    // Camera setup
    useEffect(() => {
        if (testStarted) {
            navigator.mediaDevices.getUserMedia({ video: { width: 200, height: 150 }, audio: false })
                .then(stream => {
                    setCameraStream(stream);
                    if (videoRef.current) videoRef.current.srcObject = stream;
                })
                .catch(error => console.error('Error accessing camera:', error));
        }
        return () => cameraStream?.getTracks().forEach(track => track.stop());
    }, [testStarted]);

    const formatTime = (seconds) => {
        if (seconds === null) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getDifficultyColor = (difficulty) => {
        const colors = {
            easy: 'text-green-600 bg-green-100',
            medium: 'text-yellow-600 bg-yellow-100',
            hard: 'text-red-600 bg-red-100'
        };
        return colors[difficulty?.toLowerCase()] || 'text-gray-600 bg-gray-100';
    };

    const handleAnswerSelect = (optionIndex) => {
        if (!testStarted) return;
        setAnswers(prev => ({ ...prev, [currentQuestion]: optionIndex }));
    };

    const handleFlag = () => {
        if (!testStarted) return;
        setFlaggedQuestions(prev => {
            const newSet = new Set(prev);
            newSet.has(currentQuestion) ? newSet.delete(currentQuestion) : newSet.add(currentQuestion);
            return newSet;
        });
    };

    const navigate = (direction) => {
        if (!testStarted) return;
        if (direction === 'next' && currentQuestion < questions.length - 1) setCurrentQuestion(prev => prev + 1);
        if (direction === 'prev' && currentQuestion > 0) setCurrentQuestion(prev => prev - 1);
    };

    const handleSubmit = async () => {
        const unansweredCount = questions.length - Object.keys(answers).length;
        if (unansweredCount > 0 && timeLeft > 0) {
            if (!window.confirm(`You have ${unansweredCount} unanswered questions. Continue?`)) return;
        }

        setSubmitting(true);
        try {
            const formattedAnswers = Object.entries(answers).map(([questionIndex, selectedOptionIndex]) => ({
                question: questions[parseInt(questionIndex)].question,
                selectedOption: questions[parseInt(questionIndex)].options[selectedOptionIndex]
            }));

            const response = await fetch(`${BASE_URL}/user-test/${TEST_ID}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: USER_ID, answers: formattedAnswers })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const result = await response.json();
            console.log('✅ Submission successful!', result);
            
            // Exit full screen
            const exitMethods = ['exitFullscreen', 'webkitExitFullscreen', 'mozCancelFullScreen', 'msExitFullscreen'];
            exitMethods.find(method => document[method] && document[method]());
            
            alert(`Aptitude section completed! ${Object.keys(answers).length}/${questions.length} answered. Proceeding to coding...`);
            onNavigateToCoding?.();
        } catch (err) {
            console.error('❌ Error submitting:', err);
            alert(`Error: ${err.message}. Please try again.`);
        } finally {
            setSubmitting(false);
        }
    };

    const getQuestionStatus = (index) => {
        if (flaggedQuestions.has(index)) return 'flagged';
        if (answers.hasOwnProperty(index)) return 'answered';
        return 'not-answered';
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                    <p className="text-gray-600">Loading questions...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !questions.length) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-sm max-w-md">
                    <p className="text-red-600 mb-4">Error loading questions: {error}</p>
                    <button onClick={() => window.location.reload()} 
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Full screen prompt
    if (showFullScreenPrompt) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
                    <Maximize className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                    <h2 className="text-xl font-bold mb-4">Test Security Notice</h2>
                    <p className="text-gray-600 mb-6">
                        This test must be taken in full-screen mode. You cannot copy/paste, navigate away, or use developer tools.
                    </p>
                    <button onClick={startTest} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
                        Start Test in Full Screen
                    </button>
                </div>
            </div>
        );
    }

    // Violation warning
    if (showViolationWarning) {
        return (
            <div className="fixed inset-0 bg-red-500 bg-opacity-90 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                    <h2 className="text-xl font-bold mb-4 text-red-600">Security Violation Detected!</h2>
                    <p className="text-gray-700 mb-4">
                        Violation #{violationCount}: You exited full-screen mode or switched tabs.
                        <br /><strong>Warning: {3 - violationCount} violations remaining.</strong>
                    </p>
                    <p className="text-sm text-gray-500">Returning to full-screen mode automatically...</p>
                </div>
            </div>
        );
    }

    if (!testStarted) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-600">Please start the test to continue...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white select-none">
            {/* Header */}
            <div className="bg-blue-500 text-white p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Aptitude Test</h1>
                    <div className="flex items-center space-x-4">
                        {violationCount > 0 && (
                            <span className="text-yellow-200 text-sm">Violations: {violationCount}/3</span>
                        )}
                        <span className="text-sm">{isFullScreen ? '🔒 Secure Mode' : '⚠️ Not Secure'}</span>
                    </div>
                </div>
                {error && <p className="text-yellow-200 text-sm mt-1">Using fallback questions due to API error</p>}
            </div>

            <div className="flex">
                {/* Main Content */}
                <div className="flex-1 p-6 bg-white">
                    <div className="rounded-lg p-6 mb-6 shadow-sm" style={{ backgroundColor: '#F1F3F9' }}>
                        {/* Question Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-start space-x-2">
                                <span className="text-sm font-medium text-gray-600 mt-1">{currentQuestion + 1}.</span>
                                <p className="text-gray-800 leading-relaxed mb-2 select-none">
                                    {questions[currentQuestion]?.question}
                                </p>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(questions[currentQuestion]?.difficulty)}`}>
                                    {questions[currentQuestion]?.difficulty?.toUpperCase() || 'UNKNOWN'}
                                </span>
                                <span className="text-xs text-gray-500">{questions[currentQuestion]?.marks || '0'} marks</span>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            {questions[currentQuestion]?.options?.map((option, index) => (
                                <label key={index} className="flex items-center space-x-3 cursor-pointer select-none">
                                    <input type="radio" name="answer" value={index}
                                           checked={answers[currentQuestion] === index}
                                           onChange={() => handleAnswerSelect(index)}
                                           className="w-4 h-4 text-blue-500" />
                                    <span className="text-gray-700 select-none">{option}</span>
                                </label>
                            ))}
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-end gap-3 mt-8">
                            {currentQuestion > 0 && (
                                <button onClick={() => navigate('prev')} disabled={submitting}
                                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                                    Previous
                                </button>
                            )}
                            <button onClick={handleFlag} disabled={submitting}
                                    className={`px-6 py-2 rounded-md ${flaggedQuestions.has(currentQuestion) 
                                        ? 'bg-yellow-400 text-gray-800' : 'bg-yellow-300 text-gray-700 hover:bg-yellow-400'}`}>
                                <Flag className="inline w-4 h-4 mr-1" />Flag
                            </button>
                            {currentQuestion < questions.length - 1 && (
                                <button onClick={() => navigate('next')} disabled={submitting}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-80 p-6 mt-3 mr-3" style={{ backgroundColor: '#F1F3F9' }}>
                    {/* Timer */}
                    <div className="mb-6 text-center">
                        <div className="text-sm text-gray-600 mb-1">Time to complete</div>
                        <div className="text-2xl font-bold text-orange-500">
                            {formatTime(timeLeft)} / {formatTime(testDuration)}
                        </div>
                    </div>

                    {/* Question Status Legend */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-4 text-xs mb-3">
                            {[
                                ['bg-blue-500', 'Answer'],
                                ['bg-gray-300', 'Not Answer'],
                                ['bg-yellow-400', 'Flag']
                            ].map(([color, label]) => (
                                <div key={label} className="flex items-center space-x-1">
                                    <div className={`w-3 h-3 ${color} rounded`}></div>
                                    <span>{label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mb-4">
                            <span className="text-sm font-medium">Questions</span>
                        </div>

                        {/* Question Grid */}
                        <div className="grid grid-cols-5 gap-2 mb-4">
                            {questions.map((_, index) => {
                                const status = getQuestionStatus(index);
                                const bgColor = status === 'answered' ? 'bg-blue-500' : 
                                               status === 'flagged' ? 'bg-yellow-400' : 'bg-gray-300';
                                return (
                                    <button key={index} onClick={() => setCurrentQuestion(index)} disabled={submitting}
                                            className={`w-10 h-10 rounded text-sm font-medium ${bgColor} 
                                                ${currentQuestion === index ? 'ring-2 ring-blue-700' : ''}
                                                ${status === 'answered' ? 'text-white' : 'text-gray-700'}`}>
                                        {index + 1}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="text-sm text-gray-600 mb-4">
                            Answered: {Object.keys(answers).length} / {questions.length}
                        </div>
                    </div>

                    {/* Camera Feed */}
                    <div className="bg-gray-100 rounded-lg mb-4">
                        <video ref={videoRef} autoPlay muted playsInline 
                               className="w-full h-48 bg-gray-200 rounded object-cover" />
                    </div>

                    {/* Submit Button */}
                    <button onClick={handleSubmit} disabled={submitting}
                            className="w-full px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 
                                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                        {submitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Submitting...
                            </>
                        ) : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AptitudeTest;