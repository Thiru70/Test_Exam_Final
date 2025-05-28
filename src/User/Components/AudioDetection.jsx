import React, { useState, useEffect, useRef } from 'react';
import { Check, Mic, AlertCircle } from 'lucide-react';

const AudioDetectionComponent = ({ onNavigateNext }) => {
  const [permissionStatus, setPermissionStatus] = useState('pending'); // 'pending', 'granted', 'denied'
  const [isAudioDetected, setIsAudioDetected] = useState(false);
  const [waveformData, setWaveformData] = useState([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

  // Generate waveform data based on actual audio or random data
  const generateWaveform = (level = 0) => {
    if (level > 0) {
      // Generate based on actual audio level
      const intensity = Math.min(level * 2, 1);
      return Array.from({ length: 40 }, () => ({
        up: (Math.random() * 25 + 5) * intensity + 3,
        down: (Math.random() * 25 + 5) * intensity + 3
      }));
    } else {
      // Generate static/low activity waveform
      return Array.from({ length: 40 }, () => ({
        up: Math.random() * 8 + 2,
        down: Math.random() * 8 + 2
      }));
    }
  };

  // Request microphone permission and setup audio analysis
  const requestAudioPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });
      
      streamRef.current = stream;
      setPermissionStatus('granted');
      
      // Setup audio analysis
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      microphone.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      // Start audio level monitoring
      monitorAudioLevel();
      
    } catch (error) {
      console.error('Microphone access denied:', error);
      setPermissionStatus('denied');
    }
  };

  // Monitor audio levels
  const monitorAudioLevel = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkAudioLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      const sum = dataArray.reduce((a, b) => a + b, 0);
      const average = sum / bufferLength;
      const normalizedLevel = average / 255;
      
      setAudioLevel(normalizedLevel);
      
      // Detect meaningful audio (threshold for detection)
      if (normalizedLevel > 0.02 && !isAudioDetected) {
        setIsAudioDetected(true);
      }
      
      animationRef.current = requestAnimationFrame(checkAudioLevel);
    };
    
    checkAudioLevel();
  };

  // Initialize waveform and handle permission request
  useEffect(() => {
    setWaveformData(generateWaveform());
    
    // Auto-request permission after component mounts
    const timer = setTimeout(() => {
      if (permissionStatus === 'pending') {
        requestAudioPermission();
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      // Cleanup audio resources
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Update waveform based on audio level
  useEffect(() => {
    let waveformInterval;
    
    if (permissionStatus === 'granted') {
      waveformInterval = setInterval(() => {
        setWaveformData(prev => {
          const newData = generateWaveform(audioLevel);
          return [...prev.slice(1), ...newData.slice(0, 1)];
        });
      }, 100);
    }

    return () => {
      if (waveformInterval) clearInterval(waveformInterval);
    };
  }, [permissionStatus, audioLevel]);

  const getStatusMessage = () => {
    switch (permissionStatus) {
      case 'pending':
        return 'Requesting microphone access...';
      case 'denied':
        return 'Microphone access denied. Please enable microphone permissions.';
      case 'granted':
        if (isAudioDetected) {
          return 'Audio detected successfully!';
        }
        return 'Microphone ready. Please speak or make some sound...';
      default:
        return 'Initializing...';
    }
  };

  const getStatusIcon = () => {
    switch (permissionStatus) {
      case 'pending':
        return <Mic className="w-6 h-6 text-blue-500 animate-pulse" />;
      case 'denied':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case 'granted':
        if (isAudioDetected) {
          return (
            <div className="bg-green-500 rounded-full p-3 shadow-lg">
              <Check className="w-6 h-6 text-white" />
            </div>
          );
        }
        return <Mic className="w-6 h-6 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full p-4 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-3xl font-bold text-gray-800">
            Audio detection
          </h1>
        </div>

        {/* Permission prompt */}
        {permissionStatus === 'pending' && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800">
              This app needs access to your microphone to detect audio input.
            </p>
            <button
              onClick={requestAudioPermission}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium transition-colors"
            >
              Allow Microphone Access
            </button>
          </div>
        )}

        {/* Error message for denied permission */}
        {permissionStatus === 'denied' && (
          <div className="mb-8 p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-800 mb-2">
              Microphone access is required for audio detection.
            </p>
            <button
              onClick={requestAudioPermission}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Waveform visualization */}
        <div className="flex items-center justify-center mb-8" style={{ height: '120px' }}>
          <div className="flex items-center gap-1 overflow-hidden" style={{ width: '400px' }}>
            {waveformData.map((heights, index) => (
              <div
                key={`${index}-${permissionStatus}-${isAudioDetected}`}
                className="flex flex-col items-center"
                style={{ width: '6px' }}
              >
                <div
                  className={`bg-gray-800 ${permissionStatus === 'granted' && audioLevel > 0.01 ? 'animate-pulse' : ''}`}
                  style={{
                    height: `${heights.up}px`,
                    width: '6px',
                    borderRadius: '3px 3px 0 0',
                    transition: permissionStatus === 'granted' ? 'none' : 'height 0.3s ease-in-out'
                  }}
                />
                <div
                  className={`bg-gray-800 ${permissionStatus === 'granted' && audioLevel > 0.01 ? 'animate-pulse' : ''}`}
                  style={{
                    height: `${heights.down}px`,
                    width: '6px',
                    borderRadius: '0 0 3px 3px',
                    transition: permissionStatus === 'granted' ? 'none' : 'height 0.3s ease-in-out'
                  }}
                />
              </div>
            ))}
          </div>
          
          {/* Status icon */}
          <div className="ml-8">
            {getStatusIcon()}
          </div>
        </div>

        {/* Status message */}
        <div className="mb-16" style={{ height: '60px' }}>
          <p className={`text-xl font-medium ${
            permissionStatus === 'denied' ? 'text-red-600' : 
            isAudioDetected ? 'text-gray-800' : 'text-gray-600'
          }`}>
            {getStatusMessage()}
          </p>
          
          {/* Audio level indicator */}
          {permissionStatus === 'granted' && !isAudioDetected && (
            <div className="mt-4 flex items-center justify-center">
              <div className="text-sm text-gray-500 mr-2">Audio Level:</div>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-100"
                  style={{ width: `${Math.min(audioLevel * 200, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Next button */}
        {isAudioDetected && (
          <div className="flex justify-end animate-fadeIn">
            <button
              onClick={() => onNavigateNext && onNavigateNext()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-medium transition-colors duration-200 shadow-lg"
            >
              Next
            </button>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AudioDetectionComponent;