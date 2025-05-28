import React, { useState, useRef, useEffect } from 'react';
import { Play, Video, Mic, MicOff, Camera, Move } from 'lucide-react';

const CodingSection = ({ onNavigateToInterview }) => {
  const [code, setCode] = useState(`#include <stdio.h>
int main() {
    // Write Your Code Here
    printf("Hello World!");
    return 0;
}`);
  
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [cameraPosition, setCameraPosition] = useState({ x: window.innerWidth - 280, y: window.innerHeight - 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const cameraRef = useRef(null);

  // Start video stream automatically on component mount
  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: isAudioOn 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Camera access denied');
      }
    };

    startVideo();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Toggle audio
  const toggleAudio = async () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !isAudioOn;
        setIsAudioOn(!isAudioOn);
      } else if (!isAudioOn) {
        try {
          const newStream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = newStream;
          }
          streamRef.current = newStream;
          setIsAudioOn(true);
        } catch (err) {
          console.error('Error accessing microphone:', err);
        }
      }
    }
  };

  // Dragging functionality
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = cameraRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep camera within viewport bounds
      const maxX = window.innerWidth - 264; // camera width
      const maxY = window.innerHeight - 180; // camera height
      
      setCameraPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Update camera position on window resize
  useEffect(() => {
    const handleResize = () => {
      setCameraPosition(prev => ({
        x: Math.max(0, Math.min(prev.x, window.innerWidth - 264)),
        y: Math.max(0, Math.min(prev.y, window.innerHeight - 180))
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle test submission with navigation
  const handleSubmitTest = () => {
    if (window.confirm('Are you sure you want to submit the test? This action cannot be undone.')) {
      setShowSuccessPopup(true);
      
      // Navigate to interview after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        // Call the navigation function passed as prop
        if (onNavigateToInterview) {
          onNavigateToInterview();
        }
      }, 3000);
    }
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput('');
    setError('');
    
    setTimeout(() => {
      try {
        if (code.includes('printf') && code.includes('Hello World')) {
          setOutput('Hello World!');
        } else if (code.includes('printf')) {
          const match = code.match(/printf\s*\(\s*"([^"]*)"/);
          if (match) {
            setOutput(match[1]);
          } else {
            setOutput('Output printed successfully');
          }
        } else if (code.includes('return 0')) {
          setOutput('Program executed successfully');
        } else if (code.includes('syntax error') || code.includes('error')) {
          throw new Error('Compilation error: syntax error');
        } else {
          setOutput('Code executed successfully');
        }
      } catch (err) {
        setError(err.message);
      }
      setIsRunning(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-cyan-400 text-white p-4">
        <h2 className="text-xl font-semibold">Aptitude test</h2>
      </div>

      {/* Question Section */}
      <div className="p-6 bg-white border-b">
        <h3 className="font-semibold text-gray-800 mb-4 text-lg">
          1. First And Last Position Of An Element In Sorted Array
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          {/* Problem Statement with Detailed Explanation */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <p className="font-semibold text-gray-800 mb-2">Problem Statement:</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                You Have Been Given A Sorted Array/List ARR Consisting Of N Elements. You Are Also Given An Integer K. 
                Now, Your Task Is To Find The First And Last Occurrence Of K In ARR.
              </p>
            </div>
            
            <div>
              <p className="font-semibold text-gray-800 mb-2">Note:</p>
              <div className="text-gray-700 text-sm space-y-1">
                <p>1. If K Is Not Present In The Array, Then The First And The Last Occurrence Will Be -1.</p>
                <p>2. ARR May Contain Duplicate Elements.</p>
              </div>
            </div>
            
            <div>
              <p className="font-semibold text-gray-800 mb-2">For Example:</p>
              <p className="text-gray-700 text-sm">
                ARR = [0, 1, 1, 5] and K = 1, Then The First And Last Occurrence Of K Will Be 1st To 2nd (indexed from 0).
              </p>
            </div>

            {/* Detailed Explanation */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">
                Detailed Explanation (Input/Output Format, Notes, Images)
              </h4>
              <div className="bg-gray-100 p-4 rounded text-sm text-gray-700 space-y-2">
                <div>
                  <p className="font-semibold">Constraints:</p>
                  <div className="ml-2 space-y-1">
                    <p>1 ≤ T ≤ 10^5</p>
                    <p>1 ≤ N ≤ 10^5</p>
                    <p>-10^9 ≤ ARR[i] ≤ 10^9</p>
                    <p>-10^9 ≤ K ≤ 10^9</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p><strong>Where 'T'</strong> Denotes The Number Of Test Cases Or Queries To Be Run.</p>
                  <p><strong>Where 'N'</strong> Denotes The Size Of The Array/List.</p>
                  <p><strong>Where 'ARR[i]'</strong> Denotes The Elements Of The Array/List.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col gap-4 justify-start">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-3 rounded-lg text-sm font-medium transition-colors w-[100px]">
              Previous
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg text-sm font-medium transition-colors w-[100px]">
              Flag
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors w-[100px]">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Editor and Console Section */}
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Code Editor */}
        <div className="flex-1">
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
              <span className="text-sm font-medium">C++</span>
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                <Play size={16} />
                {isRunning ? 'Running...' : 'Run'}
              </button>
            </div>
            
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-80 p-4 font-mono text-sm bg-gray-900 text-green-400 resize-none focus:outline-none"
              placeholder="Write your code here..."
            />
          </div>
        </div>

        {/* Console */}
        <div className="flex-1">
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-800 text-white p-3">
              <h4 className="text-sm font-medium">Console</h4>
            </div>
            <div className="bg-black text-green-400 p-4 font-mono text-sm h-80 overflow-y-auto">
              {isRunning && (
                <div className="text-yellow-400 mb-2">Running code...</div>
              )}
              {output && (
                <div className="mb-2">
                  <span className="text-blue-400">Output:</span>
                  <div className="text-white mt-1">{output}</div>
                </div>
              )}
              {error && (
                <div className="mb-2">
                  <span className="text-red-400">Error:</span>
                  <div className="text-red-300 mt-1">{error}</div>
                </div>
              )}
              {!output && !error && !isRunning && (
                <div className="text-gray-500">Console output will appear here...</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Draggable Camera Widget */}
      <div 
        ref={cameraRef}
        className="fixed z-50 cursor-move"
        style={{ 
          left: `${cameraPosition.x}px`, 
          top: `${cameraPosition.y}px`,
          userSelect: 'none'
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="bg-white rounded-lg shadow-lg border overflow-hidden w-64">
          <div className="bg-gray-800 text-white p-2 flex items-center justify-between cursor-move">
            <span className="text-sm font-medium flex items-center gap-2">
              <Video size={16} />
              Live Monitoring
            </span>
            <div className="flex gap-1 items-center">
              <Move size={12} className="opacity-60" />
              <button
                onClick={toggleAudio}
                className={`p-1 rounded text-xs ${
                  isAudioOn 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                {isAudioOn ? <Mic size={12} /> : <MicOff size={12} />}
              </button>
            </div>
          </div>
          
          <div className="bg-black pointer-events-none">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-32 object-cover"
            />
          </div>

          <div className="p-2 bg-gray-50 text-xs pointer-events-none">
            <div className="flex justify-between items-center">
              <span>Status: Recording</span>
              <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className={`w-2 h-2 rounded-full ${isAudioOn ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="border-t bg-white p-4 flex justify-between items-center">
        <div></div>
        <div className="text-sm text-gray-600">
          Question 1 of 10
        </div>
        <button 
          onClick={handleSubmitTest}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-medium transition-colors"
        >
          Submit Test
        </button>
      </div>

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
            <div className="mt-4 text-sm text-gray-500">
              Redirecting to interview in 3 seconds...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingSection;