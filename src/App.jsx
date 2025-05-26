import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import EmailVerification from './pages/EmailVerification';
import OtpVerification from './pages/OtpVerification';
import InfoForm from './pages/InfoForm';
import FaceDetectionComponent from './components/FaceDetection';

function App() {
  return (
    <Router>
      <div className="min-h-screen w-full bg-sky-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/otp-verification" element={<OtpVerification />} />
          <Route path="/complete-profile" element={<InfoForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/Face-Detection" element={ <FaceDetectionComponent />} />


        </Routes>
       
      </div>
    </Router>
  );
}

export default App;