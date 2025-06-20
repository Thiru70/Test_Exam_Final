import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Video, Mic, MicOff, Camera, Move, Loader2, Maximize, AlertTriangle } from 'lucide-react';
import SimpleCodeEditor from './MonacoCodeEditer';
import LiveFaceMonitoring from './LiveMonitoring';
import LiveAudioMonitor from './LiveAudioMonitor';
import Toast from './ToastComponent';

const CodingSection = ({ onNavigateToInterview }) => {
  // Core state
  const [testData, setTestData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState([]);

  // Code state management for all questions
  const [questionCodes, setQuestionCodes] = useState({});

  // Test session state
  const [testStartTime, setTestStartTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testReady, setTestReady] = useState(false);
  const [fullscreenViolations, setFullscreenViolations] = useState(0);

  // Copy-paste violation state
  const [copyPasteViolations, setCopyPasteViolations] = useState(0);
  const [showCopyPasteWarning, setShowCopyPasteWarning] = useState(false);
  const [lastViolationTime, setLastViolationTime] = useState(0);

  // Face monitoring violations
  const [faceMonitoringViolations, setFaceMonitoringViolations] = useState(0);
  const [showFaceViolationWarning, setShowFaceViolationWarning] = useState(false);

  //audio monitoring
  const [audioViolations, setAudioViolations] = useState(0);

  // UI state
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showFullscreenPopup, setShowFullscreenPopup] = useState(false);
  const [showViolationWarning, setShowViolationWarning] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [allTestResults, setAllTestResults] = useState({});
  const TEST_ID =  localStorage.getItem('currentTestId');

  // Live face monitoring position - Initialize to bottom-right corner
  const [faceMonitorPosition, setFaceMonitorPosition] = useState({
    x: window.innerWidth - 320, // 320px from right edge (300px width + 20px margin)
    y: window.innerHeight - 240  // 240px from bottom edge (220px height + 20px margin)
  });

  const timerRef = useRef(null);
  const cleanupRef = useRef(null);

  // Update position when window resizes to keep it in bottom-right
  useEffect(() => {
    const handleResize = () => {
      setFaceMonitorPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - 320),
        y: Math.min(prev.y, window.innerHeight - 240)
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showToast = useCallback((message, type = 'info') => {
  const id = Date.now();
  setToasts(prev => [...prev, { id, message, type }]);
}, []);

const removeToast = useCallback((id) => {
  setToasts(prev => prev.filter(toast => toast.id !== id));
}, []);

const handleAudioViolation = useCallback((violation) => {
  const newCount = audioViolations + 1;
  setAudioViolations(newCount);
  
  console.log('Audio violation:', violation);
  
  // Optional: Auto-submit after excessive violations
  if (newCount >= 10) {
    setTimeout(() => handleSubmitTest(true), 2000);
  }
}, [audioViolations]);

  // Test data for SimpleCodeEditor
const getTestSessionData = useCallback(() => ({
  userId: localStorage.getItem('student_id'),
  testId: TEST_ID,
  startTime: testStartTime,
  warningCount: fullscreenViolations,
  copyPasteViolations: copyPasteViolations,
  faceMonitoringViolations: faceMonitoringViolations,
  audioViolations: audioViolations, // Add this line
  timeRemaining,
  totalDuration: testData?.duration * 60 || 0
}), [testStartTime, fullscreenViolations, copyPasteViolations, faceMonitoringViolations, audioViolations, timeRemaining, testData?.duration]);

  // Handle face monitoring violations
  const handleFaceViolation = useCallback((violation) => {
    const newViolationCount = faceMonitoringViolations + 1;
    setFaceMonitoringViolations(newViolationCount);
    setShowFaceViolationWarning(true);

    // Auto-hide warning after 3 seconds
    setTimeout(() => {
      setShowFaceViolationWarning(false);
    }, 3000);

    // Optional: Auto-submit after 5 violations
    if (newViolationCount >= 5) {
      setTimeout(() => handleSubmitTest(true), 2000);
    }

    console.log('Face monitoring violation:', violation);
  }, [faceMonitoringViolations]);

  // Copy-paste violation handler with debouncing
  const handleCopyPasteViolation = useCallback((type) => {
    const currentTime = Date.now();
    const timeSinceLastViolation = currentTime - lastViolationTime;
    
    // Prevent rapid successive violations (debounce for 1 second)
    if (timeSinceLastViolation < 1000) {
      return;
    }
    
    setLastViolationTime(currentTime);
    
    const newViolationCount = copyPasteViolations + 1;
    setCopyPasteViolations(newViolationCount);
    setShowCopyPasteWarning(true);

    console.log(`Copy-paste violation detected: ${type}. Total violations: ${newViolationCount}`);

    // Auto-hide warning after 3 seconds
    setTimeout(() => {
      setShowCopyPasteWarning(false);
    }, 3000);

    // Optional: Auto-submit after 5 violations
    if (newViolationCount >= 5) {
      setTimeout(() => handleSubmitTest(true), 2000);
    }
  }, [copyPasteViolations, lastViolationTime]);

  // Initialize code templates when test data is loaded
  useEffect(() => {
    if (testData?.questions) {
      const initialCodes = {};
      testData.questions.forEach((question, index) => {
        initialCodes[index] = question.codeTemplate || '';
      });
      setQuestionCodes(initialCodes);
    }
  }, [testData]);

  // Handler for code changes
  const handleCodeChange = useCallback((questionIndex, newCode) => {
    setQuestionCodes(prev => ({
      ...prev,
      [questionIndex]: newCode
    }));
  }, []);

  // Fetch test data
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/coding-test/${TEST_ID}`);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setTestData(data);
        setShowFullscreenPopup(true);
      } catch (err) {
        console.error('Error fetching test data:', err);
        setError('Failed to load test data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, []);

  // Initialize test
  const initializeTest = useCallback(() => {
    if (testData?.duration) {
      const durationInSeconds = testData.duration * 60;
      setTimeRemaining(durationInSeconds);
      setTestStartTime(new Date().toISOString());
      setTestReady(true);
    }
  }, [testData?.duration]);

  // Handle test submission
  const handleSubmitTest = useCallback((autoSubmit = false) => {
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Cleanup security restrictions
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    
    // Show success popup
    setShowSuccessPopup(true);
    
    // Navigate after 3 seconds
    setTimeout(() => {
      if (onNavigateToInterview) {
        onNavigateToInterview();
      }
    }, 3000);
  }, [onNavigateToInterview]);

  // Timer effect - simplified and more robust
  useEffect(() => {
    if (testReady && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitTest(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [testReady, handleSubmitTest]);

  // Security restrictions
  const applySecurityRestrictions = useCallback(() => {
    const preventActions = (e) => {
      const restrictedKeys = [
        'F12', 'F5',
        ...(e.ctrlKey ? ['r', 'R', 'w', 'W', 't', 'T', 'n', 'N', 'u', 'U'] : []),
        ...(e.ctrlKey && e.shiftKey ? ['I', 'i'] : []),
        ...(e.altKey ? ['F4'] : [])
      ];

      // Handle copy-paste key combinations separately with better detection
      if (e.ctrlKey && ['c', 'C', 'v', 'V', 'x', 'X'].includes(e.key)) {
        e.preventDefault();
        
        // Only trigger violation on keydown, not keyup
        if (e.type === 'keydown') {
          const actionType = ['c', 'C'].includes(e.key) ? 'copy' : 
                           ['v', 'V'].includes(e.key) ? 'paste' : 'cut';
          handleCopyPasteViolation(actionType);
        }
        return false;
      }

      if (restrictedKeys.includes(e.key)) {
        e.preventDefault();
        return false;
      }
    };

    const preventContextMenu = (e) => e.preventDefault();
    
    const preventCopyPaste = (e) => {
      if (['copy', 'paste', 'cut'].includes(e.type)) {
        e.preventDefault();
        handleCopyPasteViolation(e.type);
        return false;
      }
    };

    const preventNavigation = (e) => {
      e.preventDefault();
      e.returnValue = 'Test is in progress. Are you sure you want to leave?';
      return e.returnValue;
    };

    // Apply restrictions
    document.body.style.userSelect = 'none';
    window.addEventListener('beforeunload', preventNavigation);
    document.addEventListener('keydown', preventActions);
    document.addEventListener('contextmenu', preventContextMenu);
    
    // Add copy-paste event listeners
    document.addEventListener('copy', preventCopyPaste);
    document.addEventListener('paste', preventCopyPaste);
    document.addEventListener('cut', preventCopyPaste);

    // Store cleanup function in ref
    cleanupRef.current = () => {
      window.removeEventListener('beforeunload', preventNavigation);
      document.removeEventListener('keydown', preventActions);
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('copy', preventCopyPaste);
      document.removeEventListener('paste', preventCopyPaste);
      document.removeEventListener('cut', preventCopyPaste);
      document.body.style.userSelect = '';
    };
  }, [handleCopyPasteViolation]);

  // Fullscreen handlers
  const handleEnableFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullScreen(true);
      setShowFullscreenPopup(false);
      initializeTest();
      applySecurityRestrictions();
    } catch (err) {
      console.error('Failed to enter fullscreen:', err);
      alert('Fullscreen is required to start the test. Please try again.');
    }
  }, [initializeTest, applySecurityRestrictions]);

  // Fullscreen change handler - fixed to prevent infinite loops
  useEffect(() => {
    const handleFullScreenChange = () => {
      const isProgrammaticFullscreen = !!document.fullscreenElement;
      const isBrowserFullscreen = window.innerHeight === screen.height && window.innerWidth === screen.width;
      const isCurrentlyFullscreen = isProgrammaticFullscreen || isBrowserFullscreen;
      
      // Only update state if it actually changed
      setIsFullScreen(prev => {
        if (prev === isCurrentlyFullscreen) return prev;
        
        if (testReady && !isCurrentlyFullscreen && prev === true) {
          // User exited fullscreen - show violation warning
          setFullscreenViolations(prevViolations => {
            const newViolationCount = prevViolations + 1;
            setShowViolationWarning(true);

            if (newViolationCount >= 3) {
              // Auto-submit after 3 violations
              setTimeout(() => handleSubmitTest(true), 2000);
            } else {
              // Try to return to fullscreen after 3 seconds
              setTimeout(async () => {
                try {
                  if (!document.fullscreenElement) {
                    await document.documentElement.requestFullscreen();
                  }
                } catch (err) {
                  console.error('Failed to re-enter fullscreen:', err);
                }
                setShowViolationWarning(false);
              }, 3000);
            }

            return newViolationCount;
          });
        } else if (testReady && isCurrentlyFullscreen && prev === false) {
          // User returned to fullscreen - hide any warnings
          setShowViolationWarning(false);
        }

        return isCurrentlyFullscreen;
      });
    };

    // Listen to fullscreen events
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    window.addEventListener('resize', handleFullScreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      window.removeEventListener('resize', handleFullScreenChange);
    };
  }, [testReady, handleSubmitTest]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  // Navigation
  const goToPrevious = useCallback(() => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
  }, [currentQuestionIndex]);

  const goToNext = useCallback(() => {
    if (testData && currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [testData, currentQuestionIndex]);

  const handleTestResults = useCallback((results) => {
    setAllTestResults(prev => ({
      ...prev,
      [results.questionIndex]: results
    }));
  }, []);

  // Utility functions
  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getTimerColor = useCallback(() => {
    const totalDuration = testData?.duration * 60 || 0;
    const percentage = (timeRemaining / totalDuration) * 100;

    if (percentage <= 10) return 'text-red-600 bg-red-100';
    if (percentage <= 25) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  }, [testData?.duration, timeRemaining]);

  const getDifficultyColor = useCallback((difficulty) => {
    const colors = {
      easy: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      hard: 'text-red-600 bg-red-100'
    };
    return colors[difficulty?.toLowerCase()] || 'text-gray-600 bg-gray-100';
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading test data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !testData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Failed to Load Test</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = testData?.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fullscreen Popup */}
      {showFullscreenPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[110]">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="mb-6">
              <Maximize className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Enable Fullscreen Mode</h2>
              <p className="text-gray-600 leading-relaxed">
                This test requires fullscreen mode for security and monitoring purposes.
                Please enable fullscreen to continue with your coding assessment.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleEnableFullscreen}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Maximize className="h-5 w-5" />
                Enable Fullscreen & Start Test
              </button>

              <button
                onClick={() => alert('Fullscreen mode is required to take this test. Please enable fullscreen to continue.')}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              <p>✓ Camera and screen monitoring will be enabled</p>
              <p>✓ Navigation restrictions will be applied</p>
              <p>✓ Copy-paste restrictions will be enforced</p>
              <p>✓ Live face monitoring will be activated</p>
            </div>
          </div>
        </div>
      )}

      {/* Test Content */}
      {testReady && (
        <>
          {/* Header */}
          <div className="bg-cyan-400 text-white p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{testData?.testName || 'Coding Test'}</h2>
              <div className="flex items-center gap-6">
                <div className="text-sm">Total Marks: {testData?.totalMarks}</div>
                <div className="text-sm">
  Violations: FS({fullscreenViolations}/3) | FM({faceMonitoringViolations}/5) | CP({copyPasteViolations}/5) | Audio({audioViolations}/10)
</div>
                <div className={`px-4 py-2 rounded-lg font-bold text-lg ${getTimerColor()}`}>
                  ⏰ {formatTime(timeRemaining)}
                </div>
                {!isFullScreen && (
                  <div className="text-xs text-red-200 bg-red-600 px-2 py-1 rounded">
                    Please return to fullscreen mode
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Question Section */}
          <div className="p-6 bg-white border-b">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1 pr-8">
                <h3 className="font-semibold text-gray-800 text-lg mb-4">
                  {currentQuestionIndex + 1}. {currentQuestion?.question}
                </h3>

                {/* Sample Test Cases */}
                {currentQuestion?.testCases?.length > 0 && (
                  <div className="space-y-3">
                    {currentQuestion.testCases.slice(0, 2).map((testCase, index) => (
                      <div key={index} className="space-y-1">
                        <div>
                          <span className="font-medium text-gray-700">Sample Input:</span>
                          <span className="ml-2 font-mono text-sm">{testCase.input}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Expected Output:</span>
                          <span className="ml-2 font-mono text-sm">{testCase.expectedOutput}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right side with difficulty badge and navigation */}
              <div className="flex flex-col items-end gap-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentQuestion?.difficulty)}`}>
                    {currentQuestion?.difficulty?.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-600 font-medium">
                    Marks: {currentQuestion?.marks}
                  </span>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={goToPrevious}
                    disabled={currentQuestionIndex === 0}
                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Previous
                  </button>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Flag
                  </button>
                  <button
                    onClick={goToNext}
                    disabled={!testData || currentQuestionIndex >= testData.questions.length - 1}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Editor Section */}
          <SimpleCodeEditor
            question={currentQuestion}
            allQuestions={testData?.questions || []}
            codeTemplate={questionCodes[currentQuestionIndex] || currentQuestion?.codeTemplate || ''}
            testCases={currentQuestion.testCases}
            testData={testData}
            currentQuestionIndex={currentQuestionIndex}
            sessionData={getTestSessionData()}
            onTestResults={handleTestResults}
            onCodeChange={(newCode) => handleCodeChange(currentQuestionIndex, newCode)}
          />

          <LiveAudioMonitor
  isActive={testReady}
  onViolation={handleAudioViolation}
  showToast={showToast}
/>

          {/* Live Face Monitoring Widget - Positioned at bottom-right and draggable */}
          <LiveFaceMonitoring
            isActive={testReady}
            position={faceMonitorPosition}
            onPositionChange={setFaceMonitorPosition}
            onViolation={handleFaceViolation}
            style={{
              position: 'fixed',
              left: `${faceMonitorPosition.x}px`,
              top: `${faceMonitorPosition.y}px`,
              zIndex: 90,
              width: '300px',
              height: '220px',
              backgroundColor: 'white',
              border: '2px solid #3b82f6',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              cursor: 'move'
            }}
          />

          {/* Copy-Paste Violation Warning */}
          {showCopyPasteWarning && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white p-6 rounded-lg shadow-2xl z-[105] max-w-sm">
              <div className="text-center">
                <div className="text-4xl mb-2">🚫</div>
                <h3 className="font-bold text-lg mb-2">Copy/Paste Detected!</h3>
                <p className="text-sm mb-2">
                  Copy, paste, and cut operations are not allowed during the test.
                </p>
                <p className="text-xs opacity-90">
                  Violation #{copyPasteViolations} of 5
                </p>
                <div className="mt-3 bg-red-700 rounded-full h-1">
                  <div 
                    className="bg-yellow-400 h-1 rounded-full transition-all duration-[3000ms]"
                    style={{ width: '100%', animation: 'shrink 3s linear forwards' }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Face Violation Warning */}
          {showFaceViolationWarning && (
            <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-600 text-white p-6 rounded-lg shadow-2xl z-[105] max-w-sm">
              <div className="text-center">
                <div className="text-4xl mb-2">👤</div>
                <h3 className="font-bold text-lg mb-2">Face Monitoring Alert!</h3>
                <p className="text-sm mb-2">
                  Face not detected or multiple faces detected.
                </p>
                <p className="text-xs opacity-90">
                  Violation #{faceMonitoringViolations} of 5
                </p>
              </div>
            </div>
          )}
          
          {/* Fullscreen Violation Warning Popup */}
          {showViolationWarning && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]">
              <div className="bg-white rounded-2xl p-6 max-w-md mx-4 text-center shadow-2xl">
                <div className="mb-4">
                  <div className="text-4xl mb-3">⚠️</div>
                  <h2 className="text-xl font-bold text-red-600 mb-2">
                    Fullscreen Violation Detected!
                  </h2>
                  <p className="text-gray-600 mb-3">
                    Violation #{fullscreenViolations} of 3
                  </p>

                  {fullscreenViolations >= 3 ? (
                    <div className="text-red-600">
                      <p className="font-semibold mb-2">Maximum violations reached!</p>
                      <p className="text-sm">Test will be auto-submitted in 2 seconds...</p>
                    </div>
                  ) : (
                    <div className="text-orange-600">
                      <p className="font-semibold mb-2">Warning!</p>
                      <p className="text-sm mb-2">
                        Exiting fullscreen mode is not allowed during the test.
                      </p>
                      <p className="text-sm">
                        Auto-returning to fullscreen in 3 seconds...
                      </p>
                      <p className="text-xs mt-2 text-gray-500">
                        {3 - fullscreenViolations} violations remaining before auto-submission
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              </div>
            </div>
          )}

          {/* Anti-cheat overlay warning */}
          {!isFullScreen && testReady && !showViolationWarning && (
            <div className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-[95] max-w-sm">
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚠️</div>
                <div>
                  <h3 className="font-bold mb-1">Fullscreen Required</h3>
                  <p className="text-sm mb-2">Test must be in fullscreen mode</p>
                  <p className="text-xs opacity-90">Press F11 to return to fullscreen</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {toasts.map(toast => (
  <Toast
    key={toast.id}
    message={toast.message}
    type={toast.type}
    onClose={() => removeToast(toast.id)}
  />
))}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl transform animate-pulse">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Successfully Submitted!
            </h2>
            <p className="text-gray-600 mb-4">
              Your test has been submitted successfully
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default CodingSection;
