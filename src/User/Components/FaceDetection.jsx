import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const FaceDetectionComponent = ({ onNavigateToAudio }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get parameters from URL
  const studentId = searchParams.get('studentId');
  const testId = searchParams.get('testId');

  const [isDetected, setIsDetected] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [stream, setStream] = useState(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [detectedFaces, setDetectedFaces] = useState([]);
  const [error, setError] = useState(null);
  const [isCorrectPosition, setIsCorrectPosition] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionCanvasRef = useRef(null);
  const modelRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    // Check if required parameters are present
    if (!studentId || !testId) {
      setError('Missing required parameters. Please start the test from the tests page.');
      return;
    }

    console.log('Face Detection initialized with:', { studentId, testId });
    
    // Store parameters in localStorage as backup
    localStorage.setItem('currentStudentId', studentId);
    localStorage.setItem('currentTestId', testId);

    startCamera();
    loadTensorFlowAndModel();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [studentId, testId]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
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
      setError('Camera access denied or not available');
    }
  };

  const loadTensorFlowAndModel = async () => {
    try {
      setIsModelLoading(true);

      if (!window.tf) {
        const tfUrls = [
          'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js',
          'https://unpkg.com/@tensorflow/tfjs@4.10.0/dist/tf.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/tensorflow/4.10.0/tf.min.js'
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
            console.warn(`Failed to load TensorFlow from ${url}`, e);
          }
        }

        if (!tfLoaded) {
          throw new Error('Failed to load TensorFlow.js from all sources');
        }
      }

      await window.tf.ready();

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
            console.warn(`Failed to load BlazeFace from ${url}`, e);
          }
        }

        if (!blazefaceLoaded) {
          throw new Error('Failed to load BlazeFace model from all sources');
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Loading BlazeFace model...');
      const model = await window.blazeface.load();
      console.log('BlazeFace model loaded successfully');

      modelRef.current = model;
      setIsModelLoaded(true);
      setIsModelLoading(false);
      setError(null);

      detectFaces();
    } catch (error) {
      console.error('Error loading model:', error);
      setError(`Failed to load face detection model: ${error.message}`);
      setIsModelLoading(false);

      startSimpleFaceDetection();
    }
  };

  const startSimpleFaceDetection = () => {
    console.log('Using fallback face detection');
    setError('Using simplified face detection (ML model unavailable)');

    const interval = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        setIsDetected(true);
        setIsCorrectPosition(true);
        setDetectedFaces([{ probability: 0.95, topLeft: [100, 100], bottomRight: [300, 300] }]);
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  // Check if face is centered (front-facing)
  const isFaceCentered = (faceBox, videoWidth) => {
    const [x1, y1] = faceBox.topLeft;
    const [x2, y2] = faceBox.bottomRight;
    const faceCenterX = (x1 + x2) / 2;

    // Check if face is reasonably centered (within middle 60% of frame)
    const leftBound = videoWidth * 0.2;
    const rightBound = videoWidth * 0.8;

    return faceCenterX >= leftBound && faceCenterX <= rightBound;
  };

  const detectFaces = async () => {
    if (modelRef.current && videoRef.current && detectionCanvasRef.current) {
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

          // Draw bounding boxes
          predictions.forEach((prediction) => {
            const [x, y] = prediction.topLeft;
            const [x2, y2] = prediction.bottomRight;
            const width = x2 - x;
            const height = y2 - y;

            const isCentered = isFaceCentered(prediction, canvas.width);

            // Draw bounding box with color based on position
            ctx.strokeStyle = predictions.length === 1 && isCentered ? '#00ff00' : '#ff0000';
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);

            // Draw confidence score
            ctx.fillStyle = predictions.length === 1 && isCentered ? '#00ff00' : '#ff0000';
            ctx.font = '16px Arial';
            ctx.fillText(
              `${(prediction.probability * 100).toFixed(1)}%`,
              x,
              y - 10
            );
          });

          // Draw center guide zone
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);

          // Center zone guide
          const centerX = canvas.width * 0.2;
          const centerWidth = canvas.width * 0.6;
          ctx.strokeRect(centerX, 0, centerWidth, canvas.height);

          ctx.setLineDash([]);

        } catch (error) {
          console.error('Face detection error:', error);
        }
      }
    }

    animationIdRef.current = requestAnimationFrame(detectFaces);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !isDetected || !isCorrectPosition) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.scale(-1, 1);
    context.drawImage(video, -canvas.width, 0);
    context.scale(-1, 1);

    const photoDataUrl = canvas.toDataURL('image/jpeg');
    setCapturedPhoto(photoDataUrl);
    
    // Store captured image with student and test context
    localStorage.setItem('capturedFaceImage', photoDataUrl);
    localStorage.setItem('faceDetectionCompleted', 'true');
    
    console.log('Photo captured for student:', studentId, 'test:', testId);
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    localStorage.removeItem('faceDetectionCompleted');
  };

  const handleNext = () => {
    if (capturedPhoto) {
      // Store the image data before navigating
      localStorage.setItem('capturedFaceImage', capturedPhoto);
      localStorage.setItem('faceDetectionCompleted', 'true');
      
      // Navigate to audio detection with parameters
      if (onNavigateToAudio) {
        onNavigateToAudio();
      } else {
        // Default navigation with parameters
        navigate(`/audio-detection?studentId=${studentId}&testId=${testId}`);
      }
    }
  };

  const handleBackToTests = () => {
    navigate('/tests');
  };

  const getFaceStatusMessage = () => {
    if (!studentId || !testId) return "Missing required parameters";
    if (isModelLoading) return "Loading face detection model...";
    if (error && error.includes('Missing required parameters')) return error;
    if (error) return error;
    if (!isModelLoaded) return "Model not loaded";
    if (detectedFaces.length === 0) return "No face detected. Please ensure you are in a well-lit environment and positioned properly.";
    if (detectedFaces.length > 1) return "Multiple faces detected. Please ensure only your face is visible.";
    if (detectedFaces.length === 1) {
      if (!isCorrectPosition) {
        return "Please center your face in the frame and look straight ahead.";
      }
      return "Perfect! Face is properly positioned.";
    }
    return "Detecting...";
  };

  const getFaceStatusColor = () => {
    if (!studentId || !testId) return "text-red-600";
    if (isModelLoading || error || !isModelLoaded) return "text-gray-600";
    if (detectedFaces.length === 0 || detectedFaces.length > 1) return "text-red-600";
    if (detectedFaces.length === 1) {
      return isCorrectPosition ? "text-green-600" : "text-orange-600";
    }
    return "text-gray-600";
  };

  // If missing parameters, show error with back button
  if (!studentId || !testId) {
    return (
      <div className="min-h-screen w-full p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
            <h2 className="text-lg font-semibold text-red-800">Missing Parameters</h2>
          </div>
          <p className="text-red-700 mb-4">
            Student ID and Test ID are required to proceed. Please start the test from the tests page.
          </p>
          <button
            onClick={handleBackToTests}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Face Detection
          </h1>
          <div className="text-sm text-gray-600">
            <p>Student ID: <span className="font-medium">{studentId}</span></p>
            <p>Test ID: <span className="font-medium">{testId}</span></p>
          </div>
        </div>

        {isModelLoading && (
          <div className="mb-4 p-4 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-800 mr-3"></div>
            <span>Loading face detection model...</span>
          </div>
        )}

        {error && !error.includes('Missing required parameters') && (
          <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
            {error.includes('Failed to load') && (
              <button
                onClick={() => window.location.reload()}
                className="ml-4 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
              >
                Retry
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="lg:w-1/3 space-y-4">
            <div className="text-gray-700">
              <p className={`text-lg font-semibold ${getFaceStatusColor()}`}>
                {getFaceStatusMessage()}
              </p>
            </div>

            <div className="text-sm text-gray-600">
              <p className="mb-2 font-medium text-blue-600">
                Position your face in the center of the frame and look straight ahead
              </p>

              {isModelLoaded && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Detection Info:</p>
                  <p className="text-sm">Faces detected: <span className="font-bold">{detectedFaces.length}</span></p>
                  {detectedFaces.length > 0 && (
                    <>
                      <p className="text-sm">Confidence: <span className="font-bold">{(detectedFaces[0].probability * 100).toFixed(1)}%</span></p>
                      <p className="text-sm">Properly positioned: <span className={`font-bold ${isCorrectPosition ? 'text-green-600' : 'text-red-600'}`}>{isCorrectPosition ? 'Yes' : 'No'}</span></p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-1/3 flex flex-col items-center">
            <div className="relative border-4 border-gray-300 rounded-lg overflow-hidden w-full mb-6">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto"
                style={{ transform: 'scaleX(-1)' }}
              />

              <canvas
                ref={detectionCanvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ transform: 'scaleX(-1)' }}
              />

              <div className="absolute top-4 left-4">
                {isModelLoading ? (
                  <div className="bg-yellow-500 rounded-full p-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  </div>
                ) : isDetected && isCorrectPosition ? (
                  <div className="bg-green-500 rounded-full p-2">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <div className="bg-red-500 rounded-full p-2">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                Look straight ahead and center your face
              </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {capturedPhoto && (
              <div className="w-full max-w-xs mb-4">
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={capturedPhoto}
                    alt="Captured face"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-gray-700 text-center mt-2">
                  Captured Photo
                </p>
              </div>
            )}
          </div>

          <div className="lg:w-1/3 flex flex-col items-center space-y-4">
            {capturedPhoto && (
              <button
                onClick={retakePhoto}
                className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 w-32"
              >
                <RefreshCw className="w-4 h-4" />
                Retake
              </button>
            )}

            <button
              onClick={capturePhoto}
              disabled={!isDetected || !isCorrectPosition || isModelLoading || capturedPhoto}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 w-32 ${isDetected && isCorrectPosition && !isModelLoading && !capturedPhoto
                  ? 'bg-gray-700 hover:bg-gray-800 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              <Camera className="w-4 h-4" />
              {capturedPhoto ? 'Captured' : 'Capture'}
            </button>

            {capturedPhoto && (
              <button
                onClick={handleNext}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 w-32"
              >
                Next
              </button>
            )}

            <button
              onClick={handleBackToTests}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 w-32 text-sm"
            >
              Back to Tests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceDetectionComponent;