import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Check } from 'lucide-react';

const FaceDetectionComponent = () => {
  const [isDetected, setIsDetected] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState({
    front: null,
    leftSide: null,
    rightSide: null
  });
  const [currentStep, setCurrentStep] = useState('front');
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const steps = ['front', 'leftSide', 'rightSide'];
  const stepLabels = {
    front: 'Front',
    leftSide: 'Left-Side',
    rightSide: 'Right-Side'
  };

  useEffect(() => {
    startCamera();
    
    // Simulate face detection after 2 seconds
    const timer = setTimeout(() => {
      setIsDetected(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const photoDataUrl = canvas.toDataURL('image/jpeg');
    
    setCapturedPhotos(prev => ({
      ...prev,
      [currentStep]: photoDataUrl
    }));

    // Move to next step
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      setIsDetected(false);
      // Simulate detection for next step
      setTimeout(() => setIsDetected(true), 1500);
    }
  };

  const retakePhoto = () => {
    setCapturedPhotos(prev => ({
      ...prev,
      [currentStep]: null
    }));
    setIsDetected(false);
    setTimeout(() => setIsDetected(true), 1500);
  };

  const resetAll = () => {
    setCapturedPhotos({
      front: null,
      leftSide: null,
      rightSide: null
    });
    setCurrentStep('front');
    setIsDetected(false);
    setTimeout(() => setIsDetected(true), 2000);
  };

  return (
    <div className="h-screen w-full bg-sky-100 overflow-hidden">
      <div className="w-full h-full bg-white shadow-lg p-4 md:p-8 flex flex-col">
        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4">
          Video call detection
        </h1>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 w-full flex-1 min-h-0">
          {/* Left side - Instructions and status */}
          <div className="lg:w-1/3 space-y-4 flex flex-col justify-center">
            <div className="text-gray-700">
              {!isDetected ? (
                <p className="text-base md:text-lg">
                  Face not detected. Please ensure you are in a well-lit environment and positioned properly.
                </p>
              ) : (
                <p className="text-base md:text-lg text-green-600 font-semibold">
                  Face detected! You're all set to proceed
                </p>
              )}
            </div>

            <div className="text-sm text-gray-600">
              <p className="mb-2">Current step: <span className="font-semibold">{stepLabels[currentStep]}</span></p>
              <p>Please position yourself for a {stepLabels[currentStep].toLowerCase()} view</p>
            </div>
          </div>

          {/* Center - Camera feed */}
          <div className="lg:w-1/3 flex flex-col items-center justify-center">
            <div className="relative border-4 border-gray-300 rounded-lg overflow-hidden w-full max-w-sm">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto"
                style={{ transform: 'scaleX(-1)' }}
              />
              
              {/* Face detection overlay */}
              {isDetected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-green-500 rounded-full p-2">
                    <Check className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {/* Captured photos preview */}
            <div className="mt-6 w-full">
              <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-sm mx-auto">
                {steps.map((step) => (
                  <div key={step} className="text-center">
                    <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-2 aspect-square bg-gray-100 flex items-center justify-center">
                      {capturedPhotos[step] ? (
                        <img
                          src={capturedPhotos[step]}
                          alt={stepLabels[step]}
                          className="w-full h-full object-cover"
                          style={{ transform: 'scaleX(-1)' }}
                        />
                      ) : (
                        <Camera className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                      )}
                    </div>
                    <p className="text-xs md:text-sm font-medium text-gray-700">
                      {stepLabels[step]}
                    </p>
                    {currentStep === step && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className="lg:w-1/3 flex flex-col items-center justify-center space-y-3 md:space-y-4">
            <button
              onClick={retakePhoto}
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 w-full max-w-32"
            >
              <RefreshCw className="w-4 h-4" />
              Retake
            </button>

            <button
              onClick={capturePhoto}
              disabled={!isDetected}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 w-full max-w-32 ${
                isDetected
                  ? 'bg-gray-700 hover:bg-gray-800 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Camera className="w-4 h-4" />
              Click
            </button>

            <button
              onClick={resetAll}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors duration-200 w-full max-w-32"
            >
              Reset All
            </button>
          </div>
        </div>

        {/* Completion message */}
        {Object.values(capturedPhotos).every(Boolean) && (
          <div className="mt-4 p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg text-center flex flex-row gap-10 justify-space between">
            <p className="text-green-800 font-semibold text-sm md:text-base mt-[25px]">
              🎉 All photos captured successfully! You can now proceed.
            </p>
             <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors duration-200 w-full max-w-32 mt-4"
              >
                Next
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceDetectionComponent;