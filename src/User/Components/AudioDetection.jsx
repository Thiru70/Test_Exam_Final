import React, { useState, useEffect, useRef } from 'react';
import { Check, Mic, AlertCircle, ShieldCheck, Volume2, Settings, Play, Download } from 'lucide-react';

const ExamAudioSetup = ({ onSetupComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState('pending');
  const [audioLevel, setAudioLevel] = useState(0);
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [testResults, setTestResults] = useState({
    microphoneWorking: false,
    noiseLevel: 'unknown',
    audioQuality: 'unknown'
  });
  const [setupComplete, setSetupComplete] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const testTimeoutRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const steps = [
    {
      title: "Microphone Permission",
      description: "Allow access to your microphone for audio monitoring during the exam",
      icon: Mic
    },
    {
      title: "Audio Test",
      description: "Test your microphone to ensure proper audio detection",
      icon: Volume2
    },
    {
      title: "Environment Check",
      description: "Verify your audio environment meets exam requirements",
      icon: ShieldCheck
    },
    {
      title: "Setup Complete",
      description: "Audio monitoring is ready for your exam",
      icon: Check
    }
  ];

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;
      setPermissionStatus('granted');
      
      // Setup audio analysis
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      microphone.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      // Start audio monitoring
      startAudioMonitoring();
      
      // Move to next step after a brief delay
      setTimeout(() => {
        setCurrentStep(1);
      }, 1000);
      
    } catch (error) {
      console.error('Microphone access denied:', error);
      setPermissionStatus('denied');
    }
  };

  const startAudioMonitoring = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkAudioLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate RMS for voice detection
      const squares = dataArray.map(value => (value / 255) ** 2);
      const rms = Math.sqrt(squares.reduce((sum, square) => sum + square, 0) / squares.length);
      
      setAudioLevel(rms);
      animationRef.current = requestAnimationFrame(checkAudioLevel);
    };
    
    checkAudioLevel();
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    audioChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'audio/webm;codecs=opus'
    });
    
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      setRecordedBlob(audioBlob);
      
      // Make the blob available in console for download
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log('Recorded audio blob:', audioBlob);
      console.log('Audio URL:', audioUrl);
      console.log('To download, run: downloadRecordedAudio()');
      
      // Add download function to window for console access
      window.downloadRecordedAudio = () => {
        const a = document.createElement('a');
        a.href = audioUrl;
        a.download = `audio-test-${new Date().getTime()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        console.log('Audio download initiated');
      };
    };

    mediaRecorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const startAudioTest = () => {
    setIsTestingAudio(true);
    const startTime = Date.now();
    const audioLevels = [];
    
    // Start recording when test begins
    startRecording();
    
    const testInterval = setInterval(() => {
      audioLevels.push(audioLevel);
    }, 100);
    
    testTimeoutRef.current = setTimeout(() => {
      clearInterval(testInterval);
      setIsTestingAudio(false);
      
      // Stop recording when test ends
      stopRecording();
      
      // Analyze test results
      const avgLevel = audioLevels.reduce((sum, level) => sum + level, 0) / audioLevels.length;
      const maxLevel = Math.max(...audioLevels);
      const hasVoiceActivity = audioLevels.some(level => level > 0.02);
      
      setTestResults({
        microphoneWorking: hasVoiceActivity || maxLevel > 0.01,
        noiseLevel: avgLevel < 0.005 ? 'low' : avgLevel < 0.02 ? 'medium' : 'high',
        audioQuality: maxLevel > 0.1 ? 'excellent' : maxLevel > 0.05 ? 'good' : maxLevel > 0.02 ? 'fair' : 'poor'
      });
      
      // Move to next step
      setTimeout(() => {
        setCurrentStep(2);
      }, 1000);
    }, 5000);
  };

  const downloadAudio = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audio-test-${new Date().getTime()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const completeEnvironmentCheck = () => {
    setTimeout(() => {
      setCurrentStep(3);
      setSetupComplete(true);
    }, 1500);
  };

  const finishSetup = () => {
    if (onSetupComplete) {
      onSetupComplete({
        audioStream: streamRef.current,
        audioContext: audioContextRef.current,
        analyser: analyserRef.current,
        testResults: testResults,
        recordedAudio: recordedBlob
      });
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (testTimeoutRef.current) {
        clearTimeout(testTimeoutRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current && !setupComplete) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && !setupComplete) {
        audioContextRef.current.close();
      }
    };
  }, [setupComplete]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center">
            <div className="mb-4">
              <Mic className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Microphone Access Required</h3>
              <p className="text-gray-600 mb-4 text-sm">
                We need access to your microphone to monitor audio during the exam. 
                This helps ensure exam integrity and prevents cheating.
              </p>
            </div>
            
            {permissionStatus === 'pending' && (
              <button
                onClick={requestMicrophonePermission}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg"
              >
                Allow Microphone Access
              </button>
            )}
            
            {permissionStatus === 'denied' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="font-medium text-red-700">Permission Denied</span>
                </div>
                <p className="text-red-600 text-sm mb-4">
                  Microphone access is required to proceed with the exam. Please enable microphone permissions in your browser settings.
                </p>
                <button
                  onClick={requestMicrophonePermission}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
            
            {permissionStatus === 'granted' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-500 mr-2" />
                  <span className="font-medium text-green-700">Microphone Access Granted</span>
                </div>
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="text-center">
            <div className="mb-4">
              <Volume2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Audio Test</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Please speak clearly or make some noise to test your microphone. 
                We'll verify that audio is being detected properly.
              </p>
            </div>

            {/* Audio level indicator */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Microphone Level</div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-100 ${
                    audioLevel > 0.02 ? 'bg-green-500' : 'bg-blue-400'
                  }`}
                  style={{ width: `${Math.min(audioLevel * 500, 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {audioLevel > 0.02 ? 'Voice detected!' : 'Listening...'}
              </div>
            </div>

            {!isTestingAudio ? (
              <button
                onClick={startAudioTest}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg"
              >
                Start Audio Test (5s Recording)
              </button>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-center mb-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
                  <span className="font-medium text-blue-700">Testing & Recording Audio...</span>
                </div>
                <p className="text-blue-600 text-sm">Please speak or make noise now</p>
                <div className="text-xs text-red-500 mt-2">🔴 Recording in progress</div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="text-center">
            <div className="mb-4">
              <ShieldCheck className="w-12 h-12 text-purple-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Environment Check</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Analyzing your audio environment to ensure optimal exam conditions.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-4 text-left max-w-md mx-auto">
              <h4 className="font-semibold mb-3 text-sm">Test Results:</h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Microphone Status:</span>
                  <span className={`font-medium text-sm ${testResults.microphoneWorking ? 'text-green-600' : 'text-red-600'}`}>
                    {testResults.microphoneWorking ? 'Working' : 'Issue Detected'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Background Noise:</span>
                  <span className={`font-medium text-sm ${
                    testResults.noiseLevel === 'low' ? 'text-green-600' : 
                    testResults.noiseLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {testResults.noiseLevel.charAt(0).toUpperCase() + testResults.noiseLevel.slice(1)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Audio Quality:</span>
                  <span className={`font-medium text-sm ${
                    testResults.audioQuality === 'excellent' || testResults.audioQuality === 'good' ? 'text-green-600' : 
                    testResults.audioQuality === 'fair' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {testResults.audioQuality.charAt(0).toUpperCase() + testResults.audioQuality.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            

            <button
              onClick={completeEnvironmentCheck}
              className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg"
            >
              Continue Setup
            </button>
          </div>
        );

      case 3:
        return (
          <div className="text-center">
            <div className="mb-4">
              <div className="bg-green-500 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Setup Complete</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Audio monitoring is now active and ready for your exam. 
                Your microphone will continue to monitor audio throughout the exam session.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <h4 className="font-semibold text-blue-800 mb-2 text-sm">Important Reminders:</h4>
              <ul className="text-blue-700 text-xs text-left max-w-md mx-auto space-y-1">
                <li>• Keep your microphone enabled throughout the exam</li>
                <li>• Minimize background noise during the exam</li>
                <li>• Avoid speaking unless permitted by exam rules</li>
                <li>• Do not disconnect or mute your microphone</li>
              </ul>
            </div>


            <button
              onClick={finishSetup}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg"
            >
              Start Exam
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full p-4 flex flex-col overflow-hidden">
      <div className="max-w-2xl mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="text-center mb-4 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Audio Setup
          </h1>
          <p className="text-gray-600 text-sm">
            Setting up audio monitoring for exam integrity
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={index} className="flex flex-col items-center flex-1 relative">
                  <div className={`
                    rounded-full p-2 mb-1 transition-all duration-300
                    ${isCompleted ? 'bg-green-500 text-white' : 
                      isActive ? 'bg-blue-500 text-white' : 
                      'bg-gray-200 text-gray-400'}
                  `}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-medium ${
                      isCompleted ? 'text-green-600' : 
                      isActive ? 'text-blue-600' : 
                      'text-gray-400'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`
                      absolute h-0.5 w-12 top-4 left-8 transition-all duration-300
                      ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-lg shadow-lg p-6 flex-1 flex items-center justify-center min-h-0">
          <div className="w-full">
            {renderStepContent()}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-3 text-xs text-gray-500 flex-shrink-0">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>
    </div>
  );
};

export default ExamAudioSetup;