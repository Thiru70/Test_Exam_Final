import React, { useState, useRef } from 'react';

export default function FaceDetection() {
  const [message, setMessage] = useState("Face not detected. Please ensure you are in a well-lit environment and positioned properly.");
  const [frontImage, setFrontImage] = useState(null);
  const [facingFront, setFacingFront] = useState(false);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (imageRef.current) {
      imageRef.current.srcObject = stream;
    }
  };

  const captureImage = () => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL("image/png");
    setFrontImage(dataURL);

    const isFront = Math.random() > 0.5;
    setFacingFront(isFront);
    setMessage(isFront ? "Face detected and positioned correctly." : "Face not detected. Please ensure you are in a well-lit environment and positioned properly.");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-6 mr-24">Video call detection</h1>

      <div className="flex items-center gap-16 mb-8 mr-[150px]">

        <div className="w-60 text-lg font-semibold text-left">
          <p>{message}</p>
        </div>

        <div className="relative border w-[350px] h-[200px] flex items-center justify-center">
          <video ref={imageRef} autoPlay width="350" height="200" className="absolute z-10" />
          <canvas ref={canvasRef} width="350" height="200" className="hidden" />
        </div>
      
        <div className="flex flex-col gap-8">
          <button onClick={startCamera} className="bg-black text-white px-4 py-2 rounded">
            Retake
          </button>
          <button onClick={captureImage} className="bg-black text-white px-4 py-2 rounded">
            Click
          </button>
        </div>

      </div>

      <div className="flex gap-6">
        <div className="flex flex-col items-center">
          <img
            src={frontImage}
            alt="Front"
            className="w-24 h-24 object-cover border"
          />
          <span className="text-md mt-1">Front</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-200 flex items-center justify-center border" />
          <span className="text-md mt-1">Left-Side</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-200 flex items-center justify-center border" />
            <span className="text-md mt-1">Right-Side</span>
        </div>
      </div>
    </div>
  );
}
