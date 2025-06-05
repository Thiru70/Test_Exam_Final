import React, { useState, useEffect, useRef } from 'react';
import { Check, AlertTriangle } from 'lucide-react';

const AudioDetection = ({ onNavigateNext }) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [audioDetected, setAudioDetected] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [noiseTooLoud, setNoiseTooLoud] = useState(false);
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const timerRef = useRef(null);
  const noiseHistoryRef = useRef([]);

  const NOISE_THRESHOLD = 0.3; // Threshold for "too loud" noise

  const startAudioDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      microphone.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      setIsDetecting(true);
      monitorAudio();
      startTimer();
      
    } catch (error) {
      console.error('Microphone access denied:', error);
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          completeDetection();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const completeDetection = () => {
    setAudioDetected(true);
    setIsDetecting(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    stopMonitoring();
  };

  const monitorAudio = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const detectAudio = () => {
      if (!analyser || !isDetecting) return;
      
      analyser.getByteFrequencyData(dataArray);
      
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const normalizedLevel = average / 128;
      
      setAudioLevel(normalizedLevel);
      
      // Add to noise history for better detection
      noiseHistoryRef.current.push(normalizedLevel);
      if (noiseHistoryRef.current.length > 10) {
        noiseHistoryRef.current.shift();
      }
      
      // Check if noise is consistently too loud
      const avgNoise = noiseHistoryRef.current.reduce((sum, level) => sum + level, 0) / noiseHistoryRef.current.length;
      setNoiseTooLoud(avgNoise > NOISE_THRESHOLD);
      
      animationRef.current = requestAnimationFrame(detectAudio);
    };
    
    detectAudio();
  };

  const stopMonitoring = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const generateWaveformBars = () => {
    const bars = [];
    const numBars = 40;
    
    for (let i = 0; i < numBars; i++) {
      const isActive = isDetecting;
      const height = isActive ? 
        Math.max(0.3, Math.random() * audioLevel + 0.2) : 
        0.5;
      
      bars.push(
        <div
          key={i}
          className={`bg-gray-800 transition-all duration-150 ${
            isActive ? 'animate-pulse' : ''
          }`}
          style={{
            width: '3px',
            height: `${height * 40}px`,
            minHeight: '8px',
            maxHeight: '40px'
          }}
        />
      );
    }
    return bars;
  };

  useEffect(() => {
    startAudioDetection();
    
    return () => {
      stopMonitoring();
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center relative">
      
      {/* Noise Warning - Top Right */}
      {noiseTooLoud && isDetecting && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-10">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">Background noise is too loud!</span>
        </div>
      )}

      {/* Main Content */}
      <div className="text-center">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-16">
          Audio detection
        </h1>

        {/* Waveform Visualization */}
        <div className="mb-12 flex items-center justify-center space-x-1 h-16">
          {audioDetected ? (
            <div className="flex items-center justify-center space-x-1">
              {generateWaveformBars()}
              <div className="ml-6 p-3 bg-green-500 rounded-full">
                <Check className="w-8 h-8 text-white" />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-1">
              {generateWaveformBars()}
            </div>
          )}
        </div>

        {/* Status Message */}
        <div className="mb-8">
          {audioDetected ? (
            <p className="text-gray-700 text-xl font-medium">
              Audio detected successfully!
            </p>
          ) : isDetecting ? (
            <div className="space-y-2">
              <p className="text-gray-600 text-lg">
                Detecting background noise...
              </p>
              <p className="text-gray-500">
                {timeRemaining} seconds remaining
              </p>
            </div>
          ) : (
            <p className="text-gray-600 text-lg">
              Initializing audio detection...
            </p>
          )}
        </div>

        {/* Next Button */}
        {audioDetected && (
          <button 
            onClick={onNavigateNext}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-10 py-4 rounded-full text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Next
          </button>
        )}

        {/* Progress Indicator */}
        {isDetecting && (
          <div className="mt-8 w-80 mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((10 - timeRemaining) / 10) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioDetection;