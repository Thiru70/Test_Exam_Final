import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './Common/pages/HomePage';
import LoginPage from './Common/pages/LoginPage'
import EmailVerification from './Common/pages/EmailVerification'
import OtpVerification from './Common/pages/OtpVerification'
import InfoForm from './Common/pages/InfoForm'
import StudentDashboard from './User/Components/StudentDashboard';
import FaceDetection from './User/Components/FaceDetection';
import {SelectionProcessStages} from './User/Components/SelectionProcessStages';

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
          <Route path="/student-dashboard" element={<StudentDashboard/>} />
          <Route path="/face-detect" element={<FaceDetection/>} />
          <Route path="/selection-process" element={<SelectionProcessStages/>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;