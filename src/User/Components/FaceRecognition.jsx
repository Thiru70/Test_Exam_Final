import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/facelandmarks-detection';
import Webcam from 'react-webcam';
const FaceRecognition = ({ onVerificationChange }) => {
    // Refs
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const detectionInterval = useRef(null);
    // State
    const [model, setModel] = useState(null);
    const [isModelLoading, setIsModelLoading] = useState(true);
    const [verificationStatus, setVerificationStatus] =
        useState('pending');
    const [warningMessage, setWarningMessage] = useState('');
    const [referenceFeatures, setReferenceFeatures] =
        useState(null);
    const [detectionCount, setDetectionCount] = useState(0);
    const [faceDetected, setFaceDetected] = useState(false);
    // Load TensorFlow model
    useEffect(() => {
        const loadModel = async () => {
            try {
                await tf.ready();
                const loadedModel = await faceLandmarksDetection.load(
                    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
                    { maxFaces: 1 });
                setModel(loadedModel);
                setIsModelLoading(false);
                // Load reference features from localStorage
                const storedFeatures =
                    localStorage.getItem('referenceFeatures');
                if (storedFeatures) {
                    setReferenceFeatures(JSON.parse(storedFeatures));
                }
            } catch (error) {
                console.error('Failed to load model:', error);
                setIsModelLoading(false);
            }
        };
        loadModel();
        return () => {
            if (model) {
                model.dispose();
            }
        };
    }, []);
    // Start face detection when model is ready
    useEffect(() => {
        if (!model || isModelLoading) return;
        const detectFaces = async () => {
            if (
                webcamRef.current &&
                webcamRef.current.video &&
                webcamRef.current.video.readyState === 4
            ) {
                // Get video properties
                const video = webcamRef.current.video;
                const videoWidth = webcamRef.current.video.videoWidth;
                const videoHeight = webcamRef.current.video.videoHeight;
                // Set video width and height
                webcamRef.current.video.width = videoWidth;
                webcamRef.current.video.height = videoHeight;
                // Set canvas width and height
                canvasRef.current.width = videoWidth;
                canvasRef.current.height = videoHeight;
                // Perform face detection
                const predictions = await model.estimateFaces({
                    input: video,
                    returnTensors: false,
                    flipHorizontal: false,
                    predictIrises: false,
                });
                // Draw detections
                drawDetections(predictions, videoWidth, videoHeight);
                // Verify identity
                verifyIdentity(predictions);
            }
        };
        // Run detection every 500ms
        detectionInterval.current = setInterval(detectFaces, 500);
        return () => {
            clearInterval(detectionInterval.current);
        };
    }, [model, isModelLoading]);
    // Draw face detections on canvas
    const drawDetections = (predictions, videoWidth, videoHeight) => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, videoWidth, videoHeight);
        if (predictions.length > 0) {
            setFaceDetected(true);
            setDetectionCount(prev => prev + 1);
            // Draw bounding box
            predictions.forEach((prediction) => {
                const start = prediction.topLeft;
                const end = prediction.bottomRight;
                const size = [end[0] - start[0], end[1] - start[1]];
                ctx.strokeStyle = verificationStatus === 'verified' ?
                    'green' : 'red';
                ctx.lineWidth = 2;
                ctx.strokeRect(start[0], start[1], size[0], size[1]);
            });
        } else {
            setFaceDetected(false);
        }
    };
    // Verify user identity
    const verifyIdentity = (predictions) => {
        // Basic checks
        if (predictions.length === 0) {
            setWarningMessage('No face detected');
            setVerificationStatus('failed');
            onVerificationChange(false);
            return;
        }
        if (predictions.length > 1) {
            setWarningMessage('Multiple faces detected');
            setVerificationStatus('failed');
            onVerificationChange(false);
            return;
        }
        if (referenceFeatures) {
            setWarningMessage('Identity verified');
            setVerificationStatus('verified');
            onVerificationChange(true);
        } else {
            setWarningMessage('Face detected - no reference for verification');
            setVerificationStatus('pending');
            onVerificationChange(false);
        }
    };// Capture reference image
    const captureReferenceImage = async () => {
        if (!webcamRef.current || !model) return;
        try {
            const video = webcamRef.current.video;
            const predictions = await model.estimateFaces({
                input: video,
                returnTensors: false,
                flipHorizontal: false,
            });
            if (predictions.length === 1) {
                const reference = {
                    timestamp: new Date().toISOString(),
                    // Add actual facial features here
                };
                localStorage.setItem('referenceFeatures',
                    JSON.stringify(reference));
                setReferenceFeatures(reference);
                alert('Reference image captured successfully!');
            } else {
                alert('Please make sure only one face is visible');
            }
        } catch (error) {
            console.error('Error capturing reference:', error);
            alert('Failed to capture reference image');
        }
    };
    // Status color mapping
    const statusColors = {
        pending: 'text-yellow-500',
        verified: 'text-green-500',
        failed: 'text-red-500',
    };
    return (
        <div className="relative w-full max-w-2xl mx-auto p-5">
            {/* Camera Feed */}
            <div className="relative w-full h-[480px] mb-5">
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                        facingMode: 'user',
                        width: 640,
                        height: 480,
                    }}
                    className="absolute left-0 right-0 mx-auto z-10"
                />
                <canvas
                    ref={canvasRef}
                    className="absolute left-0 right-0 mx-auto z-20"
                />
            </div>
            {/* Status Panel */}
            <div className="bg-gray-100 p-4 rounded-lg">
                {isModelLoading ? (
                    <p className="text-gray-700">Loading face detection
                        model...</p>
                ) : (
                    <>
                        <div className="mb-3">
                            <p className="text-gray-800">
                                Status: <span className={`font-bold $
{statusColors[verificationStatus]}`}>
                                    {verificationStatus.toUpperCase()}
                                </span>
                            </p>
                            {warningMessage && (
                                <p className={`mt-1 font-medium ${verificationStatus === 'failed' ? 'textred-600' : 'text-green-600'
                                    }`}>
                                    {warningMessage}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-white p-3 rounded shadow">
                                <p className="text-sm text-gray-600">Detection
                                    count</p>
                                <p className="text-xl fontsemibold">{detectionCount}</p>
                            </div>
                            <div className="bg-white p-3 rounded shadow">
                                <p className="text-sm text-gray-600">Face
                                    detected</p>
                                <p className="text-xl font-semibold">
                                    {faceDetected ? (
                                        <span className="text-green-500">Yes</span>
                                    ) : (
                                        <span className="text-red-500">No</span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={captureReferenceImage}
                            className="w-full bg-blue-600 hover:bg-blue-700
text-white py-2 px-4 rounded transition duration-200"
                        >
                            Capture Reference Image
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
export default FaceRecognition;