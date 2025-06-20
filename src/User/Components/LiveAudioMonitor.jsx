import React, { useState, useEffect, useRef } from 'react';

const LiveAudioMonitor = ({ isActive, onViolation, showToast }) => {
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [violationCount, setViolationCount] = useState(0);
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastViolationTimeRef = useRef(0);

  const NOISE_THRESHOLD = 30;
  const HIGH_NOISE_THRESHOLD = 50;
  const VIOLATION_DEBOUNCE = 3000; // 3 seconds between violations

  const startAudioMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });
      
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      
      monitorAudio();
    } catch (error) {
      console.error('Audio monitoring failed:', error);
      showToast?.('Microphone access failed. Audio monitoring disabled.', 'warning');
    }
  };

  const monitorAudio = () => {
    const checkAudio = () => {
      if (analyserRef.current && dataArrayRef.current && isActive) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        
        // Calculate RMS for better noise detection
        let sum = 0;
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          sum += dataArrayRef.current[i] * dataArrayRef.current[i];
        }
        const rms = Math.sqrt(sum / dataArrayRef.current.length);
        const normalizedLevel = Math.min(100, (rms / 128) * 100);
        
        setNoiseLevel(normalizedLevel);
        
        // Handle violations with debouncing
        const currentTime = Date.now();
        if (currentTime - lastViolationTimeRef.current > VIOLATION_DEBOUNCE) {
          if (normalizedLevel > HIGH_NOISE_THRESHOLD) {
            handleViolation('high', normalizedLevel);
            lastViolationTimeRef.current = currentTime;
          } else if (normalizedLevel > NOISE_THRESHOLD) {
            handleViolation('moderate', normalizedLevel);
            lastViolationTimeRef.current = currentTime;
          }
        }
      }
      
      if (isActive) {
        animationFrameRef.current = requestAnimationFrame(checkAudio);
      }
    };
    
    checkAudio();
  };

  const handleViolation = (level, noiseValue) => {
    const newCount = violationCount + 1;
    setViolationCount(newCount);
    
    const message = level === 'high' 
      ? `High noise detected (${Math.round(noiseValue)}%). Please minimize background noise.`
      : `Background noise detected (${Math.round(noiseValue)}%). Please maintain a quiet environment.`;
    
    showToast?.(message, level === 'high' ? 'error' : 'warning');
    onViolation?.({ type: 'audio', level, noiseLevel: noiseValue, count: newCount });
  };

  const cleanup = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  useEffect(() => {
    if (isActive) {
      startAudioMonitoring();
    } else {
      cleanup();
    }
    
    return cleanup;
  }, [isActive]);

  // Only render a tiny indicator if needed - completely invisible by default
  return null;
};

export default LiveAudioMonitor;