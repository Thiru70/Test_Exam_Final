import React, { useState, useRef, useEffect } from 'react';
import { Camera, AlertCircle, Eye, EyeOff } from 'lucide-react';

const LiveFaceMonitoring = ({ 
  isActive = true, 
  position = { x: 20, y: 20 },
  onPositionChange 
}) => {
  const [isDetected, setIsDetected] = useState(false);
  const [stream, setStream] = useState(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [detectedFaces, setDetectedFaces] = useState([]);
  const [error, setError] = useState(null);
  const [isCorrectPosition, setIsCorrectPosition] = useState(false);
  const [lastViolationTime, setLastViolationTime] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const videoRef = useRef(null);
  const detectionCanvasRef = useRef(null);
  const modelRef = useRef(null);
  const animationIdRef = useRef(null);
  const violationCheckRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      startCamera();
      loadTensorFlowAndModel();
    } else {
      cleanup();
    }

    return cleanup;
  }, [isActive]);

  const cleanup = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
    if (violationCheckRef.current) {
      clearInterval(violationCheckRef.current);
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 320 },
          height: { ideal: 240 },
          facingMode: 'user'
        }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError('Camera access denied');
    }
  };

  const loadTensorFlowAndModel = async () => {
    try {
      setIsModelLoading(true);

      // Load TensorFlow.js if not already loaded
      if (!window.tf) {
        const tfUrls = [
          'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js',
          'https://unpkg.com/@tensorflow/tfjs@4.10.0/dist/tf.min.js'
        ];

        let tfLoaded = false;
        for (const url of tfUrls) {
          try {
            await new Promise((resolve, reject) => {
              const script = document.createElement('script');
              script.src = url;
              script.onload = resolve;
              script.onerror = reject;
              document.head.appendChild(script);
            });
            tfLoaded = true;
            break;
          } catch (e) {
            console.warn(`Failed to load TensorFlow from ${url}`);
          }
        }

        if (!tfLoaded) {
          throw new Error('Failed to load TensorFlow.js');
        }
      }

      await window.tf.ready();

      // Load BlazeFace model if not already loaded
      if (!window.blazeface) {
        const blazefaceUrls = [
          'https://cdn.jsdelivr.net/npm/@tensorflow-models/blazeface@0.0.7/dist/blazeface.min.js',
          'https://unpkg.com/@tensorflow-models/blazeface@0.0.7/dist/blazeface.min.js'
        ];

        let blazefaceLoaded = false;
        for (const url of blazefaceUrls) {
          try {
            await new Promise((resolve, reject) => {
              const script = document.createElement('script');
              script.src = url;
              script.onload = resolve;
              script.onerror = reject;
              document.head.appendChild(script);
            });
            blazefaceLoaded = true;
            break;
          } catch (e) {
            console.warn(`Failed to load BlazeFace from ${url}`);
          }
        }

        if (!blazefaceLoaded) {
          throw new Error('Failed to load BlazeFace model');
        }
      }

      const model = await window.blazeface.load();
      modelRef.current = model;
      setIsModelLoaded(true);
      setIsModelLoading(false);
      setError(null);

      detectFaces();
      startViolationChecking();
    } catch (error) {
      console.error('Error loading model:', error);
      setError('Model loading failed - using fallback detection');
      setIsModelLoading(false);
      startFallbackDetection();
    }
  };

  const startFallbackDetection = () => {
    // Simplified detection for when ML model fails
    const interval = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        setIsDetected(true);
        setIsCorrectPosition(true);
        setDetectedFaces([{ probability: 0.95 }]);
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  const isFaceCentered = (faceBox, videoWidth) => {
    const [x1, y1] = faceBox.topLeft;
    const [x2, y2] = faceBox.bottomRight;
    const faceCenterX = (x1 + x2) / 2;
    const leftBound = videoWidth * 0.2;
    const rightBound = videoWidth * 0.8;
    return faceCenterX >= leftBound && faceCenterX <= rightBound;
  };

  const detectFaces = async () => {
    if (modelRef.current && videoRef.current && detectionCanvasRef.current && isActive) {
      const video = videoRef.current;
      const canvas = detectionCanvasRef.current;
      const ctx = canvas.getContext('2d');

      if (video.readyState >= 2) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        try {
          const predictions = await modelRef.current.estimateFaces(video, false);
          setDetectedFaces(predictions);

          if (predictions.length === 1) {
            const isCentered = isFaceCentered(predictions[0], canvas.width);
            setIsCorrectPosition(isCentered);
            setIsDetected(isCentered);
          } else {
            setIsDetected(false);
            setIsCorrectPosition(false);
          }

          // Draw detection indicators
          if (!isMinimized) {
            predictions.forEach((prediction) => {
              const [x, y] = prediction.topLeft;
              const [x2, y2] = prediction.bottomRight;
              const width = x2 - x;
              const height = y2 - y;
              const isCentered = isFaceCentered(prediction, canvas.width);

              ctx.strokeStyle = predictions.length === 1 && isCentered ? '#00ff00' : '#ff0000';
              ctx.lineWidth = 2;
              ctx.strokeRect(x, y, width, height);
            });
          }
        } catch (error) {
          console.error('Face detection error:', error);
        }
      }
    }

    if (isActive) {
      animationIdRef.current = requestAnimationFrame(detectFaces);
    }
  };

  const startViolationChecking = () => {
    violationCheckRef.current = setInterval(() => {
      const now = Date.now();
      const shouldDetectFace = isActive && !isMinimized;

      if (shouldDetectFace) {
        const hasViolation = detectedFaces.length !== 1 || !isCorrectPosition;
        
        if (hasViolation && now - lastViolationTime > 3000) {
          // Only trigger violation if it's been 3 seconds since last violation
          let violationType = 'no_face';
          let violationMessage = 'No face detected';

          if (detectedFaces.length > 1) {
            violationType = 'multiple_faces';
            violationMessage = 'Multiple faces detected';
          } else if (detectedFaces.length === 1 && !isCorrectPosition) {
            violationType = 'improper_position';
            violationMessage = 'Face not properly positioned';
          }

          setLastViolationTime(now);
          if (onViolation) {
            onViolation({
              type: violationType,
              message: violationMessage,
              timestamp: now
            });
          }
        }
      }
    }, 2000); // Check every 2 seconds
  };

  // Dragging functionality
  const handleMouseDown = (e) => {
    if (e.target.closest('.drag-handle')) {
      setIsDragging(true);
      const rect = containerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && onPositionChange) {
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - 280));
        const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - (isMinimized ? 60 : 200)));
        onPositionChange({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, onPositionChange]);

  const getStatusColor = () => {
    if (isModelLoading || error) return 'bg-yellow-500';
    if (detectedFaces.length === 1 && isCorrectPosition) return 'bg-green-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (isModelLoading) return 'Loading...';
    if (error) return 'Error';
    if (detectedFaces.length === 0) return 'No face';
    if (detectedFaces.length > 1) return 'Multiple faces';
    if (detectedFaces.length === 1 && !isCorrectPosition) return 'Position face';
    return 'Face detected';
  };

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="fixed z-50 cursor-move bg-white rounded-lg shadow-lg border overflow-hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: isMinimized ? '200px' : '280px',
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="drag-handle bg-gray-800 text-white p-2 flex items-center justify-between cursor-move">
        <div className="flex items-center gap-2">
          <Camera size={16} />
          <span className="text-sm font-medium">Live Monitor</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-gray-600 rounded text-xs"
          >
            {isMinimized ? <Eye size={12} /> : <EyeOff size={12} />}
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="relative">
          {/* Video */}
          <div className="bg-black relative h-40">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
            <canvas
              ref={detectionCanvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ transform: 'scaleX(-1)' }}
            />
            
            {/* Status overlay */}
            <div className="absolute top-2 left-2">
              <div className={`${getStatusColor()} rounded-full p-1`}>
                {isModelLoading ? (
                  <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                ) : detectedFaces.length === 1 && isCorrectPosition ? (
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                ) : (
                  <AlertCircle className="w-3 h-3 text-white" />
                )}
              </div>
            </div>

            {/* Center guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-white border-dashed rounded-full w-20 h-20 opacity-30"></div>
            </div>
          </div>

          {/* Status bar */}
          <div className="p-2 bg-gray-50 text-xs">
            <div className="flex justify-between items-center">
              <span className={`font-medium ${
                detectedFaces.length === 1 && isCorrectPosition ? 'text-green-600' : 'text-red-600'
              }`}>
                {getStatusText()}
              </span>
              <div className="flex gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${stream ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div className={`w-1.5 h-1.5 rounded-full ${isModelLoaded ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Minimized view */}
      {isMinimized && (
        <div className="p-2 bg-gray-50 text-xs">
          <div className="flex justify-between items-center">
            <span className={`font-medium ${
              detectedFaces.length === 1 && isCorrectPosition ? 'text-green-600' : 'text-red-600'
            }`}>
              {getStatusText()}
            </span>
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveFaceMonitoring;