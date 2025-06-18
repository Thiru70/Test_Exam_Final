import React, { useState, useEffect, useRef } from 'react';
import { Check, AlertTriangle, RotateCcw } from 'lucide-react';
import { LiveAudioVisualizer } from 'react-audio-visualize';
import Toast from './ToastComponent'; // Import your existing Toast component

const AudioDetection = ({ onNavigateNext }) => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [toast, setToast] = useState(null);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);

  const NOISE_THRESHOLD = 20; // Adjusted for actual audio levels
  const HIGH_NOISE_THRESHOLD = 40;

  const startAudioDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });
      
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      recorder.start();
      
      // Set up Web Audio API for proper audio analysis
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      
      setIsInitializing(false);
      
      // Start monitoring after a brief delay
      setTimeout(() => {
        monitorNoiseLevel();
      }, 1000);
      
    } catch (error) {
      console.error('Microphone access error:', error);
      setToast({
        message: `Microphone access failed: ${error.message}. Please allow microphone access.`,
        type: "error"
      });
      setIsInitializing(false);
    }
  };

  const monitorNoiseLevel = () => {
    const checkNoise = () => {
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        
        // Calculate RMS (Root Mean Square) for better noise detection
        let sum = 0;
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          sum += dataArrayRef.current[i] * dataArrayRef.current[i];
        }
        const rms = Math.sqrt(sum / dataArrayRef.current.length);
        
        // Convert to a more readable scale (0-100)
        const normalizedLevel = Math.min(100, (rms / 128) * 100);
        setNoiseLevel(normalizedLevel);
        
        // Show warnings based on noise level
        if (normalizedLevel > HIGH_NOISE_THRESHOLD) {
          if (!toast || toast.type !== 'error') {
            setToast({
              message: "Noise level is very high! Please find a quieter environment.",
              type: "error"
            });
          }
        } else if (normalizedLevel > NOISE_THRESHOLD) {
          if (!toast || toast.type !== 'warning') {
            setToast({
              message: "Background noise detected. Please try to minimize noise sources.",
              type: "warning"
            });
          }
        } else if (normalizedLevel <= NOISE_THRESHOLD && !detectionResult) {
          // Good noise level - show success after 2 seconds of stable low noise
          setTimeout(() => {
            if (noiseLevel <= NOISE_THRESHOLD) {
              setDetectionResult('success');
              setToast({
                message: "Audio detection completed successfully! Environment is suitable for testing.",
                type: "success"
              });
            }
          }, 2000);
        }
      }
      
      if (!detectionResult) {
        animationFrameRef.current = requestAnimationFrame(checkNoise);
      }
    };
    
    checkNoise();
  };

  const handleRetry = () => {
    setDetectionResult(null);
    setNoiseLevel(0);
    setToast(null);
    
    // Clean up previous audio context and animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    
    setTimeout(() => {
      startAudioDetection();
    }, 500);
  };

  const handleNext = () => {
    const audioDetectionData = {
      completed: detectionResult === 'success',
      result: detectionResult,
      timestamp: new Date().toISOString(),
      noiseLevel: noiseLevel
    };
    
    if (onNavigateNext) {
      onNavigateNext({ audioDetectionData });
    }
  };

  const getVisualizerColor = () => {
    if (detectionResult === 'success') return '#10b981';
    if (noiseLevel > HIGH_NOISE_THRESHOLD) return '#ef4444';
    if (noiseLevel > NOISE_THRESHOLD) return '#f59e0b';
    return '#3b82f6';
  };

  const getNoiseStatus = () => {
    if (noiseLevel > HIGH_NOISE_THRESHOLD) return 'High';
    if (noiseLevel > NOISE_THRESHOLD) return 'Moderate';
    return 'Low';
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    startAudioDetection();
  }, []);

  return (
    <>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center relative">
        
        {/* Main Content */}
        <div className="text-center">
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-16 -ml-10">
            Audio Detection
          </h1>

          {/* Audio Visualizer */}
          <div className="mb-12 flex items-center justify-center">
            <div className="flex items-center space-x-6">
              <div className="w-96 h-20 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-gray-200">
                {mediaRecorder ? (
                  <LiveAudioVisualizer
                    mediaRecorder={mediaRecorder}
                    width={350}
                    height={60}
                    barWidth={3}
                    gap={2}
                    barColor={getVisualizerColor()}
                    backgroundColor="transparent"
                    fftSize={512}
                    maxDecibels={-10}
                    minDecibels={-90}
                    smoothingTimeConstant={0.4}
                  />
                ) : (
                  <div className="text-gray-400 text-sm">
                    {isInitializing ? 'Initializing audio...' : 'Audio access failed'}
                  </div>
                )}
              </div>
              
              {/* Status Icon */}
              {detectionResult === 'success' && (
                <div className="p-3 bg-green-500 rounded-full">
                  <Check className="w-8 h-8 text-white" />
                </div>
              )}
              
              {noiseLevel > HIGH_NOISE_THRESHOLD && (
                <div className="p-3 bg-red-500 rounded-full">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
          </div>


          {/* Status Messages */}
          <div className="mb-8">
            {detectionResult === 'success' ? (
              <p className="text-green-700 text-xl font-medium">
                Audio detection passed! Environment is suitable for testing.
              </p>
            ) : isInitializing ? (
              <p className="text-gray-600 text-lg">
                Initializing audio detection...
              </p>
            ) : mediaRecorder ? (
              <div className="space-y-2">
                <p className="text-gray-600 text-lg">
                  Monitoring background noise...
                </p>
                <p className="text-gray-500 text-sm">
                  Please stay quiet for optimal detection
                </p>
                
                {/* Real-time Alert Messages */}
                {noiseLevel > HIGH_NOISE_THRESHOLD && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <p className="text-red-800 text-sm font-medium">
                        Critical: Noise level too high! Please find a quieter location.
                      </p>
                    </div>
                  </div>
                )}
                
                {noiseLevel > NOISE_THRESHOLD && noiseLevel <= HIGH_NOISE_THRESHOLD && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <p className="text-yellow-800 text-sm font-medium">
                        Warning: Elevated background noise detected
                      </p>
                    </div>
                  </div>
                )}
                
                {noiseLevel <= NOISE_THRESHOLD && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <p className="text-green-800 text-sm font-medium">
                        Good: Low noise environment detected
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-red-600 text-lg">
                Unable to access microphone. Please check permissions.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-x-4">
            {detectionResult === 'success' && (
              <button 
                onClick={handleNext}
                className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-full text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Continue
              </button>
            )}
            
            {(detectionResult === 'failed' || (!isInitializing && !mediaRecorder)) && (
              <button 
                onClick={handleRetry}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Retry Detection</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AudioDetection;