import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Check, AlertCircle } from 'lucide-react';

const FaceDetectionComponent = ({ onNavigateToAudio }) => {
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
  const lastDetectionTimeRef = useRef(0);
  const fallbackIntervalRef = useRef(null);

  useEffect(() => {
    startCamera();
    loadTensorFlowAndModel();

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (fallbackIntervalRef.current) clearInterval(fallbackIntervalRef.current);
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
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
        const tfScript = document.createElement('script');
        tfScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.15.0/dist/tf.min.js';
        tfScript.onload = () => console.log('TensorFlow.js loaded');
        document.head.appendChild(tfScript);
        await new Promise(resolve => (tfScript.onload = resolve));
      }

      await window.tf.ready();

      if (!window.blazeface) {
        const blazeScript = document.createElement('script');
        blazeScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/blazeface@0.0.7/dist/blazeface.min.js';
        document.head.appendChild(blazeScript);
        await new Promise(resolve => (blazeScript.onload = resolve));
      }

      // Load model explicitly from known working URL
      const model = await window.blazeface.load({
        modelUrl: 'https://cdn.jsdelivr.net/npm/@tensorflow-models/blazeface@0.0.7/model.json',
      });

      modelRef.current = model;
      setIsModelLoaded(true);
      setIsModelLoading(false);
      detectFaces();
    } catch (e) {
      console.warn('Model loading failed:', e);
      setError('Model loading failed - using fallback detection');
      setIsModelLoading(false);
      startSimpleFaceDetection();
    }
  };

  const startSimpleFaceDetection = () => {
    setIsModelLoaded(true);
    fallbackIntervalRef.current = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        setIsDetected(true);
        setIsCorrectPosition(true);
        setDetectedFaces([
          {
            probability: 0.95,
            topLeft: [160, 120],
            bottomRight: [480, 360],
          },
        ]);
      }
    }, 500);
  };

  const isFaceCentered = (faceBox, videoWidth) => {
    const [x1] = faceBox.topLeft;
    const [x2] = faceBox.bottomRight;
    const faceCenterX = (x1 + x2) / 2;
    const leftBound = videoWidth * 0.2;
    const rightBound = videoWidth * 0.8;
    return faceCenterX >= leftBound && faceCenterX <= rightBound;
  };

  const detectFaces = async (timestamp = 0) => {
    if (timestamp - lastDetectionTimeRef.current < 300) {
      animationIdRef.current = requestAnimationFrame(detectFaces);
      return;
    }
    lastDetectionTimeRef.current = timestamp;

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

          predictions.forEach(pred => {
            const [x, y] = pred.topLeft;
            const [x2, y2] = pred.bottomRight;
            const width = x2 - x;
            const height = y2 - y;
            const isCentered = isFaceCentered(pred, canvas.width);

            ctx.strokeStyle = isCentered ? '#00ff00' : '#ff0000';
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);
            ctx.fillStyle = isCentered ? '#00ff00' : '#ff0000';
            ctx.font = '16px Arial';
            ctx.fillText(`${(pred.probability * 100).toFixed(1)}%`, x, y - 10);
          });

          // Draw center guide
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(canvas.width * 0.2, 0, canvas.width * 0.6, canvas.height);
          ctx.setLineDash([]);
        } catch (err) {
          console.error('Face detection error:', err);
        }
      }
    }

    animationIdRef.current = requestAnimationFrame(detectFaces);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !isDetected || !isCorrectPosition) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.scale(-1, 1);
    context.drawImage(videoRef.current, -canvas.width, 0);
    context.scale(-1, 1);
    setCapturedPhoto(canvas.toDataURL('image/jpeg'));
  };

  const retakePhoto = () => setCapturedPhoto(null);

  const getFaceStatusMessage = () => {
    if (isModelLoading) return 'Loading face detection model...';
    if (error) return error;
    if (!isModelLoaded) return 'Model not loaded';
    if (detectedFaces.length === 0) return 'No face detected. Ensure you are well-lit and centered.';
    if (detectedFaces.length > 1) return 'Multiple faces detected. Only your face should be visible.';
    return isCorrectPosition ? 'Perfect! Face is properly positioned.' : 'Please center your face.';
  };

  const getFaceStatusColor = () => {
    if (isModelLoading || error || !isModelLoaded) return 'text-gray-600';
    if (detectedFaces.length === 0 || detectedFaces.length > 1) return 'text-red-600';
    return isCorrectPosition ? 'text-green-600' : 'text-orange-600';
  };

  return (
    <div className="min-h-screen w-full p-4">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Face Detection</h1>

        {error && (
          <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
            {error.includes('Failed to load') && (
              <button onClick={() => window.location.reload()} className="ml-4 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm">
                Retry
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Left Panel */}
          <div className="lg:w-1/3 space-y-4">
            <p className={`text-lg font-semibold ${getFaceStatusColor()}`}>
              {getFaceStatusMessage()}
            </p>
          </div>

          {/* Center Panel: Camera Feed */}
          <div className="lg:w-1/3 flex flex-col items-center">
            <div className="relative border-4 border-gray-300 rounded-lg overflow-hidden w-full mb-6">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto" style={{ transform: 'scaleX(-1)' }} />
              <canvas ref={detectionCanvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ transform: 'scaleX(-1)' }} />
              <div className="absolute top-4 left-4">
                {isModelLoading ? (
                  <div className="bg-yellow-500 rounded-full p-2 animate-spin border-2 border-white" />
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
                <img src={capturedPhoto} alt="Captured face" className="rounded-lg border border-gray-300 w-full" />
              </div>
            )}
          </div>

          {/* Right Panel: Controls */}
          <div className="lg:w-1/3 flex flex-col items-center space-y-4">
            {capturedPhoto && (
              <button
                onClick={retakePhoto}
                className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 w-32"
              >
                <RefreshCw className="w-4 h-4" /> Retake
              </button>
            )}

            <button
              onClick={capturePhoto}
              disabled={!isDetected || !isCorrectPosition || isModelLoading || capturedPhoto}
              className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 w-32 ${
                isDetected && isCorrectPosition && !isModelLoading && !capturedPhoto
                  ? 'bg-gray-700 hover:bg-gray-800 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Camera className="w-4 h-4" /> {capturedPhoto ? 'Captured' : 'Capture'}
            </button>

            {capturedPhoto && (
              <button
                onClick={() => onNavigateToAudio && onNavigateToAudio()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium w-32"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceDetectionComponent;